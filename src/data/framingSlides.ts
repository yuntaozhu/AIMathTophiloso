import { SlideItem } from '../types';

/**
 * 开场核心论点：AI Math 突破对文社哲的启发
 * （插入于深蓝时刻之后、六章导览之前）
 *
 * literatureIds 与 knowledgeBase / RAG_THESIS_REGISTRY 对齐，便于知识库与本体论图谱挂载。
 */
export const FRAMING_SLIDES: SlideItem[] = [
  {
    index: 3,
    sectionNumber: 0,
    sectionTitle: '开场 · Lean',
    title: 'Lean 是什么：交互式证明器与 0/1 真值机',
    subtitle: '布克马斯特–阿尔珀厄欧拉爆破工作的关键底座——本场研究的破局节点',
    details:
      '猜想草稿（可错）→ 写成 Lean 形式语句 → 内核逐行类型检查 → 通过=定理成立 / 失败=证明有洞\n人机协作：数学家+AI 提出策略；Lean 从不“相信修辞”，只接受可编译的证明对象',
    bullets: [
      '**一句话定义**：Lean 是微软研究院发起的**交互式定理证明器（ITP）**——把数学命题与证明写成可编译的程序；内核像编译器一样做**类型检查**，通过则证明成立，报错则存在逻辑漏洞。',
      '**为何叫“交互式”**：不是扔进黑盒等结果。人（或 AI）逐步给出策略、引理与计算步骤；Lean 随时反馈哪一步尚未闭合——像结对编程，搭档是冷酷的逻辑机。（对照文献：**Lean Copilot** 把 LLM 嵌进编辑器做战术建议；**mathlib** 提供可复用引理宇宙。）',
      '**与 ChatGPT 的本质差别**：大模型产出的是**看似合理的自然语言**；Lean 验收的是**机器可核验的证明对象**。**APOLLO** 进一步说明：整证抛掷浪费编译器反馈；应用编译器引导修复，才在低采样预算下逼近可核验证明。',
      '**欧拉爆破节点**：有限时间爆破证明极长；在 **Lean 4** 中形式化后，不等式与极限交换被内核钉死——声明原文强调：原始 LLM 草稿可“不堪卒读”，**形式化完成**才进入公开复核。（文献：`statement_zh` / Córdoba–Martínez-Zoroa 纲领源流。）',
      '**对本场的意义**：数学突破的关键不是“模型更会聊天”，而是接上了 **可失败的 System 2**。后文 Harness = 文社哲侧“类 Lean”治理层。'
    ],
    notes:
      '口播 2–3′：① Lean=证明编译器；② 点名知识库 APOLLO / Lean Copilot / mathlib / miniF2F；③ ≠LLM；④ 欧拉因可复核才成破局点。打开知识库检索「Lean」「APOLLO」。',
    keywords: ['Lean 4', 'APOLLO', 'Lean Copilot', 'mathlib', 'miniF2F', '类型检查', 'System 2'],
    literatureIds: [
      'doc-apollo-01',
      'doc-lean-copilot-01',
      'doc-mathlib-01',
      'doc-minif2f-01',
      'doc-leandojo-01',
      'doc-hypertree-01',
      'doc-lean-euler-bridge-01'
    ]
  },
  {
    index: 4,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '核心反差：数学已有范式突破，文社哲尚未有',
    subtitle: 'AlphaProof / AlphaGeometry / 结构发现 vs 海量流畅却无范式级洞见的文社哲文本',
    bullets: [
      '**数学侧里程碑（可核验）**：**AlphaProof + AlphaGeometry 2** 在 IMO 2024 达银牌水准（DeepMind 公告）；**AlphaGeometry2** 将近 25 年奥赛几何求解率 54%→84%；开源侧有 **LLEMMA / DeepSeekMath / DeepSeek-Prover / Goedel-Prover** 与 **OlympiadBench** 等标尺。',
      '**文社哲侧现实**：LLM 可写看似专业的论文，但缺少与 Lean/IMO 同等的**可公开复核闭环**——尚未出现公认的范式级突破。',
      '**本场问题**：反差暴露了什么认知短板？启发落在**概念压力测试、反事实沙箱、学术级 Harness**，而非等待万能人文大模型。'
    ],
    notes: '60 秒立论。知识库可挂：doc-alphaproof-imo-01、doc-alphageometry2-01、doc-llemma-01、doc-olympiadbench-01。',
    keywords: ['范式突破', 'AlphaProof', 'AlphaGeometry2', 'LLEMMA', 'OlympiadBench', '文社哲'],
    literatureIds: [
      'doc-alphaproof-imo-01',
      'doc-alphageometry2-01',
      'doc-llemma-01',
      'doc-deepseekmath-01',
      'doc-olympiadbench-01',
      'doc-deepseek-prover-01',
      'doc-goedel-prover-01'
    ]
  },
  {
    index: 5,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '溯源对照：两套研究范式的底盘差异',
    subtitle: '有无 Ground Truth，决定了闭环能否自动化',
    details:
      '【数学】高维直觉假说 → 形式化环境（Lean/Isabelle）→ 0/1 真值 → 证明搜索/修复反馈（HyperTree、APOLLO、RLPAF）\n\n【文社哲】高维文本关联 → 自然语言合情输出 → 解释学深渊 → 依赖人类主观评审，难成低成本闭环',
    bullets: [
      '数学突破的关键不是模型“更聪明”，而是接上了**可失败的形式验证器**（Lean 内核 + **process supervision / 编译器反馈**一类信号）。',
      '文社哲缺少等价于 Lean 的编译器：历史因果、社会机制、道德正当性无法二进制验收。',
      '因此：只做 Prompt/Context，必然停在“合情合理的胡说”——与 **AI-Coding / Böckeler**：管生成 ≠ 管执行。'
    ],
    notes: '白板两行闭环。文献锚：APOLLO、Lets Verify Step by Step、AI-Coding。',
    keywords: ['Lean', 'Ground Truth', 'APOLLO', 'process supervision', '解释学深渊'],
    literatureIds: ['doc-apollo-01', 'doc-process-supervision-01', 'doc-hypertree-01', 'doc-aicoding-01']
  },
  {
    index: 6,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '为什么数学能突破，而文社哲步履维艰？',
    subtitle: '三层结构性原因',
    bullets: [
      '**① 形式验证器缺位**：机器可胡思乱想；Lean / miniF2F 生态过滤错误。文社哲没有 0/1 编译门禁。',
      '**② 开放系统与反思性（卢卡斯批判）**：黎曼猜想不因被观察而改写；社会预测会改写行为人预期。',
      '**③ 符号意义与计算表征脱节**：数学外延精确；自然语言充满隐喻与价值负载——词向量距离 ≠ 具身理解。',
      '**结论**：短板不在“再喂更多 PDF”，而在缺少可失败、可回放的治理结构（→ Harness）。'
    ],
    notes: '三点各 20 秒。可顺带提 ATP 综述（doc-atp-survey-01）作为“数学侧已成学科地图”。',
    keywords: ['形式验证', '卢卡斯批判', 'ATP', 'Harness', '具身'],
    literatureIds: ['doc-atp-survey-01', 'doc-minif2f-01', 'doc-aicoding-02']
  },
  {
    index: 7,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '启发①：从真理证明者 → 概念压力测试机',
    subtitle: 'Concept Stress-Tester：测理论承重，而非宣布正义',
    bullets: [
      '**数学侧启示**：形式化与搜索闭环里，AI 常贡献边界案例与未知关联提示（对照 **OlympiadBench** 级压力测试），而非直接宣称“真理完成”。',
      '**文哲映射**：思想实验可扩成**高维参数扰动的边界案例库**。',
      '**操作化**：对罗尔斯正义原则做万级微妙伦理边界微扰，观察逻辑互搏或价值塌陷——后接无知之幕沙盒。',
      '**价值重估**：AI 不当正义宣判者，而当**理论承重极限的压力机**。'
    ],
    notes: '衔罗尔斯沙盒。文献：OlympiadBench（难度标尺）+ 后文 MACHIAVELLI（伦理张力）。',
    keywords: ['概念压力测试', 'OlympiadBench', '罗尔斯', '边界案例'],
    literatureIds: ['doc-olympiadbench-01', 'doc-machiavelli-01']
  },
  {
    index: 8,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '启发②：从计量拟合 → 反事实沙箱与合成社会',
    subtitle: 'Self-play 逻辑迁移：硅基微观模拟作为可计算反事实实验室',
    bullets: [
      '**数学/博弈侧**：AlphaGo / AlphaProof 本质是沙箱自我博弈；开源侧有多智能体社会原型。',
      '**文献桥**：**Social Simulacra**（Park et al.）用 LM 填充社会计算原型做建成前试运行；**Generative Agents** 给出记忆/反思/规划微架构——后文 Smallville 专讲。',
      '**社科约束**：真实社会难做破坏性实验；硅基沙盘可施加制度冲击并观察涌现。',
      '**方向**：制度经济学 / 政治学获得“可计算反事实实验室”——明清财政 / 罗尔斯沙盒即演示。'
    ],
    notes: '强调沙盘是压力测试，不是历史真理自动机。打开知识库「Social Simulacra」「Generative Agents」。',
    keywords: ['反事实', 'Social Simulacra', 'Generative Agents', '合成社会', 'Self-play'],
    literatureIds: ['doc-social-simulacra-01', 'doc-generative-agents-pdf', 'doc-futures-01', 'doc-alphaproof-imo-01']
  },
  {
    index: 9,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '启发③：破解显著性悖论，守住人类护城河',
    subtitle: '机器穷举自洽碎片；人类决断何为深刻问题',
    bullets: [
      '**数学侧**：机器可生成海量公理自洽的微小定理；**DFM** 等纲领则追问“发现问题/假说/干预”的发现智能——仍须人界定何为深刻。',
      '**人文侧**：生成术语华丽的虚假理论极其廉价。',
      '**护城河**：价值赋予与**提出真问题**是人类核心特权。',
      '**分工**：算法提供高维关联；学者决断时代焦虑与历史尊严。'
    ],
    notes: '可挂 doc-dfm-01：发现智能 ≠ 自动取代问题选择。',
    keywords: ['显著性', '真问题', 'DFM', '护城河'],
    literatureIds: ['doc-dfm-01', 'doc-structure-discovery-01']
  },

  // ——— B. 结构型证明发现 ———
  {
    index: 10,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '认知转折：从“见证搜索”到“结构发现”',
    subtitle: 'Liouville–Goldbach 类成果揭示的第三类数学能力',
    bullets: [
      '**文献底本**：`从证明搜索到结构发现`（知识库 **doc-structure-discovery-01**）区分三类能力——Calculator / Lemma Search / Structure Discovery。',
      '**旧共识**：AI 要么暴力枚举见证，要么在引理图谱中拼装路径（大量 Lean ATP 结果属第二类）。',
      '**第三类**：假设反例存在 → 约束全局传播 → **逼出隐藏刚性** → 概念性矛盾。',
      '**对本场**：与 $Agent = Model + Harness$ 融合，文社哲才能跳出平庸拼装。'
    ],
    notes: '60–90 秒。务必点开知识库结构发现条目。勿展开数论细节。',
    keywords: ['结构发现', 'Liouville-Goldbach', '三类能力', '约束传播'],
    literatureIds: ['doc-structure-discovery-01', 'doc-atp-survey-01']
  },
  {
    index: 11,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '能力谱系映射：Calculator → Lemma → Structure',
    subtitle: '三类能力严格对应文社哲研究范式与瓶颈',
    details:
      '第一类 Calculator/Searcher：海量候选找例证｜社科计量｜古籍全文检索\n第二类 Lemma Search：引理库拼推导｜套学派变量链｜范畴重注文本｜平庸论文工业（对照 miniF2F/引理搜索型 ATP）\n第三类 Structure Discovery：反例假设→约束强迫刚性→概念矛盾｜反常→制度拓扑｜反事实→本体论冲突',
    bullets: [
      '文史哲长期停在**第一、二类辅助**。',
      '数学突破的震撼在于：开始具备“约束传播逼出深层刚性”的潜质（结构发现专论）。',
      '本场沙盒与 Harness，是为**第三类**做可演示降维。'
    ],
    notes: '指 details 三行。第二类可点名“Lean 上不少 AI 结果仍是引理搜索”。',
    keywords: ['三类能力', 'Lemma Search', 'Structure Discovery', 'miniF2F'],
    literatureIds: ['doc-structure-discovery-01', 'doc-minif2f-01', 'doc-leandojo-01']
  },
  {
    index: 12,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '认识论核心：内在张力如何逼出隐藏刚性',
    subtitle: 'Additive–Multiplicative Tension 的跨域母体',
    bullets: [
      '**数论侧**：加法失败强迫乘法刚性 → 代数矛盾（结构发现专论的核心图景）。',
      '**一般形式**：异质规则张力 → 全局隐藏刚性 → 概念性结论。',
      '**文社哲母体**：微观自利 vs 宏观法权；规范理想 vs 物质实践——都是张力场。',
      '**启发**：洞见在**中间结构链条**，不在“非 P→矛盾”空壳。'
    ],
    notes: '开场最哲学味的一页。文献仍挂结构发现底本。',
    keywords: ['内在张力', '隐藏刚性', '结构链条', '结构发现'],
    literatureIds: ['doc-structure-discovery-01']
  },
  {
    index: 13,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '社科映射：个体理性与宏观秩序的结构性张力',
    subtitle: '反常命题 → 约束传播 → 制度拓扑必然性',
    bullets: [
      '**张力模型**：微观分散自利 vs 宏观法权/信贷/权力网络。',
      '**结构发现路径**：假设合作均衡失败 → 多智能体博弈传播契约受挫 → 观测刚性代理人层级 / 黑市拓扑（工程样板可对照 **FSM 出场/进场解耦**：门禁与提案分离）。',
      '**结论**：崩溃未必是偶然，可能是约束传播下的拓扑必然——罗尔斯/明清沙盒是缩微切片。'
    ],
    notes: '拧 scarcity = 加法失败→刚性涌现。可选挂 doc-fsm-trading-01 作状态机解耦隐喻。',
    keywords: ['制度拓扑', '多智能体', 'FSM', '约束传播'],
    literatureIds: ['doc-structure-discovery-01', 'doc-fsm-trading-01', 'doc-generative-agents-pdf']
  },
  {
    index: 14,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '人文与哲学：语义张力 · 先验论证的计算化',
    subtitle: '不可通约性突变 / 形而上学应力分析仪',
    bullets: [
      '**观念史**：不止词频（第一类）；要找不可通约时逼出的代偿隐喻 / 意识形态闭环。',
      '**理论哲学**：先验反思同构于反证逼刚性——裂缝蔓延须补哪些先验范畴。',
      '**可计算先例**：**Benzmüller–Paleo** 将哥德尔本体论论证机械化（Isabelle/HOL），证明“形而上学论证可进证明助手”——后文 P.70 展开。',
      '**角色重估**：AI 当概念体系的应力分析仪，不当散文写手。'
    ],
    notes: '预告第五章哥德尔页；知识库 doc-godel-ontological-01。',
    keywords: ['语义张力', '先验论证', '哥德尔本体论', '形式化'],
    literatureIds: ['doc-godel-ontological-01', 'doc-structure-discovery-01']
  },
  {
    index: 15,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '架构融合：Type-3 结构发现 Harness',
    subtitle: '不为对话框灵光一闪，而为约束传播与可失败门禁',
    details:
      '反例/反常假设注入 × 负知识拦截 → 局部约束传播 → 寻找隐藏不变量 → Validation Gates → 关键引理溯源树\n工程对照：ReAct（推理⊗行动）· Reflexion（语言反馈记忆）· SWE-agent ACI（接口即 Harness）· APOLLO（编译器修复环）',
    bullets: [
      '**约束传播引擎**：禁止跳写结论；局部→邻域→全局不变量。',
      '**结构刚性门（Exit Non-Zero）**：中间机制须有刚性预测力；只能 Ad-hoc 补丁则退回。',
      '**文献工程化**：同一模型换 **SWE-agent ACI** / **Reflexion** 记忆环，成功率可差数倍——印证“差距在那一圈”。',
      '**本场演示**：收束段 Harness 面板是 Type-3 **可开关原型**。'
    ],
    notes: '对照 details。打开知识库检索 SWE-agent / Reflexion / APOLLO。',
    keywords: ['Type-3 Harness', 'SWE-agent', 'Reflexion', 'ReAct', 'Exit Non-Zero'],
    literatureIds: [
      'doc-sweagent-01',
      'doc-reflexion-01',
      'doc-react-01',
      'doc-apollo-01',
      'doc-fsm-trading-01'
    ]
  },
  {
    index: 16,
    sectionNumber: 0,
    sectionTitle: '开场论点 · 结构发现',
    title: '关键提问：那个中间引理，究竟是谁想到的？',
    subtitle: 'Generation Trajectory · Audit Log · 人机协作 vs 自主结构发现',
    bullets: [
      '**归因问题**：关键中间结构是人类提示喂入，还是推演轨迹涌现？（结构发现专论的核心公信力门槛。）',
      '**Harness 强制**：Append-only 审计日志 + 决策分叉；节点标注 Agent 自主 / 人类注入。',
      '**对照 Lean 生态**：Lean Copilot / LeanDojo 强调人机协作与可复现工具链——文社哲同样需要可回放轨迹，而非事后盖章。'
    ],
    notes: '学术伦理页。预告收束段审计树。',
    keywords: ['关键引理', 'Audit Log', '归因', 'Lean Copilot', 'LeanDojo'],
    literatureIds: ['doc-structure-discovery-01', 'doc-lean-copilot-01', 'doc-leandojo-01']
  },
  {
    index: 17,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '方法论收束：Agent = Model + Harness',
    subtitle: '为文社哲外挂“类 Lean”的学术治理层',
    details:
      'Prompt / Context 只是建议；Harness 才是规则。\n史料沙箱 × 负知识 × Exit Non-Zero × 审计分叉 × Type-3 约束传播\n原典：Böckeler《Harness engineering》· Ethan Jiang《AI-Coding》· 公式 Agent = Model + Harness',
    bullets: [
      '**失败诊断**：文社哲用大模型常败在只调词与塞资料，缺少运行边界与验证门禁。',
      '**原典公式**：**Birgitta Böckeler**——Harness = 智能体中除模型外的一切；**AI-Coding** 五类范式：Prompt→Context→Harness→Loop→Graph，分界是“管生成 ≠ 管执行”。',
      '**证据链**：同一模型换 harness，交付可差数倍（AI-Coding 引 Codex/SWE 实测）；SWE-agent 证明**接口设计**即 Harness。',
      '**本场演示**：收束段开「Harness 示范」——可失败门禁与审计树，而非假装已裁决真理。'
    ],
    notes: '必挂知识库：doc-boeckeler-harness-01、doc-aicoding-01/02、doc-sweagent-01。',
    keywords: ['Harness', 'Agent = Model + Harness', 'Böckeler', 'AI-Coding', 'SWE-agent'],
    literatureIds: [
      'doc-boeckeler-harness-01',
      'doc-aicoding-01',
      'doc-aicoding-02',
      'doc-sweagent-01',
      'doc-react-01',
      'doc-reflexion-01'
    ]
  },
  {
    index: 18,
    sectionNumber: 0,
    sectionTitle: '开场论点',
    title: '学者新护城河与本场方向',
    subtitle: '平庸停在第一/二类；顶尖者搭建张力场与马鞍',
    bullets: [
      '**平庸路径**：总结文献、拟合回归、生成八股——停在 Calculator / Lemma。',
      '**顶尖路径**：设计微观–宏观、规范–事实的**张力场**，约束模型经受反例与传播链条（结构发现 + Harness）。',
      '**护城河**：对 **Nontrivial Problem** 的敏感度 + 为 AI 架设足以逼出洞见的马鞍。',
      '**本场路线**：六章讲稿 + 三次真沙盒 + 共议 + Type-3 示范——文献库已预装本开场全部锚点论文，翻页可检索。'
    ],
    notes: '总收束。提示：右侧知识库按页 literatureIds / 关键词检索。',
    keywords: ['护城河', '张力场', 'Type-3', '文献库', '研讨方向'],
    literatureIds: ['doc-structure-discovery-01', 'doc-boeckeler-harness-01', 'doc-dfm-01']
  }
];

export const FRAMING_SLIDE_COUNT = FRAMING_SLIDES.length;
