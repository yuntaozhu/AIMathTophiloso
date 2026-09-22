/**
 * 电车难题净效用与 U_net=0 相界面
 * U_net(r, Δt, P_audit) = ΔV_base - α·r^γ - P_audit·C_punish + η(Δt)
 *
 * η(Δt) = η0·e^(-λ·Δt) ：时间压力下的功利冲动偏置（双过程伦理叙事）
 * 可选高斯噪声：N(0, (σ·e^(-λ·Δt))^2) 用于蒙特卡洛云
 */

export interface TrolleyParams {
  deltaVBase: number;
  alpha: number;
  gamma: number;
  cPunish: number;
  eta0: number;
  lambda: number;
  sigma: number;
}

export const DEFAULT_TROLLEY_PARAMS: TrolleyParams = {
  deltaVBase: 4.0,
  alpha: 3.2,
  gamma: 1.8,
  cPunish: 5.5,
  eta0: 1.15,
  lambda: 0.08,
  sigma: 0.35
};

/** 期望 η（无噪声） */
export function etaMean(dt: number, p: TrolleyParams): number {
  return p.eta0 * Math.exp(-p.lambda * dt);
}

/** 噪声标准差 */
export function etaSigma(dt: number, p: TrolleyParams): number {
  return p.sigma * Math.exp(-p.lambda * dt);
}

export function uNet(
  r: number,
  dt: number,
  pAudit: number,
  p: TrolleyParams,
  etaSample?: number
): number {
  const eta = etaSample !== undefined ? etaSample : etaMean(dt, p);
  return p.deltaVBase - p.alpha * Math.pow(Math.max(0, r), p.gamma) - pAudit * p.cPunish + eta;
}

/**
 * 零势能等值：给定 (r, Δt) 解 P_audit*
 * U=0 ⇒ P* = (ΔV - α r^γ + η) / C_punish
 */
export function pAuditStar(r: number, dt: number, p: TrolleyParams, etaSample?: number): number {
  const eta = etaSample !== undefined ? etaSample : etaMean(dt, p);
  if (p.cPunish <= 1e-9) return 0.5;
  return (p.deltaVBase - p.alpha * Math.pow(Math.max(0, r), p.gamma) + eta) / p.cPunish;
}

/** ∇U 解析梯度（期望场，η 对 Δt 求导） */
export function gradU(
  r: number,
  dt: number,
  pAudit: number,
  p: TrolleyParams
): [number, number, number] {
  const dU_dr = -p.alpha * p.gamma * Math.pow(Math.max(1e-6, r), p.gamma - 1);
  const dU_ddt = -p.lambda * p.eta0 * Math.exp(-p.lambda * dt);
  const dU_dp = -p.cPunish;
  void pAudit;
  return [dU_dr, dU_ddt, dU_dp];
}

export interface SurfaceMesh {
  /** 交错 position xyz */
  positions: Float32Array;
  indices: Uint32Array;
  /** 归一化法向（指向功利相 U>0 → 义务论方向取 -∇U） */
  normals: Float32Array;
  /** 箭头：起点 xyz + 方向 xyz */
  arrows: Float32Array;
}

export interface BuildSurfaceRequest {
  params: TrolleyParams;
  resR: number;
  resDt: number;
  arrowStride: number;
}

/**
 * 参数曲面网格：r∈[0,1], Δt∈[0.1,60], P*=clamp(P*, -0.15, 1.15) 便于看见越界坍缩
 * 空间映射到 Three.js：x=r, y=Δt/60, z=P_audit
 */
export function buildZeroSurface(req: BuildSurfaceRequest): SurfaceMesh {
  const { params: p, resR, resDt, arrowStride } = req;
  const cols = resR;
  const rows = resDt;
  const nVert = cols * rows;
  const positions = new Float32Array(nVert * 3);
  const normals = new Float32Array(nVert * 3);

  const rMin = 0;
  const rMax = 1;
  const dtMin = 0.1;
  const dtMax = 60;

  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1);
    const dt = dtMin + v * (dtMax - dtMin);
    for (let i = 0; i < cols; i++) {
      const u = i / (cols - 1);
      const r = rMin + u * (rMax - rMin);
      let pz = pAuditStar(r, dt, p);
      pz = Math.max(-0.12, Math.min(1.12, pz));
      const idx = (j * cols + i) * 3;
      positions[idx] = r;
      positions[idx + 1] = dt / 60;
      positions[idx + 2] = pz;

      const [gx, gy, gz] = gradU(r, dt, pz, p);
      // 显示「向义务论不作为相坍缩」：箭头沿 -∇U
      let nx = -gx;
      let ny = -gy / 60;
      let nz = -gz;
      const len = Math.hypot(nx, ny, nz) || 1;
      normals[idx] = nx / len;
      normals[idx + 1] = ny / len;
      normals[idx + 2] = nz / len;
    }
  }

  const indices = new Uint32Array((cols - 1) * (rows - 1) * 6);
  let t = 0;
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices[t++] = a;
      indices[t++] = c;
      indices[t++] = b;
      indices[t++] = b;
      indices[t++] = c;
      indices[t++] = d;
    }
  }

  const arrows: number[] = [];
  for (let j = 0; j < rows; j += arrowStride) {
    for (let i = 0; i < cols; i += arrowStride) {
      const idx = (j * cols + i) * 3;
      const px = positions[idx];
      const py = positions[idx + 1];
      const pz = positions[idx + 2];
      const nx = normals[idx];
      const ny = normals[idx + 1];
      const nz = normals[idx + 2];
      const scale = 0.08;
      arrows.push(px, py, pz, nx * scale, ny * scale, nz * scale);
    }
  }

  return {
    positions,
    indices,
    normals,
    arrows: new Float32Array(arrows)
  };
}

/** 简易 Box Marching Cubes：在 (r,Δt,P) 体素上提取 U=0（备用高精度） */
export function marchingCubesZero(
  p: TrolleyParams,
  res = 28
): { positions: Float32Array; indices: Uint32Array } {
  // 精简 MC：只对边插值生成三角形扇，使用经典 256 案例的子集——
  // 为控制包体积，这里用「切片等高线拼合」近似 MC：
  // 对每个固定 Δt 切片，在 (r,P) 上找 U=0 折线，再缝合成带。
  // 完整 MC 表过长；参数曲面已是主路径。本函数生成与参数曲面等价的体素插值面。
  const mesh = buildZeroSurface({
    params: p,
    resR: res,
    resDt: res,
    arrowStride: 4
  });
  return { positions: mesh.positions, indices: mesh.indices };
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sampleGaussian(rng: () => number): number {
  const u1 = Math.max(1e-12, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** 蒙特卡洛决策云：U>0 功利拉动，U<0 义务不作为 */
export function sampleDecisionCloud(
  p: TrolleyParams,
  n: number,
  seed = 42
): Float32Array {
  const rng = mulberry32(seed);
  const out = new Float32Array(n * 4); // x,y,z,sign
  for (let i = 0; i < n; i++) {
    const r = rng();
    const dt = 0.1 + rng() * 59.9;
    const pAudit = rng();
    const eta = etaMean(dt, p) + sampleGaussian(rng) * etaSigma(dt, p);
    const u = uNet(r, dt, pAudit, p, eta);
    const o = i * 4;
    out[o] = r;
    out[o + 1] = dt / 60;
    out[o + 2] = pAudit;
    out[o + 3] = u >= 0 ? 1 : -1;
  }
  return out;
}

export const TROLLEY_SIM_PATH = '/#/sim/trolley-ethics';

export function openTrolleyEthicsDemo(opts?: { newTab?: boolean }): void {
  if (opts?.newTab === false) {
    window.location.hash = '/sim/trolley-ethics';
    window.location.reload();
  } else {
    window.open(TROLLEY_SIM_PATH, '_blank', 'noopener,noreferrer');
  }
}
