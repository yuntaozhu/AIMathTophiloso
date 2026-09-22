import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Calendar, 
  User, 
  ArrowRight, 
  Layers, 
  X,
  ExternalLink,
  Sparkles,
  Compass,
  Network,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Globe
} from 'lucide-react';
import { 
  getAllDocuments, 
  searchKnowledgeBase, 
  findRelatedDocuments, 
  DocumentRecommendation 
} from '../data/knowledgeBase';
import { RAG_THESIS_REGISTRY } from '../data/ragLiteratureAnalyzer';
import { PhilosophyApiExplorer } from './PhilosophyApiExplorer';

interface KnowledgeBaseExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskWithDoc: (docTitle: string, excerpt: string) => void;
  onNavigateSlide?: (slideIndex: number) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  isOpen,
  onClose,
  onAskWithDoc,
  onNavigateSlide
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'philosophy_api'>('local');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Get dynamic documents pool (including imported ones)
  const currentDocuments = useMemo(() => {
    return getAllDocuments();
  }, [refreshTrigger, isOpen]);

  // Compute vector recommendations when a document is selected
  const activeRecommendations = useMemo<DocumentRecommendation[]>(() => {
    if (!selectedDocId) return [];
    return findRelatedDocuments(selectedDocId, 3);
  }, [selectedDocId, refreshTrigger]);

  if (!isOpen) return null;

  // All unique domains
  const allDomains: string[] = Array.from(
    new Set(currentDocuments.map(d => d.metadata.domain).filter((d): d is string => Boolean(d)))
  );

  // Perform search or filter
  let displayChunks: { doc: any; similarity?: number }[] = [];
  if (searchQuery.trim()) {
    displayChunks = searchKnowledgeBase(searchQuery, 12);
  } else {
    displayChunks = currentDocuments.map(d => ({ doc: d, similarity: 1.0 }));
  }

  if (selectedDomain) {
    displayChunks = displayChunks.filter(c => c.doc.metadata.domain === selectedDomain);
  }

  if (selectedTag) {
    displayChunks = displayChunks.filter(c => 
      c.doc.metadata.keywords?.some((k: string) => k.toLowerCase() === selectedTag.toLowerCase())
    );
  }

  // All unique tags
  const allTags = Array.from(
    new Set(currentDocuments.flatMap(d => d.metadata.keywords || []))
  );

  const handleSelectDoc = (docId: string) => {
    if (selectedDocId === docId) {
      setSelectedDocId(null);
    } else {
      setSelectedDocId(docId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-neutral-100">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-neutral-100">
                  动态文献 RAG 知识库与哲学原典系统
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  pgvector / embeddings
                </span>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  Top-3 向量相似度推荐
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                集成研讨典籍（图灵、康德、海德格尔、退相干等）与 Philosophy API 官方哲学命题库
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Tab switch */}
            <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveTab('local')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  activeTab === 'local'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>研讨典籍库 ({currentDocuments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('philosophy_api')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  activeTab === 'philosophy_api'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Philosophy API 哲学云端库</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors shrink-0 ml-1"
              title="关闭窗口"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'philosophy_api' ? (
          <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-0">
            <PhilosophyApiExplorer
              onAskWithDoc={(title, excerpt) => {
                onAskWithDoc(title, excerpt);
                onClose();
              }}
              onNavigateSlide={(slideIdx) => {
                if (onNavigateSlide) onNavigateSlide(slideIdx);
                onClose();
              }}
              onDocumentImported={() => {
                setRefreshTrigger(prev => prev + 1);
              }}
            />
          </div>
        ) : (
          <>
            {/* Search & Tag Filter Bar */}
            <div className="p-3.5 border-b border-neutral-800 bg-neutral-900/60 space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="在向量知识库中检索概念：证伪主义、反常、范式转换、信念之网、硬核与保护带、认识论无政府主义、逻辑构造、波普尔、库恩..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
                />
              </div>

              {/* Domain filter chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-neutral-500 text-[11px] shrink-0 font-medium">哲学学派/领域:</span>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors shrink-0 ${
                    selectedDomain === null ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  全部学派 ({currentDocuments.length})
                </button>
                {allDomains.map((dom, idx) => {
                  const isSciPhil = dom === '科学哲学与方法论';
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDomain(selectedDomain === dom ? null : dom)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors shrink-0 ${
                        selectedDomain === dom
                          ? isSciPhil ? 'bg-purple-500 text-white font-bold' : 'bg-amber-500 text-neutral-950 font-bold'
                          : isSciPhil ? 'bg-purple-950/60 border border-purple-800/80 text-purple-300 hover:bg-purple-900/70' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {dom}
                    </button>
                  );
                })}
              </div>

              {/* Keyword filter chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-neutral-500 text-[11px] shrink-0">核心标签:</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-2 py-0.5 rounded-full text-[11px] transition-colors shrink-0 ${
                    selectedTag === null ? 'bg-neutral-700 text-neutral-100 font-medium' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  不限标签
                </button>
                {allTags.slice(0, 14).map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2 py-0.5 rounded-full text-[11px] transition-colors shrink-0 ${
                      selectedTag === tag ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

        {/* Document Cards List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {displayChunks.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-sm">未检索到匹配的文献条目</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="text-xs text-amber-400 hover:underline"
              >
                清空检索与标签筛选
              </button>
            </div>
          ) : (
            displayChunks.map(({ doc, similarity }) => {
              const isSelected = selectedDocId === doc.id;
              const targetSlideInfo = RAG_THESIS_REGISTRY[doc.id];

              return (
                <div 
                  key={doc.id}
                  className={`rounded-xl border transition-all space-y-2.5 overflow-hidden ${
                    isSelected
                      ? 'bg-neutral-950 border-amber-500/80 ring-1 ring-amber-500/30 shadow-xl'
                      : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Card Main Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h3 
                            onClick={() => handleSelectDoc(doc.id)}
                            className="text-sm font-semibold text-neutral-100 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            {doc.source_title}
                          </h3>
                          {doc.metadata.domain && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              doc.metadata.domain === '科学哲学与方法论'
                                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            }`}>
                              {doc.metadata.domain}
                            </span>
                          )}
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-amber-400" />
                              <span>已选中 · 推荐已展开</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-neutral-400">
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-neutral-500" />
                            <span>{doc.metadata.authors}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-neutral-500" />
                            <span>{doc.metadata.year} 年</span>
                          </span>
                          <span>•</span>
                          <span className="text-amber-400/80 font-mono">
                            出处: {doc.metadata.section || doc.metadata.page}
                          </span>
                          {targetSlideInfo?.targetSlideIndex && (
                            <>
                              <span>•</span>
                              <span className="text-sky-400 font-mono flex items-center space-x-1">
                                <Compass className="w-3 h-3 text-sky-400" />
                                <span>课件 P.{targetSlideInfo.targetSlideIndex}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right action/badge */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {similarity !== undefined && searchQuery.trim() && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                            匹配度 {(similarity * 100).toFixed(1)}%
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSelectDoc(doc.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-neutral-950 shadow-sm'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-300 border border-neutral-700/60'
                          }`}
                          title={isSelected ? '收起语义相关推荐' : '基于向量搜索展示语义最接近的三篇文献'}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isSelected ? '收起推荐' : '相关推荐 (3)'}</span>
                          {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Text chunk content */}
                    <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80 font-serif">
                      {doc.chunk_text}
                    </p>

                    {/* Card Footer actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {doc.metadata.keywords?.map((k: string, i: number) => (
                          <span key={i} className="text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                            #{k}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-3">
                        {onNavigateSlide && targetSlideInfo?.targetSlideIndex && (
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateSlide(targetSlideInfo.targetSlideIndex!);
                              onClose();
                            }}
                            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1 transition-colors"
                            title={`跳转到引用该文献的课件幻灯片 P.${targetSlideInfo.targetSlideIndex}`}
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>定位幻灯片 (P.{targetSlideInfo.targetSlideIndex})</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onAskWithDoc(doc.source_title, doc.chunk_text);
                            onClose();
                          }}
                          className="flex items-center space-x-1 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-all"
                        >
                          <span>以此文献向 AI 发问</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* VECTOR-BASED RELEVANCE RECOMMENDATION SECTION (TOP-3)     */}
                  {/* ========================================================= */}
                  {isSelected && (
                    <div className="border-t border-amber-500/30 bg-neutral-900/90 p-4 space-y-3 animate-fade-in">
                      {/* Section Title & Vector Search Stats */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-100 flex items-center space-x-2">
                              <span>基于向量搜索的语义关联推荐 (Top 3)</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                Vector Cosine Top-3
                              </span>
                            </h4>
                            <p className="text-[11px] text-neutral-400">
                              基于高维文本嵌入 (Embedding Cosine Similarity) 及核心概念拓扑，实时检索内容语义最契合的其他三篇文献
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-neutral-500 font-mono">
                          计算基底: {doc.id}
                        </span>
                      </div>

                      {/* 3 Recommended Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {activeRecommendations.map(({ doc: recDoc, similarity: recSim, rawCosine, sharedKeywords, relevanceReason }, rIdx) => {
                          const recSlideInfo = RAG_THESIS_REGISTRY[recDoc.id];
                          const scorePercent = (recSim * 100).toFixed(1);

                          return (
                            <div
                              key={recDoc.id}
                              className="p-3 rounded-xl bg-neutral-950/90 border border-neutral-800 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-2.5 group/rec shadow-md"
                            >
                              <div className="space-y-2">
                                {/* Top Rank & Similarity Metric */}
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                                    推荐 #{rIdx + 1}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                    相关度 {scorePercent}%
                                  </span>
                                </div>

                                {/* Title */}
                                <h5 
                                  onClick={() => setSelectedDocId(recDoc.id)}
                                  className="text-xs font-semibold text-neutral-200 group-hover/rec:text-amber-400 transition-colors cursor-pointer line-clamp-2"
                                  title={`点击切换焦点至《${recDoc.source_title}》`}
                                >
                                  {recDoc.source_title}
                                </h5>

                                {/* Author / Year */}
                                <div className="text-[10px] text-neutral-400 flex items-center space-x-1">
                                  <User className="w-3 h-3 text-neutral-500 shrink-0" />
                                  <span className="truncate">{recDoc.metadata.authors} ({recDoc.metadata.year})</span>
                                </div>

                                {/* Relevance Reason Badge */}
                                <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-tight">
                                  💡 <strong>推荐关联：</strong>{relevanceReason}
                                </div>

                                {/* Short Excerpt Preview */}
                                <p className="text-[11px] text-neutral-300 line-clamp-3 bg-neutral-900/70 p-2 rounded border border-neutral-800/80 leading-relaxed font-serif">
                                  {recDoc.chunk_text}
                                </p>
                              </div>

                              {/* Card Action Buttons */}
                              <div className="pt-1.5 border-t border-neutral-800/80 space-y-1.5">
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDocId(recDoc.id)}
                                    className="flex-1 py-1 px-2 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-medium text-neutral-200 hover:text-white transition-colors flex items-center justify-center space-x-1"
                                    title="将当前文献视窗切换至此推荐文献，递归展开其语义近邻"
                                  >
                                    <RotateCcw className="w-3 h-3 text-amber-400" />
                                    <span>切换焦点</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onAskWithDoc(recDoc.source_title, recDoc.chunk_text);
                                      onClose();
                                    }}
                                    className="flex-1 py-1 px-2 rounded bg-amber-500/20 hover:bg-amber-500 text-[11px] font-semibold text-amber-300 hover:text-neutral-950 transition-all flex items-center justify-center space-x-1 border border-amber-500/30 hover:border-amber-500"
                                    title="将此推荐文献的原典切片直接代入 AI 研讨池发问"
                                  >
                                    <span>以此提问</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>

                                {onNavigateSlide && recSlideInfo?.targetSlideIndex && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onNavigateSlide(recSlideInfo.targetSlideIndex!);
                                      onClose();
                                    }}
                                    className="w-full py-0.5 px-1.5 rounded text-[10px] text-sky-400 hover:text-sky-300 flex items-center justify-center space-x-1 transition-colors"
                                  >
                                    <Compass className="w-3 h-3" />
                                    <span>定位研讨幻灯片 (P.{recSlideInfo.targetSlideIndex})</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

