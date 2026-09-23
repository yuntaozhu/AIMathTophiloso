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

interface FirecrawlSearchHit {
  title?: string;
  url?: string;
  description?: string;
  markdown?: string;
}

async function firecrawlSearch(query: string): Promise<FirecrawlSearchHit[]> {
  const key = process.env.FIRECRAWL_API_KEY;
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
    const data = (await res.json()) as { data?: FirecrawlSearchHit[]; success?: boolean };
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

function hitsToCitations(hits: FirecrawlSearchHit[]): AiOverviewCitation[] {
  return hits.slice(0, 4).map(h => ({
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
    lead: `根据本场知识库与公开文献线索，对「${query}」的要点梳理如下（离线检索）。在线 Google/Firecrawl 或 Gemini 可用时将自动升级为完整 AI 概览。`,
    sections: [
      {
        heading: '知识库要点',
        bullets: bullets.length
          ? bullets
          : [{ text: '暂无命中文献切片；可尝试更短的核心词，或配置 FIRECRAWL_API_KEY / GEMINI_API_KEY。' }]
      }
    ],
    followUps: ['与本页幻灯片如何对照？', '相关 Lean / Harness 概念', '打开知识库深挖'],
    citations,
    source: 'offline_fallback'
  };
}

async function synthesizeWithLlm(
  query: string,
  searchSnippets: string,
  ragContext: string,
  getAI: GetAI
): Promise<AiOverviewPayload | null> {
  const system = `你是 Google 风格「AI 概览」撰稿器。只输出 JSON，不要 markdown 围栏。
schema:
{
  "lead": "2-4句中文导语",
  "highlightPhrase": "导语中最关键的一句（可空）",
  "sections":[{"heading":"标题","paragraphs":["..."],"bullets":[{"title":"可选","text":"..."}]}],
  "followUps":["追问1","追问2","追问3"],
  "citations":[{"label":"来源名","url":"可选"}]
}
要求：结构清晰、可讲演；结合检索摘要与文献；禁止编造不存在的 URL。`;

  const user = `查询：${query}\n\n【网络检索摘要】\n${searchSnippets || '（无）'}\n\n【本场知识库】\n${ragContext || '（无）'}`;

  let text = (await generateViaAiGateway({ system, user })) || '';
  const ai = getAI();
  if (!text && ai) {
    try {
      // Google Search grounding when supported by the SDK/model
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_OVERVIEW_MODEL || 'gemini-2.5-flash',
        contents: [{ text: system }, { text: user }],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      text = response.text || '';
    } catch {
      try {
        const response = await ai.models.generateContent({
          model: process.env.GEMINI_OVERVIEW_MODEL || 'gemini-2.5-flash',
          contents: [{ text: system }, { text: user }]
        });
        text = response.text || '';
      } catch {
        text = '';
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
      query,
      lead: parsed.lead,
      highlightPhrase: parsed.highlightPhrase,
      sections: parsed.sections,
      followUps: parsed.followUps || [],
      citations: parsed.citations || [],
      source: searchSnippets ? 'google_search' : 'live_ai'
    };
  } catch {
    return null;
  }
}

export function registerAiOverviewRoutes(app: Express, deps: { getAI: GetAI }) {
  app.post('/api/ai-overview', async (req: Request, res: Response) => {
    try {
      const query = String(req.body?.query || '').trim();
      if (!query) return res.status(400).json({ error: 'query required' });

      const preferLive = Boolean(req.body?.preferLive);
      const curated = matchCuratedOverview(query);

      // 默认：命中 curated 且未强制在线 → 秒开（研讨控台体验）
      if (curated && !preferLive) {
        return res.json(curated);
      }

      const hits = await firecrawlSearch(query);
      const searchSnippets = hits
        .map(
          (h, i) =>
            `[${i + 1}] ${h.title || ''}\n${h.url || ''}\n${(h.description || h.markdown || '').slice(0, 400)}`
        )
        .join('\n\n');

      const rag = searchKnowledgeBase(query, 4);
      const ragContext = rag
        .map(
          (r, i) =>
            `【文献${i + 1}】${r.doc.source_title}\n${r.doc.chunk_text.slice(0, 500)}`
        )
        .join('\n\n');

      const live = await synthesizeWithLlm(query, searchSnippets, ragContext, deps.getAI);
      if (live) {
        const mergedCitations = [
          ...(live.citations || []),
          ...hitsToCitations(hits),
          ...rag.map(r => ({ label: r.doc.source_title.slice(0, 40), extra: 1 }))
        ].slice(0, 8);
        // 若有 curated，把表格/图示补进 sections（避免 LLM 丢掉结构）
        if (curated?.sections.some(s => s.table || s.diagram)) {
          const structural = curated.sections.filter(s => s.table || s.diagram);
          live.sections = [...live.sections, ...structural];
        }
        return res.json({ ...live, citations: mergedCitations });
      }

      if (curated) return res.json({ ...curated, source: 'curated' as const });
      return res.json(buildOfflineFromRag(query));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'ai-overview failed';
      res.status(500).json({ error: message });
    }
  });
}
