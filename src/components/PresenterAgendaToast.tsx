import React, { useEffect } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';

interface PresenterAgendaToastProps {
  open: boolean;
  driftScore: number;
  reason: string;
  guidingQuestion: string;
  suggestSlideHint?: string;
  onDismiss: () => void;
  onAskGuiding?: () => void;
}

/** 主讲专用短提示：议程偏移时一屏可读完（P1-3） */
export const PresenterAgendaToast: React.FC<PresenterAgendaToastProps> = ({
  open,
  driftScore,
  reason,
  guidingQuestion,
  suggestSlideHint,
  onDismiss,
  onAskGuiding
}) => {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onDismiss, 14000);
    return () => window.clearTimeout(t);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-sm animate-fade-in">
      <div className="rounded-xl border border-amber-500/50 bg-neutral-950/95 shadow-2xl backdrop-blur px-3.5 py-3 text-xs text-neutral-100">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>建议收束 · 偏移 {driftScore}%</span>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-0.5 rounded text-neutral-500 hover:text-neutral-200"
            title="关闭"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-neutral-300 leading-relaxed line-clamp-2 mb-1.5">{reason}</p>
        {suggestSlideHint && (
          <p className="text-[10px] text-sky-300/90 mb-2">{suggestSlideHint}</p>
        )}
        <p className="text-[11px] text-neutral-400 mb-2 line-clamp-2">
          <span className="text-emerald-400 font-medium">可抛回：</span>
          {guidingQuestion}
        </p>
        {onAskGuiding && (
          <button
            type="button"
            onClick={onAskGuiding}
            className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-bold"
          >
            <span>用此追问收束讨论</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
