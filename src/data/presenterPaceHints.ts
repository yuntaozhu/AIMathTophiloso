/**
 * 90 分钟研讨控台节奏提示。
 * 页码：P.1–2 深蓝；P.3 Lean 专讲；P.4–P.18 开场论点；原六章自 P.19 起。
 */
export type SlidePace = '开场' | '深讲' | '快翻' | '共议' | '沙盒' | '收束';

export type SuggestedTool =
  | 'none'
  | 'knowledge_base'
  | 'sandbox_pde'
  | 'sandbox_memory'
  | 'sandbox_rawls'
  | 'sandbox_mingqing'
  | 'agenda_guardian'
  | 'minutes'
  | 'harness_demo';

export interface PresenterPaceHint {
  pace: SlidePace;
  tool: SuggestedTool;
  tip: string;
}

const DEFAULT_HINT: PresenterPaceHint = {
  pace: '快翻',
  tool: 'none',
  tip: '一带而过，保留时间给深讲与共议卡点。'
};

const HINT_BY_SLIDE: Record<number, PresenterPaceHint> = {
  1: { pace: '开场', tool: 'none', tip: '30 秒定调：AI Math → 文社哲启发与方向。' },
  2: { pace: '开场', tool: 'knowledge_base', tip: '深蓝破局：statement / Córdoba / AlphaProof；Lean 留给下页。' },
  3: { pace: '深讲', tool: 'knowledge_base', tip: 'Lean：APOLLO·Lean Copilot·mathlib·miniF2F——打开知识库。' },

  4: { pace: '开场', tool: 'knowledge_base', tip: '反差：AlphaProof/AG2/LLEMMA/OlympiadBench vs 文社哲。' },
  5: { pace: '深讲', tool: 'none', tip: '两套范式：Lean Ground Truth；对照 APOLLO / process supervision。' },
  6: { pace: '深讲', tool: 'none', tip: '三因：验证器缺位、反思性、符号意义。' },
  7: { pace: '深讲', tool: 'none', tip: '启发① 概念压力测试（衔罗尔斯；OlympiadBench 隐喻）。' },
  8: { pace: '深讲', tool: 'knowledge_base', tip: '启发② Social Simulacra / Generative Agents → 反事实沙箱。' },
  9: { pace: '深讲', tool: 'none', tip: '启发③ 护城河；可挂 DFM。' },

  10: { pace: '深讲', tool: 'knowledge_base', tip: '结构发现三类能力：必开 doc-structure-discovery-01。' },
  11: { pace: '深讲', tool: 'none', tip: '三类能力映射：Calculator / Lemma / Structure。' },
  12: { pace: '深讲', tool: 'none', tip: '内在张力母体：加法–乘法张力的跨域形式。' },
  13: { pace: '深讲', tool: 'sandbox_rawls', tip: '社科：微观博弈逼出制度拓扑；预告沙盒。' },
  14: { pace: '深讲', tool: 'knowledge_base', tip: '人文张力；预告哥德尔本体论形式化。' },
  15: { pace: '深讲', tool: 'harness_demo', tip: 'Type-3：ReAct/Reflexion/SWE-agent 作工程对照。' },
  16: { pace: '深讲', tool: 'none', tip: '关键引理归因：谁想到的中间结构？' },
  17: { pace: '深讲', tool: 'knowledge_base', tip: 'Agent=Model+Harness：Böckeler / AI-Coding / SWE-agent。' },
  18: { pace: '开场', tool: 'none', tip: '学者护城河 → 翻议程，进入六章。' },

  19: { pace: '开场', tool: 'none', tip: '议程：深讲挑梁 + 3 次沙盒 + 共议。' },

  25: { pace: '深讲', tool: 'knowledge_base', tip: 'SRM / 反基础主义：挂 Friedman 手稿。' },
  26: { pace: '深讲', tool: 'knowledge_base', tip: '有理立方体 / Friedman：打开 BRT·具体不完备性 PDF。' },
  27: { pace: '深讲', tool: 'knowledge_base', tip: '大基数遥控：与制度「外生锚定」对照。' },
  28: { pace: '深讲', tool: 'none', tip: '对哲学启发：真理实体化落地。' },
  29: { pace: '深讲', tool: 'none', tip: '对人文学启发：从阐释到执行证伪。' },
  30: { pace: '共议', tool: 'agenda_guardian', tip: '章末追问 2–3′；触发议程卫士收束。' },

  35: { pace: '深讲', tool: 'knowledge_base', tip: '邓煜波前：doc-deng-* 报告。' },
  36: { pace: '深讲', tool: 'knowledge_base', tip: '五重认知阶梯：对照邓煜条目。' },
  37: { pace: '深讲', tool: 'none', tip: '测度相变：为余维数沙盒铺垫。' },
  38: { pace: '沙盒', tool: 'sandbox_pde', tip: '开 PDE 余维数-1 模板，展示 40–60 秒即可。' },
  39: { pace: '深讲', tool: 'knowledge_base', tip: '流体爆破：statement + Córdoba + BKM/Chae。' },
  41: { pace: '深讲', tool: 'none', tip: '映射社科危机相界。' },
  42: { pace: '共议', tool: 'agenda_guardian', tip: 'Cantor / 社会崩溃追问；暂关弹幕刷屏可。' },

  45: { pace: '深讲', tool: 'none', tip: 'Ontology as Code：强类型接口。' },
  47: { pace: '深讲', tool: 'knowledge_base', tip: 'Generative Agents 原文 PDF；预备记忆流沙盒。' },
  48: { pace: '沙盒', tool: 'sandbox_memory', tip: '拧 α/β/γ 权重，看检索排序变化约 2′。' },
  50: { pace: '深讲', tool: 'knowledge_base', tip: 'Social Simulacra + 复数未来。' },
  51: { pace: '深讲', tool: 'knowledge_base', tip: 'SCM / 因果调整集论文。' },
  53: { pace: '共议', tool: 'agenda_guardian', tip: '本体论暴力：全场人文刹车，勿开沙盒炫技。' },

  56: { pace: '深讲', tool: 'knowledge_base', tip: 'MACHIAVELLI：奖励 vs 伦理张力；RLHF 陷阱。' },
  57: { pace: '深讲', tool: 'none', tip: '马基雅维利行动集：可高亮代码，不跑假执行。' },
  58: { pace: '深讲', tool: 'none', tip: 'BDI 硬约束：物质存量三维矩阵。' },
  64: { pace: '共议', tool: 'agenda_guardian', tip: '黑暗丛林与利他：短共议或并入大讨论。' },

  68: { pace: '深讲', tool: 'sandbox_rawls', tip: '无知之幕收敛：立刻衔接到沙盒。' },
  69: { pace: '沙盒', tool: 'sandbox_rawls', tip: '拧 scarcityShock / machiavellianWeight，对照“结构张力”叙事。' },
  70: { pace: '深讲', tool: 'knowledge_base', tip: '哥德尔本体论：Benzmüller 形式化条目。' },

  78: { pace: '深讲', tool: 'sandbox_mingqing', tip: '点「打开演化仪表板」→ /#/sim/ming-qing；预备对照五场景。' },
  79: { pace: '沙盒', tool: 'sandbox_mingqing', tip: '仪表板：baseline 播到 1644，再切海运/实物直征。' },

  80: { pace: '收束', tool: 'harness_demo', tip: '解释学双循环；可开 Type-3 Harness 示范面板。' },
  82: { pace: '收束', tool: 'none', tip: '意义剩余：必讲伦理刹车。' },
  83: { pace: '收束', tool: 'none', tip: '学者新定位：快带过。' },
  84: { pace: '收束', tool: 'minutes', tip: '开放追问 + 生成按页纪要。' }
};

export function getPresenterPaceHint(slideIndex: number): PresenterPaceHint {
  return HINT_BY_SLIDE[slideIndex] || DEFAULT_HINT;
}

export function isDiscussionSlide(slideIndex: number): boolean {
  return getPresenterPaceHint(slideIndex).pace === '共议';
}

export function toolLabel(tool: SuggestedTool): string {
  switch (tool) {
    case 'knowledge_base':
      return '知识库';
    case 'sandbox_pde':
      return '沙盒·PDE';
    case 'sandbox_memory':
      return '沙盒·记忆流';
    case 'sandbox_rawls':
      return '沙盒·罗尔斯';
    case 'sandbox_mingqing':
      return '沙盒·明清';
    case 'agenda_guardian':
      return '议程卫士';
    case 'minutes':
      return '会议纪要';
    case 'harness_demo':
      return 'Harness 示范';
    default:
      return '';
  }
}

export const SANDBOX_TEMPLATE_BY_TOOL: Partial<Record<SuggestedTool, string>> = {
  sandbox_pde: 'pde-codim1-manifold',
  sandbox_memory: 'stanford-agent-memory',
  sandbox_rawls: 'rawls-veil',
  sandbox_mingqing: 'ming-qing-fiscal'
};
