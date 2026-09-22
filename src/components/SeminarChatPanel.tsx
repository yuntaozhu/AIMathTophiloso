import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Code2, 
  BookOpen, 
  MessageSquare, 
  Quote, 
  Play, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Workflow,
  Radio,
  SlidersHorizontal,
  Bot,
  Network,
  X
} from 'lucide-react';
import { ChatMessage, AgentRole, SlideItem, SlideEpistemicInsight, KaibanWorkflowResult, Citation, DiscussionTag } from '../types';
import { CognitiveEngineSyncPanel } from './CognitiveEngineSyncPanel';
import { LiteratureOntologyGraph } from './LiteratureOntologyGraph';
import { RagLiteratureThesis } from '../data/ragLiteratureAnalyzer';
import { ResponseSourceBadge } from './ResponseSourceBadge';
import { isDiscussionSlide } from '../data/presenterPaceHints';
import { formatAnchorChip } from '../utils/discussionAnchor';

/** 弹幕短反馈上限；超长自动降为正式发言 */
export const BARRAGE_MAX_CHARS = 48;

const DISCUSSION_TAGS: DiscussionTag[] = ['异议', '追问', '补充'];

interface SeminarChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (
    content: string,
    role: AgentRole,
    isBarrage: boolean,
    meta?: { discussionTag?: DiscussionTag }
  ) => void;
  currentSlide: SlideItem;
  highlightedText: string | null;
  onClearHighlight: () => void;
  onSendToSandbox: (code: string, title?: string) => void;
  isLoading: boolean;
  onTriggerAntiDrift: () => void;
  antiDriftData: {
    isDrifting: boolean;
    driftScore: number;
    reason: string;
    guidingQuestion: string;
    barrageSummary: string;
  } | null;
  slideInsight: SlideEpistemicInsight | null;
  isLoadingInsight: boolean;
  onRefreshInsight: () => void;
  slideCitations: Citation[];
  kaibanWorkflow: KaibanWorkflowResult | null;
  isRunningWorkflow: boolean;
  onTriggerKaibanWorkflow: () => void;
  onNavigateSlide?: (slideIndex: number) => void;
  isPresenter?: boolean;
}

export const SeminarChatPanel: React.FC<SeminarChatPanelProps> = ({
  messages,
  onSendMessage,
  currentSlide,
  highlightedText,
  onClearHighlight,
  onSendToSandbox,
  isLoading,
  onTriggerAntiDrift,
  antiDriftData,
  slideInsight,
  isLoadingInsight,
  onRefreshInsight,
  slideCitations,
  kaibanWorkflow,
  isRunningWorkflow,
  onTriggerKaibanWorkflow,
  onNavigateSlide,
  isPresenter = false
}) => {
  const discussionMode = isDiscussionSlide(currentSlide.index);
  const [panelTab, setPanelTab] = useState<'cognitive_sync' | 'discussion'>(
    discussionMode ? 'discussion' : 'cognitive_sync'
  );
  const [inputText, setInputText] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('deep_epistemic');
  /** 正式发言默认关闭弹幕，避免深讲刷屏（P0-6） */
  const [isBarrageCheck, setIsBarrageCheck] = useState<boolean>(false);
  const [discussionTag, setDiscussionTag] = useState<DiscussionTag | null>(null);
  const [tagFilter, setTagFilter] = useState<DiscussionTag | '全部'>('全部');
  const [showOntologyGraph, setShowOntologyGraph] = useState<boolean>(false);
  const [selectedCitationForGraph, setSelectedCitationForGraph] = useState<Citation | null>(null);
  const [activeRagThesis, setActiveRagThesis] = useState<RagLiteratureThesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 进入章末共议页时自动切到研讨池并弱化认知侧栏抢戏（P1-2）
  useEffect(() => {
    if (discussionMode) {
      setPanelTab('discussion');
    }
  }, [discussionMode, currentSlide.index]);

  const visibleMessages =
    tagFilter === '全部'
      ? messages
      : messages.filter(m => m.role !== 'user' || m.discussionTag === tagFilter);

  const handleOpenOntologyGraph = (citation?: Citation) => {
    if (citation) {
      setSelectedCitationForGraph(citation);
    } else if (slideCitations.length > 0) {
      setSelectedCitationForGraph(slideCitations[0]);
    } else {
      setSelectedCitationForGraph(null);
    }
    setShowOntologyGraph(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (panelTab === 'discussion') {
      scrollToBottom();
    }
  }, [messages, isLoading, panelTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    const asBarrage = isBarrageCheck && text.length <= BARRAGE_MAX_CHARS;
    onSendMessage(text, selectedAgent, asBarrage, {
      discussionTag: discussionTag || undefined
    });
    setInputText('');
  };

  const handleQuickTagBarrage = (tag: DiscussionTag) => {
    setDiscussionTag(tag);
    setIsBarrageCheck(true);
    setPanelTab('discussion');
    if (!inputText.trim()) {
      setInputText(tag === '异议' ? '不同意当前映射：' : tag === '追问' ? '请问：' : '补充一点：');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    setPanelTab('discussion');
  };

  return (
    <aside className="w-full md:w-96 lg:w-[450px] bg-neutral-900 border-l border-neutral-800 flex flex-col h-full select-text shrink-0 z-20">
      {/* Top Header: Tab Mode Switcher between Cognitive Sync & Live Discussion */}
      <div className="p-2.5 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>深度认知与多智能体协作</span>
          </span>
          <button
            onClick={onTriggerAntiDrift}
            className="flex items-center space-x-1 text-[11px] text-neutral-400 hover:text-amber-400 transition-colors"
            title="执行当前会议防偏移检测与弹幕摘要"
          >
            <RefreshCw className="w-3 h-3" />
            <span>议程防偏移体检</span>
          </button>
        </div>

        {/* Primary View Switcher: Synchronized Cognitive Engine VS Real-time Chat Discussion */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setPanelTab('cognitive_sync')}
            className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md font-semibold transition-all ${
              panelTab === 'cognitive_sync'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>课件同步认知引擎 (P.{currentSlide.index})</span>
          </button>

          <button
            onClick={() => setPanelTab('discussion')}
            className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md font-semibold transition-all ${
              panelTab === 'discussion'
                ? 'bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>多智能体研讨池 ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* P1-1 锚定条 + P1-2 共议模式横幅 */}
      <div className="px-2.5 py-1.5 border-b border-neutral-800 bg-neutral-950/80 space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/35 font-semibold truncate">
            {formatAnchorChip(currentSlide.index, currentSlide.title)}
          </span>
          {highlightedText && (
            <button
              type="button"
              onClick={onClearHighlight}
              className="shrink-0 text-amber-400/90 hover:text-amber-300 flex items-center gap-0.5"
              title="清除高亮锚定"
            >
              <Quote className="w-3 h-3" />
              <span>有高亮</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        {discussionMode && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-2 py-1.5">
            <div className="text-[11px] text-emerald-200 leading-snug">
              <span className="font-bold">共议模式</span>
              <span className="text-emerald-400/80"> · 请用标签收集异议；主讲可用议程卫士收束</span>
            </div>
            {isPresenter && (
              <button
                type="button"
                onClick={onTriggerAntiDrift}
                className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-semibold border border-emerald-500/40"
              >
                收集异议体检
              </button>
            )}
          </div>
        )}
      </div>

      {/* Anti-Drift Score & Guiding Question Banner */}
      {antiDriftData && (
        <div className="p-2 bg-neutral-950 border-b border-neutral-800 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center space-x-1 text-neutral-400 text-[11px]">
              <ShieldAlert className="w-3 h-3 text-emerald-400" />
              <span>议程偏移度</span>
            </span>
            <span className={`font-mono text-[11px] font-bold ${
              antiDriftData.driftScore > 50 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {antiDriftData.driftScore}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-1">
            <div 
              className={`h-full transition-all duration-500 ${
                antiDriftData.driftScore > 50 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${antiDriftData.driftScore}%` }}
            />
          </div>
          {antiDriftData.guidingQuestion && (
            <div className="p-1.5 bg-neutral-900/90 rounded border border-neutral-800 text-[11px] text-neutral-300">
              <span className="font-semibold text-amber-400">引导追问：</span>
              {antiDriftData.guidingQuestion}
              <button 
                onClick={() => handleQuickPrompt(antiDriftData.guidingQuestion)}
                className="ml-1 text-amber-500 hover:underline inline"
              >
                [代入研讨]
              </button>
            </div>
          )}
        </div>
      )}

      {/* Current Slide Ribbon */}
      <div className="px-3 py-1.5 bg-neutral-950/70 border-b border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="truncate flex items-center space-x-1.5 min-w-0">
          <span className="text-amber-500 font-mono font-bold shrink-0">Slide P.{currentSlide.index}</span>
          <span className="truncate text-neutral-300">{currentSlide.title}</span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          {slideCitations.length > 0 && (
            <button
              onClick={() => handleOpenOntologyGraph()}
              className="flex items-center space-x-1 text-[10px] font-medium text-sky-400 bg-sky-950/50 hover:bg-sky-900/60 px-1.5 py-0.5 rounded border border-sky-500/40 transition-colors shadow-sm"
              title="点击查看当前幻灯片与 RAG 知识库文献的 D3.js 本体论谱系图"
            >
              <Network className="w-3 h-3 text-sky-400" />
              <span>谱系图 ({slideCitations.length})</span>
            </button>
          )}

          {highlightedText && (
            <div className="flex items-center space-x-1">
              <span className="text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30 truncate max-w-[100px]">
                "{highlightedText}"
              </span>
              <button
                onClick={onClearHighlight}
                className="text-neutral-500 hover:text-neutral-300"
                title="清除高亮引用"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area: Cognitive Sync Engine Panel OR Discussion Messages */}
      {panelTab === 'cognitive_sync' ? (
        <CognitiveEngineSyncPanel
          currentSlide={currentSlide}
          insight={slideInsight}
          citations={slideCitations}
          isLoadingInsight={isLoadingInsight}
          onRefreshInsight={onRefreshInsight}
          kaibanWorkflow={kaibanWorkflow}
          isRunningWorkflow={isRunningWorkflow}
          onTriggerWorkflow={onTriggerKaibanWorkflow}
          onSendToSandbox={onSendToSandbox}
          onQuickAsk={handleQuickPrompt}
          onSelectCitation={handleOpenOntologyGraph}
          onOpenOntologyGraph={() => handleOpenOntologyGraph()}
        />
      ) : (
        /* Discussion Stream */
        <div className="flex-1 p-3 overflow-y-auto space-y-4">
          {/* Sub Agent Switcher in Discussion Mode */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] mb-2">
            <button
              onClick={() => setSelectedAgent('deep_epistemic')}
              className={`flex items-center justify-center space-x-1 py-1 px-1.5 rounded-md font-medium transition-all ${
                selectedAgent === 'deep_epistemic'
                  ? 'bg-neutral-800 text-amber-400 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>深度认知</span>
            </button>

            <button
              onClick={() => setSelectedAgent('agenda_guardian')}
              className={`flex items-center justify-center space-x-1 py-1 px-1.5 rounded-md font-medium transition-all ${
                selectedAgent === 'agenda_guardian'
                  ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-emerald-400" />
              <span>议程卫士</span>
            </button>

            <button
              onClick={() => setSelectedAgent('sandbox_compiler')}
              className={`flex items-center justify-center space-x-1 py-1 px-1.5 rounded-md font-medium transition-all ${
                selectedAgent === 'sandbox_compiler'
                  ? 'bg-neutral-800 text-indigo-400 border border-indigo-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-3 h-3 text-indigo-400" />
              <span>沙盘编译</span>
            </button>
          </div>

          {/* P1-4 标签筛选 */}
          <div className="flex flex-wrap items-center gap-1 mb-1">
            <span className="text-[10px] text-neutral-500 mr-1">筛选</span>
            {(['全部', ...DISCUSSION_TAGS] as const).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tag)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
                  tagFilter === tag
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {visibleMessages.map((msg) => {
            const isUser = msg.role === 'user';
            const isEpistemic = msg.role === 'deep_epistemic';
            const isGuardian = msg.role === 'agenda_guardian';
            const isSandbox = msg.role === 'sandbox_compiler';

            return (
              <div 
                key={msg.id}
                className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Message Meta */}
                <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400 px-1">
                  {!isUser && (
                    <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                      isEpistemic ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      isGuardian ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {isEpistemic ? '深度认知引擎' :
                       isGuardian ? '议程管理' : '沙盘 / 规则合成'}
                    </span>
                  )}
                  <span className="font-medium text-neutral-300">{msg.sender}</span>
                  <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
                  <ResponseSourceBadge source={msg.responseSource} />
                  {msg.discussionTag && (
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 rounded font-semibold">
                      {msg.discussionTag}
                    </span>
                  )}
                  {msg.isBarrage && (
                    <span className="text-[9px] bg-neutral-800 text-amber-300 px-1 rounded">弹幕</span>
                  )}
                  {!msg.isBarrage && msg.role === 'user' && (
                    <span className="text-[9px] bg-neutral-800 text-sky-300 px-1 rounded">正式发言</span>
                  )}
                </div>

                {/* Highlight reference if bound */}
                {msg.highlightedText && (
                  <div className="text-[11px] bg-neutral-800/80 text-neutral-300 px-2.5 py-1 rounded border-l-2 border-amber-500 mb-1 max-w-[90%]">
                    <span className="text-amber-400 font-medium mr-1">引用 Slide P.{msg.slideIndex}：</span>
                    "{msg.highlightedText}"
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`p-3 rounded-xl text-xs md:text-sm leading-relaxed max-w-[92%] shadow-sm ${
                  isUser 
                    ? 'bg-amber-600/90 text-neutral-950 font-medium rounded-tr-none' 
                    : 'bg-neutral-800/90 text-neutral-100 border border-neutral-700/60 rounded-tl-none'
                }`}>
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="prose prose-invert prose-xs max-w-none space-y-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* Citations if returned by RAG */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-neutral-700/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-semibold text-amber-400 flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>文献依据：</span>
                        </div>
                        <button
                          onClick={() => handleOpenOntologyGraph(msg.citations ? msg.citations[0] : undefined)}
                          className="text-[9px] text-sky-400 hover:text-sky-300 flex items-center space-x-0.5"
                        >
                          <Network className="w-2.5 h-2.5 mr-0.5" />
                          <span>谱系拓扑</span>
                        </button>
                      </div>
                      {msg.citations.map((c, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleOpenOntologyGraph(c)}
                          className="text-[10px] bg-neutral-900/80 hover:bg-neutral-850 p-1.5 rounded-lg border border-neutral-700/50 hover:border-sky-500/40 text-neutral-300 cursor-pointer transition-all group"
                          title="点击检视该文献与 RAG 知识库的 D3.js 本体论谱系连接"
                        >
                          <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-sky-300">
                            <div className="truncate">
                              [{i+1}] 《{c.sourceTitle}》 <span className="text-amber-400 font-normal">({c.pageOrSection})</span>
                            </div>
                            <div className="text-[9px] text-sky-400 opacity-60 group-hover:opacity-100 flex items-center shrink-0 ml-1">
                              <span>谱系</span>
                              <ExternalLink className="w-2 h-2 ml-0.5" />
                            </div>
                          </div>
                          <div className="italic text-neutral-400 line-clamp-2 mt-0.5">
                            "{c.quoteText}"
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sandbox Code Export */}
                  {msg.sandboxCode && (
                    <div className="mt-3 pt-2 border-t border-neutral-700/80">
                      <button
                        onClick={() => onSendToSandbox(msg.sandboxCode || '', 'AI 生成的仿真模型')}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
                      >
                        <Play className="w-3 h-3" />
                        <span>导入代码沙盒并在 ECharts 中运行</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-neutral-400 p-2 bg-neutral-950/60 rounded-lg border border-neutral-800 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>
                {selectedAgent === 'deep_epistemic' ? '深度认知引擎正调取 RAG 知识库并进行跨域拓扑映射...' :
                 selectedAgent === 'agenda_guardian' ? '议程卫士正在分析聊天流与当前议程相关度...' :
                 '沙盘编译智能体正在构建 BDI 状态机与仿真参数...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-1.5 border-t border-neutral-800 bg-neutral-950/50 overflow-x-auto flex space-x-1.5 scrollbar-none text-[11px] shrink-0">
        <button
          onClick={() => handleQuickPrompt(`将第 ${currentSlide.index} 页命题映射至偏微分方程余维数-1 临界流形破裂`)}
          className="whitespace-nowrap px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
        >
          P.{currentSlide.index} 余维数映射
        </button>
        <button
          onClick={() => handleQuickPrompt(`为第 ${currentSlide.index} 页核心论点生成面向对象的 TypeScript 状态机接口`)}
          className="whitespace-nowrap px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
        >
          Ontology as Code 接口
        </button>
        <button
          onClick={() => handleQuickPrompt("罗尔斯‘无知之幕’在遭遇资源匮乏冲击时，何时发生违约相变？")}
          className="whitespace-nowrap px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
        >
          无知之幕相变
        </button>
      </div>

      {/* Chat Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800 bg-neutral-950 shrink-0">
        {/* P1-4 快捷标签 */}
        <div className="flex flex-wrap items-center gap-1 mb-1.5">
          <span className="text-[10px] text-neutral-500">标签</span>
          {DISCUSSION_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setDiscussionTag(prev => (prev === tag ? null : tag));
                if (tag === '异议' || tag === '追问') handleQuickTagBarrage(tag);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
                discussionTag === tag
                  ? 'bg-rose-500/25 text-rose-200 border-rose-500/50'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mb-1.5 text-[11px] text-neutral-400">
          <label className="flex items-center space-x-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isBarrageCheck}
              onChange={(e) => setIsBarrageCheck(e.target.checked)}
              className="rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-0 w-3 h-3"
            />
            <span className={isBarrageCheck ? 'text-amber-400' : 'text-neutral-500'}>
              发为弹幕（≤{BARRAGE_MAX_CHARS}字短反馈）
            </span>
          </label>
          <span className="text-[10px] text-neutral-500">
            {isBarrageCheck && inputText.trim().length > BARRAGE_MAX_CHARS
              ? '超长将自动改为正式发言'
              : '默认正式发言 · Enter 发送'}
          </span>
        </div>

        {/* Pinned Active RAG Literature Thesis Quick-Reference Banner */}
        {activeRagThesis && (
          <div className="mb-2 p-2 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start justify-between text-xs space-x-2 animate-in slide-in-from-bottom-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-semibold mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>RAG 库核心论点：</span>
                <span className="font-mono text-neutral-300 truncate max-w-[200px]">《{activeRagThesis.sourceTitle}》</span>
              </div>
              <p className="text-neutral-300 text-[11px] line-clamp-1 leading-snug">
                {activeRagThesis.coreThesis}
              </p>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 pt-0.5">
              {onNavigateSlide && activeRagThesis.targetSlideIndex && (
                <button
                  type="button"
                  onClick={() => onNavigateSlide(activeRagThesis.targetSlideIndex!)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                    currentSlide.index === activeRagThesis.targetSlideIndex
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                      : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30'
                  }`}
                  title={`定位至课件 Slide P.${activeRagThesis.targetSlideIndex}`}
                >
                  P.{activeRagThesis.targetSlideIndex}引用页
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowOntologyGraph(true)}
                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-semibold border border-amber-500/30 transition-colors"
                title="打开谱系网络详览完整公理与反诘"
              >
                深层谱系
              </button>
              <button
                type="button"
                onClick={() => setActiveRagThesis(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-200"
                title="清除当前文献挂载"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              panelTab === 'cognitive_sync'
                ? `针对第 ${currentSlide.index} 页《${currentSlide.title}》，提问或要求规则合成草稿...`
                : selectedAgent === 'deep_epistemic' ? "针对当前Slide或高亮文本，向深度认知引擎提问..." :
                  selectedAgent === 'agenda_guardian' ? "向议程卫士询问当前讨论进展或生成弹幕摘要..." :
                  "输入思想实验自然语言，要求编译为 BDI 仿真代码..."
            }
            className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-lg p-2.5 text-xs md:text-sm text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="h-10 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-semibold transition-all flex items-center justify-center shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Literature Ontology Lineage Visualizer Modal (D3.js) */}
      {showOntologyGraph && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl h-[85vh] max-h-[800px] shadow-2xl rounded-2xl overflow-hidden border border-neutral-800">
            <LiteratureOntologyGraph
              currentSlide={currentSlide}
              slideCitations={slideCitations}
              initialSelectedCitation={selectedCitationForGraph}
              onClose={() => setShowOntologyGraph(false)}
              onInjectQuestion={(q) => handleQuickPrompt(q)}
              onSelectNodeThesis={(node, thesis) => setActiveRagThesis(thesis)}
              onNavigateSlide={onNavigateSlide}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
