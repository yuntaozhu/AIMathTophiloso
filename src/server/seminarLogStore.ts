import fs from 'fs';
import path from 'path';
import { SEMINAR_SLIDES } from '../data/slides';

export interface StoredSeminarLog {
  id: string;
  slide_index: number;
  user_query: string;
  ai_response: string;
  agent_role: string;
  timestamp: string;
  highlighted_text?: string;
  citations?: unknown[];
  discussion_tag?: string;
  kind?: 'qa' | 'agenda' | 'sandbox' | 'user' | 'system';
  is_barrage?: boolean;
}

const memoryLogs: StoredSeminarLog[] = [];

function resolveLogPath(): string {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'seminar-logs.jsonl');
  }
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      /* ignore */
    }
  }
  return path.join(dir, 'seminar-logs.jsonl');
}

function loadFromDisk(): void {
  if (memoryLogs.length > 0) return;
  const file = resolveLogPath();
  try {
    if (!fs.existsSync(file)) return;
    const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        memoryLogs.push(JSON.parse(line) as StoredSeminarLog);
      } catch {
        /* skip bad line */
      }
    }
  } catch {
    /* Vercel cold start / no disk */
  }
}

function appendToDisk(entry: StoredSeminarLog): void {
  try {
    fs.appendFileSync(resolveLogPath(), `${JSON.stringify(entry)}\n`, 'utf8');
  } catch {
    /* ephemeral FS may fail; memory still holds */
  }
}

export function getSeminarLogs(): StoredSeminarLog[] {
  loadFromDisk();
  return memoryLogs;
}

export function appendSeminarLog(
  partial: Omit<StoredSeminarLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): StoredSeminarLog {
  loadFromDisk();
  const entry: StoredSeminarLog = {
    id: partial.id || `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: partial.timestamp || new Date().toISOString(),
    slide_index: partial.slide_index,
    user_query: partial.user_query || '',
    ai_response: partial.ai_response || '',
    agent_role: partial.agent_role,
    highlighted_text: partial.highlighted_text,
    citations: partial.citations,
    discussion_tag: partial.discussion_tag,
    kind: partial.kind || 'qa',
    is_barrage: partial.is_barrage
  };
  memoryLogs.push(entry);
  appendToDisk(entry);
  return entry;
}

/** 按页结构化纪要（P3-1）：人工只需补文末三句 */
export function buildStructuredMinutes(logs: StoredSeminarLog[]): string {
  const bySlide = new Map<number, StoredSeminarLog[]>();
  for (const log of logs) {
    const idx = log.slide_index || 0;
    if (!bySlide.has(idx)) bySlide.set(idx, []);
    bySlide.get(idx)!.push(log);
  }

  const sortedIndexes = [...bySlide.keys()].filter(i => i > 0).sort((a, b) => a - b);
  const dateStr = new Date().toLocaleString('zh-CN');

  const sections: string[] = [
    `# 《可计算认识论》本场研讨纪要（按页结构）`,
    ``,
    `**生成时间**：${dateStr}  `,
    `**日志条数**：${logs.length}  `,
    `**说明**：下列按课件页归类；文末「人工三句」请主讲会后补全。`,
    ``,
    `---`
  ];

  if (sortedIndexes.length === 0) {
    sections.push(``, `> 本场尚无研讨日志。请先进行提问、议程体检或沙盒调参后再生成纪要。`, ``);
  }

  for (const slideIndex of sortedIndexes) {
    const slide = SEMINAR_SLIDES.find(s => s.index === slideIndex);
    const title = slide?.title || `第 ${slideIndex} 页`;
    const items = bySlide.get(slideIndex) || [];

    const objections = items.filter(
      l =>
        (l.kind === 'user' || l.agent_role === 'user') &&
        (l.discussion_tag === '异议' || (l.user_query && l.user_query.includes('异议')))
    );
    const follows = items.filter(
      l =>
        (l.kind === 'user' || l.agent_role === 'user') &&
        (l.discussion_tag === '追问' || l.discussion_tag === '补充')
    );
    const epistemic = items.filter(l => l.agent_role === 'deep_epistemic');
    const agenda = items.filter(l => l.agent_role === 'agenda_guardian' || l.kind === 'agenda');
    const sandbox = items.filter(
      l => l.kind === 'sandbox' || (l.agent_role === 'sandbox_compiler' && l.ai_response.includes('沙盒调参'))
    );
    const userQs = items.filter(
      l =>
        l.user_query &&
        !l.discussion_tag &&
        l.kind !== 'sandbox' &&
        l.agent_role !== 'agenda_guardian'
    );

    sections.push(``, `## P.${slideIndex} 《${title}》`, ``);

    if (slide?.keywords?.length) {
      sections.push(`**关键词**：${slide.keywords.slice(0, 6).join(' · ')}`, ``);
    }

    sections.push(`### 主讲 / 认知要点`);
    if (epistemic.length) {
      for (const e of epistemic.slice(-2)) {
        const clip = (e.ai_response || '').replace(/\n+/g, ' ').slice(0, 180);
        sections.push(`- ${clip}${clip.length >= 180 ? '…' : ''}`);
      }
    } else {
      sections.push(`- （本页无深度认知问答记录）`);
    }
    sections.push(``);

    sections.push(`### 参会追问`);
    const qs = [...userQs, ...follows].slice(-5);
    if (qs.length) {
      for (const q of qs) {
        const tag = q.discussion_tag ? `【${q.discussion_tag}】` : '';
        sections.push(`- ${tag}${(q.user_query || '').slice(0, 160)}`);
      }
    } else {
      sections.push(`- （无）`);
    }
    sections.push(``);

    sections.push(`### 异议`);
    if (objections.length) {
      for (const o of objections.slice(-5)) {
        sections.push(`- ${(o.user_query || o.ai_response || '').slice(0, 160)}`);
      }
    } else {
      sections.push(`- （无显式异议标签）`);
    }
    sections.push(``);

    sections.push(`### 沙盒结论`);
    if (sandbox.length) {
      for (const s of sandbox.slice(-3)) {
        const one =
          (s.ai_response.match(/\*\*一句话\*\*[：:]\s*(.+)/)?.[1] ||
            s.ai_response.replace(/\n+/g, ' ').slice(0, 140));
        sections.push(`- ${one}`);
      }
    } else {
      sections.push(`- （本页无沙盒调参记录）`);
    }
    sections.push(``);

    if (agenda.length) {
      sections.push(`### 议程提示`);
      for (const a of agenda.slice(-2)) {
        sections.push(`- ${(a.ai_response || '').replace(/\n+/g, ' ').slice(0, 140)}`);
      }
      sections.push(``);
    }
  }

  sections.push(
    `---`,
    ``,
    `## 未决问题`,
    ``,
    `- （请从异议/追问中挑出仍未回答者）`,
    ``,
    `## 人工补记三句（主讲会后填写）`,
    ``,
    `1. **现场调参反常**：`,
    `2. **最强异议**：`,
    `3. **会后未决**：`,
    ``
  );

  return sections.join('\n');
}
