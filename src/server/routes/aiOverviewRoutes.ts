import type { Express, Request, Response } from 'express';
import type { GoogleGenAI } from '@google/genai';
import { searchKnowledgeBase } from '../../data/knowledgeBase';
import {
  AiOverviewPayload,
  AiOverviewCitation,
  matchCuratedOverview
} from '../../data/aiOverviewCurated';
import { generateViaAiGateway } from '../../services/aiGateway';

type GetAI = () => GoogleGenAI | null;

interface SearchHit {
  title?: string;
  url?: string;
  description?: string;
  markdown?: string;
}

export function getAiOverviewOnlineStatus() {
  return {
    firecrawl: Boolean(process.env.FIRECRAWL_API_KEY?.trim()),
    googleCse: Boolean(process.env.GOOGLE_CSE_API_KEY?.trim() && process.env.GOOGLE_CSE_ID?.trim()),
    gemini: Boolean(process.env.GEMINI_API_KEY?.trim()),
    aiGateway: Boolean(process.env.AI_GATEWAY_API_KEY?.trim()),
    onlineAvailable: Boolean(
      process.env.FIRECRAWL_API_KEY?.trim() ||
        (process.env.GOOGLE_CSE_API_KEY?.trim() && process.env.GOOGLE_CSE_ID?.trim()) ||
        process.env.GEMINI_API_KEY?.trim() ||
        process.env.AI_GATEWAY_API_KEY?.trim()
    )
  };
}

/** Google Programmable Search（官方 Custom Search JSON API） */
async function googleCseSearch(query: string): Promise<SearchHit[]> {
  const key = process.env.GOOGLE_CSE_API_KEY?.trim();
  const cx = process.env.GOOGLE_CSE_ID?.trim();
  if (!key || !cx) return [];
  try {
    const u = new URL('https://www.googleapis.com/customsearch/v1');
    u.searchParams.set('key', key);
    u.searchParams.set('cx', cx);
    u.searchParams.set('q', query);
    u.searchParams.set('num', '5');
    u.searchParams.set('hl', 'zh-CN');
    const res = await fetch(u.toString());
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items?: { title?: string; link?: string; snippet?: string }[];
    };
    return (data.items || []).map(it => ({
      title: it.title,
      url: it.link,
      description: it.snippet
    }));
  } catch {
    return [];
  }
}

async function firecrawlSearch(query: string): Promise<SearchHit[]> {
  const key = process.env.FIRECRAWL_API_KEY?.trim();
  if (!key) return [];
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        limit: 5,
        lang: 'zh',
        country: 'cn'
      })
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: SearchHit[] };
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

/** 并行聚合：Google CSE + Firecrawl */
async function aggregateWebSearch(query: string): Promise<SearchHit[]> {
  const [cse, fc] = await Promise.all([googleCseSearch(query), firecrawlSearch(query)]);
  const seen = new Set<string>();
  const out: SearchHit[] = [];
  for (const h of [...cse, ...fc]) {
    const k = (h.url || h.title || '').toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(h);
    if (out.length >= 8) break;
  }
  return out;
}

function hitsToCitations(hits: SearchHit[]): AiOverviewCitation[] {
  return hits.slice(0, 5).map(h => ({
    label: (h.title || h.url || '来源').slice(0, 40),
    url: h.url,
    extra: 0
  }));
}

function buildOfflineFromRag(query: string): AiOverviewPayload {
  const rag = searchKnowledgeBase(query, 4);
  const citations: AiOverviewCitation[] = rag.map(r => ({
    label: r.doc.source_title.slice(0, 42),
    extra: 1
  }));
  const bullets = rag.map(r => ({
    title: r.doc.metadata.section || r.doc.source_title.slice(0, 24),
    text: r.doc.chunk_text.slice(0, 220).replace(/\s+/g, ' ') + '…',
    citation: { label: r.doc.source_title.slice(0, 28), extra: 1 }
  }));
  return {
    query,
    lead: `根据本场知识库与公开文献线索，对「${query}」的要点梳理如下（离线检索）。配置 GEMINI_API_KEY / FIRECRAWL_API_KEY / GOOGLE_CSE_* 后可自动升级为在线 AI 概览。`,
    sections: [
      {
        heading: '知识库要点',
        bullets: bullets.length
          ? bullets
          : [{ text: '暂无命中文献切片；可尝试更短的核心词，或配置在线检索密钥。' }]
      }
    ],
    followUps: ['与本页幻灯片如何对照？', '相关 Lean / Harness 概念', '打开知识库深挖'],
    citations,
    source: 'offline_fallback'
  };
}

function extractGroundingCitations(response: {
  candidates?: {
    groundingMetadata?: {
      groundingChunks?: { web?: { uri?: string; title?: string } }[];
      webSearchQueries?: string[];
    };
  }[];
}): AiOverviewCitation[] {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .map(c => ({
      label: (c.web?.title || c.web?.uri || 'Google').slice(0, 40),
      url: c.web?.uri
    }))
    .filter(c => c.label);
}

async function synthesizeWithLlm(
  query: string,
  searchSnippets: string,
  ragContext: string,
  getAI: GetAI,
  curatedHint?: string
): Promise<{ payload: AiOverviewPayload; grounding: AiOverviewCitation[] } | null> {
  const system = `你是 Google 风格「AI 概览」撰稿器，面向数学/逻辑/AI 研讨。只输出 JSON，不要 markdown 围栏。
schema:
{
  "lead": "2-4句中文导语，可含关键术语",
  "highlightPhrase": "导语中最关键的一句（可空）",
  "sections":[{"heading":"标题","paragraphs":["..."],"bullets":[{"title":"可选短标题","text":"解释"}]}],
  "followUps":["追问1","追问2","追问3"],
  "citations":[{"label":"来源名","url":"可选真实URL"}]
}
要求：适合讲演口述；优先准确数学直觉；禁止编造不存在的 URL；可对照本场「可计算认识论」语境。`;

  const user = `查询：${query}
${curatedHint ? `\n【本场精编要点（可 refinement，勿矛盾）】\n${curatedHint}\n` : ''}
【网络检索摘要】
${searchSnippets || '（无网页摘要；请尽量用 Google Search grounding / 自身知识，并标明不确定处）'}

【本场知识库】
${ragContext || '（无）'}`;

  let text = '';
  let grounding: AiOverviewCitation[] = [];
  let usedSearchTool = Boolean(searchSnippets);

  const viaGateway = await generateViaAiGateway({
    system,
    user,
    json: true,
    model: process.env.AI_GATEWAY_OVERVIEW_MODEL || process.env.AI_GATEWAY_MODEL
  });
  if (viaGateway) text = viaGateway;

  const ai = getAI();
  if (!text && ai) {
    const model = process.env.GEMINI_OVERVIEW_MODEL || 'gemini-2.5-flash';
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ text: `${system}\n\n${user}` }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json'
        }
      });
      text = response.text || '';
      grounding = extractGroundingCitations(response as never);
      usedSearchTool = usedSearchTool || grounding.length > 0;
    } catch {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ text: `${system}\n\n${user}` }],
          config: { responseMimeType: 'application/json' }
        });
        text = response.text || '';
      } catch {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [{ text: system }, { text: user }]
          });
          text = response.text || '';
        } catch {
          text = '';
        }
      }
    }
  }

  if (!text) return null;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]) as Partial<AiOverviewPayload>;
    if (!parsed.lead || !parsed.sections) return null;
    return {
      payload: {
        query,
        lead: parsed.lead,
        highlightPhrase: parsed.highlightPhrase,
        sections: parsed.sections,
        followUps: parsed.followUps || [],
        citations: parsed.citations || [],
        source: usedSearchTool || grounding.length ? 'google_search' : 'live_ai'
      },
      grounding
    };
  } catch {
    return null;
  }
}

function mergeStructural(
  live: AiOverviewPayload,
  curated: AiOverviewPayload | null
): AiOverviewPayload {
  if (!curated) return live;
  const structural = curated.sections.filter(s => s.table || s.diagram);
  if (!structural.length) return live;
  const headings = new Set(live.sections.map(s => s.heading));
  const extra = structural.filter(s => !headings.has(s.heading));
  return { ...live, sections: [...live.sections, ...extra] };
}

export function registerAiOverviewRoutes(app: Express, deps: { getAI: GetAI }) {
  app.get('/api/ai-overview/status', (_req: Request, res: Response) => {
    res.json(getAiOverviewOnlineStatus());
  });

  app.post('/api/ai-overview', async (req: Request, res: Response) => {
    try {
      const query = String(req.body?.query || '').trim();
      if (!query) return res.status(400).json({ error: 'query required' });

      const status = getAiOverviewOnlineStatus();
      const preferLive =
        req.body?.preferLive === undefined
          ? status.onlineAvailable
          : Boolean(req.body.preferLive);

      const curated = matchCuratedOverview(query);

      // 无在线能力或明确只要精编 → 秒回
      if (curated && !preferLive) {
        return res.json(curated);
      }

      const hits = status.onlineAvailable ? await aggregateWebSearch(query) : [];
      const searchSnippets = hits
        .map(
          (h, i) =>
            `[${i + 1}] ${h.title || ''}\n${h.url || ''}\n${(h.description || h.markdown || '').slice(0, 450)}`
        )
        .join('\n\n');

      const rag = searchKnowledgeBase(query, 4);
      const ragContext = rag
        .map(
          (r, i) =>
            `【文献${i + 1}】${r.doc.source_title}\n${r.doc.chunk_text.slice(0, 500)}`
        )
        .join('\n\n');

      const curatedHint = curated
        ? `${curated.lead}\n` +
          curated.sections
            .map(
              s =>
                `${s.heading}: ` +
                (s.bullets || []).map(b => `${b.title || ''} ${b.text}`).join('; ')
            )
            .join('\n')
        : undefined;

      const live = status.onlineAvailable
        ? await synthesizeWithLlm(query, searchSnippets, ragContext, deps.getAI, curatedHint)
        : null;

      if (live) {
        let payload = mergeStructural(live.payload, curated);
        const mergedCitations = [
          ...live.grounding,
          ...(payload.citations || []),
          ...hitsToCitations(hits),
          ...rag.map(r => ({ label: r.doc.source_title.slice(0, 40), extra: 1 }))
        ].slice(0, 10);
        // 去重 label
        const seen = new Set<string>();
        payload = {
          ...payload,
          citations: mergedCitations.filter(c => {
            const k = c.label.toLowerCase();
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          })
        };
        return res.json(payload);
      }

      if (curated) return res.json({ ...curated, source: 'curated' as const });
      return res.json(buildOfflineFromRag(query));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'ai-overview failed';
      res.status(500).json({ error: message });
    }
  });
}
