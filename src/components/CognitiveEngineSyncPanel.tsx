import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  Workflow, 
  Code2, 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  ExternalLink,
  Layers,
  Cpu,
  RefreshCw,
  Zap,
  BookOpen,
  BookMarked,
  Compass,
  Lightbulb,
  ShieldAlert,
  Network
} from 'lucide-react';
import { SlideItem, SlideEpistemicInsight, KaibanWorkflowResult, Citation } from '../types';
import { getPresenterStudyNote } from '../data/presenterNotes';
import { PresenterStudyNotesModal } from './PresenterStudyNotesModal';
import { ResponseSourceBadge } from './ResponseSourceBadge';

interface CognitiveEngineSyncPanelProps {
  currentSlide: SlideItem;
  insight: SlideEpistemicInsight | null;
  citations: Citation[];
  isLoadingInsight: boolean;
  onRefreshInsight: () => void;
  kaibanWorkflow: KaibanWorkflowResult | null;
  isRunningWorkflow: boolean;
  onTriggerWorkflow: () => void;
  onSendToSandbox: (code: string, title?: string) => void;
  onQuickAsk: (question: string) => void;
  onSelectCitation?: (citation: Citation) => void;
  onOpenOntologyGraph?: () => void;
}

export const CognitiveEngineSyncPanel: React.FC<CognitiveEngineSyncPanelProps> = ({
  currentSlide,
  insight,
  citations,
  isLoadingInsight,
  onRefreshInsight,
  kaibanWorkflow,
  isRunningWorkflow,
  onTriggerWorkflow,
  onSendToSandbox,
  onQuickAsk,
  onSelectCitation,
  onOpenOntologyGraph
}) => {
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const presenterNote = getPresenterStudyNote(currentSlide);

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs select-text">
      {/* Slide Real-time Cognitive Header */}
      <div className="p-3 bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl border border-amber-500/30 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-amber-400 font-bold text-[11px]">
              P.{currentSlide.index} 课件实时认知挂钩
            </span>
            <ResponseSourceBadge source={insight?.responseSource} />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotesModal(true)}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-semibold transition-colors"
              title="打开本页主讲人全景研究手记"
            >
              <BookMarked className="w-3 h-3" />
              <span>主讲手记</span>
            </button>
            <button
              onClick={onRefreshInsight}
              disabled={isLoadingInsight}
              className="flex items-center space-x-1 text-[10px] text-neutral-400 hover:text-amber-400 transition-colors disabled:opacity-50"
              title="重新触发 Gemini 高上下文 RAG 对该页课件的深度研读"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingInsight ? 'animate-spin text-amber-400' : ''}`} />
              <span>重新研读</span>
            </button>
          </div>
        </div>

        <h4 className="text-sm font-bold text-neutral-100 line-clamp-2 leading-snug">
          {currentSlide.title}
        </h4>
        {currentSlide.subtitle && (
          <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
            {currentSlide.subtitle}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mt-2.5">
          {insight?.paradigmTag && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              范式: {insight.paradigmTag}
            </span>
          )}
          {currentSlide.sectionTitle && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 border border-neutral-700">
              {currentSlide.sectionTitle}
            </span>
          )}
          {(currentSlide.keywords || []).slice(0, 3).map((kw, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800/80 text-neutral-400">
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Presenter Study Notes Card (Embedded for easy lecturing) */}
      <div className="p-3 bg-gradient-to-br from-amber-950/25 via-neutral-900 to-neutral-950 rounded-xl border border-amber-500/40 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
            <BookMarked className="w-3.5 h-3.5" />
            <span>主讲人深度研读手记 (Presenter Notes)</span>
          </div>
          <button
            onClick={() => setShowNotesModal(true)}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-0.5 underline font-medium"
          >
            <span>全屏手记</span>
            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </button>
        </div>

        {/* Core Thesis */}
        <div className="p-2 rounded bg-neutral-950/70 border border-amber-500/20 text-[11px] leading-relaxed text-neutral-200">
          <span className="font-semibold text-amber-300 block mb-0.5">【核心定调论点】</span>
          <p>{presenterNote.coreThesis}</p>
        </div>

        {/* Step-by-Step Delivery Flow */}
        <div className="space-y-1.5 text-[11px]">
          <span className="font-semibold text-amber-400 block text-[10px]">【讲授推导演进逻辑】</span>
          {presenterNote.pedagogicalKeypoints.map((pt, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-neutral-300">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="line-clamp-2">{pt}</p>
            </div>
          ))}
        </div>

        {/* Analogy & Defense Highlights */}
        <div className="pt-2 border-t border-neutral-800 grid grid-cols-1 gap-2 text-[10px]">
          <div className="p-2 rounded bg-neutral-950/50 border border-neutral-800 text-neutral-300">
            <span className="font-semibold text-emerald-400 flex items-center space-x-1 mb-0.5">
              <Lightbulb className="w-3 h-3" />
              <span>通俗通识隐喻：</span>
            </span>
            <p className="italic text-neutral-300 leading-relaxed">“{presenterNote.crossDomainAnalogy}”</p>
          </div>

          <div className="p-2 rounded bg-neutral-950/50 border border-neutral-800 text-neutral-300">
            <span className="font-semibold text-red-400 flex items-center space-x-1 mb-0.5">
              <ShieldAlert className="w-3 h-3" />
              <span>防杠与辩难应对口径：</span>
            </span>
            <p className="text-neutral-300 leading-relaxed">{presenterNote.falsificationOrTrap}</p>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoadingInsight && (
        <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 animate-pulse space-y-2.5">
          <div className="flex items-center space-x-2 text-amber-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>深度认知引擎正在研读当前第 {currentSlide.index} 页课件并检索 RAG 文献...</span>
          </div>
          <div className="h-3 bg-neutral-800 rounded w-3/4" />
          <div className="h-3 bg-neutral-800 rounded w-5/6" />
          <div className="h-16 bg-neutral-800/60 rounded" />
        </div>
      )}

      {/* 1. Epistemic Kernel Analysis */}
      {insight && !isLoadingInsight && (
        <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-2">
          <div className="flex items-center space-x-1.5 text-neutral-300 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>认识论内核与逻辑解构</span>
          </div>
          <p className="text-neutral-300 leading-relaxed text-[11px] whitespace-pre-wrap">
            {insight.summary}
          </p>

          {/* Mathematical Mapping */}
          <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
            <span className="text-[10px] font-semibold text-amber-400 block mb-1">
              [跨域数学物理映射]
            </span>
            <div className="text-neutral-200 text-[11px] leading-relaxed bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800">
              <ReactMarkdown>{insight.mathematicalMapping}</ReactMarkdown>
            </div>
          </div>

          {/* Ontology as Code Snippet */}
          {insight.ontologyCode && (
            <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-indigo-400 flex items-center space-x-1">
                  <Code2 className="w-3 h-3" />
                  <span>概念操作化接口 (Ontology as Code)</span>
                </span>
                <button
                  onClick={() => onSendToSandbox(insight.ontologyCode, `P.${currentSlide.index} 课件代码化接口`)}
                  className="text-[10px] text-amber-400 hover:underline flex items-center space-x-0.5"
                >
                  <Play className="w-2.5 h-2.5 mr-0.5" />
                  <span>载入沙盒</span>
                </button>
              </div>
              <pre className="bg-neutral-900 p-2 rounded text-[10px] font-mono text-neutral-300 overflow-x-auto border border-neutral-800 max-h-36">
                <code>{insight.ontologyCode}</code>
              </pre>
            </div>
          )}

          {/* Computable Question Clickable */}
          {insight.computableQuestion && (
            <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
              <div className="p-2 bg-amber-950/30 rounded border border-amber-500/30 flex flex-col space-y-1">
                <span className="text-[10px] font-semibold text-amber-400 flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>课件启发式追问 (点击代入研讨池)：</span>
                </span>
                <p className="text-[11px] text-neutral-200">{insight.computableQuestion}</p>
                <button
                  onClick={() => onQuickAsk(insight.computableQuestion)}
                  className="self-end text-[10px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  [点此代入向 AI 发问 →]
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. 规则合成器（原 Kaiban 叙事收敛） */}
      <div className="p-3 bg-neutral-950/80 rounded-xl border border-indigo-500/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-200">
            <Workflow className="w-3.5 h-3.5 text-indigo-400" />
            <span>规则合成器（课件 → 接口草稿）</span>
          </div>
          <button
            onClick={onTriggerWorkflow}
            disabled={isRunningWorkflow}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-[11px] shadow-sm transition-all"
          >
            <Zap className={`w-3 h-3 ${isRunningWorkflow ? 'animate-spin' : ''}`} />
            <span>{isRunningWorkflow ? '合成中...' : '生成本页草稿'}</span>
          </button>
        </div>

        <p className="text-[10px] text-neutral-400 leading-normal">
          按课件关键词匹配预设范式与 Ontology 接口草稿。<strong>不是</strong> KaibanJS 真多智能体裁决；真调参请用「一键打开本页沙盒」。
        </p>

        {/* Workflow steps visualizer */}
        {kaibanWorkflow && (
          <div className="space-y-2 mt-2 pt-2 border-t border-neutral-800">
            <div className="text-[10px] font-semibold text-indigo-300 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-amber-400" />
              <span>合成步骤（规则模板）：</span>
            </div>

            <div className="space-y-1.5">
              {kaibanWorkflow.workflowSteps.map((step, idx) => (
                <div key={idx} className="p-1.5 bg-neutral-900 rounded border border-neutral-800 flex items-start space-x-1.5 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-200">{step.agent}</span>
                      <span className="text-[9px] text-neutral-500 font-mono">{step.timestamp}</span>
                    </div>
                    <div className="text-neutral-400 text-[10px]">{step.step}</div>
                    {step.detail && (
                      <div className="text-neutral-500 text-[9px] italic mt-0.5">{step.detail}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className="p-2 bg-neutral-900 rounded border border-amber-500/20 text-[10px] text-neutral-300">
              <span className="font-semibold text-amber-400 block mb-0.5">合成说明（非审定）：</span>
              <p className="leading-relaxed">{kaibanWorkflow.verificationVerdict}</p>
            </div>

            {/* Code Suggestion */}
            {kaibanWorkflow.ontologyCode && (
              <div className="pt-1">
                <button
                  onClick={() => {
                    onSendToSandbox(kaibanWorkflow.ontologyCode, `规则合成 P.${currentSlide.index} 《${currentSlide.title}》接口草稿`);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium border border-indigo-400/40 text-[11px] shadow-sm transition-all"
                >
                  <Play className="w-3 h-3 text-amber-300" />
                  <span>导入沙盒作可视化预览（非真执行）</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Citations Bound to This Slide */}
      {citations.length > 0 && (
        <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>本页课件关联顶尖文献证据链：</span>
            </div>
            {onOpenOntologyGraph && (
              <button
                onClick={onOpenOntologyGraph}
                className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold bg-sky-950/50 hover:bg-sky-900/60 px-2 py-0.5 rounded-md border border-sky-500/30 transition-all shadow-sm group"
                title="启动 D3.js 文献本体论谱系拓扑图"
              >
                <Network className="w-3 h-3 text-sky-400 group-hover:rotate-12 transition-transform" />
                <span>本体论谱系图</span>
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            {citations.map((c, i) => (
              <div 
                key={i} 
                onClick={() => onSelectCitation ? onSelectCitation(c) : onOpenOntologyGraph?.()}
                className="p-2 bg-neutral-900 hover:bg-neutral-800/80 cursor-pointer rounded-lg border border-neutral-800 hover:border-sky-500/40 text-[10px] text-neutral-300 transition-all group"
                title="点击在 D3.js 图谱中检视本体论谱系连接"
              >
                <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-sky-300">
                  <div className="truncate">
                    [{i + 1}] 《{c.sourceTitle}》 <span className="text-amber-400 font-normal">({c.pageOrSection})</span>
                  </div>
                  <div className="text-[9px] text-sky-400 opacity-60 group-hover:opacity-100 flex items-center space-x-0.5 shrink-0 ml-1 font-normal">
                    <span>谱系连接</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </div>
                </div>
                <div className="text-neutral-400 italic mt-0.5 line-clamp-2">
                  "{c.quoteText}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presenter Study Notes Modal */}
      <PresenterStudyNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        currentSlide={currentSlide}
        onSendToSandbox={onSendToSandbox}
        onQuickAsk={onQuickAsk}
      />
    </div>
  );
};
