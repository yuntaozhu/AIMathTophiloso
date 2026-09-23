/**
 * PPT 数学概念「AI 概览」精编（第一章–第二章 + 开场 Lean/ATP）
 */
import type { AiOverviewPayload } from './aiOverviewCurated';

type Body = Omit<AiOverviewPayload, 'query' | 'source'>;

export const MATH_CURATED: Record<string, Body> = {
  '具体数学不完备性': {
    lead:
      '哈维·弗里德曼（Harvey Friedman）的「具体数学不完备性」指出：并非只有哥德尔式自指编码才会不可判定——组合学、欧氏几何与有理点集中的日常命题，也可能超出 ZFC 的证明力，必须诉诸大基数强度。',
    highlightPhrase: '日常命题也可能超出 ZFC 的证明力',
    sections: [
      {
        heading: '核心冲击',
        bullets: [
          { title: '打破心理隔离', text: '工作数学家长期认为不可判定只属于“病态编码”；Friedman 证明有限/几何命题亦可触及大基数。' },
          { title: 'Boolean Relation Theory', text: 'BRT 等手稿系统展示具体命题与大基数公理的证明论强度对应。' },
          { title: '对本场', text: '映射社科：局部制度规则无法在系统内部完成自洽锚定，需“外生大基数式”宪制。' }
        ]
      }
    ],
    followUps: ['有理立方体模型', '马洛基数', '逆向数学 Big Five'],
    citations: [{ label: 'Friedman · Concrete Mathematical Incompleteness', extra: 1 }]
  },
  逆向数学: {
    lead:
      '逆向数学（Reverse Mathematics）不仅问“公理能否推出定理”，更在弱基底系统下证明定理反向可推出其必要公理——定理与公理具有相同的认识论重量。',
    highlightPhrase: '定理反向可推出其必要公理',
    sections: [
      {
        heading: '工作方式',
        bullets: [
          { title: '基底 RCA₀', text: '可计算算术作为最弱工作台。' },
          { title: 'Reversal', text: '证明「定理 ⇔ 公理」在算术模型中互为充要。' },
          { title: '哲学含义', text: '公理并非任意约定，而是定理内在呼唤的逻辑强度。' }
        ]
      }
    ],
    followUps: ['The Big Five', '严格逆向数学 SRM', '与弗里德曼具体不完备性关系'],
    citations: [{ label: 'Simpson / Friedman · Reverse Mathematics', extra: 2 }]
  },
  'the big five': {
    lead:
      'The Big Five 是二阶算术子系统的五座逻辑支柱：RCA₀ < WKL₀ < ACA₀ < ATR₀ < Π¹₁-CA₀，像元素周期表一样标定经典定理的“逻辑原子重量”。',
    highlightPhrase: '逻辑原子重量',
    sections: [
      {
        heading: '五重阶梯',
        bullets: [
          { title: 'RCA₀', text: '递归概括：可计算数学底座。' },
          { title: 'WKL₀', text: '弱柯尼希引理：紧致性、海涅–博雷尔。' },
          { title: 'ACA₀', text: '算术概括：实数完备性、BW 定理。' },
          { title: 'ATR₀', text: '算术超限递归：良序与乌尔姆定理级。' },
          { title: 'Π¹₁-CA₀', text: '非谓词分析天花板：康托尔–本迪克松等。' }
        ]
      }
    ],
    followUps: ['SRM 如何去掉基底假定', '社科理论对应哪一层强度'],
    citations: [{ label: 'Reverse Mathematics · Big Five', extra: 1 }]
  },
  srm: {
    lead:
      '严格逆向数学（Strict Reverse Mathematics, SRM）在尽可能剥离基础系统假定（逼近 Zero Base）的前提下，直接建立命题之间的绝对等价，用以终结“公理纯属语言约定”的反基础主义幻觉。',
    highlightPhrase: '直接建立命题之间的绝对等价',
    sections: [
      {
        heading: '要点',
        bullets: [
          { title: '真理实体性', text: '逻辑强度深植于数学事实内部，类似物理中的质量—能量。' },
          { title: '对本场哲学页', text: '为“真理实体化 / 机器证明”铺路：高阶结构非修辞幻觉。' }
        ]
      }
    ],
    followUps: ['有理立方体', '反基础主义批判'],
    citations: [{ label: 'Friedman · SRM', extra: 1 }]
  },
  有理立方体: {
    lead:
      '有理立方体（Rational Cube）把战场拉回单位立方体上的有理点集 Qᵏ∩[0,1]ᵏ：定义朴素，但仿射变换与“下落对称性”下的极大仿真性质，逻辑上可等价于大基数存在。',
    highlightPhrase: '定义朴素，深层直通大基数',
    sections: [
      {
        heading: '几何 → 集合论',
        bullets: [
          { title: '极大临界态', text: '保持内部对称约束且无法再加点，称为极大仿真。' },
          { title: '遥控隐喻', text: '宏观无穷如“量子之手”操控有限网格构型——制度外生锚定的数学原型。' }
        ]
      }
    ],
    followUps: ['马洛基数', '具体数学不完备性'],
    citations: [{ label: 'Friedman · Rational Cube / BRT', extra: 1 }]
  },
  大基数: {
    lead:
      '大基数（Large Cardinals）是超越 ZFC 常规强度的无穷公理层次。Friedman 叙事中，证明某些有限/具体命题需要马洛基数（Mahlo）等假设——大基数不再是集合论学家的形而上学玩具。',
    highlightPhrase: '有限具体命题需要大基数假设',
    sections: [
      {
        heading: '对本场',
        bullets: [
          { title: '数学', text: '局部几何构型的稳定性受控于顶端逻辑公理。' },
          { title: '社科隐喻', text: '微观契约无法自证宏观秩序，需外生宪制“大基数”锚定。' }
        ]
      }
    ],
    followUps: ['有理立方体', '哥德尔不完备性'],
    citations: [{ label: 'Large Cardinals / Mahlo', extra: 2 }]
  },
  哥德尔不完备性: {
    lead:
      '哥德尔不完备性定理表明：足够强的一致形式系统无法在内部证明自身的一切真命题，更无法证明自身一致性。它塑造了半个世纪的“心理隔离”——直到具体不完备性把冲击拉回日常数学。',
    highlightPhrase: '无法在内部证明自身的一切真命题',
    sections: [
      {
        heading: '两定理（直觉版）',
        bullets: [
          { title: '第一', text: '存在真但不可证的命题（在系统内）。' },
          { title: '第二', text: '系统不能证明自身一致性（在通常条件下）。' },
          { title: '本场转折', text: 'Friedman：不可判定不必依赖自指编码。' }
        ]
      }
    ],
    followUps: ['具体数学不完备性', '哥德尔本体论形式化'],
    citations: [{ label: 'Gödel 1931', extra: 1 }]
  },
  四色定理: {
    lead:
      '四色定理断言任何平面地图至多用四种颜色即可使邻接区域异色。1976 年阿佩尔–哈肯借助计算机完成不可避免集与可约构型的大规模核验，把“证明”推上认识论审判席；后续工作追求更短、更可复核的归约。',
    highlightPhrase: '计算机核验进入数学证明',
    sections: [
      {
        heading: '本场线索',
        bullets: [
          { title: '肯普链漏洞', text: '19 世纪证明草案的经典破绽。' },
          { title: '并行归约', text: 'O(n log n) 级算法叙事：构型储备充沛时拓扑化简可高度并行。' },
          { title: '平坦区域', text: '缺乏特征的区域往往藏着全局归约通道。' }
        ]
      }
    ],
    followUps: ['平坦区域', '与 Lean 形式化证明文化'],
    citations: [{ label: 'Appel–Haken / 四色定理', extra: 2 }]
  },
  余维数: {
    lead:
      '在无穷维相空间中，余维数（Codimension）刻画中心稳定流形相对全空间“缺了几维约束”。余维数-1 超曲面像一张薄膜：一侧耗散平衡，一侧有限时间爆破——本场映射社会危机相界的核心几何隐喻。',
    highlightPhrase: '余维数-1 超曲面像一张薄膜',
    sections: [
      {
        heading: 'PDE 图像',
        bullets: [
          { title: '鞍点孤立子 Q', text: '线性化谱算子若仅一个负本征值，则 W^{cs}(Q) 常为余维数 1。' },
          { title: '相界', text: '越过临界幅值 A*(σ) 即落入奇异坍缩。' },
          { title: '社科对偶', text: '制度均衡不是宽容盆地，而是高维预期空间中的脆弱薄膜。' }
        ]
      }
    ],
    followUps: ['Bourgain 区域', '邓煜五重阶梯', '打开 PDE 沙盒'],
    citations: [{ label: '邓煜 · 奇异性景观', extra: 2 }]
  },
  'bourgain 区域': {
    lead:
      'Bourgain 区域指在随机/概率测度意义下，即便局部存在爆破可能，高频随机波动干涉相消仍可保证全局适定性的“正测度安全区”——说明稳定性可以是测度论事实，而非处处成立。',
    highlightPhrase: '正测度安全区',
    sections: [
      {
        heading: '要点',
        bullets: [
          { title: '概率比特视角', text: '高斯随机场上的典型初值行为。' },
          { title: '与余维数对照', text: '危险集可以“薄”（余维数高）但仍决定命运；安全区可以“厚”（正测度）。' }
        ]
      }
    ],
    followUps: ['余维数-1', '五重认知阶梯'],
    citations: [{ label: 'Bourgain / 随机色散方程', extra: 1 }]
  },
  五重认知阶梯: {
    lead:
      '邓煜将奇异性分析的认知目标粗分为五阶：存在性 → 测度 → 余维数 → 拓扑性质 → 完全分类/孤子分辨。当前大模型多停在第一阶（找反例），顶尖人类数学家在向二至四阶推进。',
    highlightPhrase: '存在性 → 测度 → 余维数 → 拓扑 → 完全分类',
    sections: [
      {
        heading: '阶梯释义',
        bullets: [
          { title: '存在性', text: '有没有爆破/反例？' },
          { title: '测度', text: '爆破集合有多大？（零测 vs 正测）' },
          { title: '余维数', text: '稳定流形缺几维？相界几何。' },
          { title: '拓扑/分类', text: '连通性、模量、孤子分辨猜想级结构。' }
        ]
      }
    ],
    followUps: ['波前隐喻', 'Structure Discovery'],
    citations: [{ label: '邓煜报告 · doc-deng-*', extra: 2 }]
  },
  波前隐喻: {
    lead:
      '邓煜的“波前（Wavefront）”隐喻提醒：AI 在方程丛林中快速推进的前沿，未必等于理解奇异性景观的深度——时间尺度与认知目标错配时，狂热乐观需要冷水。',
    highlightPhrase: '前沿推进 ≠ 深度理解',
    sections: [
      {
        heading: '对本场',
        bullets: [
          { title: '正确路径', text: 'AI 与深层数理结构结合，沿五重阶梯上升，而非只堆反例。' },
          { title: '文社哲', text: '流畅文本波前同样可能停在“存在性”修辞层。' }
        ]
      }
    ],
    followUps: ['五重认知阶梯', '结构发现 Type-3'],
    citations: [{ label: '邓煜 · 波前', extra: 1 }]
  },
  bkm: {
    lead:
      'Beale–Kato–Majda（BKM）准则给出三维欧拉/Navier–Stokes 光滑解爆破的经典必要条件：若涡量的时间积分（某种范数）保持有限，则解可延拓。它是流体奇点理论的“体检仪表盘”。',
    highlightPhrase: '涡量时间积分控制延拓',
    sections: [
      {
        heading: '与深蓝时刻',
        bullets: [
          { title: '对照', text: '光滑外力爆破、Córdoba 层级联等结果在更强设定下构造奇点。' },
          { title: 'Lean', text: '长不等式证明适合形式化复核。' }
        ]
      }
    ],
    followUps: ['Córdoba Layer Cascade', '布克马斯特'],
    citations: [{ label: 'Beale–Kato–Majda 1984', extra: 1 }]
  },
  'navier-stokes': {
    lead:
      '三维 Navier–Stokes / Euler 方程的全局正则性是千禧年大奖问题核心。本场“深蓝时刻”强调：在光滑外力等设定下构造有限时间爆破，并经 Lean 形式化进入可公开复核闭环。',
    highlightPhrase: '有限时间爆破 + 可复核形式化',
    sections: [
      {
        heading: '线索',
        bullets: [
          { title: '费弗曼命题', text: '千禧年正式陈述关注光滑力与光滑初值。' },
          { title: '层级联', text: 'Córdoba–Martínez-Zoroa 涡旋嵌套路线。' },
          { title: '人机', text: 'LLM 草稿可错；Lean 内核钉死极限交换。' }
        ]
      }
    ],
    followUps: ['BKM 准则', 'Lean 内核'],
    citations: [{ label: 'Clay / Córdoba / Buckmaster', extra: 3 }]
  },
  alphaproof: {
    lead:
      'AlphaProof 是 DeepMind 面向形式化数学推理的强化学习系统，与 AlphaGeometry 2 一道在 IMO 2024 达到银牌水准（4/6 题），标示数学侧已有可核验的范式级里程碑。',
    highlightPhrase: 'IMO 2024 银牌水准',
    sections: [
      {
        heading: '要点',
        bullets: [
          { title: '形式桥', text: '自然语言题目需形式化；证明在正式系统中搜索。' },
          { title: '反差', text: '文社哲尚缺同等公开复核闭环。' }
        ]
      }
    ],
    followUps: ['AlphaGeometry2', 'miniF2F', 'OlympiadBench'],
    citations: [{ label: 'DeepMind · AlphaProof', extra: 2 }]
  },
  minif2f: {
    lead:
      'miniF2F 是形式化数学奥林匹克基准，把高中/竞赛级题目写成 Lean/Isabelle 等可机检语句，成为 ATP 与神经定理证明的标准标尺之一。',
    highlightPhrase: '可机检的奥赛级基准',
    sections: [
      {
        heading: '用途',
        bullets: [
          { title: '评测', text: '比较 LLM+ITP 在低采样预算下的通过率。' },
          { title: '本场', text: '与 APOLLO、Lean Copilot、mathlib 生态并列。' }
        ]
      }
    ],
    followUps: ['APOLLO', 'Lean Copilot', 'mathlib'],
    citations: [{ label: 'miniF2F', extra: 1 }]
  },
  mathlib: {
    lead:
      'mathlib 是 Lean 的大规模数学库，提供可复用引理宇宙。神经–符号证明助手（如 Lean Copilot、LeanDojo/ReProver）依赖它做前提选择与战术建议。',
    highlightPhrase: '可复用引理宇宙',
    sections: [
      {
        heading: '对本场',
        bullets: [
          { title: 'Lemma 层', text: '能力谱中的“引理搜索”高度依赖 mathlib 式库。' },
          { title: 'Structure 层', text: '真正稀缺的是库中尚不存在的中间结构发现。' }
        ]
      }
    ],
    followUps: ['三类能力谱系', 'LeanDojo'],
    citations: [{ label: 'mathlib4', extra: 1 }]
  },
  apollo: {
    lead:
      'APOLLO 强调：把整段证明一次扔进编译器往往浪费反馈；应用编译器引导的修复（proof repair）才能在低采样预算下逼近可核验证明——与过程监督同构。',
    highlightPhrase: '编译器引导的证明修复',
    sections: [
      {
        heading: '对照',
        bullets: [
          { title: '数学', text: 'Lean 类型错误是金标准中间信号。' },
          { title: '文社哲', text: 'Harness Exit Non-Zero / 负知识库是类比物。' }
        ]
      }
    ],
    followUps: ['Process Supervision', 'Lean 内核'],
    citations: [{ label: 'APOLLO', extra: 1 }]
  },
  'curry-howard': {
    lead:
      'Curry–Howard 同构断言「命题即类型、证明即程序」：逻辑证明与类型良好的程序一一对应。它是 Lean/Coq 等证明助手的哲学底座，也是分析哲学可计算转向的接口。',
    highlightPhrase: '命题即类型、证明即程序',
    sections: [
      {
        heading: '含义',
        bullets: [
          { title: '检验', text: '类型检查 = 证明核验。' },
          { title: '本场', text: '可执行认识论：社科假说应能写成可编译对象。' }
        ]
      }
    ],
    followUps: ['Lean 内核', 'Ontology as Code'],
    citations: [{ label: 'Curry–Howard', extra: 1 }]
  },
  '哥德尔本体论': {
    lead:
      '哥德尔用二阶模态逻辑表述本体论论证；2013 年 Benzmüller & Paleo 将 Scott 版形式化并机械化，确认语法闭环——问题转向公理的本体论承诺，而非笔误。',
    highlightPhrase: '语法闭环 ≠ 神学真理，但可计算化',
    sections: [
      {
        heading: '对本场',
        bullets: [
          { title: '人文', text: '形而上学论证可进入证明助手。' },
          { title: '警告', text: '形式化成功不自动等于哲学胜利。' }
        ]
      }
    ],
    followUps: ['打开知识库哥德尔条目', '模态逻辑 Ax1'],
    citations: [{ label: 'Benzmüller & Paleo 2013', extra: 1 }]
  },
  '结构发现': {
    lead:
      '结构发现（Structure Discovery）是能力谱第三类：不满足于计算器式搜索或引理库寻路，而是从反例假设逼出隐藏不变量与刚性链条——Liouville–Goldbach 类工作是范例。',
    highlightPhrase: '逼出隐藏不变量与刚性',
    sections: [
      {
        heading: '三层对照',
        bullets: [
          { title: 'Calculator', text: '找特例 / 执行工具。' },
          { title: 'Lemma', text: '在已有库中搜证明。' },
          { title: 'Structure', text: '发明中间结构；Type-3 Harness 所服务的目标。' }
        ]
      }
    ],
    followUps: ['能力谱系映射', 'Type-3 Harness'],
    citations: [{ label: 'doc-structure-discovery-01', extra: 1 }]
  },
  'ground truth': {
    lead:
      '数学突破的关键底盘是 Ground Truth：Lean/Isabelle 提供 0/1 可失败验证器，使搜索—修复闭环可自动化。文社哲缺少等价编译门禁，故易停在合情修辞。',
    highlightPhrase: '0/1 可失败验证器',
    sections: [
      {
        heading: '闭环',
        bullets: [
          { title: '数学', text: '假说 → 形式化 → 类型检查 → 反馈。' },
          { title: '文社哲', text: '需外挂 Harness / 沙箱 / 因果图检验。' }
        ]
      }
    ],
    followUps: ['Lean 内核', 'Harness'],
    citations: [{ label: '本场开场 · 两套范式', extra: 1 }]
  },
  'p-bit': {
    lead:
      '概率比特（p-bit）与连续朗之万动力学指向热力学计算底座：用物理自发弛豫逼近吉布斯分布，以能耗换取采样，对照冯·诺依曼门电路的确定性路径。',
    highlightPhrase: '用物理自发弛豫做计算',
    sections: [
      {
        heading: '本场位置',
        bullets: [
          { title: '第二章', text: '在 PDE 相变之后讨论未来计算硬件隐喻。' },
          { title: '联系', text: '随机性既是数值工具，也可能是物理实现。' }
        ]
      }
    ],
    followUps: ['Bourgain 区域', '吉布斯测度'],
    citations: [{ label: 'p-bit / Langevin', extra: 1 }]
  },
  深蓝时刻: {
    lead:
      '本场“深蓝时刻”指 2020 年代数学界出现的可核验突破节点：光滑外力下的流体爆破、Lean 形式化，以及 AlphaProof 等系统——类比国际象棋深蓝，机器第一次在关键赛点上给出可复核胜局。',
    highlightPhrase: '可核验突破节点',
    sections: [
      {
        heading: '三件套',
        bullets: [
          { title: '分析', text: 'Córdoba / 布克马斯特线索。' },
          { title: '形式化', text: 'Lean 4 内核复核。' },
          { title: 'AI', text: 'AlphaProof / AG2 奥赛级表现。' }
        ]
      }
    ],
    followUps: ['Lean 是什么', '文社哲为何尚未有'],
    citations: [{ label: '本场 P.2 · 深蓝时刻', extra: 2 }]
  }
};

/** 数学概念别名 → MATH_CURATED key */
export const MATH_ALIASES: [RegExp, string][] = [
  [/具体数学不完备|concrete\s*mathematical\s*incompleteness|boolean\s*relation/i, '具体数学不完备性'],
  [/逆向数学|reverse\s*mathematics|reversal/i, '逆向数学'],
  [/big\s*five|rca\s*0|wkl\s*0|aca\s*0|atr\s*0|π\s*¹|pi11|五重绝对阶梯/i, 'the big five'],
  [/严格逆向|srm\b|反基础主义/i, 'srm'],
  [/有理立方体|rational\s*cube|下落对称/i, '有理立方体'],
  [/大基数|mahlo|马洛基数|large\s*cardinal/i, '大基数'],
  [/哥德尔不完备|gödel\s*incompleteness|希尔伯特纲领/i, '哥德尔不完备性'],
  [/四色|four\s*color|appel|肯普链|平坦区域|并行归约|o\(n\s*log\s*n\)/i, '四色定理'],
  [/余维数|codimension|中心稳定流形|codim/i, '余维数'],
  [/bourgain|干涉相消|正测度/i, 'bourgain 区域'],
  [/五重认知|孤子分辨|存在性.*测度.*余维/i, '五重认知阶梯'],
  [/波前|wavefront|邓煜/i, '波前隐喻'],
  [/bkm|beale.?kato.?majda|涡量/i, 'bkm'],
  [/navier.?stokes|三维欧拉|3d\s*euler|千禧年|费弗曼|布克马斯特|buckmaster/i, 'navier-stokes'],
  [/alphaproof|alphageometry|imo\s*2024|银牌/i, 'alphaproof'],
  [/minif2f|mini\s*f2f/i, 'minif2f'],
  [/mathlib/i, 'mathlib'],
  [/apollo/i, 'apollo'],
  [/curry.?howard|命题即类型|证明即程序/i, 'curry-howard'],
  [/本体论论证|benzmüller|哥德尔模态/i, '哥德尔本体论'],
  [/结构发现|structure\s*discovery|liouville|type-?3/i, '结构发现'],
  [/ground\s*truth|0\/1\s*真值/i, 'ground truth'],
  [/p-?bit|朗之万|langevin|吉布斯收敛|热力学计算/i, 'p-bit'],
  [/深蓝时刻|deep\s*blue/i, '深蓝时刻'],
  [/哈维|弗里德曼|friedman/i, '具体数学不完备性']
];
