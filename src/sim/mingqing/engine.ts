import { HarnessValidator } from './harness';
import { buildScenario, initialState, ScenarioHooks } from './scenarios';
import {
  AuditEvent,
  DT,
  RunResult,
  ScenarioId,
  SimParams,
  SimState,
  TickFrame,
  T_END,
  T_START
} from './types';

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * 向前欧拉一步：微观博弈方程 + 三节点空间网络
 */
export function stepEuler(
  state: SimState,
  scenario: ScenarioHooks,
  dt: number
): SimState {
  const p: SimParams = scenario.params;
  const t = state.t;
  const I_Ag = scenario.silverInflow(t, p.I_Ag0);
  const Shock = scenario.climateShock(t);

  // 东南银钱比价
  const p_SE = p.p0 * (1 - 0.12 * ((I_Ag - 3.5) / 3.5));

  // 剪刀差传导 dp_CP/dt
  const dp_CP = p.alpha_price * (p_SE - state.p_CP) + 18.0 * p.T_CP * 0.02 + Shock;
  const p_CP = state.p_CP + dp_CP * dt;

  const theta = scenario.useTheta ? Math.max(0, (p_CP - p_SE) / Math.max(1e-6, p_SE)) : 0;

  // 农户税负（折银 + 白银稀缺直接加码）
  const silverScarcity = Math.max(0, (p.I_Ag0 - I_Ag) / p.I_Ag0);
  const E_CP =
    (1 + 1 / p.mu + p.k_fric * theta) *
    p.T_CP *
    (1 + scenario.landLossExtra * 0.35) *
    (1 + 0.95 * silverScarcity);

  // 流民逻辑斯蒂（白银断流后爆发率上浮）
  const surplusLine = p.Y_bar_CP - p.c_min;
  const rhoEff = p.rho * (1 + 1.4 * silverScarcity);
  const dR =
    rhoEff * Math.max(0, E_CP - surplusLine) * (1 - state.R_CP) - p.sigma_suppress * state.R_CP;
  let R_CP = clamp(state.R_CP + dR * dt, 0, 0.995);

  const chi = scenario.chiOverride !== undefined ? scenario.chiOverride : p.chi;

  // 物流：海运份额降低对中原阻断的敏感度
  const landShare = 1 - scenario.maritimeShare;
  const blockade = 1 - Math.exp(-chi * R_CP) * landShare - scenario.maritimeShare * (1 - scenario.maritimeLoss);
  const linkCP_LD = clamp(1 - Math.max(0, blockade) * 0.85, 0.05, 1);
  const linkSE_CP = clamp(0.55 + 0.4 * (I_Ag / p.I_Ag0), 0.15, 1);

  // 粮饷解达
  const loss =
    p.delta +
    scenario.landLossExtra * landShare * 0.5 +
    scenario.maritimeLoss * scenario.maritimeShare * 0.5;
  const S_LD =
    (1 - clamp(loss, 0.05, 0.75)) *
    (p.T_SE + p.T_CP) *
    Math.exp(-chi * R_CP * landShare * 0.85) *
    (0.45 + 0.55 * linkCP_LD);

  // 边关粮价
  const P_g_LD = p.P0 + p.eta * S_LD + p.phi_block * (R_CP / (1.05 - R_CP));

  // 购买力与战力
  const w_LD = (p.gamma * Math.max(0.35, S_LD)) / Math.max(0.35, P_g_LD);
  let D_LD =
    w_LD >= p.w_min ? clamp(Math.log(w_LD / p.w_min) / 1.1, 0, 1) : clamp((w_LD / p.w_min) * 0.15, 0, 0.15);

  const tNext = t + dt;

  // 白银断流后战力缓降
  if (tNext >= 1639) {
    const yearsAfter = tNext - 1639;
    D_LD *= Math.exp(-0.12 * yearsAfter);
  }

  // 历史事件钉扎（按步末时间）
  if (scenario.id === 'baseline') {
    if (tNext >= 1642 && tNext < 1644) D_LD = Math.min(D_LD, 0.18);
    if (tNext >= 1644) {
      D_LD = 0;
      R_CP = Math.max(R_CP, 0.88);
    }
  }
  if (scenario.id === 'counterfactual_maritime' && tNext < 1650) {
    D_LD = Math.max(D_LD, 0.32);
  }
  if (scenario.id === 'counterfactual_grain' && tNext < 1644.5) {
    D_LD = Math.max(D_LD, 0.22);
  }

  // 国库与粮库存（简化守恒）
  const treasurySilver = clamp(
    state.treasurySilver +
      0.02 * (I_Ag / p.I_Ag0) * dt * 10 -
      0.025 * (p.T_SE + p.T_CP) * dt * 10 -
      0.01 * R_CP * dt * 10,
    0,
    1.4
  );
  const grainStock = clamp(
    state.grainStock +
      0.015 * p.T_CP * dt * 10 -
      0.012 * S_LD * dt * 10 -
      Shock * 0.8 * dt * 10,
    0.02,
    1.3
  );

  let next: SimState = {
    ...state,
    t: tNext,
    p_SE,
    p_CP,
    theta,
    E_CP,
    R_CP,
    S_LD,
    P_g_LD,
    w_LD,
    D_LD,
    treasurySilver,
    grainStock,
    I_Ag,
    linkSE_CP,
    linkCP_LD
  };

  if (scenario.onTick) {
    next = { ...next, ...scenario.onTick(next, tNext) };
  }

  if (scenario.relocate1642 && tNext >= 1642) {
    next.R_CP = clamp(next.R_CP * 0.92, 0, 0.995);
    next.D_LD = Math.max(next.D_LD, 0.2);
  }

  return next;
}

export interface RunOptions {
  scenario?: ScenarioId;
  tStart?: number;
  tEnd?: number;
  dt?: number;
  /** 试探性归因文本（可触发 Code 137） */
  attributionProbe?: string;
  onFrame?: (frame: TickFrame) => void;
}

/**
 * 完整跑完一条时间线（同步），Harness 逐步审计
 */
export function runSimulation(opts: RunOptions = {}): RunResult {
  const scenarioId = opts.scenario ?? 'baseline';
  const scenario = buildScenario(scenarioId);
  const dt = opts.dt ?? DT;
  const tStart = opts.tStart ?? T_START;
  const tEnd = opts.tEnd ?? T_END;

  const harness = new HarnessValidator();
  harness.audit.append({
    t: tStart,
    gate: 'scenario',
    code: 'OK',
    message: `[SCENARIO] 载入 ${scenarioId}`
  });

  let state = initialState(scenario);
  state.t = tStart;

  const frames: TickFrame[] = [];
  const allEvents: AuditEvent[] = [...harness.audit.all()];
  let phaseShiftYear: number | null = null;
  let collapseYear: number | null = null;

  // 可选：在首步探测负知识库
  if (opts.attributionProbe) {
    const probe = harness.validateStep(state, { ...state, t: tStart }, scenario.params, dt, opts.attributionProbe);
    allEvents.push(...probe.events);
  }

  frames.push({ state: { ...state }, events: [], scenario: scenarioId });

  while (state.t < tEnd - 1e-9) {
    const prev = state;
    const proposed = stepEuler(state, scenario, dt);
    const { accepted, events } = harness.validateStep(
      prev,
      proposed,
      scenario.params,
      dt,
      'structural: silver-scissors-logistics'
    );

    state = accepted;
    allEvents.push(...events);

    if (state.phaseShift && phaseShiftYear === null) {
      phaseShiftYear = state.t;
    }
    if (state.collapsed && collapseYear === null) {
      collapseYear = state.t;
    }

    const frame: TickFrame = { state: { ...state }, events, scenario: scenarioId };
    frames.push(frame);
    opts.onFrame?.(frame);

    if (state.collapsed && scenarioId === 'baseline' && state.t >= 1644.5) {
      // 基线甲申后仍继续演化到 tEnd，便于对照
    }
  }

  return {
    scenario: scenarioId,
    frames,
    finalState: state,
    auditLog: allEvents,
    phaseShiftYear,
    collapseYear
  };
}

/** 预计算全轨迹，供播放器按帧回放 */
export function precomputeTrajectory(scenario: ScenarioId): RunResult {
  return runSimulation({ scenario });
}
