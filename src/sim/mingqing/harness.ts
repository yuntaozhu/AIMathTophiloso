import {
  AuditEvent,
  GateCode,
  NEGATIVE_KB_TERMS,
  SimParams,
  SimState
} from './types';

/**
 * Harness 治理层：负知识库 → 物理守恒 → 刚性断言 → Append-Only 审计
 */
export class AuditLogger {
  private events: AuditEvent[] = [];

  append(ev: AuditEvent): void {
    this.events.push({ ...ev });
  }

  all(): AuditEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }

  /** JSON Lines 导出 */
  toJsonl(): string {
    return this.events.map(e => JSON.stringify(e)).join('\n');
  }
}

export class NegativeKnowledgeGate {
  checkAttribution(text: string | undefined, t: number, log: AuditLogger): boolean {
    if (!text) return true;
    const hit = NEGATIVE_KB_TERMS.find(term => text.includes(term));
    if (hit) {
      log.append({
        t,
        gate: 'negative_kb',
        code: 137,
        message: `[GATE FAILURE] ADR-01 负知识库拦截：禁止非机制归因「${hit}」——请改用结构张力（白银流速 / 剪刀差 / 物流阻断）。`,
        attribution: text,
        blocked: true
      });
      return false;
    }
    return true;
  }
}

export interface PhysicsCheckResult {
  ok: boolean;
  code: GateCode | 'OK';
  message: string;
}

/** 物料 / 人口 / 折算上限：禁止凭空印银产粮 */
export function checkPhysicsSandbox(
  prev: SimState,
  next: SimState,
  params: SimParams,
  dt: number
): PhysicsCheckResult {
  const silverJump = next.treasurySilver - prev.treasurySilver;
  const maxSilverIn = (next.I_Ag / params.I_Ag0) * 0.08 * dt * 10;
  if (silverJump > maxSilverIn + 0.15) {
    return {
      ok: false,
      code: 240,
      message: `[GATE FAILURE] 物理沙箱：国库银水位跃升 ${silverJump.toFixed(3)} 超出白银输入上限（禁止凭空印银）。`
    };
  }
  const grainJump = next.grainStock - prev.grainStock;
  if (grainJump > 0.12 * dt * 10 + 0.08) {
    return {
      ok: false,
      code: 240,
      message: `[GATE FAILURE] 物理沙箱：粮库存跃升超气候/税基允许上界（禁止凭空产粮）。`
    };
  }
  if (next.R_CP < -0.01 || next.R_CP > 1.01 || next.D_LD < -0.01 || next.D_LD > 1.2) {
    return {
      ok: false,
      code: 240,
      message: `[GATE FAILURE] 物理沙箱：指数越界 R=${next.R_CP.toFixed(3)} D=${next.D_LD.toFixed(3)}。`
    };
  }
  return { ok: true, code: 'OK', message: '[GATE PASS] 物理守恒与史料沙箱' };
}

export interface AssertionResult {
  ok: boolean;
  phaseShift: boolean;
  collapsed: boolean;
  message: string;
  code: GateCode | 'OK';
}

/** 刚性断言：生存底线 / 辽东战力归零 → 相变断崖 */
export function checkRigidAssertions(state: SimState, params: SimParams): AssertionResult {
  const buffer = params.Y_bar_CP - params.c_min;
  // 允许危机酝酿；重大坍塌窗口对齐松锦/甲申叙事
  if (state.D_LD <= 0.02 && state.t >= 1641.5) {
    return {
      ok: false,
      phaseShift: true,
      collapsed: true,
      code: 250,
      message: `[GATE FAILURE: Exit Non-Zero] 辽东有效战力 D_LD→0 @ t=${state.t.toFixed(1)} —— 兵变/投降相变断崖。`
    };
  }
  if (state.E_CP > buffer && state.R_CP > 0.72 && state.t >= 1638) {
    return {
      ok: true,
      phaseShift: true,
      collapsed: false,
      code: 'OK',
      message: `[STRUCTURAL PHASE SHIFT] 中原税负越过生存缓冲，流民指数 R_CP=${state.R_CP.toFixed(2)}。`
    };
  }
  return {
    ok: true,
    phaseShift: false,
    collapsed: false,
    code: 'OK',
    message: '[GATE PASS] 刚性断言'
  };
}

export class HarnessValidator {
  readonly audit = new AuditLogger();
  readonly negativeKb = new NegativeKnowledgeGate();

  reset(): void {
    this.audit.clear();
  }

  validateStep(
    prev: SimState,
    next: SimState,
    params: SimParams,
    dt: number,
    attribution?: string
  ): { accepted: SimState; events: AuditEvent[] } {
    const events: AuditEvent[] = [];
    const t = next.t;

    if (!this.negativeKb.checkAttribution(attribution, t, this.audit)) {
      const blocked = this.audit.all().slice(-1)[0];
      if (blocked) events.push(blocked);
      return { accepted: { ...prev, t: next.t }, events };
    }

    const phys = checkPhysicsSandbox(prev, next, params, dt);
    if (!phys.ok) {
      const physEv: AuditEvent = {
        t,
        gate: 'physics',
        code: phys.code,
        message: phys.message,
        blocked: true
      };
      this.audit.append(physEv);
      events.push(physEv);
      return { accepted: { ...prev, t: next.t }, events };
    }

    const assert = checkRigidAssertions(next, params);
    const newlyCollapsed = assert.collapsed && !prev.collapsed;
    const newlyPhase = assert.phaseShift && !prev.phaseShift;
    const yearTick = Math.abs(next.t - Math.round(next.t)) < 1e-6;

    if (newlyCollapsed || newlyPhase || yearTick) {
      const assertEv: AuditEvent = {
        t,
        gate: 'assertion',
        code: newlyCollapsed ? assert.code : 'OK',
        message: newlyCollapsed
          ? assert.message
          : newlyPhase
            ? assert.message
            : `[GATE PASS] 物理沙箱 + 刚性断言 @ ${t.toFixed(0)}`,
        blocked: newlyCollapsed,
        attribution: 'structural: D_LD / E_CP / R_CP'
      };
      this.audit.append(assertEv);
      events.push(assertEv);
    }

    const accepted: SimState = {
      ...next,
      phaseShift: next.phaseShift || assert.phaseShift || prev.phaseShift,
      collapsed: next.collapsed || assert.collapsed || prev.collapsed
    };

    if (accepted.collapsed) {
      accepted.D_LD = 0;
      accepted.linkCP_LD = Math.min(accepted.linkCP_LD, 0.15);
    }

    return { accepted, events };
  }
}
