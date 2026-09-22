import { DEFAULT_PARAMS, ScenarioId, SimParams, SimState, T_START } from './types';

export interface ScenarioHooks {
  id: ScenarioId;
  params: SimParams;
  /** 外生白银输入 */
  silverInflow(t: number, base: number): number;
  /** 是否启用折银剪刀差 θ */
  useTheta: boolean;
  /** 陆路额外损耗（实物直征） */
  landLossExtra: number;
  /** 海运占比 0–1 */
  maritimeShare: number;
  /** 海运损耗 */
  maritimeLoss: number;
  /** 是否在 1642 南迁 */
  relocate1642: boolean;
  /** 清军北方视角 */
  qingView: boolean;
  /** 覆写 χ（中原阻断系数） */
  chiOverride?: number;
  /** 气候冲击 Shock(t) */
  climateShock(t: number): number;
  onTick?(state: SimState, t: number): Partial<SimState>;
}

function climateBase(t: number, amp: number): number {
  // 崇祯大旱窗口 ~1637–1641 加强
  const drought = t >= 1637 && t <= 1641 ? 1.0 : t >= 1630 && t < 1637 ? 0.45 : 0.15;
  return amp * drought;
}

export function buildScenario(id: ScenarioId): ScenarioHooks {
  const base = { ...DEFAULT_PARAMS };

  switch (id) {
    case 'baseline':
      return {
        id,
        params: base,
        silverInflow: (t, I0) => (t < 1639 ? I0 : I0 * 0.18),
        useTheta: true,
        landLossExtra: 0,
        maritimeShare: 0.1,
        maritimeLoss: 0.25,
        relocate1642: false,
        qingView: false,
        climateShock: t => climateBase(t, base.climateAmp)
      };

    case 'counterfactual_grain':
      return {
        id,
        params: { ...base, k_fric: 0.35, delta: 0.22 + 0.4 * 0.5 },
        silverInflow: (t, I0) => (t < 1639 ? I0 : I0 * 0.22),
        useTheta: false,
        landLossExtra: 0.4,
        maritimeShare: 0.05,
        maritimeLoss: 0.25,
        relocate1642: false,
        qingView: false,
        climateShock: t => climateBase(t, base.climateAmp)
      };

    case 'counterfactual_maritime':
      return {
        id,
        params: { ...base, chi: 0.05 },
        silverInflow: (t, I0) => (t < 1639 ? I0 : I0 * 0.35),
        useTheta: true,
        landLossExtra: 0,
        maritimeShare: 0.8,
        maritimeLoss: 0.12,
        relocate1642: false,
        qingView: false,
        chiOverride: 0,
        climateShock: t => climateBase(t, base.climateAmp * 0.9)
      };

    case 'active_relocation_1642':
      return {
        id,
        params: { ...base, T_SE: 1.35, chi: 0.6 },
        silverInflow: (t, I0) => (t < 1639 ? I0 : I0 * 0.4),
        useTheta: true,
        landLossExtra: 0.1,
        maritimeShare: 0.65,
        maritimeLoss: 0.12,
        relocate1642: true,
        qingView: false,
        climateShock: t => climateBase(t, base.climateAmp * 0.85),
        onTick: (state, t) => {
          if (t < 1642) return { P_survive: 0.55 };
          // 江南就地征收：税基效率↑，中原降为缓冲区
          const southBoost = 0.02;
          const survive =
            0.35 +
            0.45 * state.D_LD +
            0.25 * (1 - state.R_CP) -
            0.15 * Math.max(0, state.E_CP - 1.5);
          return {
            P_survive: Math.max(0.05, Math.min(0.95, survive + southBoost)),
            linkSE_CP: Math.min(1, state.linkSE_CP + 0.05),
            treasurySilver: Math.min(1.2, state.treasurySilver + 0.008)
          };
        }
      };

    case 'qing_northern_deadlock':
      return {
        id,
        params: { ...base, sigma_suppress: 0.1 },
        silverInflow: (t, I0) => (t < 1644 ? I0 * 0.5 : I0 * 0.25),
        useTheta: true,
        landLossExtra: 0.2,
        maritimeShare: 0.05,
        maritimeLoss: 0.3,
        relocate1642: false,
        qingView: true,
        climateShock: t => climateBase(t, base.climateAmp * 1.1),
        onTick: (state, t) => {
          // 南明封锁漕运/海运 → 北方粮赤字；八旗动员天花板 ~10 万归一到 1.0
          const blockade = t >= 1645 ? 0.55 : t >= 1644 ? 0.35 : 0.1;
          const R_North = Math.min(
            0.98,
            state.R_North + 0.015 * blockade + 0.01 * Math.max(0, state.E_CP - 1.2)
          );
          const bannerMobilization = Math.min(1, 0.35 + R_North * 0.55 + blockade * 0.25);
          const grainStock = Math.max(0.05, state.grainStock - 0.012 * blockade);
          return { R_North, bannerMobilization, grainStock, linkSE_CP: 1 - blockade };
        }
      };

    default:
      return buildScenario('baseline');
  }
}

export function initialState(scenario: ScenarioHooks): SimState {
  const p = scenario.params;
  const I_Ag = scenario.silverInflow(T_START, p.I_Ag0);
  return {
    t: T_START,
    p_SE: p.p0,
    p_CP: p.p0 * 1.05,
    theta: 0,
    E_CP: p.T_CP * (1 + 1 / p.mu),
    R_CP: 0.08,
    S_LD: 0.9,
    P_g_LD: p.P0,
    w_LD: 1.1,
    D_LD: 0.72,
    treasurySilver: 0.85,
    grainStock: 0.8,
    I_Ag,
    P_survive: scenario.relocate1642 ? 0.5 : 0,
    R_North: 0.05,
    bannerMobilization: 0.2,
    linkSE_CP: 0.95,
    linkCP_LD: 0.9,
    phaseShift: false,
    collapsed: false
  };
}
