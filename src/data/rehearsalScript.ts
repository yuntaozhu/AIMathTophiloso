/**
 * Phase 5：45′ 极简彩排路线（对照 90′ 全场成功标准的压缩版）。
 * 页码含开场论点 15 页（结构发现段）后的六章偏移。
 */
export interface RehearsalStop {
  slideIndex: number;
  minutesHint: string;
  action: string;
  tool?: 'knowledge_base' | 'sandbox' | 'harness' | 'minutes' | 'agenda';
}

export const REHEARSAL_45_STOPS: RehearsalStop[] = [
  { slideIndex: 1, minutesHint: '0–1′', action: '定调：AI Math → 文社哲启发' },
  { slideIndex: 3, minutesHint: '1–3′', action: '开场反差：数学突破 vs 文社哲迟滞' },
  { slideIndex: 9, minutesHint: '3–6′', action: '结构发现：见证搜索 → 第三类能力' },
  { slideIndex: 12, minutesHint: '6–8′', action: '社科张力 → 预告罗尔斯沙盒' },
  { slideIndex: 16, minutesHint: '8–9′', action: 'Harness 公式 + Type-3' },
  { slideIndex: 18, minutesHint: '9–10′', action: '议程：挑梁 + 三次沙盒 + 共议' },
  { slideIndex: 24, minutesHint: '10–13′', action: 'SRM / 反基础主义挑梁' },
  { slideIndex: 29, minutesHint: '13–14′', action: '章末共议 1–2′', tool: 'agenda' },
  { slideIndex: 37, minutesHint: '14–17′', action: 'PDE 沙盒 40–60 秒', tool: 'sandbox' },
  { slideIndex: 47, minutesHint: '17–20′', action: '记忆流沙盒拧权重', tool: 'sandbox' },
  { slideIndex: 52, minutesHint: '20–21′', action: '本体论暴力刹车共议', tool: 'agenda' },
  { slideIndex: 68, minutesHint: '21–27′', action: '罗尔斯温和/极端对比（结构张力）', tool: 'sandbox' },
  { slideIndex: 78, minutesHint: '27–31′', action: '明清财政沙盒', tool: 'sandbox' },
  { slideIndex: 79, minutesHint: '31–37′', action: 'Type-3 Harness 示范面板一轮', tool: 'harness' },
  { slideIndex: 81, minutesHint: '37–40′', action: '意义剩余 / 伦理刹车' },
  { slideIndex: 83, minutesHint: '40–45′', action: '开放追问 + 按页纪要', tool: 'minutes' }
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
