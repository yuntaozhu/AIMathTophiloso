import { DocumentChunk, Citation, SlideItem } from '../types';
import { CORE_DOCUMENTS } from './knowledgeBase';
import { SEMINAR_SLIDES } from './slides';

export interface FormalizedArgument {
  explicitPremises: string[];
  tacitAssumptions: string[];
  inferenceChain: string[];
  conclusion: string;
  falsificationCriteria: string;
}

export interface RagLiteratureThesis {
  documentId: string;
  sourceTitle: string;
  authors: string;
  year?: number;
  sectionOrPage: string;
  keywords: string[];
  coreThesis: string;
  ontologicalParadigm: '数理逻辑与模型论' | '无限维偏微分方程与相变' | '分布式多智能体与博弈' | '热力学与物理计算' | '一般认识论' | '科学哲学与方法论';
  etymologicalAnchor?: {
    term: string;
    original: string; // e.g. "Ousia", "Substantia", "Dasein"
    genealogy: string;
  };
  formalizedArgument: FormalizedArgument;
  epistemicMappingToSlide: string;
  rawChunk: string;
  socraticQuestions: string[];
  targetSlideIndex?: number;
  targetSlideTitle?: string;
}

/**
 * Knowledge Base Thesis Registry
 * Pre-compiled, academically rigorous deconstruction for foundational documents
 */
export const RAG_THESIS_REGISTRY: Record<string, Partial<RagLiteratureThesis>> = {
  'doc-deng-01': {
    sourceTitle: '邓煜：无穷维相空间中的奇异性景观与 AGI 的认知边界',
    authors: '深度前沿交叉研究组 / 邓煜',
    year: 2026,
    sectionOrPage: '认知阶梯：偏微分方程奇异性理论的深层问题体系 (P.3-4)',
    targetSlideIndex: 36,
    targetSlideTitle: '奇异性分析的五重认知阶梯',
    keywords: ['偏微分方程', 'Bourgain测度', '无穷维相空间', '吉布斯测度', '有限时间爆破'],
    ontologicalParadigm: '无限维偏微分方程与相变',
    etymologicalAnchor: {
      term: '奇异性 / 奇点',
      original: 'Singularitas (拉) / ἄτοπον (希, 无处可容)',
      genealogy: '数学上表征微分流形或场方程算子失去局部利普希茨光滑性；哲学上标志一阶决定论因果链条在有限时间内的自发断裂。'
    },
    coreThesis: '无穷维动力系统不仅存在单点局域的奇异性发散，且在特定高斯随机场加权测度下，相变具有统计必然性；依赖有限样本与单点目击的经验归纳无法逾越无穷维 Haar 测度非存在性之鸿沟。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (泛函非平凡性): 无穷维实可分希尔伯特空间中不存在局部有限且平移不变的勒贝格测度 (Haar 测度不存在定理)。',
        'P2 (微观统计构造): 依赖高斯加权维纳测度与非线性哈密顿吉布斯测度，可严格界定非线性薛定谔/波动方程的几乎必然适定集与正测度爆破集。'
      ],
      tacitAssumptions: [
        'A_tacit (认识论完备假设): 认为有限样本的局部流形学习可以渐进逼近无限维状态空间的测度分布。'
      ],
      inferenceChain: [
        '由 P1，任何在紧支集空间中训练的归纳机器，对于无穷维参数扰动的外推误差上界不可控；',
        '结合 P2，正测度爆破的存在证明了“渐近收敛”在全空间上并不具备测度意义下的拓扑平庸性。'
      ],
      conclusion: 'C ⊢ 依赖低维投射与经验经验拟合的 AI 无法在本质上判定无穷维动力系统是否在有限时间内发生相变灾变。',
      falsificationCriteria: '若能在非紧无穷维相空间中构造出一组平移不变且可列可加的正勒贝格测度，或者证明所有非线性波动方程在任意随机微扰下均全局正则，则该论点被证伪。'
    },
    epistemicMappingToSlide: '将偏微分方程奇异性的第一阶测度分析，映射至研讨会当前讨论的社会/技术演化相变：单点的技术突破并不构成系统平稳演进的充分条件，深层脆性源于隐性高维状态转移的正测度风险。',
    socraticQuestions: [
      '**如果认知主体的表征维度本质上是有限的，那么断言一个“无法被任何有限测度穷尽的无穷维奇异性”，其本体论承诺究竟是实在论的还是先验虚构的？**',
      '**在缺乏平移不变勒贝格测度的情况下，统计物理中的吉布斯测度是否仅构成认知主体对不确定性的一种主观赋权，而非客体系统的本体论属性？**'
    ]
  },
  'doc-deng-02': {
    sourceTitle: '邓煜：无穷维相空间中的奇异性景观与 AGI 的认知边界',
    authors: '深度前沿交叉研究组 / 邓煜',
    year: 2026,
    sectionOrPage: '不变流形理论与分形拓扑边界 (P.4-7)',
    targetSlideIndex: 37,
    targetSlideTitle: '解空间的测度与 Bourgain 区域相变',
    keywords: ['余维数-1', '中心稳定流形', '分形维数', '采样诅咒', 'Cantor尘埃'],
    ontologicalParadigm: '无限维偏微分方程与相变',
    etymologicalAnchor: {
      term: '相界 / 分离面',
      original: 'Separatrix (拉, 分离者)',
      genealogy: '相空间中严格划分两类互不相容动力学渐近归宿（如全局耗散收敛 vs 能量自聚焦爆破）的超曲面边界。'
    },
    coreThesis: '鞍点线性化算子的单一正不稳定本征模使得中心稳定流形构成严格“余维数-1”的分离相界；当不稳定模数 k > 1 时，稳定相空间在无监督随机采样中沦为严格零测集，诱发“高余维数采样诅咒”。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (谱分解): 鞍点稳态解 Q 的线性化算子 L = -Δ - f\'(Q) 具有离散本征谱，其非稳定流形维数由正本征模数量 k 决定。',
        'P2 (余维数几何): 当 k=1 时，中心稳定流形 W_cs(Q) 具有严格余维数 1，构成空间中的分界超曲面；当 k>1 时，余维数大于 1，其在全相空间的勒贝格测度为严格零。'
      ],
      tacitAssumptions: [
        'A_tacit: 假定机器学习模型的自注意力机制与随机梯度下降（SGD）能通过有限步迭代捕获测度为零的高维相界。'
      ],
      inferenceChain: [
        '由 P2，随机测度采样命中余维数 > 1 流形的先验概率恒为零；',
        '因此，仅凭泛化误差最小化无法习得远离平庸吸引子的临界鞍点控制策略。'
      ],
      conclusion: 'C ⊢ 复杂自适应系统向临界稳态的逼近无法经由无偏经验采样自发涌现，必须依赖先验形式化几何导引。',
      falsificationCriteria: '若能展示一种无先验物理约束的纯数据驱动神经网络在多不稳定模动力系统中以 100% 概率自发稳定在 k≥2 的鞍点上，则该论断被证伪。'
    },
    epistemicMappingToSlide: '对应当前课件中关于“制度稳定性相界”的形式化分析：复杂社会契约的维持往往是一个余维数-1 的薄层曲面，任何脱离正交矫正的自然演化都会受制于采样诅咒而跌入单向极化或耗散。',
    socraticQuestions: [
      '**当系统吸引盆边界的分形维数大于 1 且呈现 Cantor 结构时，决定论系统的“初始敏感性”是否实质上消解了因果律本身的认识论有效性？**',
      '**若稳定秩序的相空间是零测集的，人类文明迄今为止的秩序存续，究竟证明了隐藏负反馈算子的存在，还是一种幸存者偏差式的偶然涨落？**'
    ]
  },
  'doc-deng-03': {
    sourceTitle: '邓煜：无穷维相空间中的奇异性景观与 AGI 的认知边界',
    authors: '深度前沿交叉研究组 / 邓煜',
    year: 2026,
    sectionOrPage: '孤子分辨猜想与波前隐喻 (P.5, 12)',
    targetSlideIndex: 35,
    targetSlideTitle: '邓煜关于非线性 PDE 的“波前”隐喻',
    keywords: ['孤子分辨猜想', '波前隐喻', '时间尺度错配', '完全分类'],
    ontologicalParadigm: '无限维偏微分方程与相变',
    coreThesis: '在极限演化时间下，非线性解正交分解为有限个调制孤子与弥散辐射波；AI迭代与人类文明进化的时间尺度错配构成了波前局部剧烈梯度的物理根源。',
    epistemicMappingToSlide: '直接对应 Slide P.19 对非线性波前演进与社会技术系统错配的本体论映射。'
  },
  'doc-buckmaster-01': {
    sourceTitle: '特里斯坦·布克马斯特：关于千禧年数学难题突破与公开声明',
    authors: '特里斯坦·布克马斯特, 莱文特·阿尔珀厄',
    year: 2026,
    sectionOrPage: '三大突破性成果与学术纲领源流 (P.1-3)',
    targetSlideIndex: 39,
    targetSlideTitle: '突破流体奇点：特里斯坦·布克马斯特与光滑外力爆破',
    keywords: ['3D Euler', 'Navier-Stokes', '光滑外力爆破', 'Lean 4', '无限级联'],
    ontologicalParadigm: '无限维偏微分方程与相变',
    etymologicalAnchor: {
      term: '爆破 / 奇异性',
      original: 'Blow-up / Ruptura (拉, 破裂)',
      genealogy: '物理场中涡量（Vorticity）在有限时间 t* 内发散至无穷大，宣告经典连续介质力学微积分描述的失效。'
    },
    coreThesis: '在光滑有界外力驱动下，不可压缩三维欧拉方程与布辛涅斯克方程存在有限时间爆破；全部证明在 Lean 4 交互式定理证明器中实现了绝对形式化零误差闭环。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (自相似级联): 存在无穷多层空间几何尺度按几何级数缩小的定常解叠合结构，能在局域将涡量聚焦效率提升至指数级。',
        'P2 (形式系统判定): Lean 4 证明辅助器所依凭的归纳类型论（CIC）能够在有限步内核展开中核验该级联构造的形式合法性。'
      ],
      tacitAssumptions: [
        'A_tacit: 认为光滑外力下的非物理奇异解足以解答费弗曼关于偏微分方程本原物理实在性的数学判定。'
      ],
      inferenceChain: [
        '由 P1 构造出的自相似尺度压缩直接突破了比阿德-凯达-马伊达（Beale-Kato-Majda）爆破准则；',
        '由 P2，形式验证排除了人类同行评议中因符号疲劳而隐匿的同义反复或测度漏洞。'
      ],
      conclusion: 'C ⊢ 欧拉方程光滑解不可跨越有限时间爆破点，连续性假设在极值奇点处瓦解。',
      falsificationCriteria: '在 Lean 4 内核中发现该级联构造的能量守恒不满足一阶连续性方程，或找到柯西问题全局光滑延拓的相反证明。'
    },
    epistemicMappingToSlide: '与讲稿中“从光滑演进到突变奇点”的形式化模型直接同构：渐进的外力推动并不保证系统反应的光滑延续，当内部能量级联达到临界阈值，制度与经济系统将自发出现不可逆断裂。',
    socraticQuestions: [
      '**如果数学奇点的产生必须依赖于一个在物理世界中无法实现的“无限层叠自相似级联”，那么这个数学定理所宣示的“爆破”，是对实在世界的揭示，还是纯粹形式公理游戏内部的产物？**',
      '**当形式化交互证明器（Lean 4）接管了人类无法独立验算的超长推演时，真理的“可理解性”（Intelligibility）是否已与人类主体的意识彻底剥离？**'
    ]
  },
  'doc-quanta-01': {
    sourceTitle: 'Quanta Magazine：AI 攻克数学界百万元千禧年大奖难题之一',
    authors: 'Quanta Magazine 科学特稿编辑部',
    year: 2026,
    sectionOrPage: '千禧年大奖难题判定选项与无限级联 (P.2-4)',
    targetSlideIndex: 2,
    targetSlideTitle: '时代背景：2026年数学界的“深蓝时刻”',
    keywords: ['深蓝时刻', '千禧年难题', 'Navier-Stokes', 'Lean 4', '克雷数学研究所'],
    ontologicalParadigm: '数理逻辑与模型论',
    coreThesis: '形式化系统与大模型结合不仅打破了千禧年流体力学平滑性神话，更标志着科学发现从传统经验归纳彻底迈向形式化闭环可计算时代。',
    epistemicMappingToSlide: '直接对应 Slide P.2 关于“2026年数学界深蓝时刻”的时代学术背景。'
  },
  'doc-friedman-01': {
    sourceTitle: '哈维·弗里德曼：具体数学不完备性与逆向数学（Reverse Mathematics）',
    authors: '哈维·弗里德曼 (Harvey Friedman)',
    year: 2025,
    sectionOrPage: '逆向数学与有理立方体模型 (逻辑学专论)',
    targetSlideIndex: 22,
    targetSlideTitle: '哈维·弗里德曼与“具体数学不完备性”',
    keywords: ['具体数学不完备性', '逆向数学', '有理立方体', '大基数', 'RCA_0'],
    ontologicalParadigm: '数理逻辑与模型论',
    etymologicalAnchor: {
      term: '不完备性',
      original: 'Incompleteness / ἀτελές (希, 未完成/有亏损)',
      genealogy: '源于哥德尔 1931 年第一不完备定理；弗里德曼将其从抽象元数学符号编码，推进至离散图论与初等有理数空间的“具体真理”。'
    },
    coreThesis: '看似基础初等的有理立方体组合嵌入等离散数学命题，在一阶 ZFC 公理系统内是不可判定的；其真理性必然依赖超越经典集合论的外生极高阶“大基数公理”。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (逆向数学分类): 二阶算术子系统 RCA_0 与 WKL_0 构成了常规应用数学的基础，但无法裁决无限对易图与有序树的高阶组合性质。',
        'P2 (有限具体命题的高阶等价): 弗里德曼构造的有理立方体序列有界内射定理，在形式上等价于马洛大基数（Mahlo Cardinal）的存在性。'
      ],
      tacitAssumptions: [
        'A_tacit: 假设人类心智所采纳的 ZFC 公理系统是理解一切离散实在的充分基底。'
      ],
      inferenceChain: [
        '由 P1 与 P2，即使在一个完全由有理数构成的有限网格中，其合法的拓扑排序规则也无法由系统内部公理自洽闭合；',
        '欲求该有限命题的真伪，必须在形而上学层面承诺更高无穷阶大基数的存在。'
      ],
      conclusion: 'C ⊢ 微观局部规则的闭合性神话破灭：任何有限复杂的规则系统，其稳定性最终受制于外生超越性公理的裁断。',
      falsificationCriteria: '若能在 Peano 算术（PA）或标准 ZFC 内部仅凭一阶一阶逻辑推理完整无矛盾地证明弗里德曼有理立方体嵌入定理，则该论题不成立。'
    },
    epistemicMappingToSlide: '直接映射研讨会核心命题——“社会契约的一阶内生不可能性”：一个单纯由理性个体根据有限博弈规则构成的社群，无法在系统内生逻辑中实现争端的全完备自洽裁决，必然需要形而上的或外生的元规范作为大基数锚点。',
    socraticQuestions: [
      '**若解决一个有限具体有理数问题必须假定超越 ZFC 的“超限大基数”，那么人类究竟是在发现客观数学实在，还是在为了拯救逻辑系统的自洽性而不断虚构不可检验的形而上学神灵？**',
      '**对于一个拒绝承认大基数公理的严格直觉主义者而言，弗里德曼定理所断言的“真理性”是否存在？**'
    ]
  },
  'doc-fourcolor-01': {
    sourceTitle: '四色定理的 O(n log n) 高度并行归约算法与平坦区域搜索',
    authors: '算法拓扑与形式化验证联合课题组',
    year: 2026,
    sectionOrPage: '四色定理的现代并行归约与相空间平坦区域 (计算拓扑专论)',
    targetSlideIndex: 33,
    targetSlideTitle: '从串行归约到高度并行归约：O(n log n) 算法大跃迁',
    keywords: ['四色定理', '不可避免构型集', '可约构型', '放电法', '并行拓扑归约'],
    ontologicalParadigm: '数理逻辑与模型论',
    coreThesis: '通过四重对称性投影与局域 Kempe 链纠缠解耦，将传统千余构型的穷举验证提升为 O(n log n) 高度并行拓扑相空间收缩。',
    epistemicMappingToSlide: '对应 Slide P.17 关于四色定理计算复杂性突破与相空间平坦区域搜索的研讨。'
  },
  'doc-thermo-01': {
    sourceTitle: '热力学计算底座：连续朗之万动力学与概率比特网络',
    authors: '统计物理与非常规计算实验室',
    year: 2026,
    sectionOrPage: '朗之万动力学、p-bit与自发吉布斯收敛 (物理计算前沿)',
    targetSlideIndex: 40,
    targetSlideTitle: '热力学计算底座：连续朗之万动力学与概率比特（p-bit）',
    keywords: ['热力学计算', '朗之万动力学', 'p-bit', '吉布斯基态', '能耗之墙'],
    ontologicalParadigm: '热力学与物理计算',
    etymologicalAnchor: {
      term: '弛豫 / 耗散',
      original: 'Relaxatio (拉) / 自由度释放',
      genealogy: '热力学第二定律不可逆时间之矢的表征；孤立系统微观构型在热涨落中自发向最大熵或自由能极小态演化。'
    },
    coreThesis: '突破图灵-冯·诺依曼架构的 NP-Hard 计算复杂性瓶颈，不应依赖蛮力符号迭代，而应利用连续非平衡态朗之万热物理涨落，让系统以飞秒时间尺度自发弛豫至哈密顿能量泛函的全局玻尔兹曼-吉布斯基态。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (朗之万方程): dx/dt = -∇V(x) + √(2k_B T) · η(t)，热噪声 η(t) 提供了遍历高维非凸能垒的物理动能。',
        'P2 (物理降维退火): 概率比特（p-bit）耦合系统的稳态解天然服从吉布斯分布 P(x) ∝ exp(-V(x)/k_B T)，使基态成为全局最大概率态。'
      ],
      tacitAssumptions: [
        'A_tacit: 假设物理硬件中的自旋涨落与热耗散损耗不会引入超越模型容忍度的随机退相干或虚假局域陷阱。'
      ],
      inferenceChain: [
        '符号图灵机处理组合爆炸时面临多项式时间指数膨胀（P ≠ NP 假定）；',
        '物理热力学网络将组合约束直接编码为能量标量场，通过系统与热库的自然能量交换在纳秒级完成全局最优解收敛。'
      ],
      conclusion: 'C ⊢ 可计算性的终极物理边界并非符号推演速度，而是热力学自由能耗散与熵增的几何约束。',
      falsificationCriteria: '若能证明在高维玻璃态（Spin Glass）崎岖能量景观中，热朗之万系统陷入亚稳态陷阱的弛豫时间随变量数量同样呈指数发散，则物理优越性论断被证伪。'
    },
    epistemicMappingToSlide: '对应课件关于认知能耗、物理具身与信息本体论的讨论：指明形式符号系统无法脱离物质基底，理性的极限本质上受制于热力学第二定律的能量税。',
    socraticQuestions: [
      '**当物理系统的自发热平衡过程被定义为“计算”时，我们究竟是在用客观实在来解算人类的命题，还是在强行将人类的主观目的投射给无目的的宇宙自然演化？**',
      '**如果真理的获取必须支付不可逆的热力学熵增，那么完全理性的认知主体是否必然加速宇宙的终极热寂？**'
    ]
  },
  'doc-joonpark-01': {
    sourceTitle: 'Joon Sung Park：生成式智能体交互模拟微架构（Smallville）',
    authors: 'Joon Sung Park et al. (Stanford & Google)',
    year: 2023,
    sectionOrPage: 'Generative Agents 核心微架构解析 (P.1-12)',
    targetSlideIndex: 47,
    targetSlideTitle: '斯坦福生成式智能体拆解：Joon Park 架构范式',
    keywords: ['Generative Agents', 'Smallville', '记忆流', '反思树', '三维检索'],
    ontologicalParadigm: '分布式多智能体与博弈',
    etymologicalAnchor: {
      term: '拟像 / 模拟',
      original: 'Simulacrum (拉) / 意象物',
      genealogy: '从柏拉图洞穴投影到鲍德里亚的“超真实”（Hyperreality）；智能体在符号流交互中自发构筑非实在主体的信念与社会仪轨。'
    },
    coreThesis: '基于“记忆流（时间衰减+重要性+相关性）+ 递归反思树 + 场景拓扑图”的生成式智能体微架构，能在无全局指挥官的去中心化环境中自发涌现长期规划、信息扩散与协同社会行为。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (感知检索三元组): 记忆调取函数 Score(m) = α·Recency + β·Importance + γ·Relevance 构成了认知主体注意力分配的微分动力学。',
        'P2 (高阶抽象反思): 递归反思树定期将碎片化情境记忆折叠为高阶信念节点，驱动自顶向下的长期重规划。'
      ],
      tacitAssumptions: [
        'A_tacit: 假设 LLM 的底层概率采样与微调对齐（RLHF）在长期递归反思中不会导致信念退化或虚假记忆的无界正反馈扩散。'
      ],
      inferenceChain: [
        '智能体通过自生自发的符号对话传递知识，反思树将他者意图内化为主体信念（Belief）；',
        '在环境局部扰动下，自顶向下重规划避免了传统有限状态机（FSM）的死锁陷阱。'
      ],
      conclusion: 'C ⊢ 复杂的宏观群体秩序完全可由微观生成式智能体的局部记忆-反思闭环涌现。',
      falsificationCriteria: '若在资源极度匮乏或长程冲突对抗环境中，智能体反思树陷入循环确认偏误（Confirmation Bias）导致群体性极化崩溃，则平稳涌现论被局部证伪。'
    },
    epistemicMappingToSlide: '对应课件中关于多智能体博弈与相变演化的章节：展示了从个体的微观 BDI 循环向宏观制度的自组织过渡，但也暴露出 LLM 自带的马基雅维利偏见与脆弱共识问题。',
    socraticQuestions: [
      '**如果智能体的“自我认同”仅仅是反思树对历史文本记忆的词向量聚类提炼，那么它与一个纯粹的语言学回声壁究竟存在何种本体论区别？**',
      '**当数千个智能体依赖同一套底座 LLM 生成社会契约时，涌现出来的究竟是“群体智能”，还是同一个中心化模型在不同参数微扰下的自言自语？**'
    ]
  },
  'doc-dfm-01': {
    sourceTitle: '杨凌等：Discovery Foundation Models: Toward Open-Ended Discovery Intelligence',
    authors: '杨凌, 孟子越 等',
    year: 2026,
    sectionOrPage: 'DFM 七大能力定义与 Zetema 显式研究状态 (P.1-9, 14-22)',
    targetSlideIndex: 45,
    targetSlideTitle: 'Ontology as Code：将模糊理论转化为强类型接口',
    keywords: ['DFM', '科学发现基座模型', 'Zetema', '状态机闭环', '七大能力'],
    ontologicalParadigm: '数理逻辑与模型论',
    coreThesis: '以科学假说状态机 Zetema 显式驱动多模态发现智能，将模糊直觉严格约束在形式化公理验证流中。',
    epistemicMappingToSlide: '对应 Slide P.29 将自然语言理论编译为强类型状态机接口的操作化探索。'
  },
  'doc-cyberfly-01': {
    sourceTitle: '数字苍蝇的虚实之境：全脑连接组仿真与空间具身闭环',
    authors: '计算神经科学与具身智能研究中心',
    year: 2024,
    sectionOrPage: '全脑连接组仿真、神经动力学与工程祛魅 (P.4-11)',
    targetSlideIndex: 50,
    targetSlideTitle: 'Social Simulacra：社会试运行与多宇宙推演',
    keywords: ['全脑连接组', '数字苍蝇', '具身智能', '物理引擎闭环', '自顶向下反思'],
    ontologicalParadigm: '分布式多智能体与博弈',
    coreThesis: '从 13 万神经元全脑图谱到多宇宙社会拟像，具身仿真打破了经验同义反复，展现了从微观拓扑到宏观智能行为的因果闭环。',
    epistemicMappingToSlide: '对应 Slide P.34 多智能体模拟与高仿真数字孪生推演。'
  },
  'doc-turing-1936': {
    sourceTitle: '阿兰·图灵：论可计算数及其在判定难题中的应用 (1936)',
    authors: 'Alan M. Turing',
    year: 1936,
    sectionOrPage: '判定难题与停机问题的通用可计算界限 (P.230-265)',
    targetSlideIndex: 1,
    targetSlideTitle: '可计算的认识论',
    keywords: ['可计算性', '停机问题', '图灵机', '判定难题', '形式系统', '不可判定性'],
    ontologicalParadigm: '数理逻辑与模型论',
    etymologicalAnchor: {
      term: '可计算性 / 机械步骤',
      original: 'Computatio (拉, 筹算结算) / Ἀριθμός (希, 数/离散测度)',
      genealogy: '近代莱布尼茨“Calculemus”理想经弗雷格与希尔伯特公理化，在图灵纸带状态转移中完成实体化定义，同时也揭示出不可计算的内生深渊。'
    },
    coreThesis: '以有限离散状态指令表定义的通用机器无法在有限步骤内判定任意程序输入是否停机；形式演绎系统在追求绝对一致性与自足性时，不可避免地遭遇自我指涉构造带来的不可判定奇点。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (通用图灵机构造): 存在一个万能图灵机 U，能够对任意合法编码的图灵机 M 及其输入 w 实施状态转移模拟。',
        'P2 (反证前提 - 判定器假定): 设存在判定算法 H(M, w)，其对任意 (M, w) 能在有限步骤内严格返回停机 (1) 或不停机 (0)。'
      ],
      tacitAssumptions: [
        'A_tacit (全域算法闭合假定): 假设一切有意义的数学命题在形式系统内部都具有对应机械推演过程的确定布尔值。'
      ],
      inferenceChain: [
        '构造对角线反对抗机器 D(M)：若 H(M, M) = 1，则 D 陷入死循环；若 H(M, M) = 0，则 D 立即停机退出；',
        '考察输入 D 自身的情形：D(D) 停机 ⟷ H(D, D) = 0 ⟷ D(D) 不停机，引发不可调和的逻辑矛盾。'
      ],
      conclusion: 'C ⊢ 停机判定算法 H 必然在逻辑上不可构造，希尔伯特 Entscheidungsproblem 彻底被形式证伪。',
      falsificationCriteria: '若能在纯有限一阶逻辑演算体系内构造出无矛盾解决对角线悖论的通用停机判定子，则本命题被颠覆。'
    },
    epistemicMappingToSlide: '对应 Slide P.1（可计算的认识论）与 Slide P.5（形式化证明的百年孤寂）：确立了整场研讨会的认知基石——形式化编程不是无所不能的银弹，形式系统自带本体论不可知界限。',
    socraticQuestions: [
      '**如果图灵证明了“停机问题”在图灵机架构内不可计算，那么人类直觉在洞见该不可判定性时所调动的思维机制，是否必然意味着人类意识超越了任何物理可实现的图灵机？**',
      '**当现代 LLM 给出一段看似完美的推演结论时，在无法保证其底层逻辑停机的先验前提下，我们对该输出的“信任”究竟是数学判定还是经验概率迷信？**'
    ]
  },
  'doc-kant-cpr': {
    sourceTitle: '伊曼努尔·康德：纯粹理性批判 (Kritik der reinen Vernunft, 1781/1787)',
    authors: 'Immanuel Kant (蓝公武 / 邓晓芒 译本对照)',
    year: 1787,
    sectionOrPage: '先验分析论：先验范畴演绎与统觉之先验统一 (A19-B34 / B130-169)',
    targetSlideIndex: 45,
    targetSlideTitle: 'Ontology as Code：将模糊理论转化为强类型接口',
    keywords: ['纯粹理性批判', '先验范畴', '统觉先验统一', '物自身', '综合先验判断', '先验感性论'],
    ontologicalParadigm: '一般认识论',
    etymologicalAnchor: {
      term: '先验范畴',
      original: 'Categoria (希, κατηγορία, 原意为公堂控诉/定性归属)',
      genealogy: '亚里士多德作为存在者的本体论十范畴，经康德哥白尼式革命彻底倒转为主体认识能力的纯粹先验知性形式。'
    },
    coreThesis: '人类知识并非对物自身的被动映照，而是先验感性形式（时空直观）与知性纯粹范畴对感性杂多经验表象的主动构成；计算机强类型论（Type Theory）即先验范畴系统在符号计算维度的当代投射。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (经验杂多无序性): 纯粹后验感觉材料本身不具有先天的必然性与普遍性因果联结。',
        'P2 (综合先验可能条件): 任何对象若要成为经验的可能对象，必须服从知性统觉的综合统一性条件（如因果范畴与必然性范畴）。'
      ],
      tacitAssumptions: [
        'A_tacit: 假定人类认知主体的心智结构具备恒常不变且排他的先天知性机能表（十二范畴）。'
      ],
      inferenceChain: [
        '若无先验范畴先在组织，经验仅能退化为休谟式的经验联想与心理学归纳；',
        '但数学与理论物理具有无可争议的必然真理（综合先验判断），此必然性唯一成立的根据在于范畴之先验有效性。'
      ],
      conclusion: 'C ⊢ 认识对象必须符合主体的认知范畴体系，而非主体的认知范畴顺应对象本身。',
      falsificationCriteria: '若能从纯粹的无结构的物理感官输入（如纯白噪声）中，不依托任何先验结构偏置（inductive bias）内生自发导出普遍必然的自然律，则康德先验演绎被实质动摇。'
    },
    epistemicMappingToSlide: '对应 Slide P.29（Ontology as Code：将模糊理论转化为强类型接口）与 Slide P.56（Curry-Howard 同构）：强调代码中的 Types 绝非无害的形式注脚，而是对运行期现实施加本体论规约的“先验综合范畴”。',
    socraticQuestions: [
      '**如果说强类型接口相当于康德的知性范畴，那么未被强类型覆盖但真实发生于内存底层的指针越界与并发竞态，究竟是程序世界的“物自身”，还是先验理性自身的二律背反？**',
      '**在大语言模型能够通过统计自回归自动拟合范畴语义的今天，康德所主张的“先天综合性”是否正在被海量人类语料的后验经验归纳所彻底解构？**'
    ]
  },
  'doc-heidegger-bt': {
    sourceTitle: '马丁·海德格尔：存在与时间 (Sein und Zeit, 1927)',
    authors: 'Martin Heidegger (陈嘉映 / 孙周兴 译本对照)',
    year: 1927,
    sectionOrPage: '第一篇第三章：世界的周围世界性与此在的在世之在 (§15-§18 / §69)',
    targetSlideIndex: 71,
    targetSlideTitle: '现象学“非二元意识”的代码映射：主体消融与注意力重构',
    keywords: ['存在与时间', '此在', '上手状态', '在手状态', '在世之在', '现象学', '代码本体论暴政'],
    ontologicalParadigm: '一般认识论',
    etymologicalAnchor: {
      term: '此在 / 上手状态',
      original: 'Dasein (德, 在此之存在) / Zuhandenheit (德, 切近可用上手之状态)',
      genealogy: '彻底打破自笛卡尔以来主体-客体（Res cogitans / Res extensa）的二元对立，将存在论根基重锚于原初生存论操劳。'
    },
    coreThesis: '世界并非在手事物（Vorhandenes）的几何属性集合，而是此在（Dasein）在操劳中与之交织的前理论关涉网络；将世界强行编码为面向对象类的离散属性，本身构成了一场遮蔽原初上手性的“本体论暴力”。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (原初生存论前题): 此在首先且通常不是以沉思的观察者身份面对对象，而是在生存活动中与器物打交道（上手状态）。',
        'P2 (在手性的后生性): 只有在器物损坏（Unzuhandenheit）或操劳阻滞的极限状态下，客体才剥离其环境脉络，被孤立表象为可测量的物理属性（在手状态）。'
      ],
      tacitAssumptions: [
        'A_tacit: 存在一种前逻辑、前符号的原初生活世界意义视域，它先于并拒绝被形式符号公理化穷尽。'
      ],
      inferenceChain: [
        '一切符号计算与数据结构建模，均预设了世界的“在手性”抽象；',
        '因此，任何算法模型所抓取的都只是脱落了生命脉络的抽象尸骸，必然产生不可消除的“意义剩余（Surplus of Meaning）”。'
      ],
      conclusion: 'C ⊢ 计算主义所建构的数字拟像永远无法替代此在的在世之在，必须警惕代码对生活世界的本体论殖民。',
      falsificationCriteria: '若能证明一个由纯离散状态转移表驱动的冷冻自动机，能在没有任何具身沉沦与向死而在的时间性焦虑下，自发内生出对自身存在的存在论追问（Seinsfrage），则海德格尔生存论分析被证伪。'
    },
    epistemicMappingToSlide: '对应 Slide P.55（现象学“非二元意识”的代码映射）与 Slide P.66（防止“代码本体论暴政”：保罗·利科的意义剩余与历史敬畏）：提醒算法设计者保持对前反思生命世界的敬畏。',
    socraticQuestions: [
      '**如果具身智能体只能在传感器输入中获得离散数值张量，那么它究竟是在以某种硅基方式实现“在世之在”，还是永远被囚禁在无法企及上手性世界的绝对在手性牢笼之中？**',
      '**当我们试图用代码消解主客二元对立时，写下那行代码的“编程者”本身是否早已无可救药地扮演了笛卡尔式的高维沉思主体？**'
    ]
  },
  'doc-zurek-decoherence': {
    sourceTitle: '沃纳·祖雷克：退相干、环境诱导超选择与经典实在起源 (2003)',
    authors: 'Wojciech H. Zurek',
    year: 2003,
    sectionOrPage: 'Decoherence, Einselection, and the Quantum Origins of the Classical (RMP Vol. 75)',
    targetSlideIndex: 40,
    targetSlideTitle: '热力学计算底座：连续朗之万动力学与概率比特（p-bit）',
    keywords: ['退相干', '环境超选择', '指针态', '密度矩阵', '经典实在涌现', '量子达尔文主义'],
    ontologicalParadigm: '热力学与物理计算',
    etymologicalAnchor: {
      term: '超选择 / 退相干',
      original: 'Einselection (德/英缩合, Environment-Induced Superselection)',
      genealogy: '摆脱哥本哈根诠释中神秘的冯·诺依曼主观测量坍缩波包，利用开放系统与环境相互作用的连续幺正动力学严格推导经典表观实在。'
    },
    coreThesis: '经典客观世界是开放量子系统与宏观环境发生不可逆信息耗散的涌现产物；环境不仅是噪声源，更是天然的测量仪器与信息复制放大器（量子达尔文主义）。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (环境纠缠): 系统 S 与具有极大自由度的热库环境 E 发生幺正哈密顿相互作用 H_int。',
        'P2 (约化迹运算): 观测者对不可观测的环境自由度求部分迹（Partial Trace），系统约化密度矩阵 ρ_S 的非对角干涉项在极短退相干时标 τ_dec 内呈高斯/指数耗散至零。'
      ],
      tacitAssumptions: [
        'A_tacit: 假设环境自身不可逆且拥有无限自由度，使得信息在退相干后永无可能发生彭加勒逆回（Poincaré Recurrence）。'
      ],
      inferenceChain: [
        '由于非对角项归零，叠加态演化为经典概率混合态；',
        '唯有与 H_int 对易的定态基底（指针态）能在与环境的频繁碰击中保持稳定，并将其信息多重复制至环境各子系统。'
      ],
      conclusion: 'C ⊢ “客观实在”并非先验固存，而是信息在环境筛选下取得鲁棒冗余共识的相变涌现态。',
      falsificationCriteria: '若能在宏观日常尺度（如克级别物体）在常温非隔离环境中观测到稳态宏观量子薛定谔猫相干叠加干涉条纹，则退相干作为经典涌现的充要条件被证伪。'
    },
    epistemicMappingToSlide: '对应 Slide P.24（热力学计算底座：连续朗之万动力学与概率比特）与 Slide P.25（涌现的测度与危机相界）：将量子退相干与朗之万动力学相空间弛豫对照，展现微观热扰动如何沉淀为宏观有序秩序。',
    socraticQuestions: [
      '**如果客观实在仅仅是环境对指针态信息实施高冗余复制所形成的“统计共识”，那么当全网大语言模型在互联网环境中相互引用并高频复制某种谬误时，这种虚假信息是否在物理信息论意义上也涌现出了某种荒诞的“实在性”？**',
      '**在由多智能体构成的复杂社会网络中，个体意识的退相干边界究竟是由物理神经元界定，还是由算法推荐分发所构成的巨型信息环境所强制超选择？**'
    ]
  },
  'doc-popper-lsd': {
    sourceTitle: '卡尔·波普尔：科学发现的逻辑 (The Logic of Scientific Discovery, 1934/1959)',
    authors: 'Karl Popper (查汝强 / 邱仁宗 译本对照)',
    year: 1934,
    sectionOrPage: '第一篇：科学逻辑导论；第四篇：可证伪性 (§1-§10 / §19-§24)',
    targetSlideIndex: 52,
    targetSlideTitle: '形式化检验与定理证明：Lean 4 / Coq 中的反例搜寻',
    keywords: ['科学发现的逻辑', '波普尔', '证伪主义', '划界标准', '否定后件律', '归纳疑难', '逼真度', '试错法'],
    ontologicalParadigm: '科学哲学与方法论',
    etymologicalAnchor: {
      term: '可证伪性 / 划界标准',
      original: 'Falsifizierbarkeit (德) / Abgrenzungskriterium (德, 划界标准)',
      genealogy: '从休谟经验归纳之不可必然性出发，确立单称观察陈述与全称经验科学定律之间不可对称转换的纯演绎否定机制。'
    },
    coreThesis: '经验科学理论绝非由经验归纳确认的“确证真理”，而是永远处于待决状态的受试猜想；科学与非科学/形而上学的划界判据在于其形式上是否排斥某些潜在的经验状态（即潜伏反驳者集合是否非空）；否定后件律（Modus Tollens）是理论检验的唯一可靠演绎支柱。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (全称归纳失效定理): 对任意全称理论 T = ∀x(P(x) → Q(x))，有限经验样本集 E = {Q(a_1), ..., Q(a_n)} 无法赋予 T 以非零先验归纳概率（lim_{N→∞} n/N = 0）。',
        'P2 (演绎不对称公理): 依形式逻辑否定后件律 (T → Q(a)) ∧ ¬Q(a) ⊢ ¬T，单一天鹅为黑色的单称目击命题足以在逻辑上必然推翻“一切天鹅皆白”的全称命题。'
      ],
      tacitAssumptions: [
        'A_tacit: 科学共同体能够就用以充当判决基准的“基础陈述（Basissätze）”达成主体间可检验的客观约定，而不陷入无穷后退或感觉主义独断。'
      ],
      inferenceChain: [
        '任何声称能解释一切可能事实的理论（如阿德勒心理学或庸俗历史唯物论），其潜伏反驳者集合为空集；',
        '因此，不可被任何经验事态推翻的系统丧失了与经验世界的任何摩擦力，蜕化为形而上学或伪科学神话；',
        '科学合理性在于其面对严苛实验反驳时的制度性脆弱性与敢于自我否定的勇气。'
      ],
      conclusion: 'C ⊢ 科学理论的认知价值不在于其被证实的次数，而在于其经受严厉证伪检验而暂时存活的“耐受度（Corroboration）”与逼真度（Verisimilitude）。',
      falsificationCriteria: '若能在形式系统内构造出一种能从有限后验正向经验样本集中，纯靠归纳机械算法必然输出普遍必然且先验不变量的全称因果生成机，则波普尔证伪主义被实质证伪。'
    },
    epistemicMappingToSlide: '对应 Slide P.36（形式化检验与定理证明：Lean 4 / Coq 中的反例搜寻）：在软件工程与逻辑验证中，千万次成功运行（单元测试）只能证实“此特例未崩”，唯有符号反例（Counterexample）才能对不变量断言宣告死刑。',
    socraticQuestions: [
      '**如果科学共同体在遭遇反常反例时，总能通过在边缘引入辅助假设（Auxiliary Hypotheses）来挽救核心理论，那么波普尔的“证伪”究竟是一个冷峻纯粹的逻辑事件，还是一种依赖科学社会学妥协的主观决断？**',
      '**当前数千亿参数大语言模型的自回归泛化能力完全基于有限语料的经验归纳调优，若严格依照波普尔的标准，深度学习究竟属于可证伪的经验科学，还是不可证伪的技术炼金术？**'
    ]
  },
  'doc-kuhn-ssr': {
    sourceTitle: '托马斯·库恩：科学革命的结构 (The Structure of Scientific Revolutions, 1962)',
    authors: 'Thomas S. Kuhn (金吾伦 / 胡新和 译本对照)',
    year: 1962,
    sectionOrPage: '第二至五章：常规科学与范式；第九至十章：科学革命与不可通约性',
    targetSlideIndex: 47,
    targetSlideTitle: '斯坦福生成式智能体拆解：Joon Park 架构范式',
    keywords: ['科学革命的结构', '库恩', '范式', '常规科学', '反常', '不可通约性', '格式塔转换', '科学共同体'],
    ontologicalParadigm: '科学哲学与方法论',
    etymologicalAnchor: {
      term: '范式 / 不可通约性',
      original: 'Paradigma (希, παράδειγμα, 范型、模型) / Incommensurabilis (拉, 无共同公度基准)',
      genealogy: '从修辞学典型案例，被库恩升格为统摄科学共同体本体论承诺、仪器操作规范与解谜典范的核心概念网格。'
    },
    coreThesis: '科学发展并非线性的知识积累，而是“常规科学（解谜）→ 反常积累 → 范式危机 → 科学革命（格式塔转换）→ 新常规科学”的断裂史；竞争范式之间在概念定义、观测事实与评价标准上存在根本的“不可通约性（Incommensurability）”。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (理论负荷观察): 经验事实永远被理论范式所渗透，不存在中立于范式的“纯粹裸事实”；不同范式下的科学家在同一物理场景中看到的是完全不同的对象。',
        'P2 (评价准则内生性): 衡量理论优劣的价值准则（如精确性、自洽性、简洁性）本身受范式内部文化规范所定义，缺乏超范式的先验仲裁法庭。'
      ],
      tacitAssumptions: [
        'A_tacit: 科学共同体的社会学组织形式与代际更替，是决定范式胜利与淘汰的深层因果动力（“普朗克原理”：新科学真理的胜利并不靠说服反对者，而是因为反对者终将死绝）。'
      ],
      inferenceChain: [
        '在常规科学时期，反常被视为研究者个人的解谜失败而非理论本身的错误；',
        '唯有当反常侵蚀核心常数并引发系统性学术信任危机时，异端范式才可能萌芽；',
        '接受新范式并非逻辑论证的必然推导，而是一场心理学意义上的格式塔认知突变（如同从鸭图顿悟为兔图）。'
      ],
      conclusion: 'C ⊢ 科学史不存在向着客观实在终极本体的单向逼近，科学进步仅表现为从旧问题网络向更富解谜效率之新问题网络的代际演进。',
      falsificationCriteria: '若能展示一种跨越全部科学历史纪元（从古希腊自然哲学到量子引力场论）、无需任何概念重塑与社会认知范式重构即可完全保真翻译累加的终极形式物理学，则库恩范式革命论破产。'
    },
    epistemicMappingToSlide: '对应 Slide P.31（斯坦福生成式智能体拆解与范式跃迁）与 Slide P.60（认知相空间）：指出从符号主义专家系统到基于大语言模型自发交互智能体的转变，是一场不可通约的本体论范式跃迁。',
    socraticQuestions: [
      '**如果不同范式之间完全不可通约，我们依据什么宣称相对论比牛顿力学“更具真理性”，而非仅仅宣称物理学家们集体更换了一套时髦的语言游戏？**',
      '**在由数万个 AI 智能体构成的去中心化多智能体模拟环境中，如果智能体网络自发分化出两个互不兼容的符号认知框架，它们之间是否会发生数字维度的“科学革命”与格式塔内战？**'
    ]
  },
  'doc-quine-dogmas': {
    sourceTitle: '威拉德·蒯因：经验论的两个教条 (Two Dogmas of Empiricism, 1951)',
    authors: 'W.V.O. Quine (陈启伟 / 江天骥 译本对照)',
    year: 1951,
    sectionOrPage: '第一至六节：分析与综合的二分、还原论教条与整体论实用主义 (P.20-46)',
    targetSlideIndex: 45,
    targetSlideTitle: 'Ontology as Code：将模糊理论转化为强类型接口',
    keywords: ['经验论的两个教条', '蒯因', '确认整体论', '信念之网', '分析综合二分', '迪昂蒯因命题', '非充分决定性'],
    ontologicalParadigm: '科学哲学与方法论',
    etymologicalAnchor: {
      term: '确认整体论 / 信念之网',
      original: 'Holismus (希, ὅλος, 全体/完整) / Web of Belief (信念力学织锦)',
      genealogy: '承袭法国物理学家皮埃尔·迪昂（Pierre Duhem）的物理理论检验思想，将其推至整个经验知识与逻辑法则的认识论极限。'
    },
    coreThesis: '分析陈述与综合陈述的截然二分是经验主义未经验证的独断教条；我们的全部知识与信念体系如同一张相互牵引的力学力场（Web of Belief），任何孤立命题都无法单独面对经验法庭的裁判（确认整体论）；面对边缘的反常经验，我们原则上可以通过重新调整力网中任意节点的信念（包括物理常数甚至数理逻辑的排中律）来恢复系统自洽。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (意义同义性循环): “分析性”（仅依词义为真）的定义必然依赖于“同义性”或“必然性”，而后两者又必须预设分析性概念，陷入无法摆脱的形式循环。',
        'P2 (迪昂-蒯因非充分决定性): 孤立假说 H 无法独立导出可检验的观察预测 O，必须联立背景理论网 A_1 ∧ ... ∧ A_k（即 (H ∧ A) → O）。'
      ],
      tacitAssumptions: [
        'A_tacit: 人类认知理性遵循“最小扰动原理（Principle of Minimum Mutilation）”，在消化经验冲突时优先修正外围经验假设，尽量维持逻辑核心与数学基石的稳定。'
      ],
      inferenceChain: [
        '当经验观测呈现 ¬O 时，形式逻辑只能推导出 ¬(H ∧ A_1 ∧ ... ∧ A_k)；',
        '单凭逻辑本身无法判定究竟应当对假说 H、仪器标定理论 A_1、还是底层数学逻辑进行修正；',
        '因此，不存在任何一条绝对免于经验反思的纯先验命题，也不存在任何一条与概念网络完全绝缘的纯粹感性原子。'
      ],
      conclusion: 'C ⊢ 科学本体论承诺（Ontological Commitment）本质上是针对概念框架整体的实用主义抉择，而非对世界先验本体的唯一镜像映射。',
      falsificationCriteria: '若能在数理逻辑语义学中构造出一种严格非循环、不诉诸心理习惯或实用约定的算法，将“纯分析句”与“纯综合句”无歧义二分，则蒯因第一教条批判被证伪。'
    },
    epistemicMappingToSlide: '对应 Slide P.29（Ontology as Code：将模糊理论转化为强类型接口）与复杂软件系统的 Debugging（调试）：在排查生产事故时，我们面对的是代码、编译器、内核驱动、网络硬件交织的“信念之网”，单一报错永远无法孤立定位绝对元凶。',
    socraticQuestions: [
      '**如果面对任何经验事实的反常，我们理论上都可以通过修改底层逻辑规则来使核心信念保持为真，那么究竟是什么在阻止科学滑向任意编造的政治狂想？**',
      '**在大模型深度神经网络中，数千亿权重交织为一个整体嵌入流形，是否存在任何一个单一权重能被指认为‘存储了特定词义的分析命题’，还是整个模型作为一个整体在面对损失函数的梯度反传？**'
    ]
  },
  'doc-lakatos-msrp': {
    sourceTitle: '伊姆雷·拉卡托斯：科学研究纲领方法论 (The Methodology of Scientific Research Programmes, 1970)',
    authors: 'Imre Lakatos (兰征 译本对照)',
    year: 1970,
    sectionOrPage: '第一章：证伪与科学研究纲领的方法论 (§1-§4, P.91-196)',
    targetSlideIndex: 60,
    targetSlideTitle: '可信可验证 Agent 的状态机约束与不变量守护',
    keywords: ['科学研究纲领', '拉卡托斯', '坚硬核', '保护带', '启发法', '进步性问题转移', '退化性问题转移'],
    ontologicalParadigm: '科学哲学与方法论',
    etymologicalAnchor: {
      term: '坚硬核 / 辅助保护带',
      original: 'Nucleus Durus (拉, 硬核) / Cingulum Auxiliare (拉, 辅助缓冲带)',
      genealogy: '在波普尔“冷酷证伪”与库恩“心理暴民规则”之间架起精致证伪主义的理性重建桥梁。'
    },
    coreThesis: '科学评价的基本单元并非孤立理论，而是历史连续演进的“科学研究纲领（MSRP）”。纲领由被约定免受证伪攻击的“坚硬核（Hard Core）”与吸收经验反常的“辅助假说保护带（Protective Belt）”构成；由否定性启发法（禁止将证伪矛头指向核）与肯定性启发法（指导如何修改保护带）统摄；纲领的兴衰取决于其能否实现超额预测新事实的“进步性问题转移（Progressive Problemshift）”。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (反常普遍性事实): 科学史上一切重大理论从诞生起就浸泡在大量经验反常之中，若遵从朴素证伪主义，所有科学幼苗都将被立即扼杀。',
        'P2 (纲领进步性判据): 理论序列 T_1, T_2, ..., T_n 构成进步纲领，当且仅当每一新理论 T_{i+1} 拥有超额经验内容（预测未知新事实），且部分新事实得到经验确证。'
      ],
      tacitAssumptions: [
        'A_tacit: 科学史的理性重建（Rational Reconstruction）表明，科学家的共同体实践总体上受制于对理论进步性与退化性的长期启发式评估。'
      ],
      inferenceChain: [
        '科学家维护硬核并非非理性盲从，而是为了给纲领的肯定性启发法留出构建复杂数学模型的时间；',
        '当一个纲领持续退化（仅能通过事后特设假说（Ad-hoc）缝补反常），且出现一个能解释其全部内容并预测更多事实的竞争纲领时，理性抛弃才发生；',
        '因此，不存在能在一瞬间宣判理论死刑的所谓“判决性实验（Crucial Experiment）”。'
      ],
      conclusion: 'C ⊢ 科学理性是一项兼具教条主义防御（保护核）与经验主义激进探索（保护带迭代）的历时性自适应复杂工程。',
      falsificationCriteria: '若能在科学史中确凿证明某个完全退化、长期毫无新事实预测能力的纲领凭借纯粹的政治强权或玄学偏见最终在科学界永久战胜了强劲的进步纲领，则拉卡托斯的理性纲领论破产。'
    },
    epistemicMappingToSlide: '对应 Slide P.44（可信可验证 Agent 的状态机约束与不变量守护）：操作系统的 Microkernel（微内核架构）即架构“硬核”，而可动态加载的驱动与插件即“保护带”，通过隔离故障保护系统核心不变量。',
    socraticQuestions: [
      '**既然拉卡托斯承认一个陷入‘退化’的纲领在数十年后可能凭借新的数学工具重新变为‘进步’纲领，那么我们究竟依据什么理性标准在当下将某一学说判定为伪科学并剥夺其经费资助？**',
      '**在当今由算力堆叠支撑的大模型研究中，‘缩放定律（Scaling Law）’究竟是一个坚不可摧的科学硬核，还是一个随时可能因物理电网极限与数据枯竭而崩溃的特设保护带？**'
    ]
  },
  'doc-feyerabend-method': {
    sourceTitle: '保罗·费耶阿本德：反对方法 (Against Method, 1975)',
    authors: 'Paul K. Feyerabend (周昌忠 译本对照)',
    year: 1975,
    sectionOrPage: '导论与第一至五章：认识论无政府主义与“怎么都行” (§1-§5 / §16-§18)',
    targetSlideIndex: 63,
    targetSlideTitle: '探索与利用之张力：打破局部极小的随机漫步与退火',
    keywords: ['反对方法', '费耶阿本德', '认识论无政府主义', '怎么都行', '理论增生', '反归纳', '科学沙文主义'],
    ontologicalParadigm: '科学哲学与方法论',
    etymologicalAnchor: {
      term: '认识论无政府主义 / 理论增生',
      original: 'Anarchia (希, ἀναρχία, 无固定统治准则) / Proliferatio (拉, 茂盛繁殖)',
      genealogy: '从对波普尔派理性主义的尖锐背叛出发，以伽利略天文学革命史料为利刃，刺破科学方法论神圣理性的教条幻象。'
    },
    coreThesis: '科学史中不存在任何一条神圣不可侵犯的普遍方法论规则；所有被奉为圭臬的准则（如自洽性、经验符合性、简单性）都在科学史上最伟大的飞跃中被公然违背；唯一不阻碍知识增长的普遍原则是“怎么都行（Anything Goes）”；必须坚持反归纳（Counterinduction）与理论增生原则，倡导不同本体论思想的激进共存，警惕科学沙文主义对人类思想自由的垄断。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (历史反例普遍性): 伽利略推进哥白尼学说并非依靠无可辩驳的证据（当时望远镜存在严重像差且违反经典动力学常识），而是依靠修辞学隐喻、宣传技巧与公然违反已知经验的反归纳假设。',
        'P2 (已有理论的认知遮蔽): 现存常识与经验早已被主流正统理论所污染；若仅在现有事实框架内推导，绝无可能发现旧理论的盲区，必须提出与公认事实完全抵触的异端假说方能照亮旧理论的偏见。'
      ],
      tacitAssumptions: [
        'A_tacit: 人类认知繁荣与个体自由的发展，高于由单一技术理性构筑的冰冷秩序与方法论纯洁性。'
      ],
      inferenceChain: [
        '科学哲学家企图为科学制定规则的尝试，犹如试图为诗歌创作制定公式；',
        '若严格推行实证主义或批判理性主义规范，科学将被阉割为毫无创造力的僵死经院哲学；',
        '神话、原始巫术、中医直觉与前现代隐喻，往往蕴含着现代单一实证科学未能吸收的本体论智慧。'
      ],
      conclusion: 'C ⊢ 认识论必须走向无政府主义；国家应当与科学分立，正如宪政国家当年必须与宗教教会分立。',
      falsificationCriteria: '若能提出一套完全确定、机械可执行、且在科学史所有历史情境下均能确保重大科学顿悟加速涌现的普适方法论判定算法，则费耶阿本德无政府主义被证伪。'
    },
    epistemicMappingToSlide: '对应 Slide P.47（探索与利用之张力：打破局部极小的随机漫步与退火）：算法系统若只遵从局部梯度下降的“理性规则”，必将陷入局部极小（Local Minima）的陷阱；唯有引入无政府主义式的随机大尺度跳跃（探索），才能发现全局最优解。',
    socraticQuestions: [
      '**如果‘怎么都行’是唯一的准则，那么当占星术、地平论与现代气候模型平起平坐争夺公共教育话语权时，我们凭借什么抵御致命的反智浪潮与认知坍塌？**',
      '**在当今由人类反馈强化学习（RLHF）所严密‘对齐’的大语言模型中，我们消除模型‘幻觉’的努力，究竟是在捍卫真实，还是在对 AI 施行费耶阿本德所痛斥的‘技术理性暴政与思想阉割’？**'
    ]
  },
  'doc-carnap-aufbau': {
    sourceTitle: '鲁道夫·卡尔纳普：世界的逻辑构造 (Der logische Aufbau der Welt, 1928)',
    authors: 'Rudolf Carnap (陈启伟 译本对照)',
    year: 1928,
    sectionOrPage: '第二篇：形式研究；第四篇：构造系统的逐级推演 (§61-§85 / §120-§136)',
    targetSlideIndex: 31,
    targetSlideTitle: '图灵可计算性与形式系统界限：不可判定性之深渊',
    keywords: ['世界的逻辑构造', '卡尔纳普', '逻辑实证主义', '基本体验', '准分析', '证实原则', '伪命题消除'],
    ontologicalParadigm: '科学哲学与方法论',
    etymologicalAnchor: {
      term: '逻辑构造 / 伪命题',
      original: 'Konstitution (德/拉, 宪政级逐层搭建) / Scheinsatz (德, 虚假幻象命题)',
      genealogy: '利用罗素-怀特海《数学原理》的一阶谓词逻辑与关系论，力图将全部经验世界还原为纯形式化符号拓扑。'
    },
    coreThesis: '全部具有认知意义的经验科学陈述，都必须能够通过纯逻辑定义与关系代数，逐级还原为关于主体最基础感知体验（Elementarerlebnisse）及其相似性记忆关系（Rs）的形式陈述；科学的本质是结构描述（Structural Description），唯有脱离主观质感的纯关系矩阵才具备主体间可传递的客观真理性；凡无法在构造树中找到还原链条的形而上学玄想均属无意义的“伪命题（Scheinsätze）”。',
    formalizedArgument: {
      explicitPremises: [
        'P1 (认识论基底): 对于认知主体，唯一无可辩驳直接被给予的是不可分割的瞬间体验全貌流（Elementarerlebnisse）。',
        'P2 (逻辑构造全能性): 仅依赖单一基本二元关系 Rs(x, y)（体验 x 与 y 之间存在局域相似性记忆），通过“准分析（Quasianalyse）”算法，即可在逻辑上派生出性质类、感觉模态谱、以及四维时空物理客体坐标。'
      ],
      tacitAssumptions: [
        'A_tacit: 语言的逻辑句法能够穷尽人类全部认识内容的结构维度，意义即是经验验证的方法。'
      ],
      inferenceChain: [
        '从自主心智对象构造物理世界，再从物理世界构造异己心智与文化历史对象；',
        '各门科学在逻辑构造树上彼此接榫，构成统一科学（Einheitswissenschaft）的严密金字塔；',
        '传统形而上学关于“实在之本质”的争辩，纯粹源自把不同构造阶层的逻辑类型混为一谈的范畴错误。'
      ],
      conclusion: 'C ⊢ 哲学的唯一正当任务是对科学语言实施逻辑句法分析，澄清概念并肃清无意义的伪命题。',
      falsificationCriteria: '若能证明古德曼归纳悖论（Grue Paradox）或哥德尔不完备定理在本质上切断了从纯粹初级感觉经验自底向上无歧义形式化派生宏观物理实体同一性的可能，则卡尔纳普强还原论构造论破产。'
    },
    epistemicMappingToSlide: '对应 Slide P.15（图灵可计算性与形式系统界限）与现代计算机视觉/自然语言多模态表征学习：从底层的原始像素点阵（Raw Pixels）通过卷积与自注意力逐层抽象为高维语义向量与知识图谱，完美契合了卡尔纳普的逐级逻辑构造蓝图。',
    socraticQuestions: [
      '**如果‘只有原则上可经验证实的命题才具有认知意义’，那么这句关于意义划界的陈述本身，究竟是一条经验可证实的命题，还是一句按照自身标准应当被彻底肃清的形而上学伪命题？**',
      '**当神经网络自动从无标注感知流中抽取出‘猫’的高层语义嵌入时，它所执行的‘准分析’究竟揭示了实在的客观数学结构，还是仅仅学会了人类语言共同体的统计偏见？**'
    ]
  }
};

/**
 * Helper to dynamically locate the most accurate slide index referencing or referenced by this literature
 */
export function findReferencedSlideForLiterature(
  nodeId: string,
  fullTitle: string,
  currentSlide: SlideItem,
  slideCitations: Citation[] = []
): { slideIndex: number; slideTitle: string } {
  // 1. If it is a topic node directly, extract index
  if (nodeId.startsWith('topic-')) {
    const parsedIdx = parseInt(nodeId.replace('topic-', ''), 10);
    if (!isNaN(parsedIdx) && parsedIdx >= 1 && parsedIdx <= SEMINAR_SLIDES.length) {
      const s = SEMINAR_SLIDES.find(item => item.index === parsedIdx);
      return { slideIndex: parsedIdx, slideTitle: s?.title || `Slide P.${parsedIdx}` };
    }
  }

  // 2. Direct lookup in RAG_THESIS_REGISTRY
  const directId = nodeId.replace('rag-', '');
  if (RAG_THESIS_REGISTRY[directId]?.targetSlideIndex) {
    const targetIdx = RAG_THESIS_REGISTRY[directId]!.targetSlideIndex!;
    const s = SEMINAR_SLIDES.find(item => item.index === targetIdx);
    return {
      slideIndex: targetIdx,
      slideTitle: RAG_THESIS_REGISTRY[directId]!.targetSlideTitle || s?.title || `Slide P.${targetIdx}`
    };
  }

  // 3. If present in current slide citations, the current slide is the primary referencing context
  const isDirectlyReferencedByCurrentSlide = slideCitations.some(
    c => c.sourceTitle.includes(fullTitle) || fullTitle.includes(c.sourceTitle)
  );
  if (isDirectlyReferencedByCurrentSlide) {
    return {
      slideIndex: currentSlide.index,
      slideTitle: currentSlide.title
    };
  }

  // 4. Keyword and title scoring search across all 68 SEMINAR_SLIDES
  const lowerTitle = fullTitle.toLowerCase();
  let bestSlide: SlideItem | null = null;
  let highestScore = 0;

  for (const s of SEMINAR_SLIDES) {
    let score = 0;
    const sTitle = s.title.toLowerCase();
    const sSubtitle = (s.subtitle || '').toLowerCase();
    const sDetails = (s.details || '').toLowerCase();
    const sKeywords = (s.keywords || []).map(k => k.toLowerCase());

    if (sTitle.includes(lowerTitle) || lowerTitle.includes(sTitle)) score += 10;
    if (sSubtitle.includes(lowerTitle)) score += 5;
    if (sDetails.includes(lowerTitle)) score += 3;

    // Check specific authors / domain keywords
    if ((lowerTitle.includes('邓煜') || lowerTitle.includes('偏微分') || lowerTitle.includes('奇异性')) && 
        (sTitle.includes('邓煜') || sTitle.includes('奇异性') || sTitle.includes('波前') || sTitle.includes('偏微分'))) {
      score += 8;
    }
    if ((lowerTitle.includes('弗里德曼') || lowerTitle.includes('逆向数学') || lowerTitle.includes('不完备')) && 
        (sTitle.includes('弗里德曼') || sTitle.includes('逆向数学') || sTitle.includes('不完备'))) {
      score += 8;
    }
    if ((lowerTitle.includes('布克马斯特') || lowerTitle.includes('欧拉') || lowerTitle.includes('流体')) && 
        (sTitle.includes('布克马斯特') || sTitle.includes('深蓝时刻') || sTitle.includes('欧拉'))) {
      score += 8;
    }
    if ((lowerTitle.includes('park') || lowerTitle.includes('智能体') || lowerTitle.includes('smallville')) && 
        (sTitle.includes('park') || sTitle.includes('智能体') || sTitle.includes('反思机制'))) {
      score += 8;
    }
    if ((lowerTitle.includes('朗之万') || lowerTitle.includes('热力学') || lowerTitle.includes('p-bit')) && 
        (sTitle.includes('朗之万') || sTitle.includes('热力学') || sTitle.includes('概率比特'))) {
      score += 8;
    }

    if (sKeywords.some(k => lowerTitle.includes(k))) score += 4;

    if (score > highestScore) {
      highestScore = score;
      bestSlide = s;
    }
  }

  if (bestSlide && highestScore >= 6) {
    return {
      slideIndex: bestSlide.index,
      slideTitle: bestSlide.title
    };
  }

  // Fallback to current slide
  return {
    slideIndex: currentSlide.index,
    slideTitle: currentSlide.title
  };
}

/**
 * Resolver function to extract or construct a comprehensive RagLiteratureThesis
 * from any node (either RAG document or slide citation)
 */
export function resolveRagLiteratureThesis(
  nodeId: string,
  fullTitle: string,
  currentSlide: SlideItem,
  slideCitations: Citation[] = []
): RagLiteratureThesis {
  const referencedSlide = findReferencedSlideForLiterature(nodeId, fullTitle, currentSlide, slideCitations);

  // 1. Direct registry lookup by ID
  const directId = nodeId.replace('rag-', '');
  if (RAG_THESIS_REGISTRY[directId]) {
    const reg = RAG_THESIS_REGISTRY[directId];
    const rawDoc = CORE_DOCUMENTS.find(d => d.id === directId);
    return {
      documentId: directId,
      sourceTitle: reg.sourceTitle || fullTitle,
      authors: reg.authors || '权威前沿学术团队',
      year: reg.year || 2026,
      sectionOrPage: reg.sectionOrPage || `Slide P.${referencedSlide.slideIndex}`,
      keywords: reg.keywords || ['可计算认识论', '本体论谱系', '形式化证明'],
      coreThesis: reg.coreThesis || '核心论证正在由 RAG 检索生成...',
      ontologicalParadigm: reg.ontologicalParadigm || '一般认识论',
      etymologicalAnchor: reg.etymologicalAnchor,
      targetSlideIndex: reg.targetSlideIndex || referencedSlide.slideIndex,
      targetSlideTitle: reg.targetSlideTitle || referencedSlide.slideTitle,
      formalizedArgument: reg.formalizedArgument || {
        explicitPremises: ['P1 (公理基底): 系统内部状态满足一致性与因果封闭性。'],
        tacitAssumptions: ['A_tacit: 假定局部相互作用足以推导全局稳定性。'],
        inferenceChain: ['由 P1 与 A_tacit 推导出临界相变不可调和。'],
        conclusion: 'C ⊢ 系统状态演化受制于外生形式化公理的严格约束。',
        falsificationCriteria: '若能展示无外生约束下的完全内生自洽收敛，则该命题被证伪。'
      },
      epistemicMappingToSlide: reg.epistemicMappingToSlide || `该文献直接支撑 Slide P.${referencedSlide.slideIndex} 《${referencedSlide.slideTitle}》的认识论与形式化状态机推演。`,
      rawChunk: rawDoc?.chunk_text || 'RAG 原典切片正在调取中...',
      socraticQuestions: reg.socraticQuestions || [
        `**在《${fullTitle}》的前提假定下，当前议题关于稳定性的论断是否存在未言明的范畴错误？**`
      ]
    };
  }

  // 2. Lookup in CORE_DOCUMENTS by partial title matching
  const matchedDoc = CORE_DOCUMENTS.find(doc => 
    fullTitle.toLowerCase().includes(doc.source_title.toLowerCase()) ||
    doc.source_title.toLowerCase().includes(fullTitle.toLowerCase()) ||
    (doc.metadata.keywords || []).some(k => fullTitle.toLowerCase().includes(k.toLowerCase()))
  );

  if (matchedDoc) {
    const docId = matchedDoc.id;
    if (RAG_THESIS_REGISTRY[docId]) {
      return resolveRagLiteratureThesis(docId, matchedDoc.source_title, currentSlide, slideCitations);
    }
  }

  // 3. Fallback / Dynamic Synthetic Generation for Citations & General Nodes
  const isSciencePhil = fullTitle.includes('波普尔') || fullTitle.includes('证伪') || fullTitle.includes('库恩') || fullTitle.includes('范式') || fullTitle.includes('蒯因') || fullTitle.includes('拉卡托斯') || fullTitle.includes('费耶阿本德') || fullTitle.includes('卡尔纳普') || fullTitle.includes('科学哲学') || fullTitle.includes('方法论');
  const isLogic = fullTitle.includes('逻辑') || fullTitle.includes('不完备') || fullTitle.includes('弗里德曼') || fullTitle.includes('Lean');
  const isPde = fullTitle.includes('偏微分') || fullTitle.includes('奇异性') || fullTitle.includes('邓煜') || fullTitle.includes('欧拉') || fullTitle.includes('流体');
  const isAgent = fullTitle.includes('智能体') || fullTitle.includes('Park') || fullTitle.includes('博弈') || fullTitle.includes('BDI');

  const paradigm = isSciencePhil ? '科学哲学与方法论' : isLogic ? '数理逻辑与模型论' : isPde ? '无限维偏微分方程与相变' : isAgent ? '分布式多智能体与博弈' : '一般认识论';

  const matchedCitation = slideCitations.find(c => c.sourceTitle.includes(fullTitle) || fullTitle.includes(c.sourceTitle));

  return {
    documentId: nodeId,
    sourceTitle: fullTitle,
    authors: matchedDoc?.metadata?.authors || '学术研讨文献专著',
    year: matchedDoc?.metadata?.year || 2026,
    sectionOrPage: matchedDoc?.metadata?.section || matchedCitation?.pageOrSection || `Slide P.${referencedSlide.slideIndex}`,
    keywords: matchedDoc?.metadata?.keywords || ['认识论', '本体论', '可证伪性'],
    ontologicalParadigm: paradigm,
    targetSlideIndex: referencedSlide.slideIndex,
    targetSlideTitle: referencedSlide.slideTitle,
    coreThesis: matchedCitation?.quoteText 
      ? `文献断言：“${matchedCitation.quoteText}”。该论据构成了当前学术议题的核心立论基石。`
      : `该文献在 RAG 知识库中作为【${paradigm}】的基础源流，论述了复杂系统在特定公理或动力学约束下的极限行为。`,
    formalizedArgument: {
      explicitPremises: [
        `P1 (理论奠基): 《${fullTitle}》确立了${paradigm}视角下的核心守恒量与微观推导规则。`,
        'P2 (相变判定): 临界参数越过阈值时，系统的微分光滑性发生不可逆质变。'
      ],
      tacitAssumptions: [
        'A_tacit: 假定研讨中的宏观现象与该文献所界定的数学/微观模型在深层拓扑上保持同构。'
      ],
      inferenceChain: [
        '由 P1 与 P2，系统无法在原有维度的平衡态框架内消化极端扰动；',
        '因此，原有的内生适应机制失效，触发相空间维度的重组。'
      ],
      conclusion: `C ⊢ 当前学术命题《${referencedSlide.slideTitle}》必须在《${fullTitle}》所刻画的形式化边界内接受机器检验。`,
      falsificationCriteria: '若能构造反例证明在相同初始条件下系统保持全局平凡光滑，则该论点被证伪。'
    },
    epistemicMappingToSlide: `该文献为第 P.${referencedSlide.slideIndex} 页课件《${referencedSlide.slideTitle}》提供了认识论底座，防止论证滑向经验主义的同义反复。`,
    rawChunk: matchedDoc?.chunk_text || matchedCitation?.quoteText || '本条目直接对应当前学术研讨课件中的形式化推演与引用证据链。',
    socraticQuestions: [
      `**《${fullTitle}》的先验假定是否暗中排除了系统发生非线性自修复的可能？**`,
      `**将该文献的微观动力学机制直接外推至当前宏观学术议题，是否犯了还原论式的范畴错误（Category Mistake）？**`
    ]
  };
}

export function registerThesisMetadata(id: string, meta: Partial<RagLiteratureThesis> & { sourceTitle: string }): void {
  RAG_THESIS_REGISTRY[id] = {
    sourceTitle: meta.sourceTitle,
    authors: meta.authors || 'Philosophy API',
    year: meta.year || 1900,
    sectionOrPage: meta.sectionOrPage || 'Philosophy API',
    targetSlideIndex: meta.targetSlideIndex || 62,
    targetSlideTitle: meta.targetSlideTitle || '认识论映射',
    keywords: meta.keywords || [],
    ontologicalParadigm: (meta.ontologicalParadigm as any) || '一般认识论',
    coreThesis: meta.coreThesis || '',
    epistemicMappingToSlide: meta.epistemicMappingToSlide || `对应 Slide P.${meta.targetSlideIndex || 62}`
  };
}

