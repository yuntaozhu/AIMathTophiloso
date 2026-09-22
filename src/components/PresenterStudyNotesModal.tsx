import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  BookMarked, 
  Lightbulb, 
  Compass, 
  HelpCircle, 
  ShieldAlert, 
  PenTool, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { SlideItem, PresenterStudyNote } from '../types';
import { getPresenterStudyNote } from '../data/presenterNotes';

interface PresenterStudyNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideItem;
  onSendToSandbox?: (code: string, title?: string) => void;
  onQuickAsk?: (question: string) => void;
}

export const PresenterStudyNotesModal: React.FC<PresenterStudyNotesModalProps> = ({
  isOpen,
  onClose,
  currentSlide,
  onSendToSandbox,
  onQuickAsk
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const note: PresenterStudyNote = getPresenterStudyNote(currentSlide);

  if (!isOpen) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in select-text">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-400">
                  P.{currentSlide.index} / 68
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  主讲人全景研究手记与深度阐释
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-100 line-clamp-1 mt-0.5">
                {currentSlide.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(
                `【P.${currentSlide.index} 讲解手记】\n核心论点：${note.coreThesis}\n\n讲解要点：\n${note.pedagogicalKeypoints.map((k, i) => `${i+1}. ${k}`).join('\n')}\n\n通俗隐喻：${note.crossDomainAnalogy}\n\n防杠与答辩：${note.falsificationOrTrap}`,
                'all'
              )}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 transition-colors"
              title="复制完整手记内容至剪贴板"
            >
              {copiedSection === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>复制手记</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 flex items-center justify-center transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
          {/* 1. Core Thesis Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 via-neutral-900 to-neutral-950 border border-amber-500/30">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1.5">
              <Compass className="w-4 h-4" />
              <span>主讲核心论点与定调口径 (Core Thesis)</span>
            </div>
            <p className="text-neutral-100 font-medium leading-relaxed sm:text-base">
              {note.coreThesis}
            </p>
          </div>

          {/* 2. Epistemic Background & Academic Origin */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs">
              <Layers className="w-4 h-4" />
              <span>认识论背景与学术渊源（为何讲这页？破除何种误区？）</span>
            </div>
            <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
              {note.epistemicBackground}
            </p>
          </div>

          {/* 3. Pedagogical Step-by-Step Delivery Points */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Lightbulb className="w-4 h-4" />
              <span>主讲人层层推导演讲要点 (Pedagogical Flow & Script)</span>
            </div>
            <div className="space-y-2.5">
              {note.pedagogicalKeypoints.map((pt, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-neutral-200">{pt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Cross-Domain Analogy */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-neutral-900 to-neutral-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>跨学科通俗生动隐喻（如何向不同背景听众讲懂？）</span>
            </div>
            <p className="text-neutral-200 text-xs sm:text-sm italic leading-relaxed bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
              “{note.crossDomainAnalogy}”
            </p>
          </div>

          {/* 5. Defense & Falsification Trap Guide */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-red-400 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>听众常见误区、反中庸辩难与提问应对指南 (Defense & Trap Handling)</span>
            </div>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {note.falsificationOrTrap}
            </p>
          </div>

          {/* 6. Blackboard / Sandbox Prompt */}
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-2.5">
              <PenTool className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-amber-400 block mb-0.5">
                  现场交互与板书建议 (Blackboard & Interactive Sandbox)
                </span>
                <p className="text-xs text-neutral-300">
                  {note.blackboardPrompt}
                </p>
              </div>
            </div>

            {currentSlide.codeSnippet && onSendToSandbox && (
              <button
                onClick={() => {
                  onSendToSandbox(currentSlide.codeSnippet || '', `P.${currentSlide.index} 课件代码操作化`);
                  onClose();
                }}
                className="shrink-0 flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>导入代码沙盒运行</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:px-6 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span>提示：可在快捷键模式下随时按 N 键唤醒/关闭主讲手记</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
          >
            关闭手记
          </button>
        </div>
      </div>
    </div>
  );
};
