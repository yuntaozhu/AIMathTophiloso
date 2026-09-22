import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Database
} from 'lucide-react';
import { ResponseSource } from '../types';
import { ResponseSourceBadge } from './ResponseSourceBadge';

interface HumanNotes {
  anomaly?: string;
  strongestObjection?: string;
  unresolved?: string;
}

interface SeminarMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesText: string;
  minutesSource?: ResponseSource;
  isGenerating: boolean;
  onRegenerate: (humanNotes?: HumanNotes) => void | Promise<void>;
}

export const SeminarMinutesModal: React.FC<SeminarMinutesModalProps> = ({
  isOpen,
  onClose,
  minutesText,
  minutesSource,
  isGenerating,
  onRegenerate
}) => {
  const [copied, setCopied] = useState(false);
  const [anomaly, setAnomaly] = useState('');
  const [strongestObjection, setStrongestObjection] = useState('');
  const [unresolved, setUnresolved] = useState('');
  const [exportingJsonl, setExportingJsonl] = useState(false);

  if (!isOpen) return null;

  const humanNotes: HumanNotes = {
    anomaly: anomaly.trim() || undefined,
    strongestObjection: strongestObjection.trim() || undefined,
    unresolved: unresolved.trim() || undefined
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(minutesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([minutesText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `可计算认识论_研讨纪要_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJsonl = async () => {
    setExportingJsonl(true);
    try {
      const res = await fetch('/api/seminar/logs');
      const data = await res.json();
      const lines = (data.logs || []).map((l: unknown) => JSON.stringify(l)).join('\n');
      const blob = new Blob([lines + (lines ? '\n' : '')], { type: 'application/x-ndjson;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seminar-logs_${new Date().toISOString().slice(0, 10)}.jsonl`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExportingJsonl(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-neutral-100">
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-neutral-100 flex items-center flex-wrap gap-2">
                <span>本场按页研讨纪要</span>
                <ResponseSourceBadge source={minutesSource} />
              </h2>
              <p className="text-xs text-neutral-400 truncate">
                按课件页归类 · 会后补三句 · 可导出 MD / JSONL
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-end gap-2 shrink-0">
            <button
              onClick={() => onRegenerate(humanNotes)}
              disabled={isGenerating}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 text-xs border border-neutral-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>重新生成</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-neutral-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制'}</span>
            </button>

            <button
              onClick={handleExportJsonl}
              disabled={exportingJsonl}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 text-xs border border-neutral-700 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>导出 JSONL</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 MD</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 人工补记三句 */}
        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/80 grid grid-cols-1 md:grid-cols-3 gap-2 shrink-0">
          <label className="block text-[11px] text-neutral-400">
            现场调参反常
            <input
              value={anomaly}
              onChange={e => setAnomaly(e.target.value)}
              placeholder="例：稀缺冲击后违约率未升反降"
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-700 px-2 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block text-[11px] text-neutral-400">
            最强异议
            <input
              value={strongestObjection}
              onChange={e => setStrongestObjection(e.target.value)}
              placeholder="例：仿真无法承载意义剩余"
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-700 px-2 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block text-[11px] text-neutral-400">
            会后未决
            <input
              value={unresolved}
              onChange={e => setUnresolved(e.target.value)}
              placeholder="例：大基数锚定如何制度落地"
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-700 px-2 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
            />
          </label>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-neutral-950">
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 text-neutral-400">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm">正在按页归类问答 / 异议 / 沙盒结论…</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-amber max-w-none text-xs md:text-sm leading-relaxed">
              <ReactMarkdown>{minutesText}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
