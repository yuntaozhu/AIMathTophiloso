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
  2: { pace: '开场', tool: 'knowledge_base', tip: '深蓝破局点立住即可；Lean 机制留给下一页。可选出示文献底本。' },
  3: { pace: '深讲', tool: 'knowledge_base', tip: 'Lean 专讲 2–3′：证明编译器 / 交互填洞 / ≠LLM / 衔接触发 Harness。' },

  4: { pace: '开场', tool: 'none', tip: '核心反差：数学有范式突破，文社哲尚未有。' },
  5: { pace: '深讲', tool: 'none', tip: '两套范式对照：有无 Ground Truth / Lean。' },
  6: { pace: '深讲', tool: 'none', tip: '三因：验证器缺位、反思性、符号意义。' },
  7: { pace: '深讲', tool: 'none', tip: '启发① 概念压力测试机（衔罗尔斯沙盒）。' },
  8: { pace: '深讲', tool: 'none', tip: '启发② 反事实沙箱 / 合成社会。' },
  9: { pace: '深讲', tool: 'none', tip: '启发③ 人类护城河：真问题与价值赋予。' },

  10: { pace: '深讲', tool: 'none', tip: '结构发现：见证搜索 → 逼出隐藏刚性。' },
  11: { pace: '深讲', tool: 'none', tip: '三类能力映射：Calculator / Lemma / Structure。' },
  12: { pace: '深讲', tool: 'none', tip: '内在张力母体：加法–乘法张力的跨域形式。' },
  13: { pace: '深讲', tool: 'sandbox_rawls', tip: '社科：微观博弈逼出制度拓扑；预告沙盒。' },
  14: { pace: '深讲', tool: 'none', tip: '人文语义张力 + 先验论证计算化。' },
  15: { pace: '深讲', tool: 'harness_demo', tip: 'Type-3 Harness：约束传播 + 刚性门。' },
  16: { pace: '深讲', tool: 'none', tip: '关键引理归因：谁想到的中间结构？' },
  17: { pace: '深讲', tool: 'harness_demo', tip: '公式收束 Agent = Model + Harness。' },
  18: { pace: '开场', tool: 'none', tip: '学者护城河 → 翻议程，进入六章。' },

  19: { pace: '开场', tool: 'none', tip: '议程：深讲挑梁 + 3 次沙盒 + 共议。' },

  25: { pace: '深讲', tool: 'none', tip: 'SRM / 反基础主义：本章核心论点之一。' },
  26: { pace: '深讲', tool: 'knowledge_base', tip: '有理立方体：打开知识库 Friedman 切片。' },
  27: { pace: '深讲', tool: 'knowledge_base', tip: '大基数遥控：与制度「外生锚定」对照。' },
  28: { pace: '深讲', tool: 'none', tip: '对哲学启发：真理实体化落地。' },
  29: { pace: '深讲', tool: 'none', tip: '对人文学启发：从阐释到执行证伪。' },
  30: { pace: '共议', tool: 'agenda_guardian', tip: '章末追问 2–3′；触发议程卫士收束。' },

  37: { pace: '深讲', tool: 'none', tip: '测度相变：为余维数沙盒铺垫。' },
  38: { pace: '沙盒', tool: 'sandbox_pde', tip: '开 PDE 余维数-1 模板，展示 40–60 秒即可。' },
  41: { pace: '深讲', tool: 'none', tip: '映射社科危机相界。' },
  42: { pace: '共议', tool: 'agenda_guardian', tip: 'Cantor / 社会崩溃追问；暂关弹幕刷屏可。' },

  45: { pace: '深讲', tool: 'none', tip: 'Ontology as Code：强类型接口。' },
  47: { pace: '深讲', tool: 'sandbox_memory', tip: 'Joon Park 架构：预备记忆流沙盒。' },
  48: { pace: '沙盒', tool: 'sandbox_memory', tip: '拧 α/β/γ 权重，看检索排序变化约 2′。' },
  53: { pace: '共议', tool: 'agenda_guardian', tip: '本体论暴力：全场人文刹车，勿开沙盒炫技。' },

  56: { pace: '深讲', tool: 'none', tip: 'RLHF 中庸陷阱：严肃仿真动机。' },
  57: { pace: '深讲', tool: 'none', tip: '马基雅维利行动集：可高亮代码，不跑假执行。' },
  58: { pace: '深讲', tool: 'none', tip: 'BDI 硬约束：物质存量三维矩阵。' },
  64: { pace: '共议', tool: 'agenda_guardian', tip: '黑暗丛林与利他：短共议或并入大讨论。' },

  68: { pace: '深讲', tool: 'sandbox_rawls', tip: '无知之幕收敛：立刻衔接到沙盒。' },
  69: { pace: '沙盒', tool: 'sandbox_rawls', tip: '拧 scarcityShock / machiavellianWeight，对照“结构张力”叙事。' },

  78: { pace: '深讲', tool: 'sandbox_mingqing', tip: '明清内卷沙盘背景：预备调参。' },
  79: { pace: '沙盒', tool: 'sandbox_mingqing', tip: '白银紧缩 → 抗粮；对照余维数-1 叙事。' },

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
