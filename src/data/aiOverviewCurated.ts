/**
 * PPT 核心概念的「AI 概览」离线精编（对齐 Google AI Overview 版式）
 * 在线路径失败时直接展示；有 Firecrawl/Gemini 时会与检索结果合并润色。
 */

export interface AiOverviewCitation {
  label: string;
  url?: string;
  extra?: number;
}

export interface AiOverviewBullet {
  title?: string;
  text: string;
  citation?: AiOverviewCitation;
}

export interface AiOverviewSection {
  heading: string;
  paragraphs?: string[];
  bullets?: AiOverviewBullet[];
  /** 简易三列表格（如 Ontology as Code） */
  table?: {
    title?: string;
    columns: string[];
    rows: { label: string; cells: string[] }[];
  };
  /** 内置示意：混淆 DAG */
  diagram?: 'confounding_dag';
}

export interface AiOverviewPayload {
  query: string;
  lead: string;
  /** 导语中需浅蓝高亮的关键句 */
  highlightPhrase?: string;
  sections: AiOverviewSection[];
  followUps?: string[];
  citations?: AiOverviewCitation[];
  source: 'curated' | 'google_search' | 'live_ai' | 'offline_fallback';
}

const CURATED: Record<string, Omit<AiOverviewPayload, 'query' | 'source'>> = {
  'process supervision': {
    lead:
      '在大语言模型（LLM）的训练与推理中，过程监督（Process Supervision）与编译器反馈（Compiler Feedback）是两种非常关键的强化学习与对齐技术。它们的核心哲学都是：“不能只看结果，还得盯过程”。',
    highlightPhrase: '不能只看结果，还得盯过程',
    sections: [
      {
        heading: '一、过程监督 (Process Supervision)',
        paragraphs: [
          '与只奖励/惩罚最终答案的结果监督（Outcome Supervision）相对，过程监督要求对解题中间步骤逐一评估。'
        ],
        bullets: [
          {
            title: '思维链拆解',
            text: 'AI 把复杂问题拆成可检查的步骤序列（Chain of Thought），而不是一次性吐出答案。'
          },
          {
            title: '步骤级评估',
            text: '人类专家或导师模型（ORM/PRM）对每一步打上正确 / 错误 / 风险标签。'
          },
          {
            title: '奖励模型 (PRM)',
            text: 'Process Reward Model 在推理时为候选路径打分，引导搜索走向可核验轨迹（对照 Lean/APOLLO 的编译器反馈）。'
          }
        ]
      },
      {
        heading: '二、与编译器反馈的对照',
        bullets: [
          {
            title: '共同哲学',
            text: '都把“可失败的中间信号”当作训练/修复燃料，而非只赌最终对错。'
          },
          {
            title: '本场映射',
            text: '数学侧：Lean 内核类型检查；文社哲侧：Harness 门禁与沙箱断言。'
          }
        ]
      }
    ],
    followUps: ['Process Reward Model 如何训练？', 'APOLLO 如何用编译器反馈修证明？', '与 Outcome Supervision 的样本效率对比'],
    citations: [
      { label: "Let's Verify Step by Step", url: 'https://arxiv.org/abs/2305.20050' },
      { label: 'APOLLO / Lean', extra: 2 }
    ]
  },
  'lean 内核': {
    lead:
      'Lean 内核（Lean Kernel）是 Lean 定理证明器与编程语言的逻辑核心组件。它实现依赖类型论规则，并对证明对象做机器可核验的类型检查——通过则定理成立，失败则存在逻辑漏洞。',
    highlightPhrase: '机器可核验的类型检查',
    sections: [
      {
        heading: '核心功能与工作原理',
        bullets: [
          {
            title: '极简设计',
            text: '内核代码面积极小，只处理函数应用、变量绑定等核心规则，降低“信任基底”体积。',
            citation: { label: '北京大学 / Lean 社区', extra: 1 }
          },
          {
            title: '终极权威',
            text: '外部战术与元编程展开式必须经内核“干净重放”与类型校验，才能进入可信证明对象。',
            citation: { label: 'Lean 中文文档', extra: 1 }
          },
          {
            title: '依赖类型理论',
            text: '把定理写成可编译对象，使证明与程序共享同一套类型规则。',
            citation: { label: 'Lean 4 Manual', extra: 2 }
          }
        ]
      }
    ],
    followUps: ['逻辑基础（Calculus of Constructions）', '元编程与交互（Lean Copilot）', '与 ChatGPT 自然语言证明的本质差别'],
    citations: [
      { label: 'The Lean 4 Theorem Prover', url: 'https://lean-lang.org' },
      { label: 'mathlib', extra: 2 }
    ]
  },
  '能力谱系映射': {
    lead:
      '在 AI 与认知科学语境下，「能力谱系映射：Calculator → Lemma → Structure」描述智能体从执行单任务，到理解抽象逻辑，再到构建系统性知识的演化路径。',
    highlightPhrase: 'Calculator → Lemma → Structure',
    sections: [
      {
        heading: '1. Calculator（执行与工具层）',
        bullets: [
          { title: '定义', text: '能力谱起点：确定性输入输出与局部优化，被动响应。' },
          { title: 'AI 表现', text: '算术、翻译、语法修正等高精度低层任务；不懂“为何”。' },
          { title: '认知隐喻', text: '“手脚”——埋头干活，不抬头看路。' }
        ]
      },
      {
        heading: '2. Lemma（逻辑与抽象层）',
        bullets: [
          {
            title: '定义',
            text: '中间过渡：抽象思维、逻辑推理与模式识别；对应数学中服务大定理的中间引理搜索（Lean/Isabelle 上多数 AI 结果属此类）。'
          },
          {
            title: '局限',
            text: '善于在已有引理宇宙中找路，未必发明新的中间结构。'
          }
        ]
      },
      {
        heading: '3. Structure（结构发现层）',
        bullets: [
          {
            title: '定义',
            text: '从反例假设逼出隐藏不变量与刚性——Type-3 结构发现；本场强调的稀缺能力。'
          }
        ]
      }
    ],
    followUps: ['为何文社哲难有 Structure 级突破？', 'Harness 如何抬升能力谱？', '与 DFM 七大能力对照'],
    citations: [{ label: '结构发现 / Type-3', extra: 2 }]
  },
  'ontology as code': {
    lead:
      '在知识工程与复杂系统设计中，Ontology as Code（本体即代码）是一种新设计范式：将原本存在于人类大脑或业务文档中的模糊概念（本体），转化为编程语言中具备编译期校验、自动补全与强类型约束的接口与模型。',
    highlightPhrase:
      '将原本存在于人类大脑或业务文档中的模糊概念（本体），转化为编程语言中具备编译期校验、自动补全与强类型约束的接口与模型',
    sections: [
      {
        heading: '🧱 从模糊到精确：三种建模层级的对比',
        table: {
          columns: ['模糊理论 / 文档', '弱类型（JSON/字典）', 'Ontology as Code'],
          rows: [
            {
              label: '存在形式',
              cells: ['Word / Wiki / 脑图', 'Map<String, Any> / JSON', 'TS Interface / Rust Trait / Struct']
            },
            {
              label: '错误发现时',
              cells: ['上线后或永不发现', '运行时解析失败', '编译期']
            },
            {
              label: '可演进性',
              cells: ['口头约定难 diff', '缺 schema 易漂移', '可测试、可版本化']
            }
          ]
        }
      }
    ],
    followUps: ['如何把阶层流动写成状态机？', '与 Lean Ground Truth 的同构点', '本体论暴力的边界在哪？'],
    citations: [{ label: '本场第三章 · Ontology as Code', extra: 1 }]
  },
  'scm': {
    lead:
      '使用 DAG（有向无环图）与结构因果模型（SCM）做因果推断时，最关键的任务是识别变量间的真实依赖，以判断是否存在混淆（Confounding）或倒果为因（Reverse Causality）。',
    highlightPhrase: '混淆（Confounding）或倒果为因（Reverse Causality）',
    sections: [
      {
        heading: '一、检查是否存在“混淆”(Confounding)',
        paragraphs: [
          '混淆指共同原因打开后门路径，使原因 X 与结果 Y 出现虚假相关。'
        ],
        diagram: 'confounding_dag',
        bullets: [
          {
            title: '后门准则',
            text: '阻断所有从 X 到 Y 的后门路径后，剩余关联才更接近因果效应。'
          },
          {
            title: '对本场',
            text: '历史叙事若只写“因为 A 所以 B”，应用调整集检查是否倒果为因或遗漏共同冲击（白银、气候等）。'
          }
        ]
      }
    ],
    followUps: ['如何选最小调整集？', '干预 do(X) 与观察条件化差别', '与明清沙盘外生冲击的对应'],
    citations: [{ label: 'Causal Adjustment Sets', extra: 2 }]
  },
  'córdoba': {
    lead:
      '在流体力学与 Navier–Stokes / Euler 方程语境下，“光滑外力突破”指构造数学上性态良好的光滑外力，使有限时间内出现爆破（Blow-up / 奇点）。Diego Córdoba 与 Luis Martínez-Zoroa 的“涡旋层级联（Layer Cascade）”框架是重要理论根基。',
    highlightPhrase: '涡旋层级联（Layer Cascade）',
    sections: [
      {
        heading: '1. 核心理论根基：Córdoba–Martínez-Zoroa 的“涡旋层级联”',
        paragraphs: [
          '证明爆破通常依赖“粗糙、怪异”的力；而千禧年问题要求力绝对光滑良态。层级联用纸笔构造尺度递减的无穷嵌套涡旋路线。'
        ],
        bullets: [
          {
            title: '原始机制',
            text: '两人多年合作打通 Layer Cascade 数学路线。',
            citation: { label: 'ICMAT', extra: 1 }
          },
          {
            title: '与深蓝时刻',
            text: '布克马斯特等工作与 Lean 形式化，使长证明进入可公开复核闭环。',
            citation: { label: 'Quanta / statement', extra: 2 }
          }
        ]
      }
    ],
    followUps: ['与 Beale–Kato–Majda 准则关系', 'Lean 形式化完成了什么', '对社科“余维数-1 相界”隐喻'],
    citations: [
      { label: 'Quanta Magazine', extra: 2 },
      { label: 'Córdoba–Martínez-Zoroa', extra: 1 }
    ]
  },
  harness: {
    lead:
      'Harness（治理层）是 Agent = Model + Harness 中的执行与校验外壳：沙箱、负知识库、门禁拦截与不可篡改审计。管生成不等于管交付。',
    highlightPhrase: '管生成不等于管交付',
    sections: [
      {
        heading: '工程要点',
        bullets: [
          { title: '门禁', text: '负知识库禁止非机制归因；物理守恒与刚性断言 Exit Non-Zero。' },
          { title: '审计', text: 'Append-Only 事件流记录决策分叉与门禁状态。' },
          { title: '对照', text: '数学侧 Lean 内核；文社哲侧罗尔斯/明清沙盒上的 Harness。' }
        ]
      }
    ],
    followUps: ['Böckeler Harness 工程', 'ReAct / Reflexion / SWE-agent', '打开明清演化仪表板'],
    citations: [{ label: 'AI-Coding / Böckeler', extra: 2 }]
  },
  '电车难题': {
    lead:
      '经典电车难题可参数化为连续张量：亲缘系数 r、认知耗时 Δt、问责概率 P_audit。净效用 U_net=0 定义功利主义「作为相」与义务论「不作为相」的相界面。',
    highlightPhrase: 'U_net=0',
    sections: [
      {
        heading: '参数化微扰',
        bullets: [
          { title: 'r', text: '汉密尔顿亲缘系数 ∈[0,1]' },
          { title: 'Δt', text: '决策思考秒数，调制噪声与时间压力偏置 η(Δt)' },
          { title: 'P_audit', text: '法律/声誉审计概率' }
        ]
      }
    ],
    followUps: ['打开电车难题三维演示', 'α 与 C_punish 如何扭曲相界'],
    citations: [{ label: '本场 · 伦理学参数化微扰', extra: 1 }]
  }
};

/** 查询归一化 → curated key */
export function matchCuratedOverview(query: string): AiOverviewPayload | null {
  const q = query.trim().toLowerCase();
  const aliases: [RegExp, string][] = [
    [/process\s*supervision|过程监督|编译器反馈|prm|lets?\s*verify/i, 'process supervision'],
    [/lean\s*内核|lean\s*kernel|类型检查|依赖类型/i, 'lean 内核'],
    [/calculator\s*→\s*lemma|能力谱系|structure\s*discovery|三类能力/i, '能力谱系映射'],
    [/ontology\s*as\s*code|本体即代码|强类型接口/i, 'ontology as code'],
    [/scm|结构因果|混淆|倒果为因|dag|调整集/i, 'scm'],
    [/c[oó]rdoba|mart[ií]nez|涡旋层级联|layer\s*cascade|光滑外力/i, 'córdoba'],
    [/harness|门禁|负知识库|agent\s*=\s*model/i, 'harness'],
    [/电车|trolley|u_net|道德相界|功利主义|义务论/i, '电车难题']
  ];
  for (const [re, key] of aliases) {
    if (re.test(query) || re.test(q)) {
      const body = CURATED[key];
      if (body) return { ...body, query, source: 'curated' };
    }
  }
  // exact key
  for (const key of Object.keys(CURATED)) {
    if (q.includes(key) || key.includes(q)) {
      return { ...CURATED[key], query, source: 'curated' };
    }
  }
  return null;
}

export function listCuratedConceptLabels(): string[] {
  return [
    'Process Supervision / 编译器反馈',
    'Lean 内核',
    '能力谱系映射: Calculator → Lemma → Structure',
    'Ontology as Code',
    'DAG / SCM 混淆与倒果为因',
    'Córdoba–Martínez-Zoroa 涡旋层级联',
    'Harness 治理层',
    '电车难题 · U_net 相界面'
  ];
}
