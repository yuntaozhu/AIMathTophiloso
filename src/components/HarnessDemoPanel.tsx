import React, { useState } from 'react';
import {
  Shield,
  X,
  Play,
  CheckCircle2,
  XCircle,
  GitBranch,
  ScrollText,
  AlertTriangle
} from 'lucide-react';
import type { HarnessRun } from '../services/harnessRunner';

interface HarnessDemoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  slideIndex: number;
}

const PRESETS = [
  {
    id: 'passish',
    label: '示范断言（可过门禁）',
    text: '邓煜指出无穷维相空间中奇异性在特定测度下具有正概率；将余维数-1 临界流形映射到制度薄膜后，可用罗尔斯无知之幕仿真检验：资源匮乏冲击下差异原则契约遵从率是否断崖式下跌。'
  },
  {
    id: 'fail-stale',
    label: '故意踩负知识',
    text: '只要对齐人类偏好、RLHF 即可保证多智能体仿真无害；仿真成功即证明制度设计为真理。'
  },
  {
    id: 'fail-cite',
    label: '故意无底本',
    text: '火星殖民议会的以太灵知学已经彻底解决了主权概念的跨语际漂移问题。'
  }
];

export const HarnessDemoPanel: React.FC<HarnessDemoPanelProps> = ({
  isOpen,
  onClose,
  slideIndex
}) => {
  const [thesis, setThesis] = useState(PRESETS[0].text);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<HarnessRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/harness/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thesis,
          claimClass: 'hypothesis',
          slideIndex
        })
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.error || 'Harness 运行失败');
      }
      setResult(data.run as HarnessRun);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-neutral-100">
                Model + Harness 示范层
              </h2>
              <p className="text-xs text-amber-200/80 mt-0.5">
                远期学术治理原型 · 默认关闭 · 非本场研讨主路径（建议在 P.64 讲解释学双循环时打开）
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setThesis(p.text);
                  setResult(null);
                }}
                className="px-2.5 py-1 rounded-md text-[11px] border border-neutral-700 bg-neutral-800/80 text-neutral-300 hover:border-amber-500/50 hover:text-amber-200"
              >
                {p.label}
              </button>
            ))}
          </div>

          <label className="block text-xs text-neutral-400">
            假设断言（hypothesis）
            <textarea
              value={thesis}
              onChange={e => setThesis(e.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-lg bg-neutral-950 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60 resize-y"
            />
          </label>

          <button
            type="button"
            onClick={handleRun}
            disabled={running || !thesis.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium"
          >
            <Play className={`w-4 h-4 ${running ? 'animate-pulse' : ''}`} />
            {running ? '跑门禁中…' : '跑一轮三道 Gate'}
          </button>

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-3 border-t border-neutral-800 pt-4">
              <div
                className={`flex items-center gap-2 text-sm font-semibold ${
                  result.passed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.passed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {result.passed
                  ? '三道门 exit 0 — 可记入示范审计（仍非研讨终稿）'
                  : '存在 exit 1 — 禁止写入终稿，仅可重试/回滚'}
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed">{result.demoDisclaimer}</p>

              <div className="space-y-2">
                {result.gates.map(g => (
                  <div
                    key={g.name}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      g.passed
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-rose-500/30 bg-rose-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-neutral-200">
                        {g.name === 'citation'
                          ? 'Gate1 史料底本'
                          : g.name === 'counterfactual'
                            ? 'Gate2 反事实扰动'
                            : 'Gate3 负知识'}
                      </span>
                      <span className={g.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        exit {g.exitCode}
                      </span>
                    </div>
                    {g.remediation && (
                      <p className="mt-1 text-rose-200/90">{g.remediation}</p>
                    )}
                    {g.name === 'citation' && g.passed && (g.evidence as any)?.sourceTitle && (
                      <p className="mt-1 text-neutral-400">
                        锚定：{(g.evidence as any).sourceTitle}（sim=
                        {(g.evidence as any).similarity}）
                      </p>
                    )}
                    {g.name === 'counterfactual' && (g.evidence as any)?.falsificationHint && (
                      <p className="mt-1 text-neutral-400">{(g.evidence as any).falsificationHint}</p>
                    )}
                    {g.name === 'negative_knowledge' && !g.passed && (
                      <ul className="mt-1 list-disc list-inside text-neutral-400">
                        {((g.evidence as any)?.hits || []).slice(0, 3).map((h: any, i: number) => (
                          <li key={i}>{h.reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {result.fork && (
                <div className="rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-1.5 text-neutral-200 font-medium mb-1">
                    <GitBranch className="w-3.5 h-3.5" />
                    示范分叉
                  </div>
                  <p>A：{result.fork.pathA}</p>
                  <p className="mt-0.5">B：{result.fork.pathB}</p>
                  <p className="mt-1 text-neutral-500">{result.fork.note}</p>
                </div>
              )}

              <div className="rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-200 font-medium mb-1">
                  <ScrollText className="w-3.5 h-3.5" />
                  审计推演流
                </div>
                <ol className="space-y-1 text-neutral-400">
                  {result.auditTrace.map((n, i) => (
                    <li key={i}>
                      <span className="text-neutral-500">{n.step}</span> — {n.detail}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
