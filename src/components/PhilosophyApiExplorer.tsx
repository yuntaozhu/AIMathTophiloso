import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  BookOpen, 
  User, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Quote, 
  Filter, 
  RefreshCw, 
  Database,
  Layers,
  GraduationCap
} from 'lucide-react';
import { 
  fetchPhilosophers, 
  fetchPhilosophyIdeas, 
  fetchPhilosophySchools, 
  importPhilosopherToRAG, 
  PhilosophyPhilosopher, 
  PhilosophyIdea, 
  PhilosophySchool 
} from '../services/philosophyApi';
import { getAllDocuments } from '../data/knowledgeBase';

interface PhilosophyApiExplorerProps {
  onAskWithDoc: (docTitle: string, excerpt: string) => void;
  onNavigateSlide?: (slideIndex: number) => void;
  onDocumentImported?: (docTitle: string) => void;
}

export const PhilosophyApiExplorer: React.FC<PhilosophyApiExplorerProps> = ({
  onAskWithDoc,
  onNavigateSlide,
  onDocumentImported
}) => {
  const [activeTab, setActiveTab] = useState<'philosophers' | 'ideas' | 'schools'>('philosophers');
  const [philosophers, setPhilosophers] = useState<PhilosophyPhilosopher[]>([]);
  const [schools, setSchools] = useState<PhilosophySchool[]>([]);
  const [ideas, setIdeas] = useState<PhilosophyIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ideaSearch, setIdeaSearch] = useState<string>('');
  const [searchingIdeas, setSearchingIdeas] = useState<boolean>(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [importedDocIds, setImportedDocIds] = useState<Set<string>>(new Set());
  const [expandedPhilosopherId, setExpandedPhilosopherId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Check which documents are already imported in the RAG store
  useEffect(() => {
    const allDocs = getAllDocuments();
    const imported = new Set<string>();
    allDocs.forEach(d => {
      if (d.id.startsWith('doc-api-')) {
        imported.add(d.id);
      }
    });
    setImportedDocIds(imported);
  }, []);

  // Fetch initial data
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [phData, scData, ideasData] = await Promise.all([
          fetchPhilosophers(),
          fetchPhilosophySchools(),
          fetchPhilosophyIdeas()
        ]);
        if (mounted) {
          setPhilosophers(phData);
          setSchools(scData);
          setIdeas(ideasData.results || []);
        }
      } catch (err) {
        console.error('Failed to load Philosophy API data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  // Search ideas dynamically with debounce
  useEffect(() => {
    if (activeTab !== 'ideas') return;
    const timer = setTimeout(async () => {
      setSearchingIdeas(true);
      try {
        const res = await fetchPhilosophyIdeas(ideaSearch.trim() || undefined);
        setIdeas(res.results || []);
      } catch (err) {
        console.error('Search ideas error', err);
      } finally {
        setSearchingIdeas(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [ideaSearch, activeTab]);

  const handleImportToRAG = (philosopher: PhilosophyPhilosopher) => {
    const doc = importPhilosopherToRAG(philosopher);
    setImportedDocIds(prev => new Set(prev).add(doc.id));
    setNotification(`已成功将「${philosopher.nameZh || philosopher.name}」全部命题导入 RAG 向量库`);
    if (onDocumentImported) {
      onDocumentImported(doc.source_title);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAskWithIdea = (quote: string, author: string) => {
    const prompt = `请针对哲学原典命题：\n「${quote}」\n—— 出处：${author}\n运用苏格拉底反诘与当代形式认识论（结合计算复杂性与可判定性），对其内在形而上学假设进行形式化审查（明示前提、隐涵假设、反例判别）。`;
    onAskWithDoc(`${author} 哲学命题研讨`, prompt);
  };

  const filteredPhilosophers = philosophers.filter(p => {
    if (!selectedSchool) return true;
    return p.school.some(s => s.toLowerCase() === selectedSchool.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Sub Header & API Grounding Banner */}
      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-neutral-200">Philosophy API 实时在线文献网关</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                API v1.0 Connected
              </span>
              <a 
                href="https://philosophyapi.pythonanywhere.com/documentation/" 
                target="_blank" 
                rel="noreferrer"
                className="text-neutral-400 hover:text-amber-400 inline-flex items-center space-x-1"
              >
                <span>官方文档</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-neutral-400 text-[11px] mt-0.5">
              接入笛卡尔、康德、莱布尼茨、叔本华、黑格尔、海德格尔等 9 大奠基哲学家的原典命题库（250+ Quotes），支持一键入库本地 RAG 向量空间。
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 shrink-0">
          <button
            onClick={() => setActiveTab('philosophers')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
              activeTab === 'philosophers' 
                ? 'bg-amber-500 text-neutral-950 font-bold' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>哲学家原典 ({philosophers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
              activeTab === 'ideas' 
                ? 'bg-amber-500 text-neutral-950 font-bold' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>核心命题集 (250+)</span>
          </button>
          <button
            onClick={() => setActiveTab('schools')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
              activeTab === 'schools' 
                ? 'bg-amber-500 text-neutral-950 font-bold' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>哲学流派 ({schools.length || 24})</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs">正在从 Philosophy API 加载权威哲学资料与命题库...</p>
          </div>
        ) : activeTab === 'philosophers' ? (
          /* Philosophers List */
          <div className="space-y-3">
            {/* Filter by School Chip Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-neutral-500 text-[11px] shrink-0">流派筛选:</span>
              <button
                onClick={() => setSelectedSchool(null)}
                className={`px-2 py-0.5 rounded-full text-[11px] transition-colors shrink-0 ${
                  selectedSchool === null 
                    ? 'bg-amber-500 text-neutral-950 font-bold' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                全部流派 ({philosophers.length})
              </button>
              {['Rationalism', 'Transcendental idealism', 'German idealism', 'Existentialism', 'Phenomenology', 'Continental philosophy'].map(school => (
                <button
                  key={school}
                  onClick={() => setSelectedSchool(selectedSchool === school ? null : school)}
                  className={`px-2 py-0.5 rounded-full text-[11px] transition-colors shrink-0 ${
                    selectedSchool === school 
                      ? 'bg-amber-500 text-neutral-950 font-bold' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {school}
                </button>
              ))}
            </div>

            {/* Philosopher Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredPhilosophers.map(p => {
                const docId = `doc-api-${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                const isImported = importedDocIds.has(docId);
                const isExpanded = expandedPhilosopherId === p.id;

                return (
                  <div 
                    key={p.id}
                    className={`bg-neutral-950/80 border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
                      isImported 
                        ? 'border-emerald-500/40 shadow-sm shadow-emerald-500/10' 
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      {/* Philosopher Header */}
                      <div className="flex items-start space-x-3">
                        <img 
                          src={p.photo} 
                          alt={p.name}
                          className="w-14 h-16 rounded-lg object-cover border border-neutral-700/80 bg-neutral-900 shrink-0"
                          onError={(e) => {
                            // Fallback image if wikipedia fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-neutral-100 truncate">
                              {p.nameZh || p.name}
                            </h3>
                            {isImported ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] flex items-center space-x-1 shrink-0">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>已入库 RAG</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-500 font-mono">
                                API #{p.id}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            {p.name} ({p.born_date?.slice(0, 4)} - {p.death_date?.slice(0, 4)})
                          </p>
                          <p className="text-[11px] text-amber-400/90 mt-0.5">
                            {p.era} · {p.nationality}
                          </p>
                        </div>
                      </div>

                      {/* Schools */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {p.school.map((s, idx) => (
                          <span 
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-300 text-[10px] border border-neutral-700/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Core Academic Thesis */}
                      {p.coreThesis && (
                        <div className="mt-2.5 p-2 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed">
                          <span className="text-amber-400 font-semibold mr-1">【核心命题】:</span>
                          {p.coreThesis}
                        </div>
                      )}

                      {/* Expanded Quotes List */}
                      {isExpanded && p.ideas && p.ideas.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2 animate-fade-in">
                          <div className="flex items-center justify-between text-[11px] text-neutral-400">
                            <span className="font-semibold text-neutral-300">入库权威哲学命题 (Philosophy API Quotes):</span>
                            <span className="font-mono text-[10px]">{p.ideas.length} 条</span>
                          </div>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {p.ideas.map((quote, qIdx) => (
                              <div 
                                key={qIdx}
                                className="p-2 rounded bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-200 flex flex-col gap-1 group"
                              >
                                <p className="italic">“{quote}”</p>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleAskWithIdea(quote, p.nameZh || p.name)}
                                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>以此命题向研讨班发问</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setExpandedPhilosopherId(isExpanded ? null : p.id)}
                        className="text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        {isExpanded ? '收起命题' : `查看命题 (${p.ideas.length})`}
                      </button>

                      <div className="flex items-center space-x-1.5">
                        {p.recommendedSlideIndex && onNavigateSlide && (
                          <button
                            onClick={() => onNavigateSlide(p.recommendedSlideIndex!)}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors flex items-center space-x-1"
                            title={`跳转至研讨会课件 P.${p.recommendedSlideIndex}`}
                          >
                            <span>课件 P.{p.recommendedSlideIndex}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleImportToRAG(p)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                            isImported
                              ? 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30'
                              : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold'
                          }`}
                        >
                          <Database className="w-3 h-3" />
                          <span>{isImported ? '更新 RAG 向量' : '一键入库 RAG'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'ideas' ? (
          /* Ideas Search & Quotes List */
          <div className="space-y-3">
            {/* Live Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={ideaSearch}
                onChange={(e) => setIdeaSearch(e.target.value)}
                placeholder="在 250+ 经典哲学命题中即时检索（如：truth, reason, doubt, mind, nature, God, time, freedom）..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
              />
              {searchingIdeas && (
                <RefreshCw className="absolute right-3.5 top-2.5 w-4 h-4 text-amber-500 animate-spin" />
              )}
            </div>

            {/* Ideas Card Stream */}
            <div className="space-y-2">
              {ideas.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  未匹配到相关哲学命题，请尝试不同英文检索词（如 knowledge, reality, sense, cause 等）
                </div>
              ) : (
                ideas.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-xs text-neutral-200 italic font-serif leading-relaxed">
                        “{item.quote}”
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-neutral-400">
                        <span className="font-semibold text-amber-400">{item.author}</span>
                        <span>·</span>
                        <span className="text-neutral-500 font-mono">Philosophy API #{item.id}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAskWithIdea(item.quote, item.author)}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700/60 text-xs font-medium flex items-center space-x-1.5 shrink-0 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>带入研讨班辨析</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Schools & Traditions */
          <div className="space-y-3">
            <p className="text-xs text-neutral-400">
              Philosophy API 维护的 24 个西方哲学核心流派及主要代表思想家：
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {schools.map(school => (
                <div 
                  key={school.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-200">
                      {school.name}
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      #{school.id}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-neutral-400">
                    <span className="text-neutral-500">代表人物：</span>
                    {school.philosophers && school.philosophers.length > 0 ? (
                      <span className="text-amber-300/90 font-medium">
                        {school.philosophers.join(', ')}
                      </span>
                    ) : (
                      <span className="text-neutral-600">经典流派</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
