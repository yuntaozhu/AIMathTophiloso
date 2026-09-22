import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { ResponseSource } from '../types';
import { ResponseSourceBadge } from './ResponseSourceBadge';

interface SeminarMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesText: string;
  minutesSource?: ResponseSource;
  isGenerating: boolean;
  onRegenerate: () => void;
}

export const SeminarMinutesModal: React.FC<SeminarMinutesModalProps> = ({
  isOpen,
  onClose,
  minutesText,
  minutesSource,
  isGenerating,
  onRegenerate
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

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
    a.download = `可计算认识论_研讨会纪要_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-neutral-100">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100 flex items-center space-x-2">
                <span>学术研讨会深度会议纪要</span>
                <ResponseSourceBadge source={minutesSource} />
              </h2>
              <p className="text-xs text-neutral-400">
                基于本场 seminar_logs 综合；离线讲稿请人工补三句现场结论
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 text-xs border border-neutral-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>重新综合</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-neutral-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制全文'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 Markdown</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-neutral-950">
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 text-neutral-400">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm">正在提炼全程学术研讨日志、结构化梳理核心争鸣与理论共识...</p>
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
