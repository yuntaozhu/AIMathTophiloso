/**
 * 90 分钟研讨控台节奏提示：对齐开场 → 主讲 → 共议 → 沙盒 → 纪要。
 * pace 决定主讲口播深度；tool 提示当场该开哪个道具。
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
  | 'minutes';

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

/** 显式标注的关键页；未列出的页默认「快翻」 */
const HINT_BY_SLIDE: Record<number, PresenterPaceHint> = {
  1: { pace: '开场', tool: 'none', tip: '30 秒定调：数学 AI → 文史哲社科启发。' },
  2: { pace: '开场', tool: 'knowledge_base', tip: '可选出示 Lean/流体文献底本；说明参会跟随规则。' },
  3: { pace: '开场', tool: 'none', tip: '宣布：深讲约 20 页 + 3 次沙盒 + 章末共议。' },

  9: { pace: '深讲', tool: 'none', tip: 'SRM / 反基础主义：本章核心论点之一。' },
  10: { pace: '深讲', tool: 'knowledge_base', tip: '有理立方体：打开知识库 Friedman 切片。' },
  11: { pace: '深讲', tool: 'knowledge_base', tip: '大基数遥控：与制度「外生锚定」对照。' },
  12: { pace: '深讲', tool: 'none', tip: '对哲学启发：真理实体化落地。' },
  13: { pace: '深讲', tool: 'none', tip: '对人文学启发：从阐释到执行证伪。' },
  14: { pace: '共议', tool: 'agenda_guardian', tip: '章末追问 2–3′；触发议程卫士收束。' },

  21: { pace: '深讲', tool: 'none', tip: '测度相变：为余维数沙盒铺垫。' },
  22: { pace: '沙盒', tool: 'sandbox_pde', tip: '开 PDE 余维数-1 模板，展示 40–60 秒即可。' },
  25: { pace: '深讲', tool: 'none', tip: '映射社科危机相界。' },
  26: { pace: '共议', tool: 'agenda_guardian', tip: 'Cantor / 社会崩溃追问；暂关弹幕刷屏可。' },

  29: { pace: '深讲', tool: 'none', tip: 'Ontology as Code：强类型接口。' },
  31: { pace: '深讲', tool: 'sandbox_memory', tip: 'Joon Park 架构：预备记忆流沙盒。' },
  32: { pace: '沙盒', tool: 'sandbox_memory', tip: '拧 α/β/γ 权重，看检索排序变化约 2′。' },
  37: { pace: '共议', tool: 'agenda_guardian', tip: '本体论暴力：全场人文刹车，勿开沙盒炫技。' },

  40: { pace: '深讲', tool: 'none', tip: 'RLHF 中庸陷阱：严肃仿真动机。' },
  41: { pace: '深讲', tool: 'none', tip: '马基雅维利行动集：可高亮代码，不跑假执行。' },
  42: { pace: '深讲', tool: 'none', tip: 'BDI 硬约束：物质存量三维矩阵。' },
  48: { pace: '共议', tool: 'agenda_guardian', tip: '黑暗丛林与利他：短共议或并入大讨论。' },

  52: { pace: '深讲', tool: 'sandbox_rawls', tip: '无知之幕收敛：立刻衔接到沙盒。' },
  53: { pace: '沙盒', tool: 'sandbox_rawls', tip: '拧 scarcityShock / machiavellianWeight，对比遵从率。' },

  62: { pace: '深讲', tool: 'sandbox_mingqing', tip: '明清内卷沙盘背景：预备调参。' },
  63: { pace: '沙盒', tool: 'sandbox_mingqing', tip: '白银紧缩 → 抗粮；对照余维数-1 叙事。' },

  64: { pace: '收束', tool: 'none', tip: '解释学双循环：方法论总结。' },
  66: { pace: '收束', tool: 'none', tip: '意义剩余：必讲伦理刹车。' },
  67: { pace: '收束', tool: 'none', tip: '学者新定位：快带过。' },
  68: { pace: '收束', tool: 'minutes', tip: '开放追问 + 生成按页纪要。' }
};

export function getPresenterPaceHint(slideIndex: number): PresenterPaceHint {
  return HINT_BY_SLIDE[slideIndex] || DEFAULT_HINT;
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
