import React from 'react';
import { 
  Cast, 
  Eye, 
  Users, 
  BookOpen, 
  Terminal, 
  FileText, 
  MessageSquare, 
  Sparkles,
  Radio,
  Sliders
} from 'lucide-react';

interface HeaderBarProps {
  isPresenter: boolean;
  onToggleRole: () => void;
  isFollowingPresenter: boolean;
  onToggleFollow: () => void;
  currentSlide: number;
  presenterSlide: number;
  totalSlides: number;
  connectedCount: number;
  isConnected: boolean;
  barrageEnabled: boolean;
  onToggleBarrage: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenSandbox: () => void;
  onOpenMinutes: () => void;
  activeTab: 'presentation' | 'sandbox';
  setActiveTab: (tab: 'presentation' | 'sandbox') => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isPresenter,
  onToggleRole,
  isFollowingPresenter,
  onToggleFollow,
  currentSlide,
  presenterSlide,
  totalSlides,
  connectedCount,
  isConnected,
  barrageEnabled,
  onToggleBarrage,
  onOpenKnowledgeBase,
  onOpenSandbox,
  onOpenMinutes,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="h-16 bg-neutral-900 border-b border-neutral-800 text-neutral-100 px-4 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Connection Badge */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center font-bold text-neutral-950 shadow-md">
          <Sparkles className="w-5 h-5 text-neutral-950" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold tracking-wide text-sm md:text-base text-neutral-100">
              可计算认识论
            </h1>
            <span className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
              Executable Epistemology
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <span className="flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[11px]">{isConnected ? '实时同步在线' : '连接断开'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-[11px] text-neutral-400">
              <Users className="w-3 h-3 text-neutral-400" />
              <span>{connectedCount} 位参会学者</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main View Tabs (PPT vs Code Sandbox) */}
      <div className="hidden md:flex items-center p-1 bg-neutral-950 rounded-lg border border-neutral-800">
        <button
          onClick={() => setActiveTab('presentation')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'presentation'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Cast className="w-3.5 h-3.5" />
          <span>同步幻灯片 ({currentSlide}/{totalSlides})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('sandbox');
            onOpenSandbox();
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'sandbox'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>可执行代码沙盒</span>
        </button>
      </div>

      {/* Action Controls & Mode Switchers */}
      <div className="flex items-center space-x-2">
        {/* Presenter Mode Badge / Switcher */}
        <button
          onClick={onToggleRole}
          title="点击切换主讲人或参会者模式"
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
            isPresenter
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
              : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          {isPresenter ? <Cast className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-neutral-400" />}
          <span>{isPresenter ? '主讲人模式 (控台)' : '参会者模式'}</span>
        </button>

        {/* Sync with Presenter status when in Viewer mode */}
        {!isPresenter && (
          <button
            onClick={onToggleFollow}
            className={`hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs border transition-all ${
              isFollowingPresenter
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400'
                : 'bg-neutral-800 border-amber-600/40 text-amber-400 hover:bg-neutral-700 animate-pulse'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{isFollowingPresenter ? '紧跟主讲人' : `回主讲人页(P.${presenterSlide})`}</span>
          </button>
        )}

        {/* Barrage Toggle */}
        <button
          onClick={onToggleBarrage}
          className={`px-2 py-1.5 rounded-md text-xs border transition-all ${
            barrageEnabled 
              ? 'bg-neutral-800 border-neutral-600 text-neutral-200' 
              : 'bg-neutral-900 border-neutral-800 text-neutral-500'
          }`}
          title="开启/关闭实时弹幕浮层"
        >
          弹幕: {barrageEnabled ? '开' : '关'}
        </button>

        {/* Knowledge Base Drawer Button */}
        <button
          onClick={onOpenKnowledgeBase}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all"
          title="打开动态文献 RAG 知识库"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">核心文献库</span>
        </button>

        {/* Seminar Minutes Generator */}
        <button
          onClick={onOpenMinutes}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all"
          title="生成学术会议纪要"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">会议纪要</span>
        </button>
      </div>
    </header>
  );
};
