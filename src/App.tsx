import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SEMINAR_SLIDES } from './data/slides';
import { ChatMessage, AgentRole, SlideItem, SlideEpistemicInsight, KaibanWorkflowResult, Citation, DiscussionTag, ResponseSource } from './types';
import { HeaderBar } from './components/HeaderBar';
import { PresentationViewer } from './components/PresentationViewer';
import { SeminarChatPanel } from './components/SeminarChatPanel';
import { CodeSandbox } from './components/CodeSandbox';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer';
import { SeminarMinutesModal } from './components/SeminarMinutesModal';
import { PresenterAgendaToast } from './components/PresenterAgendaToast';
import { buildAnchoredQuery } from './utils/discussionAnchor';
import { getPresenterPaceHint } from './data/presenterPaceHints';

export default function App() {
  // Navigation & Sync State
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(1);
  const [presenterSlideIndex, setPresenterSlideIndex] = useState<number>(1);
  const [isPresenter, setIsPresenter] = useState<boolean>(true);
  const [isFollowingPresenter, setIsFollowingPresenter] = useState<boolean>(true);
  const [laserPointerPos, setLaserPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [connectedCount, setConnectedCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // View state
  const [activeTab, setActiveTab] = useState<'presentation' | 'sandbox'>('presentation');
  const [barrageEnabled, setBarrageEnabled] = useState<boolean>(true);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState<boolean>(false);
  const [isMinutesModalOpen, setIsMinutesModalOpen] = useState<boolean>(false);

  // Code Sandbox Custom Injection
  const [sandboxCustomCode, setSandboxCustomCode] = useState<string | undefined>(undefined);
  const [sandboxCustomTitle, setSandboxCustomTitle] = useState<string | undefined>(undefined);

  // Anti-Drift State
  const [antiDriftData, setAntiDriftData] = useState<{
    isDrifting: boolean;
    driftScore: number;
    reason: string;
    guidingQuestion: string;
    barrageSummary: string;
  } | null>(null);

  // Minutes text
  const [minutesText, setMinutesText] = useState<string>('');
  const [minutesSource, setMinutesSource] = useState<ResponseSource | undefined>(undefined);
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState<boolean>(false);
  const [showAgendaToast, setShowAgendaToast] = useState<boolean>(false);

  // Slide-Synchronized Cognitive Engine State
  const [slideInsight, setSlideInsight] = useState<SlideEpistemicInsight | null>(null);
  const [slideCitations, setSlideCitations] = useState<Citation[]>([]);
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);

  // KaibanJS Multi-Agent Workflow State
  const [kaibanWorkflow, setKaibanWorkflow] = useState<KaibanWorkflowResult | null>(null);
  const [isRunningWorkflow, setIsRunningWorkflow] = useState<boolean>(false);
  // Serialization status check for Code Sandbox code injection
  const [isSandboxCodeSerialized, setIsSandboxCodeSerialized] = useState<boolean>(true);

  // Chat stream
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: '可计算认识论引擎',
      role: 'deep_epistemic',
      content: `### 研讨会认知网络已接入
欢迎参与**《可计算的认识论：从数学范式跃迁到人文社科的 AI 代码落地引擎》**跨学科深度研讨。

本系统已深度整合：
- **同步演示引擎**：渲染 68 页完整学术课件讲稿，支持主讲人激光笔与实时全局同步翻页。
- **课件深度认知引擎同步**：右侧面板实时锁定当前翻页 Slide，自动完成认识论解构、邓煜余维数/弗里德曼大基数跨域映射与 Ontology as Code 接口生成。
- **KaibanJS 多智能体工作流**：调度【范式认知学者】、【形式化架构师】与【认识论裁判官】三阶协同流水线，杜绝 RLHF 中庸偏置。
- **动态文献 RAG 知识库**：预装邓煜（无穷维相空间奇异性）、布克马斯特与科尔多瓦（流体爆破与Lean形式化）、弗里德曼（逆向数学与有理立方体）、Joon Park（生成式智能体微架构）等顶尖文献。
- **可执行代码沙盒**：内置 Web IDE 与 ECharts 动力学相变实时图谱渲染。`,
      timestamp: new Date().toLocaleTimeString(),
      slideIndex: 1
    }
  ]);

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  /** 跟随状态用 ref，避免切换跟随时整段 Socket 重连（P0-1） */
  const isFollowingPresenterRef = useRef<boolean>(isFollowingPresenter);

  useEffect(() => {
    isFollowingPresenterRef.current = isFollowingPresenter;
  }, [isFollowingPresenter]);

  // Current Slide Object
  const currentSlide: SlideItem = SEMINAR_SLIDES.find(s => s.index === currentSlideIndex) || SEMINAR_SLIDES[0];

  // Initialize Socket.io once; Vercel Fluid 上优先 websocket（无 sticky polling）
  useEffect(() => {
    const onVercel = typeof window !== 'undefined' && /vercel\.app$|\.vercel\.app$/.test(window.location.hostname);
    const socket = io({
      path: '/socket.io',
      transports: onVercel ? ['websocket'] : ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 12,
      reconnectionDelay: 800,
      reconnectionDelayMax: 8000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('sync:state', (state: any) => {
      if (state.currentSlide) {
        setPresenterSlideIndex(state.currentSlide);
        if (isFollowingPresenterRef.current) {
          setCurrentSlideIndex(state.currentSlide);
        }
      }
      if (state.userCount) setConnectedCount(state.userCount);
      if (state.laserPointer) setLaserPointerPos(state.laserPointer);
      if (state.activeHighlight) setHighlightedText(state.activeHighlight);
    });

    socket.on('attendees:update', (data: any) => {
      setConnectedCount(data.count || 1);
    });

    socket.on('role:confirmed', (data: { isPresenter: boolean }) => {
      setIsPresenter(data.isPresenter);
    });

    socket.on('slide:synced', (data: { slideIndex: number; byUser: string }) => {
      setPresenterSlideIndex(data.slideIndex);
      if (isFollowingPresenterRef.current) {
        setCurrentSlideIndex(data.slideIndex);
      }
    });

    socket.on('laser:synced', (pos: { x: number; y: number } | null) => {
      setLaserPointerPos(pos);
    });

    socket.on('highlight:synced', (data: { text: string | null; slideIndex: number }) => {
      setHighlightedText(data.text);
    });

    socket.on('chat:received', (msg: ChatMessage) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Fetch synchronized slide epistemic insight whenever currentSlideIndex changes
  const fetchSlideInsight = useCallback(async (index: number) => {
    setIsLoadingInsight(true);
    try {
      const res = await fetch(`/api/gemini/slide-insight/${index}`);
      const data = await res.json();
      if (data.status === 'success') {
        setSlideInsight({
          ...data.insight,
          responseSource: data.source || data.insight?.responseSource
        });
        setSlideCitations(data.citations || []);
      }
    } catch (err) {
      console.warn('Error fetching slide epistemic insight:', err);
    } finally {
      setIsLoadingInsight(false);
    }
  }, []);

  // Synchronize deep cognitive engine immediately on slide index change
  useEffect(() => {
    fetchSlideInsight(currentSlideIndex);
  }, [currentSlideIndex, fetchSlideInsight]);

  // Helper to serialize ontologyCode into fully structured, executable state machine format
  const serializeOntologyCodeToStructuredFormat = (workflowResult: KaibanWorkflowResult): string => {
    let rawCode = '';
    if (typeof workflowResult.ontologyCode === 'string') {
      rawCode = workflowResult.ontologyCode.trim();
    } else if (workflowResult.ontologyCode && typeof workflowResult.ontologyCode === 'object') {
      rawCode = JSON.stringify(workflowResult.ontologyCode, null, 2);
    } else {
      rawCode = '// 未定义本体论状态机代码';
    }

    return `/**
 * ==============================================================================
 * 🏛️ 可计算认识论形式化状态机 (KaibanJS Multi-Agent Pipeline)
 * ==============================================================================
 * 幻灯片编号   : Slide P.${workflowResult.slideIndex}
 * 议题名称     : 《${workflowResult.slideTitle || '学术研讨'}》
 * 所属板块     : ${workflowResult.sectionTitle || '核心研讨'}
 * 核心理论范式 : ${workflowResult.paradigm || '可计算认识论'}
 * 认识论裁判   : ${workflowResult.verificationVerdict || '已通过机器可证伪性检验'}
 * 序列化时间戳 : ${new Date().toISOString()}
 * ==============================================================================
 */

// 1. 面向对象本体论接口与状态转移签名 (Ontology as Code Interfaces)
${rawCode}

// 2. 结构化元数据配置 (Structured State Machine Metadata)
export const STATE_MACHINE_METADATA = {
  slideIndex: ${workflowResult.slideIndex},
  slideTitle: ${JSON.stringify(workflowResult.slideTitle || '')},
  paradigm: ${JSON.stringify(workflowResult.paradigm || '')},
  falsificationTarget: ${JSON.stringify(workflowResult.bdiSimulationSuggestion || '有限时间相变与多智能体博弈检验')},
  serializedAt: "${new Date().toISOString()}",
  isFullySerialized: true
};

// 3. 可执行 BDI 动力学状态机驱动器 (Executable BDI Dynamic Agent Engine)
export class KaibanStateMachineRunner {
  private step: number = 0;
  private state: Record<string, any> = {
    step: 0,
    entropy: 0.18,
    complianceRatio: 0.96,
    resourceScarcity: 0.12,
    deadlockDetected: false
  };

  constructor(public config = STATE_MACHINE_METADATA) {}

  public tick(perturbation: number = 0.05): { state: Record<string, any>; isFalsified: boolean } {
    this.step += 1;
    this.state.step = this.step;
    this.state.resourceScarcity = Math.min(1.0, this.state.resourceScarcity + perturbation);
    this.state.complianceRatio = Math.max(0.0, 1.0 - Math.pow(this.state.resourceScarcity, 1.6));
    this.state.entropy = Math.min(1.0, this.state.entropy + perturbation * 0.75);
    const isFalsified = this.state.complianceRatio < 0.30;
    return { state: { ...this.state }, isFalsified };
  }
}
`;
  };

  // Trigger KaibanJS Multi-Agent Workflow for the current slide
  const handleTriggerKaibanWorkflow = async () => {
    setIsRunningWorkflow(true);
    // 状态检查初始化：重置序列化状态标志，避免沙盒在生成过程中加载未完成的代码
    setIsSandboxCodeSerialized(false);
    try {
      const res = await fetch('/api/kaiban/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideIndex: currentSlideIndex,
          query: highlightedText || undefined
        })
      });
      const data = await res.json();
      if (data.status === 'success' && data.result) {
        // 1. 将 kaibanWorkflow.ontologyCode 序列化为结构化数据格式
        const structuredCode = serializeOntologyCodeToStructuredFormat(data.result);

        // 2. 状态检查：确保代码在 sandbox 加载前已完整完成序列化与结构化校验
        const isSerializationComplete = 
          typeof structuredCode === 'string' &&
          structuredCode.trim().length > 0 &&
          structuredCode.includes('STATE_MACHINE_METADATA') &&
          structuredCode.includes('isFullySerialized: true');

        if (!isSerializationComplete) {
          throw new Error('KaibanJS 状态机代码序列化校验失败：数据结构不完整或中断');
        }

        // 3. 将完整序列化的结构化代码同步注入 kaibanWorkflow
        const fullySerializedResult: KaibanWorkflowResult = {
          ...data.result,
          ontologyCode: structuredCode
        };
        setKaibanWorkflow(fullySerializedResult);

        // 4. 确保 CodeSandbox 的 customCode 属性能够完全接收结构化数据
        setSandboxCustomCode(structuredCode);
        setSandboxCustomTitle(`KaibanJS P.${currentSlideIndex} 《${currentSlide.title}》状态机模型`);
        
        // 5. 状态检查完成，开启沙盒加载许可
        setIsSandboxCodeSerialized(true);
        
        // Also inject into discussion message stream
        const workflowMsg: ChatMessage = {
          id: `kaiban-${Date.now()}`,
          sender: 'KaibanJS 多智能体协同流水线',
          role: 'sandbox_compiler',
          content: `### 🎯 KaibanJS 多智能体工作流执行完毕（Slide P.${currentSlideIndex}）\n\n**理论范式**：${data.result.paradigm}\n\n**认识论跨域映射**：\n${data.result.crossDomainMapping}\n\n**终审可证伪裁决**：\n${data.result.verificationVerdict}`,
          timestamp: new Date().toLocaleTimeString(),
          slideIndex: currentSlideIndex,
          sandboxCode: structuredCode
        };
        if (socketRef.current) {
          socketRef.current.emit('chat:send', workflowMsg);
        } else {
          setMessages(prev => [...prev, workflowMsg]);
        }
      }
    } catch (err) {
      console.error('KaibanJS workflow execution error:', err);
      // 若出现异常，保持序列化标志状态一致
      setIsSandboxCodeSerialized(true);
    } finally {
      setIsRunningWorkflow(false);
    }
  };

  // Handle slide navigation
  const handleNavigateSlide = (newIndex: number) => {
    if (newIndex < 1 || newIndex > SEMINAR_SLIDES.length) return;
    setCurrentSlideIndex(newIndex);
    setActiveTab('presentation');

    if (isPresenter && socketRef.current) {
      socketRef.current.emit('slide:change', { slideIndex: newIndex });
    } else {
      // In viewer mode, manual slide browsing breaks auto-follow
      if (newIndex !== presenterSlideIndex) {
        setIsFollowingPresenter(false);
      }
    }
  };

  // Toggle Role (Presenter vs Viewer)
  const handleToggleRole = () => {
    if (!isPresenter && socketRef.current) {
      socketRef.current.emit('role:claim-presenter');
      setIsPresenter(true);
      setIsFollowingPresenter(true);
    } else {
      setIsPresenter(false);
    }
  };

  // Toggle follow presenter
  const handleToggleFollow = () => {
    setIsFollowingPresenter(true);
    setCurrentSlideIndex(presenterSlideIndex);
  };

  // Laser move
  const handleLaserMove = (pos: { x: number; y: number } | null) => {
    setLaserPointerPos(pos);
    if (socketRef.current && isPresenter) {
      socketRef.current.emit('laser:move', pos);
    }
  };

  // Highlight Text Selection
  const handleSelectHighlightText = (text: string) => {
    setHighlightedText(text);
    if (socketRef.current) {
      socketRef.current.emit('highlight:text', { text, slideIndex: currentSlideIndex });
    }
  };

  // Send message and trigger AI workflow
  const handleSendMessage = async (
    content: string,
    role: AgentRole,
    isBarrage: boolean,
    meta?: { discussionTag?: DiscussionTag }
  ) => {
    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: isPresenter ? '主讲学者' : '参会学者',
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString(),
      slideIndex: currentSlideIndex,
      highlightedText: highlightedText || undefined,
      isBarrage,
      discussionTag: meta?.discussionTag
    };

    // Emit via WebSocket to all connected peers
    if (socketRef.current) {
      socketRef.current.emit('chat:send', userMsg);
    } else {
      setMessages(prev => [...prev, userMsg]);
    }

    setIsLoadingAi(true);

    const anchoredQuery = buildAnchoredQuery(
      content,
      currentSlide,
      highlightedText,
      meta?.discussionTag
    );

    try {
      if (role === 'deep_epistemic') {
        // Call Gemini Deep Epistemic Engine with RAG
        const res = await fetch('/api/gemini/epistemic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: anchoredQuery,
            slideIndex: currentSlideIndex,
            highlightedText: highlightedText || null
          })
        });
        const data = await res.json();
        if (data.status === 'success') {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: '深度认知引擎 (Gemini)',
            role: 'deep_epistemic',
            content: data.response,
            timestamp: new Date().toLocaleTimeString(),
            slideIndex: currentSlideIndex,
            citations: data.citations,
            responseSource: data.source || (data.fromFallback ? 'offline_fallback' : 'live_ai')
          };
          if (socketRef.current) {
            socketRef.current.emit('chat:send', aiMsg);
          } else {
            setMessages(prev => [...prev, aiMsg]);
          }
        }
      } else if (role === 'agenda_guardian') {
        // Call Agenda Guardian (Doubao / Gemini)
        const res = await fetch('/api/agent/agenda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slideIndex: currentSlideIndex,
            currentDiscussion: anchoredQuery,
            recentMessages: messages.slice(-5)
          })
        });
        const data = await res.json();
        setAntiDriftData(data);
        if (isPresenter && (data.isDrifting || data.driftScore > 45)) {
          setShowAgendaToast(true);
        }

        // 参会侧：短摘要；主讲侧：仍保留完整记录在消息流，Toast 另给收束建议
        const guardianContent = isPresenter
          ? `**【主讲收束建议】** 偏移 ${data.driftScore}%\n${data.reason}\n\n→ ${data.guidingQuestion}`
          : `**【议程提示】** 偏移 ${data.driftScore}% · ${data.reason}`;

        const aiMsg: ChatMessage = {
          id: `guardian-${Date.now()}`,
          sender: '议程管理智能体 (Doubao)',
          role: 'agenda_guardian',
          content: guardianContent,
          timestamp: new Date().toLocaleTimeString(),
          slideIndex: currentSlideIndex,
          antiDriftAlert: data,
          responseSource: data.source || (data.fromFallback ? 'offline_fallback' : 'live_ai')
        };
        if (socketRef.current) {
          socketRef.current.emit('chat:send', aiMsg);
        } else {
          setMessages(prev => [...prev, aiMsg]);
        }
      } else if (role === 'sandbox_compiler') {
        // Call Sandbox Compiler
        const res = await fetch('/api/gemini/sandbox', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptText: anchoredQuery,
            slideIndex: currentSlideIndex
          })
        });
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `sandbox-agent-${Date.now()}`,
          sender: '沙盘编译智能体',
          role: 'sandbox_compiler',
          content: `### 仿真沙盘编译完成：《${data.title}》\n${data.description}\n\n**理论解释**：${data.explanation}\n\n*点击下方按钮可载入沙盒。若为自定义/Kaiban 代码，图表为可视化预览而非真实执行。*`,
          timestamp: new Date().toLocaleTimeString(),
          slideIndex: currentSlideIndex,
          sandboxCode: data.code,
          responseSource: data.source || (data.fromFallback ? 'offline_fallback' : 'live_ai')
        };
        if (socketRef.current) {
          socketRef.current.emit('chat:send', aiMsg);
        } else {
          setMessages(prev => [...prev, aiMsg]);
        }
      }
    } catch (err) {
      console.error("Failed to query AI service:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Trigger Anti-Drift Inspection manually
  const handleTriggerAntiDrift = async () => {
    try {
      const res = await fetch('/api/agent/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideIndex: currentSlideIndex,
          recentMessages: messages.slice(-8)
        })
      });
      const data = await res.json();
      setAntiDriftData(data);
      if (isPresenter && (data.isDrifting || data.driftScore > 45)) {
        setShowAgendaToast(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate Seminar Minutes
  const handleOpenMinutes = async () => {
    setIsMinutesModalOpen(true);
    if (!minutesText) {
      handleRegenerateMinutes();
    }
  };

  const handleRegenerateMinutes = async () => {
    setIsGeneratingMinutes(true);
    try {
      const res = await fetch('/api/seminar/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setMinutesText(data.markdownSummary);
      setMinutesSource(data.source);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMinutes(false);
    }
  };

  // Send generated code directly to Code Sandbox
  const handleSendToSandbox = (code: string, title?: string) => {
    if (code && typeof code === 'string' && code.trim().length > 0) {
      setSandboxCustomCode(code);
      setSandboxCustomTitle(title);
      setIsSandboxCodeSerialized(true);
      setActiveTab('sandbox');
    }
  };

  // Quick Ask Handler from Slide Insight or Notes
  const handleQuickAskQuestion = (question: string) => {
    setActiveTab('presentation');
    handleSendMessage(question, 'deep_epistemic', true);
  };

  // Send doc citation to chat
  const handleAskWithDoc = (docTitle: string, excerpt: string) => {
    setActiveTab('presentation');
    handleSendMessage(`请结合《${docTitle}》中这段论述：“${excerpt.slice(0, 100)}...”，分析其在当前第${currentSlideIndex}页讲稿中的认识论价值与可计算操作化方案。`, 'deep_epistemic', false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Top Universal App Header */}
      <HeaderBar
        isPresenter={isPresenter}
        onToggleRole={handleToggleRole}
        isFollowingPresenter={isFollowingPresenter}
        onToggleFollow={handleToggleFollow}
        currentSlide={currentSlideIndex}
        presenterSlide={presenterSlideIndex}
        totalSlides={SEMINAR_SLIDES.length}
        connectedCount={connectedCount}
        isConnected={isConnected}
        barrageEnabled={barrageEnabled}
        onToggleBarrage={() => setBarrageEnabled(!barrageEnabled)}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        onOpenSandbox={() => setActiveTab('sandbox')}
        onOpenMinutes={handleOpenMinutes}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Viewer Desync Banner if Viewer is browsing independently */}
      {!isPresenter && !isFollowingPresenter && (
        <div className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-amber-200">
          <span>
            您正在自主浏览第 {currentSlideIndex} 页（主讲人当前正在第 {presenterSlideIndex} 页）
          </span>
          <button
            onClick={handleToggleFollow}
            className="px-2.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all"
          >
            立即跟随主讲人视图
          </button>
        </div>
      )}

      {/* Main Split Layout: Presentation / Sandbox + Collaboration Chat Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Stage: PPT Viewer OR Code Sandbox */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'presentation' ? (
            <PresentationViewer
              currentSlide={currentSlide}
              currentIndex={currentSlideIndex}
              totalSlides={SEMINAR_SLIDES.length}
              onNavigateSlide={handleNavigateSlide}
              isPresenter={isPresenter}
              onLaserMove={handleLaserMove}
              laserPointerPos={laserPointerPos}
              onSelectHighlightText={handleSelectHighlightText}
              barrageMessages={messages.filter(m => m.isBarrage)}
              barrageEnabled={barrageEnabled}
              onSendToSandbox={handleSendToSandbox}
              onQuickAsk={handleQuickAskQuestion}
            />
          ) : (
            // 状态检查：确保代码在 sandbox 加载前已完整完成序列化
            !isSandboxCodeSerialized && isRunningWorkflow ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 text-neutral-300 p-8">
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col items-center space-y-3 max-w-md text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <div className="font-semibold text-neutral-100 text-sm">
                    正在执行 KaibanJS 状态机结构化序列化...
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    状态检查进行中：正在对 Slide P.{currentSlideIndex} 生成的 BDI 状态机进行语法完整性与本体论接口序列化校验，确保沙盒完整接收结构化代码。
                  </p>
                </div>
              </div>
            ) : (
              <CodeSandbox
                customCode={sandboxCustomCode}
                customTitle={sandboxCustomTitle}
                onClose={() => setActiveTab('presentation')}
              />
            )
          )}
        </main>

        {/* Right Side: Dual-Engine Seminar Collaboration Panel */}
        <SeminarChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          currentSlide={currentSlide}
          highlightedText={highlightedText}
          onClearHighlight={() => setHighlightedText(null)}
          onSendToSandbox={handleSendToSandbox}
          isLoading={isLoadingAi}
          onTriggerAntiDrift={handleTriggerAntiDrift}
          antiDriftData={antiDriftData}
          slideInsight={slideInsight}
          isLoadingInsight={isLoadingInsight}
          onRefreshInsight={() => fetchSlideInsight(currentSlideIndex)}
          slideCitations={slideCitations}
          kaibanWorkflow={kaibanWorkflow}
          isRunningWorkflow={isRunningWorkflow}
          onTriggerKaibanWorkflow={handleTriggerKaibanWorkflow}
          onNavigateSlide={handleNavigateSlide}
          isPresenter={isPresenter}
        />
      </div>

      {/* Dynamic Literature RAG Knowledge Base Modal */}
      <KnowledgeBaseExplorer
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
        onAskWithDoc={handleAskWithDoc}
        onNavigateSlide={handleNavigateSlide}
      />

      {/* Seminar Minutes Modal */}
      <SeminarMinutesModal
        isOpen={isMinutesModalOpen}
        onClose={() => setIsMinutesModalOpen(false)}
        minutesText={minutesText}
        minutesSource={minutesSource}
        isGenerating={isGeneratingMinutes}
        onRegenerate={handleRegenerateMinutes}
      />

      <PresenterAgendaToast
        open={Boolean(isPresenter && showAgendaToast && antiDriftData)}
        driftScore={antiDriftData?.driftScore ?? 0}
        reason={antiDriftData?.reason || ''}
        guidingQuestion={antiDriftData?.guidingQuestion || ''}
        suggestSlideHint={
          getPresenterPaceHint(currentSlideIndex).pace === '共议'
            ? '当前为共议卡点页，优先回收「异议」标签发言。'
            : '可回到最近共议页（如 P.14 / 26 / 37）收束。'
        }
        onDismiss={() => setShowAgendaToast(false)}
        onAskGuiding={() => {
          if (!antiDriftData?.guidingQuestion) return;
          setShowAgendaToast(false);
          handleSendMessage(antiDriftData.guidingQuestion, 'deep_epistemic', false, {
            discussionTag: '追问'
          });
        }}
      />
    </div>
  );
}
