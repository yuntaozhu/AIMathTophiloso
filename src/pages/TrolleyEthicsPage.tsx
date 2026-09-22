import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';
import {
  DEFAULT_TROLLEY_PARAMS,
  SurfaceWorkerPool,
  TrolleyParams,
  buildZeroSurface
} from '../sim/trolley';

function disposeObject(obj: THREE.Object3D) {
  obj.traverse(child => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material;
    if (Array.isArray(mat)) mat.forEach(m => m.dispose());
    else if (mat) (mat as THREE.Material).dispose();
  });
}

export const TrolleyEthicsPage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<TrolleyParams>({ ...DEFAULT_TROLLEY_PARAMS });
  const [busy, setBusy] = useState(false);
  const [showCloud, setShowCloud] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const poolRef = useRef<SurfaceWorkerPool | null>(null);
  const sceneApi = useRef<{
    rebuild: (p: TrolleyParams, cloud: boolean, arrows: boolean) => Promise<void>;
  } | null>(null);

  const formula = useMemo(
    () => 'U_net = ΔV_base − α·r^γ − P_audit·C_punish + η(Δt)',
    []
  );

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508);
    scene.fog = new THREE.FogExp2(0x050508, 0.045);

    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / Math.max(1, el.clientHeight), 0.01, 100);
    camera.position.set(1.85, 1.35, 1.95);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.5, 0.45, 0.45);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffe4b5, 1.1);
    key.position.set(2, 3, 1);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x93c5fd, 0.45);
    fill.position.set(-2, 1, -1);
    scene.add(fill);

    // 未使用的 box 变量清理
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
      new THREE.LineBasicMaterial({ color: 0x3f3f46 })
    );
    frame.position.set(0.5, 0.5, 0.5);
    scene.add(frame);

    const axis = new THREE.AxesHelper(1.15);
    scene.add(axis);

    const labelCanvas = (text: string, color: string) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 64;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.font = 'bold 28px ui-sans-serif, system-ui';
      ctx.fillText(text, 8, 40);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(0.45, 0.12, 1);
      return spr;
    };
    const lx = labelCanvas('r 亲缘', '#fbbf24');
    lx.position.set(1.12, 0.02, 0.02);
    const ly = labelCanvas('Δt 认知', '#38bdf8');
    ly.position.set(0.02, 1.12, 0.02);
    const lz = labelCanvas('P_audit', '#a78bfa');
    lz.position.set(0.02, 0.02, 1.12);
    scene.add(lx, ly, lz);

    // 相区标注精灵
    const utilLabel = labelCanvas('功利主义作为相 U>0', '#4ade80');
    utilLabel.position.set(0.2, 0.85, 0.15);
    const deonLabel = labelCanvas('义务论不作为相 U<0', '#fb7185');
    deonLabel.position.set(0.75, 0.2, 0.85);
    scene.add(utilLabel, deonLabel);

    poolRef.current = new SurfaceWorkerPool(2);

    let surface: THREE.Mesh | null = null;
    let arrows: THREE.LineSegments | null = null;
    let cloud: THREE.Points | null = null;
    let disposed = false;

    const clearDynamic = () => {
      if (surface) {
        scene.remove(surface);
        disposeObject(surface);
        surface = null;
      }
      if (arrows) {
        scene.remove(arrows);
        disposeObject(arrows);
        arrows = null;
      }
      if (cloud) {
        scene.remove(cloud);
        disposeObject(cloud);
        cloud = null;
      }
    };

    const applyMesh = (
      positions: Float32Array,
      indices: Uint32Array,
      normals: Float32Array,
      arrowData: Float32Array,
      cloudData: Float32Array,
      withCloud: boolean,
      withArrows: boolean
    ) => {
      clearDynamic();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geo.setIndex(new THREE.BufferAttribute(indices, 1));
      geo.computeBoundingSphere();

      const mat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.15,
        roughness: 0.45,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        flatShading: false
      });
      surface = new THREE.Mesh(geo, mat);
      scene.add(surface);

      if (withArrows) {
        const aPos = new Float32Array((arrowData.length / 6) * 6);
        for (let i = 0; i < arrowData.length; i += 6) {
          const o = i;
          aPos[o] = arrowData[i];
          aPos[o + 1] = arrowData[i + 1];
          aPos[o + 2] = arrowData[i + 2];
          aPos[o + 3] = arrowData[i] + arrowData[i + 3];
          aPos[o + 4] = arrowData[i + 1] + arrowData[i + 4];
          aPos[o + 5] = arrowData[i + 2] + arrowData[i + 5];
        }
        const ageo = new THREE.BufferGeometry();
        ageo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
        arrows = new THREE.LineSegments(
          ageo,
          new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.85 })
        );
        scene.add(arrows);
      }

      if (withCloud) {
        const n = cloudData.length / 4;
        const cPos = new Float32Array(n * 3);
        const cCol = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const o = i * 4;
          cPos[i * 3] = cloudData[o];
          cPos[i * 3 + 1] = cloudData[o + 1];
          cPos[i * 3 + 2] = cloudData[o + 2];
          const util = cloudData[o + 3] > 0;
          cCol[i * 3] = util ? 0.3 : 0.95;
          cCol[i * 3 + 1] = util ? 0.85 : 0.35;
          cCol[i * 3 + 2] = util ? 0.45 : 0.45;
        }
        const cgeo = new THREE.BufferGeometry();
        cgeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
        cgeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
        cloud = new THREE.Points(
          cgeo,
          new THREE.PointsMaterial({
            size: 0.018,
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            depthWrite: false
          })
        );
        scene.add(cloud);
      }
    };

    const rebuild = async (p: TrolleyParams, withCloud: boolean, withArrows: boolean) => {
      setBusy(true);
      try {
        const pool = poolRef.current;
        if (pool) {
          const mesh = await pool.build(p, { resR: 52, resDt: 40, cloudN: 2800 });
          if (disposed) return;
          applyMesh(mesh.positions, mesh.indices, mesh.normals, mesh.arrows, mesh.cloud, withCloud, withArrows);
        } else {
          const mesh = buildZeroSurface({ params: p, resR: 52, resDt: 40, arrowStride: 5 });
          const { sampleDecisionCloud } = await import('../sim/trolley/ethicsModel');
          const cloudData = sampleDecisionCloud(p, 2800);
          applyMesh(mesh.positions, mesh.indices, mesh.normals, mesh.arrows, cloudData, withCloud, withArrows);
        }
      } catch (e) {
        console.warn('worker fallback', e);
        const mesh = buildZeroSurface({ params: p, resR: 40, resDt: 32, arrowStride: 5 });
        const { sampleDecisionCloud } = await import('../sim/trolley/ethicsModel');
        const cloudData = sampleDecisionCloud(p, 1800);
        if (!disposed) {
          applyMesh(mesh.positions, mesh.indices, mesh.normals, mesh.arrows, cloudData, withCloud, withArrows);
        }
      } finally {
        if (!disposed) setBusy(false);
      }
    };

    sceneApi.current = { rebuild };

    void rebuild(DEFAULT_TROLLEY_PARAMS, true, true);

    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      poolRef.current?.dispose();
      poolRef.current = null;
      clearDynamic();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
      sceneApi.current = null;
    };
  }, []);

  // 参数变化时重建
  useEffect(() => {
    const api = sceneApi.current;
    if (!api) return;
    const t = window.setTimeout(() => {
      void api.rebuild(params, showCloud, showArrows);
    }, 120);
    return () => clearTimeout(t);
  }, [params, showCloud, showArrows]);

  const setNum = (key: keyof TrolleyParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const goBack = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <header className="shrink-0 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur px-4 py-3 z-20">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              返回研讨
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                电车难题 · 道德直觉零势能相界面
              </h1>
              <p className="text-[11px] text-neutral-500 font-mono truncate">{formula}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {busy && <span className="text-amber-400 animate-pulse">Worker 重建曲面…</span>}
            <button
              type="button"
              onClick={() => setParams({ ...DEFAULT_TROLLEY_PARAMS })}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置参数
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div ref={mountRef} className="flex-1 min-h-[420px] lg:min-h-0 relative" />

        <aside className="w-full lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-800 bg-neutral-900/60 p-4 space-y-4 overflow-y-auto max-h-[46vh] lg:max-h-none">
          <div className="flex items-start gap-2 text-[12px] text-neutral-400 leading-relaxed">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p>
              琥珀色曲面为 <span className="text-amber-300">U_net = 0</span> 等值相界。青色箭头沿{' '}
              <span className="text-cyan-300">−∇U</span>，指向义务论「不作为相」坍缩方向。绿点=拉动杠杆（功利），红点=不作为（义务）。
            </p>
          </div>

          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>α 亲缘权重</span>
              <span className="tabular-nums text-amber-200">{params.alpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.05}
              value={params.alpha}
              onChange={e => setNum('alpha', Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>C_punish 责任惩罚</span>
              <span className="tabular-nums text-violet-200">{params.cPunish.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={12}
              step={0.05}
              value={params.cPunish}
              onChange={e => setNum('cPunish', Number(e.target.value))}
              className="w-full accent-violet-500"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>γ 亲缘非线性</span>
              <span className="tabular-nums">{params.gamma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={3.5}
              step={0.05}
              value={params.gamma}
              onChange={e => setNum('gamma', Number(e.target.value))}
              className="w-full accent-neutral-400"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>η₀ 时间压力偏置</span>
              <span className="tabular-nums">{params.eta0.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={0.05}
              value={params.eta0}
              onChange={e => setNum('eta0', Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </label>

          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>σ 噪声幅度</span>
              <span className="tabular-nums">{params.sigma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1.2}
              step={0.02}
              value={params.sigma}
              onChange={e => setNum('sigma', Number(e.target.value))}
              className="w-full accent-rose-400"
            />
          </label>

          <div className="flex flex-col gap-2 text-xs pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showArrows} onChange={e => setShowArrows(e.target.checked)} />
              显示相变梯度箭头 (−∇U)
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showCloud} onChange={e => setShowCloud(e.target.checked)} />
              显示蒙特卡洛决策云
            </label>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-black/40 p-3 text-[11px] text-neutral-500 space-y-1 font-mono">
            <div>ΔV_base = {params.deltaVBase.toFixed(1)}</div>
            <div>η(Δt) = η₀·e^(−λ·Δt)</div>
            <div>噪声 ~ N(0, (σ·e^(−λ·Δt))²)</div>
            <div className="pt-1 text-neutral-600">拖拽旋转 · 滚轮缩放</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TrolleyEthicsPage;
