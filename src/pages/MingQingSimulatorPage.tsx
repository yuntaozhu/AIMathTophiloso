import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  ArrowLeft,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  FastForward,
  ShieldAlert,
  Map
} from 'lucide-react';
import {
  AuditEvent,
  precomputeTrajectory,
  RunResult,
  ScenarioId,
  SCENARIO_META,
  SimState
} from '../sim/mingqing';

const SCENARIOS = Object.keys(SCENARIO_META) as ScenarioId[];

const EVENT_MARKERS = [
  { year: 1639, label: '1639 白银断流' },
  { year: 1642, label: '1642 松锦之战' },
  { year: 1644, label: '1644 甲申之变' }
];

function readScenarioFromUrl(): ScenarioId {
  const hash = window.location.hash || '';
  const q = hash.includes('?') ? hash.split('?')[1] : window.location.search.replace(/^\?/, '');
  const sp = new URLSearchParams(q);
  const s = sp.get('scenario') as ScenarioId | null;
  if (s && SCENARIOS.includes(s)) return s;
  return 'baseline';
}

function TopologyMap({ state }: { state: SimState }) {
  const seCp = Math.max(2, state.linkSE_CP * 10);
  const cpLd = Math.max(2, state.linkCP_LD * 10);
  const blocked = state.linkCP_LD < 0.35;
  return (
    <svg viewBox="0 0 640 220" className="w-full h-full">
      <defs>
        <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="640" height="220" fill="#0a0a0b" rx="12" />
      {/* links */}
      <line
        x1="120"
        y1="110"
        x2="320"
        y2="110"
        stroke="url(#flow)"
        strokeWidth={seCp}
        opacity={0.85}
      />
      <line
        x1="320"
        y1="110"
        x2="520"
        y2="110"
        stroke={blocked ? '#ef4444' : 'url(#flow)'}
        strokeWidth={cpLd}
        opacity={0.9}
        strokeDasharray={blocked ? '8 6' : undefined}
      />
      {blocked && (
        <text x="400" y="88" fill="#f87171" fontSize="12" fontFamily="ui-sans-serif">
          陆路阻断红光
        </text>
      )}
      {/* nodes */}
      {[
        { x: 120, y: 110, title: '东南 SE', sub: `I_Ag=${state.I_Ag.toFixed(2)}`, color: '#38bdf8' },
        { x: 320, y: 110, title: '中原 CP', sub: `R=${state.R_CP.toFixed(2)} E=${state.E_CP.toFixed(2)}`, color: '#fbbf24' },
        { x: 520, y: 110, title: '辽东 LD', sub: `D=${state.D_LD.toFixed(2)}`, color: state.D_LD < 0.15 ? '#ef4444' : '#a78bfa' }
      ].map(n => (
        <g key={n.title}>
          <circle cx={n.x} cy={n.y} r="36" fill="#171717" stroke={n.color} strokeWidth="2.5" />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fill="#fafafa" fontSize="13" fontWeight="700">
            {n.title}
          </text>
          <text x={n.x} y={n.y + 14} textAnchor="middle" fill="#a3a3a3" fontSize="10">
            {n.sub}
          </text>
        </g>
      ))}
      <text x="320" y="28" textAnchor="middle" fill="#737373" fontSize="12">
        三节点物流拓扑 · 线宽∝通畅度
      </text>
    </svg>
  );
}

function MetricPill({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        warn ? 'border-rose-500/40 bg-rose-500/10' : 'border-neutral-800 bg-neutral-900/80'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`text-lg font-semibold tabular-nums ${warn ? 'text-rose-300' : 'text-neutral-100'}`}>
        {value}
      </div>
    </div>
  );
}

export const MingQingSimulatorPage: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioId>(() => readScenarioFromUrl());
  const [result, setResult] = useState<RunResult | null>(null);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const logRef = useRef<HTMLDivElement>(null);

  const recompute = useCallback((id: ScenarioId) => {
    const r = precomputeTrajectory(id);
    setResult(r);
    setFrameIdx(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    recompute(scenario);
  }, [scenario, recompute]);

  useEffect(() => {
    if (!playing || !result) return;
    const ms = Math.max(16, 80 / speed);
    const id = window.setInterval(() => {
      setFrameIdx(i => {
        if (i >= result.frames.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, ms);
    return () => clearInterval(id);
  }, [playing, speed, result]);

  const frame = result?.frames[frameIdx];
  const state = frame?.state;

  const visibleLog: AuditEvent[] = useMemo(() => {
    if (!result || !state) return [];
    return result.auditLog.filter(e => e.t <= state.t + 1e-6).slice(-80);
  }, [result, state]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [visibleLog.length, frameIdx]);

  const chartOption = useMemo(() => {
    if (!result) return {};
    const upto = result.frames.slice(0, frameIdx + 1);
    const years = upto.map(f => f.state.t);
    const markLines = EVENT_MARKERS.map(m => ({
      xAxis: m.year,
      label: { formatter: m.label, color: '#a3a3a3', fontSize: 10 },
      lineStyle: { color: '#525252', type: 'dashed' as const }
    }));

    return {
      backgroundColor: 'transparent',
      animation: false,
      legend: {
        data: ['E_CP 税负', '生存缓冲', 'R_CP 流民', 'D_LD 战力', '国库银', '粮库存'],
        textStyle: { color: '#a3a3a3', fontSize: 11 },
        top: 0
      },
      grid: { left: 48, right: 24, top: 36, bottom: 36 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        min: 1628,
        max: 1655,
        name: '年',
        axisLabel: { color: '#737373' },
        splitLine: { lineStyle: { color: '#262626' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#737373' },
        splitLine: { lineStyle: { color: '#262626' } }
      },
      series: [
        {
          name: 'E_CP 税负',
          type: 'line',
          showSymbol: false,
          data: years.map((t, i) => [t, upto[i].state.E_CP]),
          color: '#fbbf24',
          markLine: { symbol: 'none', data: markLines }
        },
        {
          name: '生存缓冲',
          type: 'line',
          showSymbol: false,
          data: years.map(t => [t, 1.55]),
          color: '#64748b',
          lineStyle: { type: 'dashed', width: 1 }
        },
        {
          name: 'R_CP 流民',
          type: 'line',
          showSymbol: false,
          data: years.map((t, i) => [t, upto[i].state.R_CP]),
          color: '#ef4444'
        },
        {
          name: 'D_LD 战力',
          type: 'line',
          showSymbol: false,
          data: years.map((t, i) => [t, upto[i].state.D_LD]),
          color: '#a78bfa'
        },
        {
          name: '国库银',
          type: 'line',
          showSymbol: false,
          data: years.map((t, i) => [t, upto[i].state.treasurySilver]),
          color: '#38bdf8'
        },
        {
          name: '粮库存',
          type: 'line',
          showSymbol: false,
          data: years.map((t, i) => [t, upto[i].state.grainStock]),
          color: '#4ade80'
        }
      ]
    };
  }, [result, frameIdx]);

  const goBack = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 justify-between">
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
                明清财政困局 · 三节点动力学 + Harness
              </h1>
              <p className="text-[11px] text-neutral-500 truncate">
                1628–1655 · Δt=0.1 · Forward Euler · 负知识库 / 物理沙箱 / 刚性断言
              </p>
            </div>
          </div>
          <select
            value={scenario}
            onChange={e => setScenario(e.target.value as ScenarioId)}
            className="bg-neutral-900 border border-neutral-700 rounded-lg text-sm px-3 py-2 max-w-[280px]"
          >
            {SCENARIOS.map(id => (
              <option key={id} value={id}>
                {SCENARIO_META[id].label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <p className="text-sm text-neutral-400">{SCENARIO_META[scenario].blurb}</p>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-3">
          <button
            type="button"
            onClick={() => setPlaying(p => !p)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? '暂停' : '播放'}
          </button>
          <button
            type="button"
            onClick={() => setFrameIdx(i => Math.min((result?.frames.length ?? 1) - 1, i + 1))}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            <SkipForward className="w-4 h-4" />
            步进
          </button>
          <button
            type="button"
            onClick={() => {
              setFrameIdx(0);
              setPlaying(false);
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <div className="inline-flex items-center gap-2 text-sm text-neutral-400 ml-1">
            <FastForward className="w-4 h-4" />
            倍速
            {[0.5, 1, 2, 4].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded ${speed === s ? 'bg-sky-600 text-white' : 'bg-neutral-800'}`}
              >
                {s}×
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm tabular-nums text-amber-200/90 font-medium">
            t = {state?.t.toFixed(1) ?? '—'} 年
            {result?.phaseShiftYear != null && state && state.t >= result.phaseShiftYear && (
              <span className="ml-2 text-rose-400">· 相变已触发</span>
            )}
          </div>
        </div>

        {state && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <MetricPill label="E_CP 税负" value={state.E_CP.toFixed(2)} warn={state.E_CP > 1.55} />
            <MetricPill label="R_CP 流民" value={state.R_CP.toFixed(2)} warn={state.R_CP > 0.7} />
            <MetricPill label="D_LD 战力" value={state.D_LD.toFixed(2)} warn={state.D_LD < 0.2} />
            <MetricPill label="θ 剪刀差" value={state.theta.toFixed(2)} />
            <MetricPill label="国库银" value={state.treasurySilver.toFixed(2)} warn={state.treasurySilver < 0.25} />
            <MetricPill label="粮库存" value={state.grainStock.toFixed(2)} warn={state.grainStock < 0.25} />
            {scenario === 'active_relocation_1642' && (
              <MetricPill label="P_survive" value={state.P_survive.toFixed(2)} />
            )}
            {scenario === 'qing_northern_deadlock' && (
              <>
                <MetricPill label="R_North" value={state.R_North.toFixed(2)} warn={state.R_North > 0.6} />
                <MetricPill
                  label="八旗动员"
                  value={state.bannerMobilization.toFixed(2)}
                  warn={state.bannerMobilization > 0.9}
                />
              </>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-3">
            <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              动力学曲线
            </div>
            <div className="h-[340px]">
              <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-900/40 p-3">
            <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
              <Map className="w-4 h-4 text-violet-400" />
              空间网络
            </div>
            <div className="h-[200px]">{state && <TopologyMap state={state} />}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-400">
              <div className="rounded-lg bg-neutral-950/80 border border-neutral-800 p-2">
                银水位
                <div className="mt-1 h-2 rounded bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all"
                    style={{ width: `${Math.min(100, (state?.treasurySilver ?? 0) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-neutral-950/80 border border-neutral-800 p-2">
                粮水位
                <div className="mt-1 h-2 rounded bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(100, (state?.grainStock ?? 0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Harness 审计日志（Append-Only）
          </div>
          <div
            ref={logRef}
            className="h-48 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 bg-black/40 rounded-lg p-3 border border-neutral-900"
          >
            {visibleLog.map((e, i) => (
              <div
                key={`${e.t}-${i}-${e.message.slice(0, 24)}`}
                className={
                  e.blocked
                    ? 'text-rose-400'
                    : e.message.includes('PHASE')
                      ? 'text-amber-300'
                      : e.gate === 'scenario'
                        ? 'text-sky-300'
                        : 'text-neutral-400'
                }
              >
                <span className="text-neutral-600">[{e.t.toFixed(1)}]</span> {e.message}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-neutral-600 pb-6">
          引擎路径：<code className="text-neutral-500">src/sim/mingqing/</code>
          （Engine · Harness · Scenarios · Audit · View）。深链：
          <code className="text-neutral-500">/#/sim/ming-qing?scenario=baseline</code>
        </p>
      </main>
    </div>
  );
};

export default MingQingSimulatorPage;
