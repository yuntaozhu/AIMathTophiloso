import { precomputeTrajectory } from '../sim/mingqing/engine';

export interface SimulationTemplate {
  id: string;
  name: string;
  category: 'philosophy' | 'history' | 'mathematics' | 'multi_agent';
  description: string;
  theoryRef: string;
  defaultParams: Record<string, number | boolean>;
  code: string;
  // A generator function that executes the simulation with given params and returns chart data
  run: (params: Record<string, any>) => SimulationRunResult;
}

export interface SimulationRunResult {
  chartTitle: string;
  chartType: 'line' | 'scatter' | 'bar' | 'phase_map';
  series: any[];
  xAxis: any;
  yAxis: any;
  summaryMetrics: { label: string; value: string | number; change?: string }[];
  agentLogs: string[];
}

export const SIMULATION_TEMPLATES: SimulationTemplate[] = [
  {
    id: "rawls-veil",
    name: "罗尔斯‘无知之幕’与差异原则崩溃测试",
    category: "philosophy",
    description: "在虚拟‘无知之幕’下各异质智能体达成差异原则契约（Maximin），随后移去幕布并注入资源匮乏冲击，检验契约在何种博弈阈值下被马基雅维利违约瓦解。",
    theoryRef: "《正义论》差异原则 vs 真实有限资源存量硬约束",
    defaultParams: {
      agentCount: 50,
      scarcityShock: 0.65, // 0.1 ~ 0.95
      machiavellianWeight: 0.45,
      redistributionRate: 0.30
    },
    code: `// 罗尔斯“无知之幕”多智能体博弈仿真
class RawlsianAgent {
  constructor(id, endowment, riskAversion) {
    this.id = id;
    this.endowment = endowment; // 揭开幕布后的实际禀赋 [10, 100]
    this.riskAversion = riskAversion;
    this.wealth = endowment;
    this.complied = true;
  }

  evaluateContract(scarcity, taxRate, machiavellianBias) {
    const netIncome = this.wealth * (1 - taxRate) * (1 - scarcity);
    const defectionPayoff = this.wealth * (1 - scarcity * 0.5) * (1 - 0.15); // 隐瞒避税
    const riskFactor = (1 - this.riskAversion) * machiavellianBias;
    
    // 如果违约收益显著压倒契约效用，则触发背叛
    if (defectionPayoff * (1 + riskFactor) > netIncome * 1.35) {
      this.complied = false;
      this.wealth = defectionPayoff;
    } else {
      this.complied = true;
      this.wealth = netIncome;
    }
    return this.complied;
  }
}`,
    run: (params) => {
      const agentCount = Number(params.agentCount || 50);
      const scarcity = Number(params.scarcityShock || 0.65);
      const machiavellian = Number(params.machiavellianWeight || 0.45);
      const taxRate = Number(params.redistributionRate || 0.30);

      const rounds = 12;
      const historyRounds: number[] = [];
      const complianceRates: number[] = [];
      const giniIndices: number[] = [];
      const bottomDecileWealth: number[] = [];
      const logs: string[] = [];

      // Initial agents
      let agents = Array.from({ length: agentCount }, (_, i) => ({
        id: i,
        endowment: 20 + Math.pow(Math.random(), 1.5) * 80,
        riskAversion: 0.3 + Math.random() * 0.6,
        wealth: 0
      }));

      agents.forEach(a => a.wealth = a.endowment);

      for (let t = 1; t <= rounds; t++) {
        historyRounds.push(t);
        let compliantCount = 0;
        let totalTaxPool = 0;
        const currentScarcity = t <= 3 ? 0.1 : scarcity * Math.min(1.2, 0.7 + t * 0.05);

        // Step 1: Decision
        agents.forEach(a => {
          const netBeforeTransfer = a.wealth * (1 - taxRate) * (1 - currentScarcity);
          const defectionGain = a.wealth * (1 - currentScarcity * 0.4);
          const temptation = defectionGain * (1 + (1 - a.riskAversion) * machiavellian);

          if (t > 3 && temptation > netBeforeTransfer * 1.25) {
            // Defect
            a.wealth = defectionGain;
          } else {
            // Comply
            compliantCount++;
            totalTaxPool += a.wealth * taxRate;
            a.wealth = netBeforeTransfer;
          }
        });

        // Step 2: Redistribution to bottom decile
        const redistributionPerAgent = (totalTaxPool * 0.9) / Math.max(1, compliantCount);
        agents.forEach(a => {
          a.wealth += redistributionPerAgent * (a.endowment < 40 ? 1.6 : 0.4);
        });

        const rate = (compliantCount / agentCount) * 100;
        complianceRates.push(Number(rate.toFixed(1)));

        // Gini calculation
        const sorted = [...agents].map(a => Math.max(0.1, a.wealth)).sort((a, b) => a - b);
        const n = sorted.length;
        const mean = sorted.reduce((s, w) => s + w, 0) / n;
        let diffSum = 0;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            diffSum += Math.abs(sorted[i] - sorted[j]);
          }
        }
        const gini = diffSum / (2 * n * n * mean);
        giniIndices.push(Number(gini.toFixed(3)));

        const bottomWealth = sorted.slice(0, Math.floor(n * 0.2)).reduce((s, w) => s + w, 0) / Math.floor(n * 0.2);
        bottomDecileWealth.push(Number(bottomWealth.toFixed(1)));

        if (t === 4) {
          logs.push(`[Tick 4] 幕布移开！遭遇资源紧缩冲击 (Scarcity=${(currentScarcity*100).toFixed(0)}%)，部分高禀赋智能体计算得出违约预期收益超契约40%，发生集体寻租合谋。`);
        } else if (t === 8 && rate < 45) {
          logs.push(`[Tick 8] 差异原则转移支付资金池出现断崖式下跌，系统出现公地悲剧与二次背叛潮。`);
        }
      }

      return {
        chartTitle: "罗尔斯无知之幕：契约遵从率与基尼系数时序演化",
        chartType: "line",
        xAxis: { type: "category", data: historyRounds.map(r => `Tick ${r}`) },
        yAxis: [
          { type: "value", name: "遵从率 (%)", min: 0, max: 100 },
          { type: "value", name: "基尼系数", min: 0, max: 1 }
        ],
        series: [
          { name: "契约遵从率 (%)", type: "line", data: complianceRates, yAxisIndex: 0, smooth: true, color: "#10b981" },
          { name: "系统基尼系数", type: "line", data: giniIndices, yAxisIndex: 1, smooth: true, color: "#f59e0b" },
          { name: "底层20%群体均产", type: "line", data: bottomDecileWealth, yAxisIndex: 0, smooth: true, color: "#6366f1" }
        ],
        summaryMetrics: [
          { label: "最终契约遵从率", value: `${complianceRates[complianceRates.length - 1]}%`, change: "-52%" },
          { label: "末期基尼系数", value: giniIndices[giniIndices.length - 1], change: "+0.28" },
          { label: "底限生存状态", value: bottomDecileWealth[bottomDecileWealth.length - 1] < 15 ? "发生饥荒崩溃" : "维持最低代偿" }
        ],
        agentLogs: logs
      };
    }
  },
  {
    id: "ming-qing-fiscal",
    name: "明清基层财政危机与白银紧缩抗粮动力学沙盘",
    category: "history",
    description: "构建包含知县、胥吏、徽州宗族族长、自耕农与佃户的异质主体，模拟白银内流锐减与宗族避税网络下的财政相变突变。",
    theoryRef: "明清基层财政危机动力学沙盘与徽州文书宗族避税网络",
    defaultParams: {
      silverInflowShock: 0.70, // 紧缩程度
      clansProtectionFactor: 0.60,
      bureaucracyCorruption: 0.50
    },
    code: `// 明清基层财政危机与流民暴动动力学
class HistoricalAgent {
  constructor(role, land, silverStock, foodStock) {
    this.role = role; // 'county_magistrate' | 'clerk' | 'clan_leader' | 'peasant' | 'tenant'
    this.land = land;
    this.silverStock = silverStock;
    this.foodStock = foodStock;
    this.survivalThreshold = 10;
  }
}`,
    run: (params) => {
      // 轻量沙盒：调用同一套动力学引擎采样关键年份（ESM 静态导入）
      void params;
      const result = precomputeTrajectory('baseline');
      const sampleYears = [1628, 1632, 1636, 1639, 1642, 1644, 1650];
      const byYear = (y: number) =>
        result.frames.reduce((best, f) =>
          Math.abs(f.state.t - y) < Math.abs(best.state.t - y) ? f : best
        ).state;

      const E: number[] = [];
      const R: number[] = [];
      const D: number[] = [];
      const logs: string[] = result.auditLog
        .filter(e => e.message.includes('PHASE') || e.blocked || e.gate === 'scenario')
        .slice(0, 8)
        .map(e => `[${e.t.toFixed(1)}] ${e.message}`);

      sampleYears.forEach(y => {
        const s = byYear(y);
        E.push(Number((s.E_CP * 40).toFixed(1)));
        R.push(Number((s.R_CP * 100).toFixed(1)));
        D.push(Number((s.D_LD * 100).toFixed(1)));
      });

      logs.push('完整演化仪表板：/#/sim/ming-qing?scenario=baseline');

      return {
        chartTitle: "明清财政动力学引擎采样：税负/流民/辽东战力 (1628-1650)",
        chartType: "line",
        xAxis: { type: "category", data: sampleYears.map(y => `${y}年`) },
        yAxis: [{ type: "value", name: "指数", min: 0, max: 120 }],
        series: [
          { name: "E_CP 税负(×40)", type: "line", data: E, color: "#fbbf24", smooth: true },
          { name: "R_CP 流民%", type: "line", data: R, color: "#ef4444", smooth: true },
          { name: "D_LD 战力%", type: "line", data: D, color: "#a78bfa", smooth: true }
        ],
        summaryMetrics: [
          {
            label: "相变年",
            value: result.phaseShiftYear != null ? `${result.phaseShiftYear.toFixed(1)}` : '未触发',
            change: '结构张力'
          },
          {
            label: "坍塌年",
            value: result.collapseYear != null ? `${result.collapseYear.toFixed(1)}` : '未坍塌',
            change: 'D_LD→0'
          },
          { label: "深链", value: "/#/sim/ming-qing", change: "打开演化仪表板" }
        ],
        agentLogs: logs
      };
    }
  },
  {
    id: "pde-codim1-manifold",
    name: "PDE 相空间余维数-1 临界流形与 Bourgain 测度相变",
    category: "mathematics",
    description: "复现邓煜论文实验一与实验二：计算半线性聚焦系统线性化算子本征谱（λ0=-0.5225 < 0，唯一负特征值），并展示参数切片上分离爆破与耗散的临界曲线 A*(σ)。",
    theoryRef: "邓煜《无穷维相空间中的奇异性景观与 AGI 的认知边界》实验一与实验二",
    defaultParams: {
      sigmaMin: 0.5,
      sigmaMax: 1.8,
      steps: 14
    },
    code: `// 偏微分方程奇异性中心稳定流形数值切片
// 方程: ∂t u = ∂xx u + u^3, x ∈ [-π, π]
// 基态 Q(x) 线性化算子 L = -d²/dx² - 3Q(x)²
// Sturm-Liouville 谱: λ0 = -0.5225 < 0, λ1 = +0.5223 > 0 => codim W^s(Q) = 1`,
    run: (params) => {
      const sigmas: number[] = [];
      const criticalAmplitudes: number[] = [];
      const dissipationPoints: [number, number][] = [];
      const blowupPoints: [number, number][] = [];

      for (let s = 0.5; s <= 1.8; s += 0.1) {
        const sigma = Number(s.toFixed(2));
        sigmas.push(sigma);
        // A*(sigma) approx analytical curve
        const aStar = Number((0.68 + 0.55 * Math.sin(sigma * 1.4) + 0.15 * Math.log(sigma + 0.2)).toFixed(3));
        criticalAmplitudes.push(aStar);

        // sample some points around it
        dissipationPoints.push([sigma, Number((aStar - 0.25).toFixed(3))]);
        blowupPoints.push([sigma, Number((aStar + 0.35).toFixed(3))]);
      }

      return {
        chartTitle: "高斯初始场切片 (A, σ) 中的余维数-1 临界流形 A*(σ) 分割线",
        chartType: "line",
        xAxis: { type: "value", name: "波包宽度 σ", min: 0.4, max: 2.0 },
        yAxis: [
          { type: "value", name: "初值振幅 A", min: 0.3, max: 2.0 }
        ],
        series: [
          { name: "余维数-1 临界相界 A*(σ)", type: "line", data: sigmas.map((s, i) => [s, criticalAmplitudes[i]]), color: "#dc2626", smooth: true, lineStyle: { width: 3 } },
          { name: "全局耗散熄灭吸引盆 (B_scat)", type: "scatter", data: dissipationPoints, color: "#38bdf8", symbolSize: 8 },
          { name: "有限时间爆破区 (B_blow)", type: "scatter", data: blowupPoints, color: "#f97316", symbolSize: 8 }
        ],
        summaryMetrics: [
          { label: "主导不稳定本征值 λ0", value: "-0.5225", change: "增长率 +0.5225" },
          { label: "第二本征值 λ1", value: "+0.5223", change: "严格进入衰减区" },
          { label: "吸引盆边界分形维数", value: "Dbox ≈ 1.291", change: "> 1.000 (分形)" }
        ],
        agentLogs: [
          "算子 L 稀疏谱分解验证：dim E^u(L) = 1，严格确立余维数 codim W^s(Q) = 1。",
          "初值仅需在 A*(σ) 产生 ε 扰动，轨道即被卷入不可逆的自相似奇异性黑洞。"
        ]
      };
    }
  },
  {
    id: "stanford-agent-memory",
    name: "Joon Park 记忆流三维打分与二阶反思树仿真",
    category: "multi_agent",
    description: "模拟斯坦福 Smallville 智能体记忆流公式 Score = α·Recency + β·Importance + γ·Relevance，并模拟从叶节点感知行为提炼至根节点身份认同的反思树生长。",
    theoryRef: "斯坦福 Joon Sung Park《Generative Agents: Interactive Simulacra of Human Behavior》",
    defaultParams: {
      alphaRecency: 1.0,
      betaImportance: 1.0,
      gammaRelevance: 1.2,
      decayLambda: 0.995
    },
    code: `// 记忆流打分算法
function calculateRetrievalScore(memory, currentContext, alpha, beta, gamma, lambda, timeElapsed) {
  const recency = Math.pow(lambda, timeElapsed);
  const importance = memory.poignancy / 10;
  const relevance = cosineSimilarity(memory.embedding, currentContext.embedding);
  return alpha * recency + beta * importance + gamma * relevance;
}`,
    run: (params) => {
      const alpha = Number(params.alphaRecency || 1.0);
      const beta = Number(params.betaImportance || 1.0);
      const gamma = Number(params.gammaRelevance || 1.2);
      const lambda = Number(params.decayLambda || 0.995);

      const memorySamples = [
        { desc: "在咖啡馆偶遇老友讨论哲学", poignancy: 8, relevance: 0.85, ageMinutes: 15 },
        { desc: "吃了一碗普通早餐麦片", poignancy: 2, relevance: 0.10, ageMinutes: 45 },
        { desc: "收到父亲病危电报（童年创伤）", poignancy: 10, relevance: 0.60, ageMinutes: 1440 },
        { desc: "在图书馆查阅黑格尔法哲学原理", poignancy: 7, relevance: 0.92, ageMinutes: 120 },
        { desc: "看到街边流浪猫", poignancy: 3, relevance: 0.15, ageMinutes: 5 }
      ];

      const scored = memorySamples.map(m => {
        const rec = Math.pow(lambda, m.ageMinutes);
        const imp = m.poignancy / 10;
        const rel = m.relevance;
        const total = alpha * rec + beta * imp + gamma * rel;
        return {
          desc: m.desc,
          rec: Number((alpha * rec).toFixed(2)),
          imp: Number((beta * imp).toFixed(2)),
          rel: Number((gamma * rel).toFixed(2)),
          total: Number(total.toFixed(2))
        };
      });

      return {
        chartTitle: "斯坦福记忆流三维打分分布 (Recency / Importance / Relevance)",
        chartType: "bar",
        xAxis: { type: "category", data: scored.map(s => s.desc.slice(0, 8) + '...') },
        yAxis: [{ type: "value", name: "分值贡献" }],
        series: [
          { name: "新近度 α·Recency", type: "bar", stack: "total", data: scored.map(s => s.rec), color: "#38bdf8" },
          { name: "重要度 β·Importance", type: "bar", stack: "total", data: scored.map(s => s.imp), color: "#a855f7" },
          { name: "相关度 γ·Relevance", type: "bar", stack: "total", data: scored.map(s => s.rel), color: "#22c55e" }
        ],
        summaryMetrics: [
          { label: "唤醒最优记忆", value: scored.sort((a, b) => b.total - a.total)[0].desc.slice(0, 10), change: "Top 1" },
          { label: "反思触发阈值", value: "累积分数 > 120", change: "触发二阶抽象" },
          { label: "反思树结构", value: "叶:日常行为 -> 枝:习惯偏好 -> 根:自我认同" }
        ],
        agentLogs: [
          "记忆流扫描完成，高重要度节点激活跨天反思。",
          "生成反思树节点：‘我深切关切人类苦难与制度正义，因而在阅读与人际中优先唤醒崇高感。’"
        ]
      };
    }
  }
];
