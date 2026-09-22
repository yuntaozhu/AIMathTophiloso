import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  MessageSquareQuote, 
  HelpCircle, 
  FileCode,
  BookMarked,
  Lightbulb,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SlideItem, ChatMessage } from '../types';
import { SEMINAR_SLIDES } from '../data/slides';
import { PresenterStudyNotesModal } from './PresenterStudyNotesModal';
import { getPresenterStudyNote } from '../data/presenterNotes';
import { getPresenterPaceHint, toolLabel } from '../data/presenterPaceHints';

const PACE_STYLE: Record<string, string> = {
  '开场': 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  '深讲': 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  '快翻': 'bg-neutral-700/40 text-neutral-400 border-neutral-600/50',
  '共议': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  '沙盒': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
  '收束': 'bg-rose-500/15 text-rose-300 border-rose-500/40'
};

interface PresentationViewerProps {
  currentSlide: SlideItem;
  currentIndex: number;
  totalSlides: number;
  onNavigateSlide: (index: number) => void;
  isPresenter: boolean;
  onLaserMove?: (pos: { x: number; y: number } | null) => void;
  laserPointerPos?: { x: number; y: number } | null;
  onSelectHighlightText: (text: string) => void;
  barrageMessages: ChatMessage[];
  barrageEnabled: boolean;
  onSendToSandbox?: (code: string, title?: string) => void;
  onQuickAsk?: (question: string) => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  currentSlide,
  currentIndex,
  totalSlides,
  onNavigateSlide,
  isPresenter,
  onLaserMove,
  laserPointerPos,
  onSelectHighlightText,
  barrageMessages,
  barrageEnabled,
  onSendToSandbox,
  onQuickAsk
}) => {
  const [laserActive, setLaserActive] = useState<boolean>(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [showFullNotesModal, setShowFullNotesModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideContentRef = useRef<HTMLDivElement>(null);

  const currentStudyNote = getPresenterStudyNote(currentSlide);
  const paceHint = getPresenterPaceHint(currentIndex);
  const paceTool = toolLabel(paceHint.tool);

  // KaTeX formula renderer helper
  const renderFormula = (latexStr: string) => {
    try {
      return {
        __html: katex.renderToString(latexStr, {
          displayMode: true,
          throwOnError: false
        })
      };
    } catch (e) {
      return { __html: latexStr };
    }
  };

  // Laser pointer broadcast
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!laserActive || !isPresenter || !onLaserMove) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onLaserMove({ x, y });
  };

  const handleMouseLeave = () => {
    if (laserActive && isPresenter && onLaserMove) {
      onLaserMove(null);
    }
  };

  // Text selection detection for context-aware questions
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionBox(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length > 2) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const parentRect = containerRef.current?.getBoundingClientRect();
      if (parentRect) {
        setSelectionBox({
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top - 38
        });
      }
    } else {
      setSelectionBox(null);
    }
  };

  // Keyboard navigation & Shortcuts (N key toggles notes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (currentIndex < totalSlides) onNavigateSlide(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 1) onNavigateSlide(currentIndex - 1);
      } else if (e.key === 'n' || e.key === 'N') {
        setShowFullNotesModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalSlides, onNavigateSlide]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden select-text"
      onMouseUp={handleMouseUp}
    >
      {/* Floating Barrage Overlay */}
      {barrageEnabled && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {barrageMessages.slice(-8).map((msg, idx) => {
            const topPercent = 8 + (idx % 6) * 14;
            return (
              <div 
                key={msg.id}
                className="absolute whitespace-nowrap text-xs md:text-sm font-medium px-3 py-1 rounded-full bg-neutral-900/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm shadow-md animate-barrage-fly"
                style={{ top: `${topPercent}%`, animationDuration: `${12 + (idx % 4) * 2}s` }}
              >
                <span className="text-neutral-400 mr-1.5 font-normal">[{msg.sender}]:</span>
                <span>{msg.content}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Laser pointer circle */}
      {laserPointerPos && (
        <div 
          className="absolute w-4 h-4 rounded-full bg-red-500 pointer-events-none z-30 shadow-[0_0_12px_#ef4444] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${laserPointerPos.x * 100}%`,
            top: `${laserPointerPos.y * 100}%`
          }}
        />
      )}

      {/* Selection context popover */}
      {selectionBox && selectedText && (
        <div 
          className="absolute z-40 transform -translate-x-1/2 bg-neutral-900 border border-amber-500/50 rounded-lg shadow-xl px-2 py-1 flex items-center space-x-1.5 animate-fade-in"
          style={{ left: selectionBox.x, top: selectionBox.y }}
        >
          <button
            onClick={() => {
              onSelectHighlightText(selectedText);
              setSelectionBox(null);
            }}
            className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-0.5 rounded hover:bg-neutral-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>引用此论点向 AI 发问</span>
          </button>
        </div>
      )}

      {/* Main Slide Card Container */}
      <div 
        className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full select-text"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={slideContentRef}
      >
        {/* Slide Top Meta: Section, Progress, Keywords & Presenter Notes Trigger */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 text-xs text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-amber-500 font-bold text-sm tracking-wider">
              SLIDE {String(currentIndex).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
            {currentSlide.sectionTitle && (
              <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                {currentSlide.sectionTitle}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded border font-semibold tracking-wide ${PACE_STYLE[paceHint.pace] || PACE_STYLE['快翻']}`}
              title={paceHint.tip}
            >
              控台·{paceHint.pace}
              {paceTool ? ` · ${paceTool}` : ''}
            </span>
            {/* Quick Open Study Notes Button in Top Header */}
            <button
              onClick={() => setShowFullNotesModal(true)}
              className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium transition-colors"
              title="打开主讲人全景研究手记 (快捷键: N)"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>主讲研究手记</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {currentSlide.keywords && currentSlide.keywords.map((kw, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800/80 shrink-0">
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* 主讲节奏提示条（P0-5） */}
        <div className="mt-2 flex items-start gap-2 text-[11px] text-neutral-400 bg-neutral-900/50 border border-neutral-800/80 rounded-lg px-2.5 py-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-neutral-300 font-medium">{paceHint.pace}：</span>
            {paceHint.tip}
          </p>
        </div>

        {/* Slide Main Content Area */}
        <div className="flex-1 my-4 flex flex-col justify-center space-y-5 animate-fade-in">
          {/* Title and Subtitle */}
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-100 tracking-tight leading-snug">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="mt-2 text-base md:text-xl text-neutral-400 font-light leading-relaxed">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Details / Text description */}
          {currentSlide.details && (
            <div className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-3xl whitespace-pre-line border-l-2 border-amber-500/50 pl-4 py-1">
              {currentSlide.details}
            </div>
          )}

          {/* Bullet Items */}
          {currentSlide.bullets && currentSlide.bullets.length > 0 && (
            <ul className="space-y-3.5 my-2 max-w-4xl">
              {currentSlide.bullets.map((bullet, idx) => {
                // Formatting markdown bold tags: **text**
                const parts = bullet.split(/\*\*(.*?)\*\*/g);
                return (
                  <li key={idx} className="flex items-start space-x-3 text-sm md:text-lg text-neutral-300 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-sm" />
                    <span>
                      {parts.map((p, pIdx) => 
                        pIdx % 2 === 1 ? (
                          <strong key={pIdx} className="text-amber-300 font-semibold">{p}</strong>
                        ) : (
                          p
                        )
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Formula Block */}
          {currentSlide.formula && (
            <div className="my-4 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-inner overflow-x-auto">
              <div 
                className="text-neutral-100 text-base md:text-xl text-center"
                dangerouslySetInnerHTML={renderFormula(currentSlide.formula)}
              />
            </div>
          )}

          {/* Quote Block */}
          {currentSlide.quote && (
            <div className="my-3 p-4 rounded-xl bg-gradient-to-r from-amber-950/20 to-neutral-900 border border-amber-900/30 flex items-start space-x-3">
              <MessageSquareQuote className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm md:text-base italic text-amber-100/90 font-serif leading-relaxed">
                  “{currentSlide.quote.text}”
                </p>
                <p className="mt-1 text-xs text-amber-400/80 font-medium">
                  —— {currentSlide.quote.author}
                </p>
              </div>
            </div>
          )}

          {/* Code Snippet Block */}
          {currentSlide.codeSnippet && (
            <div className="my-3 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden font-mono text-xs md:text-sm">
              <div className="px-3 py-1.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-neutral-400 text-xs">
                <span className="flex items-center space-x-1.5">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>本体论可执行代码操作化 (Ontology as Code)</span>
                </span>
                {onSendToSandbox && (
                  <button
                    onClick={() => onSendToSandbox(currentSlide.codeSnippet || '', `P.${currentSlide.index} 课件代码操作化`)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    载入沙盒运行 →
                  </button>
                )}
              </div>
              <pre className="p-4 overflow-x-auto text-amber-200/90 leading-relaxed">
                <code>{currentSlide.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Presenter Quick Study Notes Drawer (Collapsible bottom bar with rich breakdown) */}
        {showNotesDrawer && (
          <div className="mt-3 p-3.5 rounded-xl bg-neutral-900/95 border border-amber-500/40 text-xs text-neutral-300 animate-slide-up space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-semibold text-amber-400">
                <BookMarked className="w-4 h-4" />
                <span>P.{currentIndex} 主讲人精粹手记：{currentStudyNote.coreThesis}</span>
              </div>
              <button
                onClick={() => setShowFullNotesModal(true)}
                className="text-[11px] text-amber-400 hover:underline flex items-center space-x-0.5"
              >
                <span>展开全屏详尽手记</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-neutral-800 text-[11px]">
              <div className="bg-neutral-950/60 p-2 rounded border border-neutral-800">
                <span className="text-amber-400 font-medium block mb-1">【主讲推导演进】</span>
                <ul className="space-y-1 list-disc list-inside text-neutral-300">
                  {currentStudyNote.pedagogicalKeypoints.slice(0, 2).map((k, i) => (
                    <li key={i} className="line-clamp-2">{k}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-950/60 p-2 rounded border border-neutral-800">
                <span className="text-emerald-400 font-medium block mb-1">【通俗隐喻与答辩】</span>
                <p className="italic text-neutral-300 line-clamp-2">“{currentStudyNote.crossDomainAnalogy}”</p>
                <p className="text-red-400 mt-1 line-clamp-1">{currentStudyNote.falsificationOrTrap}</p>
              </div>
            </div>
          </div>
        )}

        {/* Slide Bottom Bar Controls */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          {/* Left Navigation Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => currentIndex > 1 && onNavigateSlide(currentIndex - 1)}
              disabled={currentIndex <= 1}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 border border-neutral-800 transition-colors"
              title="上一页 (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => currentIndex < totalSlides && onNavigateSlide(currentIndex + 1)}
              disabled={currentIndex >= totalSlides}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 border border-neutral-800 transition-colors"
              title="下一页 (→ 或 空格)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Quick Slide Selector */}
            <select
              value={currentIndex}
              onChange={(e) => onNavigateSlide(Number(e.target.value))}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500 max-w-[260px] truncate"
            >
              {Array.from({ length: totalSlides }, (_, i) => i + 1).map(n => {
                const item = SEMINAR_SLIDES[n - 1];
                const label = item ? item.title : `第${n}页`;
                const truncatedLabel = label.length > 24 ? label.slice(0, 22) + '...' : label;
                return (
                  <option key={n} value={n}>
                    P.{String(n).padStart(2, '0')} - {truncatedLabel}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Right Tools: Laser pointer, Notes, Fullscreen */}
          <div className="flex items-center space-x-2">
            {isPresenter && (
              <button
                onClick={() => setLaserActive(!laserActive)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs border transition-colors ${
                  laserActive
                    ? 'bg-red-950/60 border-red-500/60 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title="开启/关闭激光教鞭广播"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>激光笔</span>
              </button>
            )}

            {/* Quick Drawer Toggle */}
            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                showNotesDrawer
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title="切换底部速查手记"
            >
              速查手记
            </button>

            {/* Full Dedicated Presenter Study Notes Modal Trigger */}
            <button
              onClick={() => setShowFullNotesModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors font-semibold"
              title="打开完整研究手记与深度讲解指南 (N)"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>详尽研究手记</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition-colors"
              title="全屏演示"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Presenter Study Notes Modal */}
      <PresenterStudyNotesModal
        isOpen={showFullNotesModal}
        onClose={() => setShowFullNotesModal(false)}
        currentSlide={currentSlide}
        onSendToSandbox={onSendToSandbox}
        onQuickAsk={onQuickAsk}
      />
    </div>
  );
};
