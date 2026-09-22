/**
 * Phase 5：45′ 极简彩排路线（对照 90′ 全场成功标准的压缩版）。
 * 主讲可一键跳站，不必翻外部文档。
 */
export interface RehearsalStop {
  slideIndex: number;
  minutesHint: string;
  action: string;
  tool?: 'knowledge_base' | 'sandbox' | 'harness' | 'minutes' | 'agenda';
}

export const REHEARSAL_45_STOPS: RehearsalStop[] = [
  { slideIndex: 1, minutesHint: '0–1′', action: '定调：AI Math → 文社哲启发' },
  { slideIndex: 3, minutesHint: '1–4′', action: '开场论点：数学突破 vs 文社哲迟滞' },
  { slideIndex: 9, minutesHint: '4–6′', action: 'Harness 公式预告（示范留到收束）' },
  { slideIndex: 11, minutesHint: '6–7′', action: '议程：挑梁 + 三次沙盒 + 共议' },
  { slideIndex: 17, minutesHint: '7–11′', action: 'SRM / 反基础主义挑梁' },
  { slideIndex: 22, minutesHint: '11–13′', action: '章末共议 2′', tool: 'agenda' },
  { slideIndex: 30, minutesHint: '13–16′', action: 'PDE 沙盒 40–60 秒', tool: 'sandbox' },
  { slideIndex: 40, minutesHint: '16–20′', action: '记忆流沙盒拧权重', tool: 'sandbox' },
  { slideIndex: 45, minutesHint: '20–22′', action: '本体论暴力刹车共议', tool: 'agenda' },
  { slideIndex: 61, minutesHint: '22–28′', action: '罗尔斯温和/极端对比', tool: 'sandbox' },
  { slideIndex: 71, minutesHint: '28–33′', action: '明清财政沙盒', tool: 'sandbox' },
  { slideIndex: 72, minutesHint: '33–38′', action: 'Harness 示范面板一轮', tool: 'harness' },
  { slideIndex: 74, minutesHint: '38–41′', action: '意义剩余 / 伦理刹车' },
  { slideIndex: 76, minutesHint: '41–45′', action: '开放追问 + 按页纪要', tool: 'minutes' }
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
