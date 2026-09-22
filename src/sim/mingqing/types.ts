/**
 * 明末清初财政-军事动力学：状态、参数与审计契约
 * 时间轴 1628.0–1655.0，Δt = 0.1 年
 */

export type ScenarioId =
  | 'baseline'
  | 'counterfactual_grain'
  | 'counterfactual_maritime'
  | 'active_relocation_1642'
  | 'qing_northern_deadlock';

export const SCENARIO_META: Record<
  ScenarioId,
  { label: string; blurb: string }
> = {
  baseline: {
    label: '历史基线',
    blurb: '三饷折银 · 1639 白银断流 · 1642 辽东溃变 · 1644 甲申'
  },
  counterfactual_grain: {
    label: '反事实·实物直征',
    blurb: '中原废除折银，剔除剪刀差；陆路损耗 +40%，断粮推迟'
  },
  counterfactual_maritime: {
    label: '反事实·东南海运',
    blurb: '80% 海运直达觉华岛，χ≈0，辽东战力可维系至 1650+'
  },
  active_relocation_1642: {
    label: '崇祯南迁南京',
    blurb: '1642 松锦后迁都 + 海运并联，计算南明跨周期存活概率'
  },
  qing_northern_deadlock: {
    label: '清军华北困局',
    blurb: '南明封锁漕运/海运下的北方粮赤字与八旗动员天花板'
  }
};

export interface SimParams {
  /** 东南常态白银输入基准 */
  I_Ag0: number;
  p0: number;
  /** 剪刀差传导系数 */
  alpha_price: number;
  /** 税负摩擦 */
  k_fric: number;
  mu: number;
  /** 中原税基强度 */
  T_CP: number;
  T_SE: number;
  /** 小农净产出缓冲 */
  Y_bar_CP: number;
  c_min: number;
  /** 流民爆发 / 镇压 */
  rho: number;
  sigma_suppress: number;
  /** 辽东解达损耗与阻断 */
  delta: number;
  chi: number;
  P0: number;
  eta: number;
  phi_block: number;
  gamma: number;
  w_min: number;
  /** 外生冲击系数（气候等） */
  climateAmp: number;
}

export interface SimState {
  t: number;
  /** 东南银钱比价 */
  p_SE: number;
  /** 中原粮价折银 */
  p_CP: number;
  /** 汇率剪刀差 */
  theta: number;
  /** 农户有效税负 */
  E_CP: number;
  /** 流民/叛乱指数 [0,1) */
  R_CP: number;
  /** 辽东粮饷解达 */
  S_LD: number;
  /** 边关粮价 */
  P_g_LD: number;
  /** 有效购买力 */
  w_LD: number;
  /** 国防战斗力 [0,1] */
  D_LD: number;
  /** 国库银水位（归一） */
  treasurySilver: number;
  /** 实物粮库存（归一） */
  grainStock: number;
  /** 白银输入流速 */
  I_Ag: number;
  /** 南明存活概率（仅南迁场景有意义） */
  P_survive: number;
  /** 华北民变（清军视角） */
  R_North: number;
  /** 八旗动员占用 [0,1] */
  bannerMobilization: number;
  /** 物流链路通畅度 SE→CP、CP→LD */
  linkSE_CP: number;
  linkCP_LD: number;
  phaseShift: boolean;
  collapsed: boolean;
}

export type GateCode = 'PASS' | 137 | 240 | 250 | 260;

export interface AuditEvent {
  t: number;
  gate: 'negative_kb' | 'physics' | 'assertion' | 'info' | 'scenario';
  code: GateCode | 'OK';
  message: string;
  attribution?: string;
  blocked?: boolean;
}

export interface TickFrame {
  state: SimState;
  events: AuditEvent[];
  scenario: ScenarioId;
}

export interface RunResult {
  scenario: ScenarioId;
  frames: TickFrame[];
  finalState: SimState;
  auditLog: AuditEvent[];
  phaseShiftYear: number | null;
  collapseYear: number | null;
}

export const DEFAULT_PARAMS: SimParams = {
  I_Ag0: 3.5,
  p0: 1.0,
  alpha_price: 0.35,
  k_fric: 0.85,
  mu: 2.8,
  T_CP: 0.85,
  T_SE: 1.05,
  Y_bar_CP: 2.05,
  c_min: 0.7,
  rho: 0.42,
  sigma_suppress: 0.16,
  delta: 0.18,
  chi: 1.15,
  P0: 1.0,
  eta: 0.08,
  phi_block: 1.35,
  gamma: 1.55,
  w_min: 0.28,
  climateAmp: 0.08
};

export const T_START = 1628.0;
export const T_END = 1655.0;
export const DT = 0.1;

/** 禁止的非机制性归因词（负知识库 ADR-01） */
export const NEGATIVE_KB_TERMS = [
  '东林党争',
  '崇祯性格',
  '天命',
  '气数',
  '道德败坏',
  '人心不古',
  '天意'
];
