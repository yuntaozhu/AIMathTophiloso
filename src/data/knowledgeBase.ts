import { DocumentChunk } from '../types';

export const CORE_DOCUMENTS: DocumentChunk[] = [
  // 1. 邓煜：无穷维相空间与偏微分方程奇异性
  {
    id: "doc-deng-01",
    source_title: "邓煜：无穷维相空间中的奇异性景观与 AGI 的认知边界",
    chunk_text: `邓煜（2026年菲尔兹奖得主）提出了偏微分方程（PDE）奇异性分析的五重认知阶梯：
第零阶：存在性（Existence）——单点目击者的局限。通过变分山路引理或维里恒等式证明有限时间爆破的存在，但这仅相当于在参数空间中找到单条发散轨道，机器学习优化也能拟合单点。
第一阶：解空间中的测度（Measure）——无穷维下的统计必然性。根据泛函分析 Haar 测度非存在性定理，无穷维希尔伯特空间不存在平移不变的勒贝格测度。Jean Bourgain 利用高斯随机场构造加权维纳测度与不变吉布斯测度，揭示了从几乎必然适定区到正测度爆破的相变过程。`,
    embedding: [],
    metadata: {
      page: "3-4",
      section: "认知阶梯：偏微分方程奇异性理论的深层问题体系",
      year: 2026,
      authors: "深度前沿交叉研究组 / 邓煜",
      keywords: ["偏微分方程", "Bourgain测度", "无穷维相空间", "吉布斯测度"]
    }
  },
  {
    id: "doc-deng-02",
    source_title: "邓煜：无穷维相空间中的奇异性景观与 AGI 的认知边界",
    chunk_text: `第二阶：相空间流形的“（余）维数”（Codimension）。考察鞍点稳态解 Q 的线性化算子 L = -Δ - f'(Q)。若仅存在唯一正不稳定本征模（k=1），则中心稳定流形 W_cs(Q) 在相空间中具有严格余维数 1，作为分离全局耗散与有限时间爆破的超曲面相界（Separatrix）。若 k>1 则构成更高余维数流形，高余维数流形在无监督随机采样中属于严格零测集，这导致大模型的“高余维数采样诅咒”（Curse of Codimension）。
第三阶：时空奇异集与吸引盆边界的分形拓扑（Dbox ≈ 1.291 > 1）。吸引盆分界线并非平滑曲面，而是呈现 Cantor 尘埃状的复杂自相似相界。`,
    embedding: [],
    metadata: {
      page: "4-7",
      section: "不变流形理论与分形拓扑边界",
      year: 2026,
      authors: "深度前沿交叉研究组 / 邓煜",
      keywords: ["余维数-1", "中心稳定流形", "分形维数", "采样诅咒"]
    }
  },
  {
    id: "doc-deng-03",
    source_title: "邓煜：无穷维相空间中的奇异性景观与 AGI 的认知边界",
    chunk_text: `第四阶：孤子分辨猜想（Soliton Resolution Conjecture）与奇异性的完全模空间分类（Complete Moduli Space Classification）。在极限时间 t -> T*，相空间中的任意解正交分解为有限个调制孤子加上线性辐射色散波与趋向零的高阶误差项。分类包括 Type-I 自相似坍缩与 Type-II 能量聚集（Bubbling）。
邓煜的“波前”（Wavefront）隐喻指出：AI 迭代时间尺度（1~2年）明显小于人类科学演化尺度（10~100年），波前瞬间具有剧烈局部梯度，但在长程相互作用下终将向全局平衡态松弛。`,
    embedding: [],
    metadata: {
      page: "5, 12",
      section: "孤子分辨猜想与波前隐喻",
      year: 2026,
      authors: "深度前沿交叉研究组 / 邓煜",
      keywords: ["孤子分辨猜想", "波前隐喻", "时间尺度错配", "完全分类"]
    }
  },

  // 2. 特里斯坦·布克马斯特与阿尔珀厄 / 科尔多瓦：流体力学奇异性与千禧年难题
  {
    id: "doc-buckmaster-01",
    source_title: "特里斯坦·布克马斯特：关于千禧年数学难题突破与公开声明（statement_zh.pdf）",
    chunk_text: `【出处：PDF/statement_zh.pdf · 2026-09-08】纽约大学库朗研究所正教授特里斯坦·布克马斯特与 Anthropic 数学家莱文特·阿尔珀厄正式公开：在光滑外力驱动（smooth forcing）下，不可压缩多孔介质方程（IPM）、布辛涅斯克方程（Boussinesq）以及三维不可压缩欧拉方程（3D Incompressible Euler）存在有限时间爆破；论文手稿与 Lean 4 代码同步公开。
纲领源流：整体构想归功于迭戈·科尔多瓦与路易斯·马丁内斯-佐罗亚——他们在粗糙外力下先证明爆破；布克马斯特–阿尔珀厄借助大模型将其推进至光滑外力并攻克三维欧拉。次耗散纳维-斯托克斯爆破“确信已掌握”，但 Lean 形式化尚未完成故未发布。
时间线关键句：2026-08-15 取得布辛涅斯克与欧拉爆破证明；8-22 在 Lean 交互式定理证明器中完成全部逻辑链条的严格形式化验证——作者称之为数学界的“深蓝对决卡斯帕罗夫时刻”（A Deep Blue-Kasparov moment）。`,
    embedding: [],
    metadata: {
      page: "§1–5 / p.1-3",
      section: "三大突破性成果 · 纲领源流 · 深蓝时刻",
      year: 2026,
      authors: "特里斯坦·布克马斯特, 莱文特·阿尔珀厄",
      keywords: ["Navier-Stokes", "3D Euler", "光滑外力爆破", "Lean 4", "深蓝时刻", "statement_zh"],
      domain: "流体 PDE / 形式化验证",
      category: "PDF/statement_zh.pdf"
    }
  },
  {
    id: "doc-quanta-01",
    source_title: "Quanta Magazine：AI 攻克数学界百万元千禧年大奖难题之一",
    chunk_text: `克雷数学研究所设立的千禧年难题中，查尔斯·费弗曼（Charles Fefferman）明确给出了选项(C)与(D)：证明在光滑外力驱动下三维纳维-斯托克斯方程存在有限时间爆破。
科尔多瓦与马丁内斯-佐罗亚构造了一个由无穷多层非奇异解叠合而成的自相似无限级联，在局域点将动能与涡量无限聚焦，最终诱发奇点。人机协同通过并行探索与 Lean 形式化核验，完成了数学界的“深蓝对决卡斯帕罗夫时刻”。`,
    embedding: [],
    metadata: {
      page: "2-4",
      section: "千禧年大奖难题判定选项与无限级联",
      year: 2026,
      authors: "康斯坦丁·卡卡埃斯 (Konstantin Kakaes)",
      keywords: ["千禧年大奖", "费弗曼命题", "涡量聚焦", "深蓝时刻"]
    }
  },

  // —— 本地 PDF/ 目录原文入库（Lean 协作与结构发现）——
  {
    id: "doc-apollo-01",
    source_title: "APOLLO: Automated LLM and Lean Collaboration for Advanced Formal Reasoning",
    chunk_text: `【出处：PDF/APOLLO Automated LLM and Lean Collaboration for Advanced Formal Reasoning.pdf · NeurIPS 2025 · arXiv:2505.05758】Formal verification systems such as Lean can check whether a formal proof is correct almost instantaneously, but generating a completely correct formal proof with LLMs remains formidable. The common approach prompts the LLM thousands of times until one proof passes—compiler feedback (syntax errors, incorrect tactics, open goals) is largely unused.
APOLLO (Automated PrOof repair via LLM and Lean cOllaboration) is a modular, model-agnostic agentic framework: the LLM generates proofs; agents analyze them, fix syntax, identify mistakes via Lean, isolate failing sub-lemmas, call automated solvers, and re-invoke the LLM on remaining goals with a low top-K budget; repaired sub-proofs are recombined and reverified.
On miniF2F, APOLLO reaches 84.9% SOTA among sub-8B models (Aug 2025) with sampling budget <100; raises Goedel-Prover-SFT to 65.6% while cutting sample complexity from 25,600 to a few hundred. Key claim: targeted, compiler-guided repair of LLM outputs yields dramatic gains—Lean’s trusted kernel verdict remains binary True/False.`,
    embedding: [],
    metadata: {
      page: "Abstract / §1–2",
      section: "Apollo pipeline vs whole-proof generation",
      year: 2025,
      authors: "Azim Ospanov, Farzan Farnia, Roozbeh Yousefzadeh",
      keywords: ["APOLLO", "Lean 4", "proof repair", "compiler feedback", "miniF2F", "ATP", "Harness"],
      domain: "数理逻辑与形式化方法",
      category: "PDF/APOLLO Automated LLM and Lean Collaboration for Advanced Formal Reasoning.pdf"
    }
  },
  {
    id: "doc-lean-copilot-01",
    source_title: "Lean Copilot: Large Language Models as Copilots for Theorem Proving in Lean",
    chunk_text: `【出处：PDF/Lean Copilot Large Language Models as Copilots.pdf · NeuS 2025 · arXiv:2404.12534】Neural theorem proving combines LLMs with proof assistants such as Lean, where formal proofs can be rigorously verified, leaving no room for hallucination. Existing autonomous provers wrap Lean as a gym and interact only on a backend server—often failing on truly novel theorems outside the training domain.
Lean Copilot treats LLMs as copilots: run LLM inference natively in Lean so humans guide overall strategy while models ease routine labor (tactic suggestion SUGGEST_TACTICS, proof search SEARCH_PROOFS, premise selection SELECT_PREMISES). On the Mathematics in Lean textbook, Lean Copilot needs 2.08 manually-entered proof steps on average vs AESOP’s 3.86; automates 74.2% of steps (AESOP 40.1%).
对本场：这正是“Model 提案 + Lean/人机 Harness 门禁”的工程原型——协作而非黑盒整证抛掷。`,
    embedding: [],
    metadata: {
      page: "Abstract / §1",
      section: "Copilot tools in Lean workflow",
      year: 2025,
      authors: "Peiyang Song, Kaiyu Yang, Anima Anandkumar",
      keywords: ["Lean Copilot", "Lean 4", "Mathlib", "tactic", "neuro-symbolic", "人机协作", "Harness"],
      domain: "数理逻辑与形式化方法",
      category: "PDF/Lean Copilot Large Language Models as Copilots.pdf"
    }
  },
  {
    id: "doc-lean-euler-bridge-01",
    source_title: "布克马斯特声明摘录：Lean 形式化与人机协同的深蓝时刻",
    chunk_text: `【出处：PDF/statement_zh.pdf §3–5】作者坦陈：大模型原始证明一度“最为骇人听闻、不堪卒读”，但约一周后成功在 Lean 交互式定理证明器中完成全部逻辑链条的严格形式化验证；随后日以继夜把机器推演重构成人类可读文本。
范式判断：“具体的数学定理结论本身并非最关键的核心。真正具有震古烁今意义的，是人类数学家与大语言模型协同，如今竟然能够在区区一个月的时间里，彻底攻克下如此庞大深邃的一揽子深水区难题……这是数学界的深蓝对决卡斯帕罗夫时刻。”
机制映射：System 1（LLM/搜索提案）可错且可“劣质”；System 2（Lean 核验）决定可否公开复核。文社哲若缺同等可失败编译器，仅有流畅文稿不足以称范式突破。`,
    embedding: [],
    metadata: {
      page: "§3–5",
      section: "个人协作模式 · 深蓝时刻",
      year: 2026,
      authors: "特里斯坦·布克马斯特（声明）",
      keywords: ["Lean 4", "3D Euler", "深蓝时刻", "System 1", "System 2", "形式验证", "Harness"],
      domain: "可计算认识论 / 形式化方法",
      category: "PDF/statement_zh.pdf"
    }
  },
  {
    id: "doc-structure-discovery-01",
    source_title: "从证明搜索到结构发现：AI 数学的另一种能力（Liouville–Goldbach）",
    chunk_text: `【出处：PDF/从证明搜索到结构发现_AI数学的另一种能力.pdf】学术价值不只在“又解决一个开放问题”，而在能力类型：过去许多 AI 数学成果走“搜索空间 → 找到 witness”；此处若证明路线属实，则更接近：假设反例存在 → 局部约束强迫全局代数结构 → 证明该结构不可能 → 矛盾。
三种粗分能力：（1）calculator/searcher——海量候选中找特例；（2）lemma/formal proof search——在引理库上搜索推导路线（Lean/Isabelle 上不少 AI 结果属此类）；（3）structure discovery——从反例假设逼出隐藏不变量与刚性。Lean 早就证明大量 by_contra；稀缺的是发现“非 P 迫使 λ(n) 符号系统具有某种全局结构”的中间链条。
对本场 Type-3 结构发现页：中间引理链条如何被发现，比反证法框架本身重要。`,
    embedding: [],
    metadata: {
      page: "01–03 / 05",
      section: "问题分量 · 证明形态 · 三种能力",
      year: 2026,
      authors: "研讨策展整理（据所提供回答；涉及生成过程的陈述未作独立核验）",
      keywords: ["结构发现", "Liouville-Goldbach", "parity obstruction", "Type-3", "Lean", "反证法"],
      domain: "可计算认识论",
      category: "PDF/从证明搜索到结构发现_AI数学的另一种能力.pdf"
    }
  },

  // —— AI Coding / Harness 工程纲领（开场收束公式底本）——
  {
    id: "doc-aicoding-01",
    source_title: "控制权往哪里移：AI Coding 的工程演变（Ethan Jiang）",
    chunk_text: `【出处：PDF/AI-Coding.pdf · Ethan Jiang】从 Coding 切入，但问题是一切 AI 交付的质量：做错了能不能查（可追溯）、长期不越跑越偏（可治理）、谁说了算（权责清晰）。
五类范式按控制权外移依次出现：（1）Prompt Engineering——管它说什么；（2）Context Engineering——管它能看到什么；（3）Harness Engineering——把模型圈进受控环境（权限/沙箱/验证门禁/执行记录）；（4）Loop Engineering——多轮互相影响（触发·验证·停止·记忆）；（5）Graph Engineering——多 agent 编排为图。
分界：前两类只管生成，后三类才管“这一步能不能发生”。管生成 ≠ 管执行。`,
    embedding: [],
    metadata: {
      page: "Overview / Five Paradigms",
      section: "五类范式与生成/执行分界",
      year: 2026,
      authors: "Ethan Jiang",
      keywords: ["Harness", "Prompt", "Context", "Loop", "Graph", "交付质量", "Agent"],
      domain: "科学哲学与方法论",
      category: "PDF/AI-Coding.pdf"
    }
  },
  {
    id: "doc-aicoding-02",
    source_title: "Agent = Model + Harness：那一圈决定交付差距",
    chunk_text: `【出处：PDF/AI-Coding.pdf】终点公式：Agent = Model + Harness。Birgitta Böckeler（martinfowler.com, 2026-04）：harness = 智能体中除模型以外的一切。
Harness 在模型外做九件事：执行循环、工具集、执行环境、上下文管理、状态与记忆、反馈与验证、安全控制、编排、扩展接口——模型是大脑，这九件事是身体。
证据：同一模型换 harness，ARC-AGI-3 上 GPT-5.6 Sol 从 13.3%→38.3%、输出 token 约 1/6（Codex harness 开源）；Claw-SWE-Bench 上同模型 minimal 19.1% vs 完整 adapter 73.4%。能力看模型，差距看那一圈。
对本场：文社哲移植的不是更好的 Prompt，而是可失败的 Harness（史料沙箱×门禁×审计）。`,
    embedding: [],
    metadata: {
      page: "Harness Matters",
      section: "公式 · 九件事 · 分层效应证据",
      year: 2026,
      authors: "Ethan Jiang（引 Böckeler / OpenAI Codex harness）",
      keywords: ["Agent = Model + Harness", "验证门禁", "沙箱", "可追溯", "ARC-AGI"],
      domain: "科学哲学与方法论",
      category: "PDF/AI-Coding.pdf"
    }
  },

  // 3. 哈维·弗里德曼：具体数学不完备性与逆向数学
  {
    id: "doc-friedman-01",
    source_title: "哈维·弗里德曼：具体数学不完备性与逆向数学（Reverse Mathematics）",
    chunk_text: `数理逻辑巨擘哈维·弗里德曼（Harvey Friedman）建立了“具体数学不完备性”（Concrete Incompleteness）纲领。他证明了诸如有理立方体（Rational Cube）组合嵌入定理等看似初等微观的有限离散数学命题，在 ZFC 公理系统内不可证，其严格真值必然依赖于超越常规集合论的极高阶“大基数”（Large Cardinals）公理（如马洛基数 Mahlo、不可达基数）。
认识论映射：在有限、局部的社会行为人系统中，系统内部的稳定契约与无冲突状态，常常无法在系统内生的一阶规则中实现自洽闭合，必然需要借由高阶元规则或外生宪制进行锚定。`,
    embedding: [],
    metadata: {
      page: "逻辑学专论",
      section: "逆向数学与有理立方体模型",
      year: 2025,
      authors: "哈维·弗里德曼 (Harvey Friedman)",
      keywords: ["具体数学不完备性", "逆向数学", "有理立方体", "大基数"]
    }
  },

  // 4. 四色定理与 O(n log n) 并行归约
  {
    id: "doc-fourcolor-01",
    source_title: "四色定理的 O(n log n) 高度并行归约算法与平坦区域搜索",
    chunk_text: `四色定理的现代计算复杂度跃迁：从传统 Kempe 链的深度回溯，演进为基于平面图局部对偶结构的 O(n log n) 高度并行归约算法。该算法的核心数学洞见在于识别图空间中的“平坦区域”（Flat Basins）与对称不可约构型集合。
在计算复杂性理论中，平坦区域意味着目标函数在此处梯度近似为零，传统梯度下降或贪心策略极易在此迷失。而在分布式搜索中，平坦区域正是相变探索的最佳缓冲带，能够为全局拓扑重布线提供无摩擦的构型过渡通道。`,
    embedding: [],
    metadata: {
      page: "计算拓扑专论",
      section: "四色定理的现代并行归约与相空间平坦区域",
      year: 2025,
      authors: "复杂网络与计算拓扑联合课题组",
      keywords: ["四色定理", "O(n log n)", "并行归约", "平坦区域", "复杂网络"]
    }
  },

  // 5. 热力学计算底座：朗之万动力学与概率比特（p-bit）网络
  {
    id: "doc-thermo-01",
    source_title: "热力学计算底座：连续朗之万动力学与概率比特网络",
    chunk_text: `为突破传统冯·诺依曼架构在 NP-Hard 组合优化问题上的“算力与能耗之墙”，热力学计算利用自然物理系统的连续朗之万动力学（Langevin Dynamics）方程：
dx/dt = -∇V(x) + √(2k_B T) · η(t)
通过磁隧道结（MTJ）或光学参量振荡器构建概率比特（p-bit）耦合网络。系统无须进行穷举搜索，而是依靠热噪声物理涨落，以极高能效在飞秒尺度自发弛豫至系统能量泛函的全局玻尔兹曼-吉布斯基态分布，实现复杂约束满足问题的物理降维自发求解。`,
    embedding: [],
    metadata: {
      page: "物理计算前沿",
      section: "朗之万动力学、p-bit与自发吉布斯收敛",
      year: 2026,
      authors: "统计物理与非常规计算实验室",
      keywords: ["热力学计算", "朗之万动力学", "p-bit", "吉布斯基态", "能耗之墙"]
    }
  },

  // 6. 斯坦福生成式智能体：Joon Sung Park
  {
    id: "doc-joonpark-01",
    source_title: "Joon Sung Park：生成式智能体交互模拟微架构（Smallville）",
    chunk_text: `斯坦福大学 Joon Sung Park 团队在《Generative Agents: Interactive Simulacra of Human Behavior》中提出四大核心工程机制：
1. 记忆流（Memory Stream）：包含感知记忆的完整时间序列。记忆检索打分函数：
Score = α · Recency (指数衰减) + β · Importance (LLM赋权1-10) + γ · Relevance (余弦相似度)
2. 递归反思树（Reflection Tree）：定期调取近期高重要度记忆，向LLM询问“这表明个体具有何种高层动机”，从叶节点具体动作提炼至根节点身份自我认同。
3. 自顶向下规划（Top-Down Planning）：日规划 -> 小时计划 -> 5-15分钟动作细化，遭遇环境突变时触发重规划（Re-planning）。
4. 环境场景图（Spatial Scene Graph）：以树状拓扑表示住宅、工作区与物品的可通行与可交互状态。`,
    embedding: [],
    metadata: {
      page: "1-12",
      section: "Generative Agents 核心微架构解析",
      year: 2023,
      authors: "Joon Sung Park et al. (Stanford & Google)",
      keywords: ["Generative Agents", "Smallville", "记忆流", "反思树", "三维检索"]
    }
  },

  // 7. 杨凌等：Discovery Foundation Models (DFM)
  {
    id: "doc-dfm-01",
    source_title: "Discovery Foundation Models: Toward Open-Ended Discovery Intelligence",
    chunk_text: `【出处：PDF/Discovery Foundation Models Toward Open-Ended Discovery Intelligence.pdf · arXiv:2609.15973 · Ling Yang, Zhenfei Yin, Yingcheng Wu · 2026-09】Foundation models 已从学习既有知识，推进到经由行动/工具/结果反馈学习；下一前沿是 Discovery Intelligence——参与新问题、表征、解释与知识被创造的过程本身。
DFM 在可修订研究状态上运转，耦合七大能力：problem discovery / formulation / representation construction / hypothesis formation / intervention / evidence-grounded revision / continual discovery improvement。实例化系统 Zetema：显式研究状态动力学、验证与实验门控、外部 grounding、跨任务 Discovery Skill 演化；GALILEO 将 Dry-Lab 推理与 Wet-Lab 实验闭环用于真实治疗发现。
对本场：相对“解题 Agent”，DFM 要求可失败验证门与可回滚研究状态——与 Harness / Type-3 同构。`,
    embedding: [],
    metadata: {
      page: "Abstract / Fig.1 / §3–5",
      section: "Discovery Intelligence · Zetema · GALILEO",
      year: 2026,
      authors: "Ling Yang, Zhenfei Yin, Yingcheng Wu (PhAI Labs)",
      keywords: ["DFM", "Zetema", "GALILEO", "Discovery Intelligence", "验证门控", "研究状态"],
      domain: "科学哲学与方法论",
      category: "PDF/Discovery Foundation Models Toward Open-Ended Discovery Intelligence.pdf"
    }
  },

  // 8. 数字苍蝇与全脑连接组仿真
  {
    id: "doc-cyberfly-01",
    source_title: "数字苍蝇的虚实之境：全脑连接组仿真与空间具身闭环",
    chunk_text: `【出处：PDF/cyberfly_research_report.pdf · 2026-09】基于 MaleCNS v1.0 雄性果蝇完整中枢神经系统（约 166,700 神经元）在 Mac 上仿真，经 Snap Spectacles 投射全息果蝇；动作源自连接组动力学对真实房间的反应，而非硬编码规避脚本。诚实声明：大脑在旁路笔记本上算；另有少量工程辅助模块。
技术祛魅三层：（1）巨纤维等演化硬核反射回路（Zero-Shot）；（2）工程降维补丁；（3）观察者拟人化投射。对比 ANN/RL：突触拓扑决定功能，无需反向传播即可展现复杂反射。
对本场沙盒：具身闭环可演示“因果可观测”，但社科移植必须叠加资源硬约束与博弈，警惕中庸偏置与工程补丁冒充生命。`,
    embedding: [],
    metadata: {
      page: "总览 / §1.2–2.3",
      section: "MaleCNS · Spectacles 闭环 · 灵性祛魅",
      year: 2026,
      authors: "Pavlo Tkachenko & Stijn Spanhove（博文）；研报二次调查",
      keywords: ["MaleCNS", "数字苍蝇", "连接组", "具身智能", "Zero-Shot", "Giant Fiber"],
      domain: "分布式多智能体与博弈",
      category: "PDF/cyberfly_research_report.pdf"
    }
  },
  {
    id: "doc-fsm-trading-01",
    source_title: "基于 FSM 有限状态机与独立出场引擎的量化交易重构方案",
    chunk_text: `【出处：PDF/基于 FSM 有限状态机与独立出场引擎的量化交易重构方案.pdf】病灶：把“平仓”与“开仓”放在同一条件分支，导致不开单、反向死锁、利润坐过山车。方法论：采用有限状态机，拆为独立引擎——STATE_FLAT / STATE_LONG / STATE_SHORT；出场引擎拥有最高独立裁决权，持仓时关闭大级别趋势过滤，只看微观价格与风险。
Two-Step Decoupled Reversal：先 ClosePosition 切回 FLAT 并记录冷却，下一 Tick 再由进场引擎独立评估趋势与冷却——利润先落袋，再决定是否反向。辅以填充模式自适应、MTF 数据就绪可观测、三阶梯利润保护矩阵。
对本场：状态机解耦是可执行认识论的工程样板——门禁（出场）与提案（进场）分离，对应 Harness 的验证/权限分层。`,
    embedding: [],
    metadata: {
      page: "全文 4 页",
      section: "FSM · Exit Engine · Two-Step Reversal",
      year: 2026,
      authors: "量化交易重构方案（据 MQL5 官方文献方法论）",
      keywords: ["FSM", "有限状态机", "出场引擎", "解耦", "死锁", "可执行认识论"],
      domain: "科学哲学与方法论",
      category: "PDF/基于 FSM 有限状态机与独立出场引擎的量化交易重构方案.pdf"
    }
  },
  {
    id: "doc-futures-01",
    source_title: "复数未来与未来研究：后AI研究所知识地图",
    chunk_text: `【出处：PDF/复数未来与未来研究_后AI研究所_压缩版.pdf · 后AI研究所 · 2026】地图并置而非伪造学派谱系：Journal of Futures Studies（知识生产）→ 复数未来（the future → futures）→ UNESCO Futures Literacy Labs（使用未来的能力）→ Jake Dunagan 体验式未来与社会发明 → IFTF 组织化前瞻。
核心主张：未来研究不只是预测，而是持续感知变化、比较路径、暴露假设、设计原型并校准行动的能力。JFS 五条线索：复数未来、批判未来、参与式未来、设计未来、全球南方/亚太视角。人物锚点含 Dator 替代未来、Inayatullah CLA、Riel Miller Futures Literacy。
对本场：反事实沙箱与多宇宙推演需要“复数未来”语法——拒绝把大概率趋势误认为唯一终点。`,
    embedding: [],
    metadata: {
      page: "导言 / §1 JFS",
      section: "复数未来 · Futures Literacy · 分析地图",
      year: 2026,
      authors: "后AI研究所",
      keywords: ["复数未来", "Futures Literacy", "JFS", "IFTF", "反事实", "情景"],
      domain: "一般认识论",
      category: "PDF/复数未来与未来研究_后AI研究所_压缩版.pdf"
    }
  },
      authors: "Pavlo Tkachenko, Stijn Spanhove, Shiu et al. (Nature 2024)",
      keywords: ["MaleCNS", "全脑连接组", "LIF", "DNp01巨纤维", "生物拓扑"],
      domain: "分布式多智能体与博弈"
    }
  },
  // 9. 阿兰·图灵：停机问题与形式判定难题 (1936)
  {
    id: "doc-turing-1936",
    source_title: "阿兰·图灵：论可计算数及其在判定难题中的应用 (1936)",
    chunk_text: `【形式停机问题与通用图灵机状态界限】阿兰·图灵提出 Universal Turing Machine (UTM) 的抽象纸带自动机架构。
核心论证逻辑：通过对可计算序列与机器状态指令表的康托尔对角线法构造，严格证明不存在判定图灵机是否对任意给定输入停机的通用判定算法（Halting Problem 不可判定性）。由此彻底击碎希尔伯特形式化判定终局的理想纲领（Entscheidungsproblem）。
认识论启示：闭合形式系统在可计算算符的演绎中必然蕴含内在不可达状态与无限自指递归困境；可计算界限并非算力工程的临时壁垒，而是数理逻辑与符号构造的本体论先天界限。`,
    embedding: [],
    metadata: {
      page: "230-265",
      section: "Proc. London Math. Soc., Ser. 2, Vol. 42",
      year: 1936,
      authors: "Alan M. Turing",
      keywords: ["可计算性", "停机问题", "图灵机", "判定难题", "形式系统", "不可判定性"],
      domain: "数理逻辑与模型论"
    }
  },
  // 10. 伊曼努尔·康德：纯粹理性批判原典 (1781/1787)
  {
    id: "doc-kant-cpr",
    source_title: "伊曼努尔·康德：纯粹理性批判 (Kritik der reinen Vernunft, 1781/1787)",
    chunk_text: `【先验感性论与知性范畴的认识论奠基】康德在《先验感性论》与《先验分析论》中确立先验唯心论与经验实在论的对勘统摄。
核心命题：感性赋予直观对象（纯形式：空间与时间），知性则通过纯粹先验范畴（因果性、实体、必然性等十二范畴）对杂多经验表象实施统觉的先验综合统一（Transzendentale Einheit der Apperzeption）。物自身（Ding an sich）在本体论上作为认知主体的先验边界不可直达。
现代形式化启示：类型系统与模式匹配（Curry-Howard 同构）构成了代码世界的“先验范畴网格”，为可执行认识论提供不可或缺的类型先决条件。`,
    embedding: [],
    metadata: {
      page: "A19-B34 / B130-169",
      section: "先验分析论：先验范畴演绎与统觉统一",
      year: 1787,
      authors: "Immanuel Kant (蓝公武/邓晓芒 译本对照)",
      keywords: ["纯粹理性批判", "先验范畴", "统觉先验统一", "物自身", "综合先验判断", "先验感性论"],
      domain: "一般认识论"
    }
  },
  // 11. 马丁·海德格尔：存在与时间 (Sein und Zeit, 1927)
  {
    id: "doc-heidegger-bt",
    source_title: "马丁·海德格尔：存在与时间 (Sein und Zeit, 1927)",
    chunk_text: `【此在的在世之在与上手状态的现象学解构】海德格尔直指传统形而上学与认识论的范畴盲区：将世界先验割裂为知觉主体（Subjekt）与在手客观实体（Vorhandenheit）乃是本体论遗忘。
核心分析：此在（Dasein）的原初存在方式是“在世界之中存在”（In-der-Welt-sein）。器物并非在理论注视中被认知，而是在前理论的切近操劳中呈现为“上手状态”（Zuhandenheit）；唯有当器物破损断裂时，其在手性才被对象化凸显。
警惕“代码本体论暴政”：任何形式化离散建模都是对活体生活世界意义链条的降维折叠，计算模型必须时刻敬畏保罗·利科的“意义剩余”与历史诠释学视域。`,
    embedding: [],
    metadata: {
      page: "§15-§18 / §69",
      section: "第一篇第三章：世界的周围世界性与此在的在世存在",
      year: 1927,
      authors: "Martin Heidegger (陈嘉映 / 孙周兴 译本对照)",
      keywords: ["存在与时间", "此在", "上手状态", "在手状态", "在世之在", "现象学", "代码本体论暴政"],
      domain: "一般认识论"
    }
  },
  // 12. 沃纳·祖雷克：退相干与量子达尔文主义 (2003)
  {
    id: "doc-zurek-decoherence",
    source_title: "沃纳·祖雷克：退相干、环境诱导超选择与经典实在起源 (2003)",
    chunk_text: `【环境诱导超选择 (Einselection) 与量子退相干动力学】祖雷克在开放量子系统主方程理论中揭示经典客观世界的物理涌现机制。
核心物理机制：宏观环境充当天然测量仪器，与微观量子态发生极速不可逆纠缠，系统约化密度矩阵的非对角相干干涉项以指数级速率衰减为零（Decoherence）；唯有与系统-环境互作用哈密顿量对易的指针态（Pointer States）能够存活，形成稳固的信息冗余拷贝。
计算与复杂网络映射：在连续朗之万动力学沙盘中，智能体相互作用充当微观行为的“环境退相干过滤器”，使多智能体博弈的概率相界沉淀为经典稳定的宏观制度与文化规范。`,
    embedding: [],
    metadata: {
      page: "715-775",
      section: "Reviews of Modern Physics, Vol. 75, No. 3",
      year: 2003,
      authors: "Wojciech H. Zurek",
      keywords: ["退相干", "环境超选择", "指针态", "密度矩阵", "经典实在涌现", "量子达尔文主义"],
      domain: "热力学与物理计算"
    }
  },
  // 13. 卡尔·波普尔：科学发现的逻辑 (Logik der Forschung, 1934)
  {
    id: "doc-popper-lsd",
    source_title: "卡尔·波普尔：科学发现的逻辑 (The Logic of Scientific Discovery, 1934/1959)",
    chunk_text: `【证伪主义原则与划界标准的逻辑不对称性】波普尔在《科学发现的逻辑》中彻底动摇归纳逻辑与经验证实原则的认识论合法性。
核心命题：归纳推理在形式逻辑上不可能保证全称命题的必然真理性；证实与证伪存在先验的逻辑不对称性（Modus Tollens）。一个理论如果不可证伪，便排除了任何潜在的反驳经验，因此不属于经验科学。科学的进步是一部由大胆猜想与严厉反驳交织构成的试错史。
形式化与计算映射：在代码与系统工程中，单元测试（Unit Testing）只能证明缺陷的存在（反例），永远无法证明程序不存在任何 Bug；Lean 4/Coq 形式化证明系统正是在符号演绎层面践行波普尔的演绎检验模型。`,
    embedding: [],
    metadata: {
      page: "§1-§10 / §19-§24",
      section: "第一篇：科学的逻辑导论；第四篇：可证伪性",
      year: 1934,
      authors: "Karl Popper (查汝强 / 邱仁宗 译本对照)",
      keywords: ["科学发现的逻辑", "波普尔", "证伪主义", "划界标准", "否定后件律", "归纳疑难", "逼真度", "试错法"],
      domain: "科学哲学与方法论"
    }
  },
  // 14. 托马斯·库恩：科学革命的结构 (The Structure of Scientific Revolutions, 1962)
  {
    id: "doc-kuhn-ssr",
    source_title: "托马斯·库恩：科学革命的结构 (The Structure of Scientific Revolutions, 1962)",
    chunk_text: `【常规科学解谜、反常积累与不可通约的范式转换】库恩揭示科学发展绝非线性连续的真理积累，而是被社会认识论塑造的历史断裂。
核心命题：常规科学（Normal Science）是在被共同体共识所统治的“范式（Paradigm）”内进行的解谜活动。当反常（Anomalies）大量涌现并引发科学共同体的普遍危机时，触发非累积性的“科学革命”；新旧范式之间在概念定义、观测网络与价值尺度上具有“不可通约性（Incommensurability）”，其范式转换犹如认知格式塔心理学的整体反转。
计算与复杂网络映射：从经典冯·诺依曼串行架构到大规模自回归分布式神经网络的变迁，本质上是一场计算本体论范式（Computational Paradigm）的断裂式革命。`,
    embedding: [],
    metadata: {
      page: "§II-§V / §IX-§X",
      section: "常规科学的本质与科学革命的机制",
      year: 1962,
      authors: "Thomas S. Kuhn (金吾伦 / 胡新和 译本对照)",
      keywords: ["科学革命的结构", "库恩", "范式", "常规科学", "反常", "不可通约性", "格式塔转换", "科学共同体"],
      domain: "科学哲学与方法论"
    }
  },
  // 15. 威拉德·蒯因：经验论的两个教条 (Two Dogmas of Empiricism, 1951)
  {
    id: "doc-quine-dogmas",
    source_title: "威拉德·蒯因：经验论的两个教条 (Two Dogmas of Empiricism, 1951)",
    chunk_text: `【确认整体论、信念之网与分析-综合两分法的解构】蒯因对现代逻辑经验主义核心信条施以毁灭性批判。
核心命题：不存在孤立于经验事实的纯粹“分析真理”，同义性概念陷入恶性循环；彻底抛弃激进还原论，确立“确认整体论（Confirmation Holism / 迪昂-蒯因命题）”：人类对外部世界的整体信念如同一张相互拉扯的力学之网（Web of Belief），任何单独陈述都不单独面对感觉经验的裁判；边缘的反常经验可以借由调整网中任何节点的信念（包括数理逻辑排中律）来消化。
形式化与系统工程映射：在复杂分布式系统排错（Debug）中，单一错误日志永远无法孤立锁定故障源，是整个网络协议、内存状态、编译器与运行环境整体面对物理世界的失真。`,
    embedding: [],
    metadata: {
      page: "P.20-46",
      section: "Philosophical Review, Vol. 60, No. 1",
      year: 1951,
      authors: "W.V.O. Quine (陈启伟 / 江天骥 译本对照)",
      keywords: ["经验论的两个教条", "蒯因", "确认整体论", "信念之网", "分析综合二分", "迪昂蒯因命题", "非充分决定性"],
      domain: "科学哲学与方法论"
    }
  },
  // 16. 伊姆雷·拉卡托斯：科学研究纲领方法论 (1970)
  {
    id: "doc-lakatos-msrp",
    source_title: "伊姆雷·拉卡托斯：科学研究纲领方法论 (The Methodology of Scientific Research Programmes, 1970)",
    chunk_text: `【硬核、保护带与进步性vs退化性问题转换】拉卡托斯调和了波普尔证伪主义与库恩历史主义的深刻张力。
核心命题：科学评价的基本单位是历时演进的“科学研究纲领（MSRP）”。纲领由不可妥协的“坚硬核（Hard Core）”与吸收反驳的“辅助假说保护带（Protective Belt）”组成；由否定性启发法（禁止证伪矛头对准硬核）与肯定性启发法（引导保护带的数学重构）驱动；纲领是否优越取决于其是否能在理论与经验上实现“进步的问题转换（Progressive Problemshift）”，预测出令人震惊的新事实。
计算架构映射：操作系统内核（Kernel）充当坚硬核，而可插拔驱动与动态链接库形成保护带，通过不断吸收硬件断言异常维持整个计算环境的长程演进。`,
    embedding: [],
    metadata: {
      page: "P.91-196",
      section: "Criticism and the Growth of Knowledge",
      year: 1970,
      authors: "Imre Lakatos (兰征 译本对照)",
      keywords: ["科学研究纲领", "拉卡托斯", "坚硬核", "保护带", "启发法", "进步性问题转移", "退化性问题转移"],
      domain: "科学哲学与方法论"
    }
  },
  // 17. 保罗·费耶阿本德：反对方法 (Against Method, 1975)
  {
    id: "doc-feyerabend-method",
    source_title: "保罗·费耶阿本德：反对方法：无政府主义知识论纲要 (Against Method, 1975)",
    chunk_text: `【认识论无政府主义与反归纳原则：怎么都行】费耶阿本德对科学主义的唯理智论独裁发起最激进的反叛。
核心命题：没有任何单一的、不变的、普遍适用的科学方法论规则在科学史的真实突破中未曾被践踏过；唯一站得住脚的原则只有“怎么都行（Anything Goes）”。主张反归纳法（Counterinduction）与理论增生（Proliferation of Theories）原则——唯有引入与已知最佳经验事实相抵触的激进异端假说，才能暴露旧范式中被日常语言遮蔽的深层偏见；批判科学沙文主义。
计算与认知映射：模拟退火与演化算法必须故意引入随机变异与高熵扰动，才能从局部最优（Local Minimum）的狭隘理智死锁中跳出，实现全局优化空间的充分探索。`,
    embedding: [],
    metadata: {
      page: "§1-§5 / §16-§18",
      section: "无政府主义知识论导引与哥白尼-伽利略案例剖析",
      year: 1975,
      authors: "Paul K. Feyerabend (周昌忠 译本对照)",
      keywords: ["反对方法", "费耶阿本德", "认识论无政府主义", "怎么都行", "理论增生", "反归纳", "科学沙文主义"],
      domain: "科学哲学与方法论"
    }
  },
  // 18. 鲁道夫·卡尔纳普：世界的逻辑构造 (Der logische Aufbau der Welt, 1928)
  {
    id: "doc-carnap-aufbau",
    source_title: "鲁道夫·卡尔纳普：世界的逻辑构造 (Der logische Aufbau der Welt, 1928)",
    chunk_text: `【逻辑实证主义的宪政构造与无意义形而上学命题的消除】卡尔纳普展示了如何用一阶逻辑与类型论公理化奠基全部经验科学。
核心命题：全部有意义的科学命题都必须能够逐级还原为关于基本体验（Elementarerlebnisse）与相似性记忆关系的形式命题。通过准分析（Quasianalyse）算法，从纯主观自指称体验流逐级构造出物理对象、异己心智与社会文化客体；凡不能在构造树上获得经验验证路径的论断，皆属缺乏认知意义的“伪命题（Scheinsätze）”。
现代计算机图谱映射：从原始像素传感器张量（Raw Tensors）到高层抽象本体图谱（Ontological Knowledge Graphs）的层级特征抽象，完美再现了卡尔纳普一个世纪前的形式化构造宏愿。`,
    embedding: [],
    metadata: {
      page: "§61-§85 / §120-§136",
      section: "第二篇：形式研究；第四篇：构造系统的逐级推演",
      year: 1928,
      authors: "Rudolf Carnap (陈启伟 译本对照)",
      keywords: ["世界的逻辑构造", "卡尔纳普", "逻辑实证主义", "基本体验", "准分析", "证实原则", "伪命题消除"],
      domain: "科学哲学与方法论"
    }
  }
];

// Helper to compute rich term-frequency vector representation for RAG matching and cosine similarity
export function extractTerms(text: string): string[] {
  const clean = text.toLowerCase();
  const words = clean
    .replace(/[^\w\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);

  // Chinese bi-grams to capture semantics in unsegmented Chinese literature
  const ngrams: string[] = [];
  const chineseChunks = clean.match(/[\u4e00-\u9fa5]+/g) || [];
  chineseChunks.forEach(chunk => {
    if (chunk.length >= 2) {
      for (let i = 0; i < chunk.length - 1; i++) {
        ngrams.push(chunk.slice(i, i + 2));
      }
    }
  });

  return [...words, ...ngrams];
}

// Build pre-computed embeddings using normalized vocabulary bag-of-words
const VOCAB: string[] = Array.from(
  new Set(
    CORE_DOCUMENTS.flatMap(d =>
      extractTerms(d.source_title + ' ' + d.chunk_text + ' ' + (d.metadata.keywords || []).join(' '))
    )
  )
);

export const DYNAMIC_DOCUMENTS: DocumentChunk[] = [];

export function computeEmbeddingForDoc(doc: DocumentChunk): void {
  const terms = extractTerms(
    doc.source_title + ' ' + doc.chunk_text + ' ' + (doc.metadata.keywords || []).join(' ')
  );
  const termCounts = new Map<string, number>();
  terms.forEach(t => termCounts.set(t, (termCounts.get(t) || 0) + 1));
  
  const vec: number[] = new Array(VOCAB.length).fill(0);
  let sumSq = 0;
  for (let i = 0; i < VOCAB.length; i++) {
    const count = termCounts.get(VOCAB[i]) || 0;
    vec[i] = count;
    sumSq += count * count;
  }
  const norm = Math.sqrt(sumSq) || 1;
  doc.embedding = vec.map(v => v / norm);
}

CORE_DOCUMENTS.forEach(doc => {
  computeEmbeddingForDoc(doc);
});

export function getAllDocuments(): DocumentChunk[] {
  return [...CORE_DOCUMENTS, ...DYNAMIC_DOCUMENTS];
}

export function registerDynamicDocument(doc: DocumentChunk): void {
  const existingIdx = DYNAMIC_DOCUMENTS.findIndex(d => d.id === doc.id);
  computeEmbeddingForDoc(doc);
  if (existingIdx >= 0) {
    DYNAMIC_DOCUMENTS[existingIdx] = doc;
  } else if (!CORE_DOCUMENTS.some(d => d.id === doc.id)) {
    DYNAMIC_DOCUMENTS.push(doc);
  }
}

export function removeDynamicDocument(id: string): void {
  const idx = DYNAMIC_DOCUMENTS.findIndex(d => d.id === id);
  if (idx >= 0) {
    DYNAMIC_DOCUMENTS.splice(idx, 1);
  }
}

export function searchKnowledgeBase(
  query: string,
  topK: number = 4
): { doc: DocumentChunk; similarity: number; rawCosine: number; displaySimilarity: number }[] {
  const queryTerms = extractTerms(query);
  const termCounts = new Map<string, number>();
  queryTerms.forEach(t => termCounts.set(t, (termCounts.get(t) || 0) + 1));

  const qVec: number[] = new Array(VOCAB.length).fill(0);
  let sumSq = 0;
  for (let i = 0; i < VOCAB.length; i++) {
    const count = termCounts.get(VOCAB[i]) || 0;
    qVec[i] = count;
    sumSq += count * count;
  }
  const norm = Math.sqrt(sumSq) || 1;
  const qNorm = qVec.map(v => v / norm);

  const allDocs = getAllDocuments();
  const scored = allDocs.map(doc => {
    let rawCosine = 0;
    if (doc.embedding && doc.embedding.length === VOCAB.length) {
      for (let i = 0; i < VOCAB.length; i++) {
        rawCosine += qNorm[i] * doc.embedding[i];
      }
    }
    // Boost score if keyword matches exactly in title or tags
    const titleMatch = doc.source_title.toLowerCase().includes(query.toLowerCase());
    const keywordMatch = doc.metadata.keywords?.some(k => query.toLowerCase().includes(k.toLowerCase()));
    let boosted = rawCosine;
    if (titleMatch) boosted += 0.25;
    if (keywordMatch) boosted += 0.15;

    // UI 展示用：稀疏 BoW 下 0.15–0.30 已是强相关，映射到可读百分比
    const displaySimilarity = Math.min(0.99, Math.max(0, 0.35 + boosted * 1.8));
    const similarity = Math.min(1.0, Math.max(0.0, boosted));

    return {
      doc,
      /** 门禁用：含关键词加成的原始相关分 */
      similarity,
      rawCosine: Number(rawCosine.toFixed(4)),
      /** 仅供 UI 展示，禁止用于 gate 阈值 */
      displaySimilarity: Number(displaySimilarity.toFixed(3))
    };
  });

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
}

export interface DocumentRecommendation {
  doc: DocumentChunk;
  similarity: number; // 0.0 - 1.0 calibrated similarity
  rawCosine: number;   // Raw vector dot product
  sharedKeywords: string[];
  relevanceReason: string;
}

/**
 * Perform vector cosine similarity search to find the top-K most semantically relevant documents
 * for a given document in the knowledge base.
 */
export function findRelatedDocuments(targetDocId: string, topK: number = 3): DocumentRecommendation[] {
  const allDocs = getAllDocuments();
  const targetDoc = allDocs.find(d => d.id === targetDocId);
  if (!targetDoc || !targetDoc.embedding) return [];

  const candidates = allDocs.filter(d => d.id !== targetDocId);

  const scored = candidates.map(other => {
    let rawCosine = 0;
    if (other.embedding && other.embedding.length === targetDoc.embedding.length) {
      for (let i = 0; i < targetDoc.embedding.length; i++) {
        rawCosine += targetDoc.embedding[i] * other.embedding[i];
      }
    }

    const targetKeywords = (targetDoc.metadata.keywords || []).map(k => k.toLowerCase());
    const shared = (other.metadata.keywords || []).filter(k => 
      targetKeywords.includes(k.toLowerCase())
    );

    const isSameAuthor = Boolean(
      targetDoc.metadata.authors &&
      other.metadata.authors &&
      (targetDoc.metadata.authors.includes(other.metadata.authors) ||
        other.metadata.authors.includes(targetDoc.metadata.authors))
    );

    // Calibrate similarity percentage for human-readable semantic relevance:
    // In high-dimensional sparse bag-of-words/n-gram embeddings, cosine of 0.20-0.30 represents high topical overlap
    let calibrated = 0.48 + rawCosine * 1.6 + shared.length * 0.08 + (isSameAuthor ? 0.12 : 0);
    calibrated = Math.min(0.985, Math.max(0.42, calibrated));

    let relevanceReason = '向量空间词义与概念近邻';
    if (isSameAuthor) {
      relevanceReason = `同作者（${targetDoc.metadata.authors}）理论连续性演进与论述深化`;
    } else if (shared.length > 0) {
      relevanceReason = `共同聚焦核心概念：#${shared.slice(0, 3).join(' #')}`;
    } else if (rawCosine > 0.08) {
      relevanceReason = `数理动力学与认识论论证结构高维重合`;
    } else if (other.metadata.domain && targetDoc.metadata.domain && other.metadata.domain === targetDoc.metadata.domain) {
      relevanceReason = `同属【${targetDoc.metadata.domain}】范式体系`;
    }

    return {
      doc: other,
      similarity: Number(calibrated.toFixed(3)),
      rawCosine: Number(rawCosine.toFixed(3)),
      sharedKeywords: shared,
      relevanceReason
    };
  });

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
}

