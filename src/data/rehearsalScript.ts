/**
 * 45′ 极简彩排（含 Lean 专讲站）。
 */
export interface RehearsalStop {
  slideIndex: number;
  minutesHint: string;
  action: string;
  tool?: 'knowledge_base' | 'sandbox' | 'harness' | 'minutes' | 'agenda';
}

export const REHEARSAL_45_STOPS: RehearsalStop[] = [
  { slideIndex: 1, minutesHint: '0–1′', action: '定调：AI Math → 文社哲启发' },
  { slideIndex: 2, minutesHint: '1–2′', action: '深蓝破局点：欧拉爆破 + Lean 节点' },
  { slideIndex: 3, minutesHint: '2–5′', action: 'Lean 专讲：证明编译器 ≠ LLM', tool: 'knowledge_base' },
  { slideIndex: 4, minutesHint: '5–6′', action: '开场反差：数学突破 vs 文社哲迟滞' },
  { slideIndex: 10, minutesHint: '6–8′', action: '结构发现：见证搜索 → 第三类能力' },
  { slideIndex: 13, minutesHint: '8–10′', action: '社科张力 → 预告罗尔斯沙盒' },
  { slideIndex: 17, minutesHint: '10–11′', action: 'Harness 公式 + Type-3' },
  { slideIndex: 19, minutesHint: '11–12′', action: '议程：挑梁 + 三次沙盒 + 共议' },
  { slideIndex: 25, minutesHint: '12–15′', action: 'SRM / 反基础主义挑梁' },
  { slideIndex: 30, minutesHint: '15–16′', action: '章末共议 1–2′', tool: 'agenda' },
  { slideIndex: 38, minutesHint: '16–18′', action: 'PDE 沙盒 40–60 秒', tool: 'sandbox' },
  { slideIndex: 48, minutesHint: '18–21′', action: '记忆流沙盒拧权重', tool: 'sandbox' },
  { slideIndex: 53, minutesHint: '21–22′', action: '本体论暴力刹车共议', tool: 'agenda' },
  { slideIndex: 69, minutesHint: '22–27′', action: '罗尔斯温和/极端对比', tool: 'sandbox' },
  { slideIndex: 79, minutesHint: '27–30′', action: '明清财政沙盒', tool: 'sandbox' },
  { slideIndex: 80, minutesHint: '30–36′', action: 'Type-3 Harness 示范', tool: 'harness' },
  { slideIndex: 82, minutesHint: '36–39′', action: '意义剩余 / 伦理刹车' },
  { slideIndex: 84, minutesHint: '39–45′', action: '开放追问 + 按页纪要', tool: 'minutes' }
];

export function getRehearsalStopIndex(slideIndex: number): number {
  return REHEARSAL_45_STOPS.findIndex(s => s.slideIndex === slideIndex);
}

export function getNextRehearsalStop(slideIndex: number): RehearsalStop | null {
  const i = getRehearsalStopIndex(slideIndex);
  if (i >= 0 && i < REHEARSAL_45_STOPS.length - 1) return REHEARSAL_45_STOPS[i + 1];
  const ahead = REHEARSAL_45_STOPS.find(s => s.slideIndex > slideIndex);
  return ahead || null;
}

export function getPrevRehearsalStop(slideIndex: number): RehearsalStop | null {
  const i = getRehearsalStopIndex(slideIndex);
  if (i > 0) return REHEARSAL_45_STOPS[i - 1];
  const behind = [...REHEARSAL_45_STOPS].reverse().find(s => s.slideIndex < slideIndex);
  return behind || null;
}
