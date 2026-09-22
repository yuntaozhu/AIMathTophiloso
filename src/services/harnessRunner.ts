import { searchKnowledgeBase } from '../data/knowledgeBase';
import { RAG_THESIS_REGISTRY } from '../data/ragLiteratureAnalyzer';
import { SIMULATION_TEMPLATES } from '../data/simulationTemplates';

export type ClaimClass = 'ground_fact' | 'correlation' | 'hypothesis';

export type GateName = 'citation' | 'counterfactual' | 'negative_knowledge';

export interface GateResult {
  name: GateName;
  passed: boolean;
  exitCode: 0 | 1;
  evidence: unknown;
  remediation?: string;
}

export interface AuditNode {
  step: string;
  at: string;
  detail: string;
}

export interface HarnessRun {
  thesis: string;
  claimClass: ClaimClass;
  slideIndex: number;
  gates: GateResult[];
  passed: boolean;
  rejectedHypotheses: string[];
  fork?: { pathA: string; pathB: string; note: string };
  auditTrace: AuditNode[];
  demoDisclaimer: string;
}

const DEMO_DISCLAIMER =
  'Harness 示范层：远期学术治理原型，非本场研讨默认路径。任一 gate exit≠0 则不得写入「终稿」断言。';

function nowIso() {
  return new Date().toISOString();
}

function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(t => t.length >= 2);
}

function jaccard(a: string[], b: string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Gate 1：断言须锚定知识库 chunk（用 raw/boosted 分，不用展示校准分） */
export function runCitationGate(thesis: string): GateResult {
  const hits = searchKnowledgeBase(thesis, 4);
  const top = hits[0];
  const RAW_THRESHOLD = 0.08;
  const anchored = Boolean(top && top.similarity >= RAW_THRESHOLD);

  if (!anchored) {
    return {
      name: 'citation',
      passed: false,
      exitCode: 1,
      evidence: {
        topHits: hits.slice(0, 3).map(h => ({
          id: h.doc.id,
          title: h.doc.source_title,
          similarity: Number(h.similarity.toFixed(4)),
          rawCosine: h.rawCosine,
          displaySimilarity: h.displaySimilarity,
          excerpt: h.doc.chunk_text.slice(0, 120)
        }))
      },
      remediation: '找不到足够相似的史料/文献底本。请缩小语料范围或改写为可检索的原典表述；禁止静默替换为无关经典。'
    };
  }

  return {
    name: 'citation',
    passed: true,
    exitCode: 0,
    evidence: {
      chunkId: top.doc.id,
      sourceTitle: top.doc.source_title,
      similarity: Number(top.similarity.toFixed(4)),
      rawCosine: top.rawCosine,
      displaySimilarity: top.displaySimilarity,
      quote: top.doc.chunk_text.slice(0, 180),
      pageOrSection: top.doc.metadata.section || top.doc.metadata.page
    }
  };
}

function pickTemplateId(thesis: string): string {
  const t = thesis.toLowerCase();
  if (/罗尔斯|无知之幕|差异原则|正义论|rawls|veil|契约/.test(t)) return 'rawls-veil';
  if (/明清|白银|抗粮|财政|宗族/.test(t)) return 'ming-qing-fiscal';
  if (/记忆|joon|park|检索|smallville/.test(t)) return 'stanford-agent-memory';
  if (/余维|相界|pde|奇异|流形|邓煜/.test(t)) return 'pde-codim1-manifold';
  // 解释学/本体论议题默认用罗尔斯做「可拧参数」示范
  return 'rawls-veil';
}

function parseMetricValue(value: string | number): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const m = String(value).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function seriesLastByName(
  result: { series: { name?: string; data?: (number | [number, number])[] }[] },
  namePart: string
): number | null {
  for (const s of result.series || []) {
    if (!(s.name || '').includes(namePart) || !Array.isArray(s.data) || !s.data.length) continue;
    const last = s.data[s.data.length - 1];
    if (typeof last === 'number') return last;
    if (Array.isArray(last) && typeof last[1] === 'number') return last[1];
  }
  return null;
}

function primaryMetric(
  result: {
    summaryMetrics: { label: string; value: string | number }[];
    series: { name?: string; data?: (number | [number, number])[] }[];
  },
  preferLabels: string[]
): number | null {
  for (const m of result.summaryMetrics) {
    if (preferLabels.some(l => m.label.includes(l))) {
      const n = parseMetricValue(m.value);
      if (n != null) return n;
    }
  }
  for (const s of result.series || []) {
    if (s.name && preferLabels.some(l => (s.name || '').includes(l)) && Array.isArray(s.data) && s.data.length) {
      const last = s.data[s.data.length - 1];
      if (typeof last === 'number') return last;
      if (Array.isArray(last) && typeof last[1] === 'number') return last[1];
    }
  }
  const first = result.summaryMetrics[0];
  return first ? parseMetricValue(first.value) : null;
}

function extractComparableMetric(
  templateId: string,
  result: {
    summaryMetrics: { label: string; value: string | number }[];
    series: { name?: string; data?: (number | [number, number])[] }[];
  }
): { value: number | null; label: string } {
  if (templateId === 'rawls-veil') {
    const bottom = seriesLastByName(result, '底层');
    if (bottom != null) return { value: bottom, label: '底层20%均产' };
    const gini = primaryMetric(result, ['基尼']);
    return { value: gini, label: '基尼系数' };
  }
  if (templateId === 'ming-qing-fiscal') {
    const survival = seriesLastByName(result, '生存') ?? primaryMetric(result, ['生存']);
    return { value: survival, label: '小农生存指数' };
  }
  if (templateId === 'stanford-agent-memory') {
    const score = seriesLastByName(result, 'Score') ?? primaryMetric(result, ['检索', '得分']);
    return { value: score, label: '检索得分' };
  }
  if (templateId === 'pde-codim1-manifold') {
    const amp = seriesLastByName(result, '临界') ?? primaryMetric(result, ['临界', '振幅']);
    return { value: amp, label: '临界振幅' };
  }
  const fallback = primaryMetric(result, ['遵从', '生存', '基尼']);
  return { value: fallback, label: '主指标' };
}

/** Gate 2：用已有仿真模板做温和/极端扰动；可观测塌陷才算门禁本身有效 */
export function runCounterfactualGate(thesis: string): GateResult {
  const templateId = pickTemplateId(thesis);
  const tmpl = SIMULATION_TEMPLATES.find(t => t.id === templateId);
  if (!tmpl) {
    return {
      name: 'counterfactual',
      passed: false,
      exitCode: 1,
      evidence: { templateId },
      remediation: '无可用仿真模板，无法做反事实压力测试。'
    };
  }

  const mild = { ...tmpl.defaultParams };
  const extreme = { ...tmpl.defaultParams };

  if (templateId === 'rawls-veil') {
    mild.scarcityShock = 0.2;
    mild.machiavellianWeight = 0.15;
    extreme.scarcityShock = 0.92;
    extreme.machiavellianWeight = 0.88;
  } else if (templateId === 'ming-qing-fiscal') {
    mild.silverInflowShock = 0.15;
    mild.clansProtectionFactor = 0.3;
    extreme.silverInflowShock = 0.95;
    extreme.clansProtectionFactor = 0.85;
  } else if (templateId === 'pde-codim1-manifold') {
    mild.sigmaMin = 0.5;
    mild.sigmaMax = 0.9;
    extreme.sigmaMin = 0.5;
    extreme.sigmaMax = 1.8;
  } else if (templateId === 'stanford-agent-memory') {
    mild.alphaRecency = 1.2;
    mild.betaImportance = 1.0;
    mild.gammaRelevance = 0.4;
    extreme.alphaRecency = 0.2;
    extreme.betaImportance = 0.3;
    extreme.gammaRelevance = 2.0;
  }

  const mildRun = tmpl.run(mild);
  const extremeRun = tmpl.run(extreme);

  const mildCmp = extractComparableMetric(templateId, mildRun);
  const extremeCmp = extractComparableMetric(templateId, extremeRun);
  const mildMetric = mildCmp.value;
  const extremeMetric = extremeCmp.value;

  const delta =
    mildMetric != null && extremeMetric != null ? Math.abs(extremeMetric - mildMetric) : null;
  // 底层均产/生存指数多为 0–100；基尼等为 0–1
  const threshold = mildMetric != null && Math.abs(mildMetric) > 1.5 ? 5 : 0.05;
  const collapsed = delta != null && delta >= threshold;

  if (!collapsed) {
    return {
      name: 'counterfactual',
      passed: false,
      exitCode: 1,
      evidence: {
        templateId,
        templateName: tmpl.name,
        mildParams: mild,
        extremeParams: extreme,
        mildMetric,
        extremeMetric,
        delta,
        mildSummary: mildRun.summaryMetrics,
        extremeSummary: extremeRun.summaryMetrics
      },
      remediation: '极端扰动未产生可观测相变/指标跳变，假说对反事实不敏感，暂记为不可证伪——请收紧机制表述或换模板。'
    };
  }

  return {
    name: 'counterfactual',
    passed: true,
    exitCode: 0,
    evidence: {
      templateId,
      templateName: tmpl.name,
      mildParams: mild,
      extremeParams: extreme,
      mildMetric,
      extremeMetric,
      delta: Number(delta!.toFixed(4)),
      falsificationHint: `在模板「${tmpl.name}」上，${mildCmp.label} 从 ${mildMetric} → ${extremeMetric}（Δ=${delta!.toFixed(3)}），机制在扰动下塌陷/跃迁，可作为证伪压力证据。`,
      mildLogs: mildRun.agentLogs.slice(0, 2),
      extremeLogs: extremeRun.agentLogs.slice(0, 2)
    }
  };
}

/** Gate 3：负知识——命中已被登记的陈旧/默会陷阱则拦截 */
export function runNegativeKnowledgeGate(thesis: string): GateResult {
  const thesisTokens = tokenize(thesis);
  const hits: { docId: string; title: string; reason: string; overlap: number }[] = [];

  for (const [docId, thesisMeta] of Object.entries(RAG_THESIS_REGISTRY)) {
    const fa = thesisMeta.formalizedArgument;
    if (!fa) continue;
    const traps = [
      ...fa.tacitAssumptions.map(t => ({ reason: `默会假设陷阱：${t}`, text: t })),
      {
        reason: `证伪判据相关陈旧路径：${fa.falsificationCriteria.slice(0, 80)}…`,
        text: fa.falsificationCriteria
      }
    ];
    for (const trap of traps) {
      const overlap = jaccard(thesisTokens, tokenize(trap.text));
      // 高重叠 = 把默会假设当结论复读，或撞上已知证伪路径的关键词壳
      if (overlap >= 0.28) {
        hits.push({
          docId,
          title: thesisMeta.sourceTitle || docId,
          reason: trap.reason,
          overlap: Number(overlap.toFixed(3))
        });
      }
    }
  }

  // 显式陈旧话术（讲稿里常提的「勿再走」路径）
  const staleHeuristics = [
    { id: 'stale-rlhf-polite', pattern: /只要.*对齐.*人类偏好|RLHF.*即可保证|礼貌偏置.*无害/, label: '把 RLHF 中庸偏置当成无害对齐终点' },
    { id: 'stale-code-equals-truth', pattern: /代码自洽.*等于.*真理|仿真成功.*即证明/, label: '把代码自洽等同于经验真理（本体论暴政）' },
    { id: 'stale-kant-default', pattern: /凡无出处.*默认康德|找不到文献.*用康德/, label: '无底本时静默塞入康德' }
  ];

  for (const s of staleHeuristics) {
    if (s.pattern.test(thesis)) {
      hits.push({
        docId: s.id,
        title: '负知识启发式',
        reason: s.label,
        overlap: 1
      });
    }
  }

  if (hits.length > 0) {
    return {
      name: 'negative_knowledge',
      passed: false,
      exitCode: 1,
      evidence: { hits: hits.slice(0, 5) },
      remediation: '命中负知识库/陈旧路径。请换反常识切入点，勿复读已被登记的默会假设或伪相关叙事。'
    };
  }

  return {
    name: 'negative_knowledge',
    passed: true,
    exitCode: 0,
    evidence: {
      scannedTheses: Object.keys(RAG_THESIS_REGISTRY).length,
      message: '未命中已登记的默会陷阱与陈旧启发式。'
    }
  };
}

export interface HarnessRunInput {
  thesis?: string;
  claimClass?: ClaimClass;
  slideIndex?: number;
}

const DEFAULT_THESIS =
  '邓煜指出无穷维相空间中奇异性在特定测度下具有正概率；将余维数-1 临界流形映射到制度薄膜后，可用罗尔斯无知之幕仿真检验：资源匮乏冲击下差异原则契约遵从率是否断崖式下跌，从而证明社科机制必须接受可证伪的硬约束，而非仅靠文本自洽。';

export function runHarnessDemo(input: HarnessRunInput = {}): HarnessRun {
  const thesis = (input.thesis || DEFAULT_THESIS).trim();
  const claimClass: ClaimClass = input.claimClass || 'hypothesis';
  const slideIndex = input.slideIndex || 72;
  const auditTrace: AuditNode[] = [];
  const rejectedHypotheses: string[] = [];

  auditTrace.push({
    step: 'load_sandbox',
    at: nowIso(),
    detail: `语料沙箱：CORE_DOCUMENTS + RAG_THESIS_REGISTRY；议题页 P.${slideIndex}`
  });

  auditTrace.push({
    step: 'claim',
    at: nowIso(),
    detail: `[${claimClass}] ${thesis.slice(0, 200)}`
  });

  const gates: GateResult[] = [];

  const g1 = runCitationGate(thesis);
  gates.push(g1);
  auditTrace.push({
    step: 'gate1_citation',
    at: nowIso(),
    detail: g1.passed ? `锚定 ${(g1.evidence as any).sourceTitle}` : `拦截：${g1.remediation}`
  });
  if (!g1.passed) rejectedHypotheses.push('无底本锚定的断言');

  const g2 = runCounterfactualGate(thesis);
  gates.push(g2);
  auditTrace.push({
    step: 'gate2_counterfactual',
    at: nowIso(),
    detail: g2.passed
      ? String((g2.evidence as any).falsificationHint || '压力测试通过')
      : `拦截：${g2.remediation}`
  });
  if (!g2.passed) rejectedHypotheses.push('反事实不敏感 / 不可证伪');

  const g3 = runNegativeKnowledgeGate(thesis);
  gates.push(g3);
  auditTrace.push({
    step: 'gate3_negative_knowledge',
    at: nowIso(),
    detail: g3.passed ? '未命中负知识' : `拦截：${g3.remediation}`
  });
  if (!g3.passed) {
    const hit = (g3.evidence as any)?.hits?.[0]?.reason;
    rejectedHypotheses.push(hit || '负知识命中');
  }

  const passed = gates.every(g => g.exitCode === 0);

  auditTrace.push({
    step: 'verdict',
    at: nowIso(),
    detail: passed
      ? '三道门均 exit 0，可记入示范审计树（仍非研讨默认终稿）。'
      : '存在 exit 1：禁止写入终稿，仅允许重试/回滚。'
  });

  return {
    thesis,
    claimClass,
    slideIndex,
    gates,
    passed,
    rejectedHypotheses,
    fork: {
      pathA: '唯物史观：资源/财政硬约束驱动相变（偏仿真可测）',
      pathB: '观念史：概念漂移与意义剩余主导解释（偏文献对勘）',
      note: '示范分叉：同一现象两条互斥路径；本轮不自动裁决胜者，只展示门禁如何分别施压。'
    },
    auditTrace,
    demoDisclaimer: DEMO_DISCLAIMER
  };
}
