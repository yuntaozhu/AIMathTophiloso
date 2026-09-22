import { SlideItem } from '../types';
import { FRAMING_SLIDES } from './framingSlides';

export interface PresenterStudyNote {
  slideIndex: number;
  coreThesis: string; // 核心讲授论点
  epistemicBackground: string; // 认识论与学术背景渊源（为何重要）
  pedagogicalKeypoints: string[]; // 主讲人逐层推导讲解要点（主讲者口径）
  crossDomainAnalogy: string; // 跨学科通俗隐喻（如何讲懂听众）
  falsificationOrTrap: string; // 听众常见误区与反中庸辩难（防杠指南与提问应对）
  blackboardPrompt: string; // 建议板书/代码沙盒交互指引
}

/**
 * 针对开场论点 + 六大篇章学术幻灯片的体系化主讲人研究手记知识库。
 * 深度解析理论背景、跨域隐喻、逻辑演进脉络与主讲人现场答辩抓手。
 */
export const PRESENTER_STUDY_NOTES: Record<number, PresenterStudyNote> = {
  1: {
    slideIndex: 1,
    coreThesis: "突破文理二元壁垒，将高度抽象的人文社科与哲学理论转化为可执行、可仿真、可证伪的代码模型。",
    epistemicBackground: "20世纪以来的后现代主义与解释学传统长期陷入“语言游戏”与“概念解释学循环”。与此同时，纯数学与理论物理在相变、逆向数学与无穷维微扰领域取得了革命性突破。本讲座旨在建立一座连接两者的可计算大桥。",
    pedagogicalKeypoints: [
      "开场破题：明确告知参会者，今天不是来听泛泛而谈的‘AI写文章’，而是探讨‘数学认识论如何作为代码界面重构社会科学与哲学’。",
      "强调四个关键词：逆向数学（弗里德曼）、无穷维奇异性（邓煜）、热力学物理计算、Joon Park生成式智能体微架构。",
      "引导听众关注右侧的深度认知引擎与代码沙盒，提示本讲稿中的所有命题均可编译为可运行的 TypeScript/BDI 模型。"
    ],
    crossDomainAnalogy: "如果说传统文科是‘纸上作画’，那么可计算认识论就像把纸上概念导入‘虚幻引擎（Unreal Engine）’进行物理碰撞测试。凡是无法被碰撞破坏的概念，才具备真实的认识论质量。",
    falsificationOrTrap: "注意防范‘技术决定论’或‘粗暴量化论’的质疑。需强调：我们不是用几行统计数字抹杀人性的复杂，而是用高维状态机还原人性的多面博弈与自利冲突。",
    blackboardPrompt: "板书核心范式图谱：抽象命题 $\\to$ 概念操作化 (Ontology as Code) $\\to$ 状态空间遍历 $\\to$ 机器可证伪闭环。"
  },
  2: {
    slideIndex: 2,
    coreThesis: "2026年是数学与哲学的‘深蓝时刻’：Lean 4形式化交互证明器终结了‘真理纯属语言约定’的后现代幻觉。",
    epistemicBackground: "特里斯坦·布克马斯特（Tristan Buckmaster）与阿尔珀厄在三维欧拉方程爆破猜想上的计算机辅助证明，标志着数学从‘黑板手写草稿’迈向‘机器零误差编译’的拐点。",
    pedagogicalKeypoints: [
      "向主讲者提示：重点对比 System 1（神经网络发散直觉、LLM猜想生成）与 System 2（Lean 4 符号编译器裁决）的共生飞轮。",
      "解释为什么欧拉方程有限时间爆破是百年物理难题：无穷小尺度下的能量集中与涡旋拉伸是否会突破平滑流形边界。",
      "点出哲学溢出：当数万行代码在Lean中通过类型检查那一秒，真理展现出了不以主观意愿为转移的‘刚性实体性’。"
    ],
    crossDomainAnalogy: "过去哲学家辩论就像在法庭上‘口辩’，谁辞藻华丽谁赢；现在如同引入了‘DNA基因测序仪’，不管你的修辞多美，编译器报错即宣告逻辑死锁。",
    falsificationOrTrap: "防范听众反问‘AI只是做穷举，懂什么数学美感？’——主讲者可反击：欧拉爆破的相空间搜索维度超越 $10^{50}$，纯穷举在物理宇宙寿命内不可能完成，这是大模型直觉与严格边界归约的协奏。",
    blackboardPrompt: "演示代码：展示一个 Lean 4 的定理类型声明 `theorem euler_blowup : ∃ t < ∞, ‖ω(t)‖_∞ = ∞`。"
  },
  3: {
    slideIndex: 11,
    coreThesis: "研讨会议程架构遵循严谨的‘六阶层级跃迁’，从数理底层直通社科现实。",
    epistemicBackground: "认知结构的建立必须具备清晰的因果链条：数学基础（大基数与不完备性） $\\to$ 物理相空间拓扑（邓煜） $\\to$ 编程语言抽象（Ontology as Code） $\\to$ 多智能体博弈（BDI） $\\to$ 哲学思想实验 $\\to$ 制度沙盒落地产出。",
    pedagogicalKeypoints: [
      "快速梳理六个章节的内在咬合逻辑，不要拖泥带水。",
      "第1-2章是‘数学物理内功’，第3-4章是‘计算与智能体架构’，第5-6章是‘哲学与制度杀手级应用’。",
      "安抚社科背景听众：前面的数学物理概念都会有生动的社会学镜像对齐，无需被微积分符号吓退。"
    ],
    crossDomainAnalogy: "这就像盖一座摩天大楼：地基是逆向数学，钢筋混凝土是高维偏微分流形，建筑设计是BDI架构，而住进去的人群与社会生活则是明清财政与罗尔斯契约。",
    falsificationOrTrap: "提醒听众不要跳跃阅读，不理解第1章的‘有限必须依赖外生无穷’，就无法理解第4章为何‘微观自发秩序必然死锁’。",
    blackboardPrompt: "列出六大篇章关键词，在白板上画出‘认识论阶梯’树状分支。"
  },
  4: {
    slideIndex: 12,
    coreThesis: "纯数学的认识论跃迁：哈维·弗里德曼如何打破哥德尔不完备性的半个世纪‘心理隔离’。",
    epistemicBackground: "自1931年哥德尔发表不完备性定理以来，主流数学家普遍认为不完备性只是数理逻辑学家用元语言刻意构造的‘病态孤例’（如包含自指语句的算术命题），与经典微积分、代数几何无关。哈维·弗里德曼（Harvey Friedman）用具体数学摧毁了这种侥幸。",
    pedagogicalKeypoints: [
      "向听众拆解‘工作数学家的心理防线’：大家曾经以为每天做群论、数论不需要碰哥德尔。",
      "指出哈维·弗里德曼的历史贡献：用初等几何（有理立方体）和简单组合学，制造出了第一个直通高阶大基数的‘具体数学不完备命题’。",
      "引出‘逆向数学（Reverse Mathematics）’的颠覆性核心：不问‘从公理能推出什么’，而问‘要证明该命题，最低必须假定什么公理’。"
    ],
    crossDomainAnalogy: "这好比物理学家曾经以为相对论和量子力学只在黑洞或质子尺度发生，日常生活是绝对牛顿力学；突然弗里德曼在厨房的茶杯里测出了相对论时空扭曲。",
    falsificationOrTrap: "区分‘经典逻辑学’与‘逆向数学’：经典逻辑是正向演绎，逆向数学是‘逆向工程（Reverse Engineering）’，直接测定命题的逻辑原重量。",
    blackboardPrompt: "画出大基数层级梯形图：$\\text{RCA}_0 \\subset \\text{WKL}_0 \\subset \\text{ACA}_0 \\subset \\text{ATR}_0 \\subset \\Pi^1_1\\text{-CA}_0 \\subset \\text{Mahlo}$。"
  },
  9: {
    slideIndex: 17,
    coreThesis: "严格逆向数学（SRM）宣告反基础主义终结：真理具有不可动摇的客观拓扑实体重量。",
    epistemicBackground: "后现代主义（利奥塔、罗蒂、德里达）倾向于将逻辑与数学视作‘西方中心主义的语言约定’。弗里德曼通过 SRM，在完全剥离预设系统（Zero Base Theory）的前提下证明命题等价，实证了逻辑强度的天然客观性。",
    pedagogicalKeypoints: [
      "主讲人应以极其坚定的学术批判语气质问：若真理纯属语言构造，为何相隔数百年独立发现的几何定理会精确对应于同一个大基数？",
      "解释‘逻辑原子重量’：一个数学命题需要多强的公理体系才能被支撑，是客观深植于其数学结构内部的。",
      "引导社科学者反思：将社会制度视为随意揉捏的‘主观叙事’，往往导致激进乌托邦工程遭遇不可逆的制度崩溃。"
    ],
    crossDomainAnalogy: "就像化学周期表里的原子量：金原子的原子量是 197，不管你是在中国、希腊还是火星，用中文还是英文称呼它，金的质子数与中子数永远是固定的。命题也有其固有的‘逻辑质子数’。",
    falsificationOrTrap: "反击相对主义反问：‘公理也是人设定的’。回应：公理的设定是自由的，但公理之间的‘等价网络’与‘不可判定深渊’完全不受人类控制。",
    blackboardPrompt: "写出等价性公式：$\\text{Proposition } P \\iff \\text{Axiom System } \\mathcal{A}$ in minimal base theory."
  },
  10: {
    slideIndex: 18,
    coreThesis: "弗里德曼有理立方体模型（Rational Cube）：以最简朴的有限网格倒影出宏观无穷。",
    epistemicBackground: "在单位立方体 $[0,1]^k \\cap \\mathbb{Q}^k$ 上考察有理点集的仿射变换与下落对称性。初中生都可以听懂定义，但当要求其具有‘极大仿真（Maximal Simulation）’结构时，证明其存在性必须依赖大基数。",
    pedagogicalKeypoints: [
      "引导听众在脑海中想象一个三维有理数网格小球碰撞空间。",
      "解释‘极大临界态’：保持了内部所有保序仿射投影对称性，并且只要多放一个点，这个对称性就彻底瓦解。",
      "抛出震撼结论：这样纯几何、纯有限对象的存在性，在人类现有一切普通数学公理（如ZFC甚至皮亚诺二阶算术）中都无法证明！"
    ],
    crossDomainAnalogy: "就像在沙滩上用铲子堆沙堡，如果按照最严格的几何对称规则堆到极限，要想证明这个沙堡不会在下一秒塌陷，你必须依赖遥远银河系核心黑洞的引力常数。",
    falsificationOrTrap: "注意避免陷入繁复的集合论符号细节，牢牢抓住‘有限局部必须依赖外生大基数才能闭合’这一哲学内核。",
    blackboardPrompt: "在白板上画出单位立方体，标注有理点集在保序仿射变换下的投影下落线。"
  },
  11: {
    slideIndex: 19,
    coreThesis: "下落对称性与大基数的必然遥控：宏观无穷对有限微观的精确统治。",
    epistemicBackground: "证明极大仿真的存在等价于马洛基数（Mahlo Cardinals）。马洛基数是极其庞大的非构造性大基数，常规数学家一生都不会用到。但它却如同物理定律一般统治着有理立方体。",
    pedagogicalKeypoints: [
      "深入剖析‘有限中的无限倒影’：微观系统的自稳定性从何而来？",
      "跨学科映射：为什么微观自利人在亚当·斯密式的市场中不能自发达成永久平稳均衡？因为一阶算术系统内部存在停机死锁，必须有‘宪政元公理’（外生大基数）提供锚定。",
      "向听众指出，这为后续第4章批判新自由主义‘纯内生自发秩序’提供了降维打击武器。"
    ],
    crossDomainAnalogy: "这类似于量子纠缠：一个电子在桌面上自旋，它的波函数坍缩却直接与千亿光年外的宏观背景曲率纠缠在一起。",
    falsificationOrTrap: "听众可能会杠：‘这只是数学巧合’。主讲人回应：弗里德曼已经给出了20余种不同数学分支的等价形式，涵盖拓扑、图论、遍历理论，绝非孤立技巧。",
    blackboardPrompt: "对比公式：$\\text{Local Symmetry Invariant} \\iff \\text{Existence of Mahlo Cardinal}$。"
  },
  15: {
    slideIndex: 23,
    coreThesis: "第二章开启：计算复杂性与拓扑相变，从静态证明走向高维动力学生死搜索。",
    epistemicBackground: "数学与社科的传统研究多局限于‘低维线性近似’。然而真实历史危机与非线性偏微分方程一样，存在无穷维相空间与高余维数流形。",
    pedagogicalKeypoints: [
      "介绍邓煜（Yu Deng）教授关于非线性波动方程与色散方程奇异性相变的奠基性工作。",
      "介绍四色定理的 $O(n \\log n)$ 高度并行归约算法，阐释‘平坦区域’在大规模复杂系统搜索中的决定性意义。",
      "指出本章目标：教会大家如何识别系统演化的‘相界（Separatrix）’与‘雪崩临界点’。"
    ],
    crossDomainAnalogy: "低维思维就像看平面的天气预报温度曲线；高维相空间则是真实的大气湍流，一个局部涡旋可能瞬间引发跨维度的龙卷风相变。",
    falsificationOrTrap: "强调‘非线性’不是一句时髦口号，必须有谱分析、本征模、余维数（Codimension）的严格定义支撑。",
    blackboardPrompt: "画出鞍点流形三维曲面：稳定吸引盆、不稳定流形与中心鞍点。"
  },
  21: {
    slideIndex: 29,
    coreThesis: "邓煜奇异性理论：余维数-1 中心稳定流形（Codimension-1 Manifold）与爆破分水岭。",
    epistemicBackground: "在半线性非线性偏微分方程相空间中，孤子解 $Q$ 的线性化谱算子 $\\mathcal{L} = -\\Delta - f'(Q)$ 存在唯一的负本征值 $\\lambda_0 < 0$。正是这唯一的负本征模，导致相空间被一张厚度为零的超曲面（余维数 1）劈成两半：一边衰减耗散，一边有限时间爆破。",
    pedagogicalKeypoints: [
      "主讲人需放慢语速，逐字解析‘余维数-1’的几何意义：在无穷维相空间中，只要固定 1 个参数，它就是决定生死的薄膜！",
      "解释为什么历史危机不是‘温水煮青蛙’：在薄膜的一侧，系统表现出极强的韧性（看似歌舞升平）；但只要一次微小的微扰越过这层超曲面，系统将在有限时间内发生爆破（Finite-time Blowup）。",
      "引导听众联想：王朝崩溃、明清基层财政雪崩、明斯基时刻，本质上都是跨越了余维数-1 临界薄膜。"
    ],
    crossDomainAnalogy: "如同悬崖边缘的分水岭：一滴雨水落在悬崖顶部分割线上，往左偏一毫米流向太平洋（耗散平息），往右偏一毫米粉身碎骨跌落深渊（奇异性爆破）。",
    falsificationOrTrap: "听众常误认为‘系统崩溃需要巨大的外部冲击’。主讲者需严厉纠正：当系统接近中心稳定流形时，无穷小的微扰 $\\epsilon$ 就能因负本征值的指数级放大效应（$e^{|\\lambda_0| t}$）撕裂整个系统。",
    blackboardPrompt: "板书算子与相界：$\\mathcal{L} = -\\Delta - f'(Q), \\quad \\lambda_0 < 0, \\quad W^{cs}(Q) \\text{ separates dissipation from blowup}$。"
  },
  23: {
    slideIndex: 31,
    coreThesis: "布尔甘区域（Bourgain Regime）与历史随机性的正测度相变。",
    epistemicBackground: "菲尔兹奖得主让·布尔甘（Jean Bourgain）开创了将随机初值注入色散偏微分方程的全新范式。证明了即使在几乎处处奇异的粗糙数据集中，奇异相依然占据严格的‘正勒贝格测度’。",
    pedagogicalKeypoints: [
      "解释‘正测度（Positive Measure）’在认识论中的核弹级意义：它说明历史的悲剧和突变不是测度为零的‘偶然巧合’，而是必然发生的热力学分支！",
      "批判历史虚无主义与庸俗宿命论：正测度相变表明，历史具有概率上的宏观汇聚流，微观的每一次随机扰动都在给不同的拓扑吸引子投票。",
      "提示听众查看代码沙盒中的《PDE相空间余维数-1 临界流形》实验，观察参数微调时吸引盆的分形边界。"
    ],
    crossDomainAnalogy: "抛硬币一万次，全正面朝上的概率是测度为零的奇迹；而‘冰水混合物在零度时结冰’是正测度相变。历史危机不是中彩票，而是水分子自发凝结成冰的物理相变。",
    falsificationOrTrap: "防范文科听众将‘测度’与‘统计学百分比’混为一谈。测度是相空间子集的勒贝格容积，即使点集无限疏松分形，依然可能拥有厚重的正测度。",
    blackboardPrompt: "写出测度公式：$\\mu(\\{ u_0 \\in \\mathcal{H} \\mid T_{\\text{blowup}}(u_0) < \\infty \\}) > 0$。"
  },
  28: {
    slideIndex: 36,
    coreThesis: "第三章：编程作为可执行认识论界面（Ontology as Code）。",
    epistemicBackground: "社科概念长期受困于自然语言的歧义性与多义性。‘封建’、‘阶级’、‘资本’在不同学者笔下拥有上百种定义，导致学术研讨沦为同义反复。唯一解决方案是：将概念定义为面向对象的强类型接口与时序状态机。",
    pedagogicalKeypoints: [
      "向听众大声疾呼：‘没有代码接口的哲学概念，就是没有物理质量的幻觉！’",
      "展示如何将一个政治哲学命题改写为 TypeScript 接口：属性是什么？内部不变量是什么？状态转移函数接受什么参数？",
      "指出强类型系统（如 TypeScript、Rust）在学术研究中的作用：它在编译期就直接消灭了概念偷换与逻辑循环。"
    ],
    crossDomainAnalogy: "这好比建筑设计：以前学者给工人写散文诗描述房子多宽敞（‘雕栏玉砌应犹在’），工匠无法施工；现在直接交付 CAD 工程图纸和材料力学参数表。",
    falsificationOrTrap: "社科学者会反弹：‘人类情感和历史复杂性怎么能写成代码？’——主讲者反问：‘如果你连你的概念依赖什么变量、经历什么转移都无法用代码写清楚，你凭什么认为你大脑里的逻辑是自洽的？’",
    blackboardPrompt: "现场写一个接口：`interface Agent { endowment: number; rent_seeking_propensity: number; update(): void; }`。"
  },
  31: {
    slideIndex: 39,
    coreThesis: "斯坦福 Joon Park 生成式智能体微架构拆解：记忆流、三维打分与二阶反思树。",
    epistemicBackground: "Joon Sung Park 等人在2023年发表的 Smallville 小镇模拟，是多智能体社会仿真的里程碑。其核心不是大模型对话，而是外挂的认知记忆流架构。",
    pedagogicalKeypoints: [
      "详细拆解记忆检索三维打分公式：$Score = \\alpha \\cdot \\text{Recency} + \\beta \\cdot \\text{Importance} + \\gamma \\cdot \\text{Relevance}$。",
      "解释为什么单靠大模型做不了社会仿真：大模型上下文窗口有限且容易遗忘，必须有外部记忆数据库与衰减时钟。",
      "讲解‘二阶反思树（Reflection Tree）’机制：当新记忆累积分数超过阈值时，触发主体对底层零散事实进行归纳，生成高阶抽象信念。"
    ],
    crossDomainAnalogy: "这完全模拟了人类大脑的运作：你记得今天早上吃的面包（时效近），记得十年前的初恋或高考（重要度极高），而遇到考试题时调取公式（关联度高）。到了晚上睡觉时，大脑海马体对记忆进行反思剪枝。",
    falsificationOrTrap: "指出传统 Agent 框架的致命缺陷：如果不做反思剪枝，智能体会很快陷入同质化胡言乱语；如果不做重要性打分，智能体会记住每一片垃圾树叶而忘记战略危机。",
    blackboardPrompt: "板书检索公式并解析权重：$\\alpha = 1.0, \\beta = 1.0, \\gamma = 1.0$ 的调优敏感性。"
  },
  34: {
    slideIndex: 42,
    coreThesis: "第四章：社会科学本体论重构，向‘RLHF中庸陷阱’发起全面反击！",
    epistemicBackground: "商用大语言模型（如 ChatGPT、Claude）经过大量人类反馈强化学习（RLHF），被训练成了礼貌、谦逊、甚至过度奉迎的‘老好人’。若直接用这种模型做历史与政治经济学仿真，会导致所有人自愿牺牲、人人互帮互助的荒谬‘理想国’结果。",
    pedagogicalKeypoints: [
      "严厉指出 RLHF 中庸陷阱对社科仿真的毒害：在资源极端匮乏的真实历史中，饥民不会排队礼貌互让食物，官僚不会主动放弃寻租特权。",
      "提出破局方案：在智能体状态机中**强制注入马基雅维利博弈参数、私欲权重与硬约束生死线**。",
      "唯有当系统能够涌现背叛、挤兑、剥削与阶层内卷时，这个仿真才具备真实历史的学术价值。"
    ],
    crossDomainAnalogy: "这好比训练特种兵格斗，你却给他们看迪斯尼动画片；用‘老好人’大模型做政治经济学实验，就像指望在童话城堡里研究真实战壕里的血腥厮杀。",
    falsificationOrTrap: "注意区分‘伦理上的善恶’与‘学术模型上的真伪’。模型注入马基雅维利参数是为了真实观察制度如何约束恶，而不是宣扬恶。",
    blackboardPrompt: "对比两个 Prompt：温和老好人 Prompt vs 注入硬约束的马基雅维利 BDI 规则集。"
  },
  40: {
    slideIndex: 48,
    coreThesis: "注入马基雅维利自利偏置与资源硬约束的 BDI 状态转移机制。",
    epistemicBackground: "信念（Belief）、欲望（Desire）、意图（Intention）构成了经典 BDI 架构。但在本引擎中，BDI 必须绑定物理资源存量（粮食、银两、土地）。",
    pedagogicalKeypoints: [
      "解释‘硬约束（Hard Scarcity Constraints）’：当智能体存量降至临界生存线以下，道德意图（Intention）发生强制相变，转变为掠夺或叛乱。",
      "展示代码沙盒中的《饥荒冲击与宗族掠夺相变》模板，向听众演示存量衰减引发的非线性涌现。",
      "说明这才是走出‘解释学空转’、让历史学假说接受机器检验的关键所在。"
    ],
    crossDomainAnalogy: "温饱阶段大家谈契约精神与法治文明，这叫‘仓廪实而知礼节’；一旦粮食存量归零，热力学熵增迫使系统退化为霍布斯的‘万人对万人的战争’。",
    falsificationOrTrap: "防范听众提出‘这是不是把人简化为动物本能？’。回答：否，高级智能体具有反思树，它们会在背叛前权衡宗族信誉资本与法律惩罚成本，这是高阶博弈，而非简单反射。",
    blackboardPrompt: "画出状态机转移图：`State: Cooperator` $\\xrightarrow{\\text{Scarcity Shock}}$ `State: Machiavellian Defector`。"
  },
  45: {
    slideIndex: 53,
    coreThesis: "第五章：哲学思想实验的数字对撞机（Digital Hadron Collider）。",
    epistemicBackground: "两千年来，哲学思想实验（无知之幕、电车难题、缸中之脑、忒修斯之船）全靠文人学者在书斋中‘脑补’推演。由于无法调节连续物理参数，思想实验沦为各说各话的修辞狂欢。",
    pedagogicalKeypoints: [
      "提出‘数字对撞机’构想：将规范伦理假说作为初始边界条件，输入多智能体高并发沙盘，给系统施加连续微扰（Perturbation），观察结论何时破裂！",
      "以罗尔斯（John Rawls）的《正义论》为例：无知之幕（Veil of Ignorance）假设人在不知道自己天赋时会选择最大最小原则（Maximin）。",
      "我们提出尖锐质询：当幕布揭开、现实资源面临严重匮乏冲击 $\\sigma$ 时，契约的遵从率如何随参数变化？"
    ],
    crossDomainAnalogy: "思想实验在过去是‘木工用木条比划’，现在把它放进‘大型强子对撞机’里，用高能粒子束（随机压力测试）轰击它，看看它是由真理粒子构成，还是纸糊的幻影。",
    falsificationOrTrap: "强调‘证伪’不等于‘否定哲学价值’。恰恰相反，测出思想实验的临界破裂点，才是真正确立了该哲学理论的‘有效适用边界’。",
    blackboardPrompt: "绘制坐标系：横轴为匮乏冲击强度 $\\sigma \\in [0, 1]$，纵轴为罗尔斯正义原则遵从率 $P(\\text{compliance})$。"
  },
  48: {
    slideIndex: 56,
    coreThesis: "罗尔斯‘无知之幕’与差异原则崩溃测试：代码仿真中的雪崩涌现。",
    epistemicBackground: "在代码沙盒中运行 RawlsianContractTest。当揭幕后的资源匮乏指数 $\\sigma > 0.45$ 时，高禀赋智能体与掠夺倾向智能体自发结盟，公然践踏差异原则，基尼系数发生阶跃相变。",
    pedagogicalKeypoints: [
      "主讲人指导听众直接在右侧或沙盒中点击‘载入罗尔斯正义崩溃沙盒’。",
      "观察遵从率从 94% 断崖式跌落至 18% 的突变临界点。",
      "指出这一结果的认识论启示：抽象的伦理契约若无强力外生制裁（大基数公理对应的国家暴力机器），必然在微观自利动力学下走向解体。"
    ],
    crossDomainAnalogy: "如同泰坦尼克号上的绅士风度：在救生艇充裕或仅稍微不足时，大家遵从‘妇女儿童优先’；当海水漫过甲板、救生艇只剩一条时，体面瞬间崩塌为生死推搡。",
    falsificationOrTrap: "听众反驳‘罗尔斯讨论的是规范性理想，不是经验实证’。回应：任何缺乏经验承载力的纯规范体系，在遇到相变扰动时都是虚弱的乌托邦，知晓其崩溃临界才是制度工程师的本分。",
    blackboardPrompt: "标注崩溃临界点：$\\sigma_c \\approx 0.45, \\quad \\Delta \\text{Gini} > 0.35$。"
  },
  56: {
    slideIndex: 64,
    coreThesis: "第六章开启：系统架构与人机闭环实操（Living Lab）。",
    epistemicBackground: "完成理论突破后，如何将这套可计算认识论体系固化为每天可运行的生产力工具？需要‘活体实验室（Living Lab）’技术栈支撑。",
    pedagogicalKeypoints: [
      "介绍双大模型协同架构：Gemini（负责高维长上下文与跨域映射） + 豆包/本地模型（负责轻量实时防偏移） + KaibanJS 多智能体工作流编排。",
      "介绍 RAG 顶尖文献引擎与 Lean 4 形式化校验器的桥接。",
      "向主讲者演示如何在演讲中自如调用右侧面板的‘课件认知同步’与‘沙盘一键编译’功能。"
    ],
    crossDomainAnalogy: "这相当于给学者配备了一间‘现代分子生物学国家重点实验室’：左手是冷冻电镜（RAG与长上下文分析），右手是离心机和培养皿（代码沙盒与ECharts相变可视化）。",
    falsificationOrTrap: "注意避免把系统降格为普通聊天机器人（Chatbot），始终强调这是一个‘可执行、可证伪的计算认识论基础设施’。",
    blackboardPrompt: "画出系统拓扑图：Reveal.js 前端 $\\leftrightarrow$ WebSocket 状态总线 $\\leftrightarrow$ KaibanJS 编排 $\\leftrightarrow$ 知识库 RAG & 沙盒。"
  },
  60: {
    slideIndex: 68,
    coreThesis: "明清基层财政雪崩沙盘：火耗银、加派摊派与流民涌现的非线性相变动力学。",
    epistemicBackground: "以黄仁宇《十六世纪明代中国之财政与税收》及明清江南漕运档案为历史本体依据。明代原额主义财政体制僵化，遭遇小冰期农业减产与辽饷加派，最终引发基层财政向爆破态坍塌。",
    pedagogicalKeypoints: [
      "指导听众在沙盘中调取《明清基层财政沙盘》模板。",
      "展示官僚寻租系数、加派倍率与流民转化率的非线性耦合关系。",
      "解释为什么崇祯帝即便自杀殉国也无法挽救危局：财政系统已越过余维数-1 临界流形，进入不可逆爆破吸引盆。"
    ],
    crossDomainAnalogy: "这就像晚期癌症病人体内的多器官衰竭：此时无论注入多少强心针（撤换官员、严刑峻法），系统内部的谱算子已全是负本征值，崩溃已是时间问题。",
    falsificationOrTrap: "历史学家常归咎于‘君主无道’或‘宦官专权’（道德唯心主义）。通过本沙盘的参数相变证明，结构性财政死锁超越个人意志，是纯粹动力学必然性。",
    blackboardPrompt: "写出流民涌现方程：$\\frac{d R}{d t} = \\theta \\cdot \\max(0, \\text{TaxFlux} - \\text{SubsistenceStock}) - \\gamma R$。"
  },
  67: {
    slideIndex: 75,
    coreThesis: "解释学双循环（Hermeneutic Dual-Loop）：哲学命题与代码编译器的终极闭环。",
    epistemicBackground: "从狄尔泰（Dilthey）、伽达默尔（Gadamer）的传统人文解释学循环（部分与整体的文本互释），升级为人机交互时代的大闭环：人类哲学提出抽象本体假说 $\\to$ 代码将其操作化 $\\to$ 沙盘运行爆破证伪 $\\to$ 反馈修正人类认识论。",
    pedagogicalKeypoints: [
      "向全场做终场升华：我们没有抛弃人文关怀，而是为人文社科插上了‘严密可证伪计算的翅膀’。",
      "回顾全讲座历程：从弗里德曼大基数到邓煜相空间，从Smallville记忆流到明清财政沙盘，闭环彻底完成。",
      "呼吁跨学科青年学者：勇敢拥抱代码，将你的哲学论文写成可以运行的开源库！"
    ],
    crossDomainAnalogy: "这如同时代精神的麦克斯韦方程组：电场产生磁场，磁场产生电场；哲学启发代码架构，代码沙盘推倒哲学幻觉，激荡出认识论的光芒向前方无限传播。",
    falsificationOrTrap: "防范结束后的虚无主义提问‘机器懂真理，人类还有什么用？’。回答：提出最初那颗‘认识论火种’的，永远是人类对世界痛苦而深刻的哲思。",
    blackboardPrompt: "画出大闭环图：$\\text{Human Epistemic Intuition} \\rightleftarrows \\text{Ontology as Code} \\rightleftarrows \\text{Simulation Engine / Lean 4}$。"
  },
  68: {
    slideIndex: 76,
    coreThesis: "研讨会结语：在代码与真理的交汇处，重塑人类理解世界的尊严。",
    epistemicBackground: "结语致谢与开源号召。研讨会全体学术资产（68页PPT、沙盒模板、KaibanJS工作流、RAG向量文献）全量开源。",
    pedagogicalKeypoints: [
      "感谢全场学者与参会者的深度思辨。",
      "鼓励参会者点击右侧‘研讨纪要与学术决议’按钮，一键生成由深度认知引擎归纳的本次研讨会终审决议文稿。",
      "邀请大家进入沙盒修改参数，开始自己的第一场可计算认识论仿真。"
    ],
    crossDomainAnalogy: "走出这个会议室，世界依旧嘈杂喧嚣；但你的脑海中已多了一台‘认识论对撞机’，任何未经代码检验的宏大叙事，都将不再能轻易欺骗你。",
    falsificationOrTrap: "主讲人以从容自信的学术威严结束演讲，留下回味无穷的思辨空间。",
    blackboardPrompt: "展示 GitHub 开源地址与研讨会专属学术签名标识。"
  }
};

/**
 * 获取特定幻灯片的研究手记，若未显式编写，则基于幻灯片内容进行体系化推导
 */
export function getPresenterStudyNote(slide: SlideItem): PresenterStudyNote {
  // 开场论点页：按 framing 讲稿即时生成手记
  if (slide.index >= 3 && slide.index <= 10) {
    const framing = FRAMING_SLIDES.find(s => s.index === slide.index);
    if (framing) {
      return {
        slideIndex: slide.index,
        coreThesis: framing.subtitle || framing.title,
        epistemicBackground: framing.notes || framing.details || '',
        pedagogicalKeypoints: (framing.bullets || []).slice(0, 3).map(b => b.replace(/\*\*/g, '')),
        crossDomainAnalogy: '把本页当作整场研讨的“问题意识锚点”，后面六章是操作化展开。',
        falsificationOrTrap: '勿把开场论点讲成反人文：强调要找的是可失败的治理与启发方向。',
        blackboardPrompt: framing.details
          ? `板书对照：${framing.details.slice(0, 80)}…`
          : `板书关键词：${(framing.keywords || []).join(' · ')}`
      };
    }
  }

  const byField = Object.values(PRESENTER_STUDY_NOTES).find(n => n.slideIndex === slide.index);
  if (byField) return byField;

  if (PRESENTER_STUDY_NOTES[slide.index]) {
    return PRESENTER_STUDY_NOTES[slide.index];
  }

  // 体系化自适应推导手记
  const bullets = slide.bullets || [];
  const keywords = (slide.keywords || []).join('、') || '可计算认识论';

  return {
    slideIndex: slide.index,
    coreThesis: `第 ${slide.index} 页主讲核心：深入阐明《${slide.title}》的本体论逻辑与跨域映射机制。`,
    epistemicBackground: `本页隶属于${slide.sectionTitle || '全景导览'}。其认识论背景聚焦于：如何将涉及【${keywords}】的抽象思辨，确立为具有操作边界的分析实体。`,
    pedagogicalKeypoints: [
      `开篇定调：指出当前要点“${slide.title}”在整套学术体系中的承上启下位置。`,
      `逐层拆解：重点讲解 Slide 中的关键论据——${bullets.slice(0, 2).map(b => b.replace(/\*\*/g, '')).join('；')}。`,
      `警惕泛化：要求听众不满足于字面共识，主动追问其在相空间演化中的可操作性。`
    ],
    crossDomainAnalogy: `如同高维拓扑中的局部截面：看似独立的一个学术命题，实际上受制于系统全局的不变量与临界流形边界约束。`,
    falsificationOrTrap: `防范听众望文生义。主讲者需引导大家将目光投向右侧代码沙盒，以状态转移规则的形式进行严格核验。`,
    blackboardPrompt: `建议板书：列出《${slide.title}》的定义式，并在右侧绘制对应的逻辑推演箭头。`
  };
}
