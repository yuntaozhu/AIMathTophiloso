import React, { useState } from 'react';
import { 
  Languages, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  ArrowRight, 
  FileText, 
  GitCompare, 
  Scale, 
  Quote, 
  Flame,
  Search,
  BookMarked
} from 'lucide-react';
import { PhilologicalCollation, ChineseTranslationVariant } from '../types';

interface PhilologicalCollationViewerProps {
  collation: PhilologicalCollation | null;
  isLoading: boolean;
  docTitle?: string;
  onAskWithCollation?: (questionText: string) => void;
  onNavigateSlide?: (slideIndex: number) => void;
  targetSlideIndex?: number;
}

export const PhilologicalCollationViewer: React.FC<PhilologicalCollationViewerProps> = ({
  collation,
  isLoading,
  docTitle,
  onAskWithCollation,
  onNavigateSlide,
  targetSlideIndex
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedTranslatorIdx, setSelectedTranslatorIdx] = useState<number>(0);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900/90 rounded-2xl border border-amber-500/30 p-8 flex flex-col items-center justify-center space-y-4 my-2 text-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Languages className="w-6 h-6 animate-spin" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-neutral-200">正在检索多语言原典与版本学考订...</h4>
          <p className="text-xs text-neutral-400 mt-1 max-w-md">
            调用原典文献学搜索工具，溯源原始语种版本（德语/拉丁语/希腊语原著）与代表性中文权威译本对勘...
          </p>
        </div>
      </div>
    );
  }

  if (!collation) {
    return (
      <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-6 text-center my-2">
        <BookOpen className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-xs text-neutral-400">请选择左侧或上方文献卡片，系统将自动触发多语言原典溯源与中译对勘</p>
      </div>
    );
  }

  const activeTranslation = collation.chineseTranslations[selectedTranslatorIdx] || collation.chineseTranslations[0];

  const fullMarkdownSummary = `【多语言原典对勘笔记】
文献：《${collation.workChineseTitle}》（${collation.workOriginalTitle}）
作者：${collation.author}
原语种：${collation.originalLanguage} | 标准引注：${collation.standardCitation}

【原始语种原文字句】
${collation.originalPassage}

【权威中文译本（${activeTranslation.translator} 译）】
${activeTranslation.translatedText}
（出处/版本：${activeTranslation.editionOrPublisher}）

【核心术语词源考订】
${collation.keyTermsEtymology.map(t => `• ${t.term} [${t.originalLanguage}]: ${t.morphology} —— ${t.conceptualGenealogy}`).join('\n')}

【翻译争议与认识论张力】
${collation.translationDebate.coreControversy}
${collation.translationDebate.representativeDebates}

【苏格拉底式发问】
${collation.socraticQuestions.join('\n')}`;

  return (
    <div className="bg-neutral-950 rounded-2xl border border-amber-500/40 shadow-xl overflow-hidden my-3">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border-b border-amber-500/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  多语言文献学溯源 (Philological Collation)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono border border-neutral-700">
                  {collation.originalLanguage}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                  {collation.standardCitation}
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-100 mt-1 flex items-center space-x-2">
                <span>{collation.workChineseTitle}</span>
                <span className="text-xs text-amber-400 font-serif italic font-normal">
                  — {collation.workOriginalTitle}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                著作者：{collation.author}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(fullMarkdownSummary, 'full_collation')}
              className="px-2.5 py-1 rounded-lg text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-700 flex items-center space-x-1.5 transition-colors"
              title="复制完整对勘笔记为 Markdown"
            >
              {copiedSection === 'full_collation' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">已复制对勘</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制对勘笔记</span>
                </>
              )}
            </button>

            {onAskWithCollation && (
              <button
                onClick={() => {
                  const inquiryPrompt = `请基于《${collation.workChineseTitle}》（${collation.workOriginalTitle}）的原始语种文本：“${collation.originalPassage.slice(0, 150)}...” 与 ${activeTranslation.translator} 译本：“${activeTranslation.translatedText.slice(0, 150)}...”，深入解构其核心术语在翻译中的认识论张力，并回答以下苏格拉底式发问：\n${collation.socraticQuestions[0] || ""}`;
                  onAskWithCollation(inquiryPrompt);
                }}
                className="px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>以此对勘向 AI 发问</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Parallel Bilingual Collation (原语种原典 vs 中文权威译本) */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-neutral-900/40">
        {/* Left Column: 原始语种版本 (Original Language Text) */}
        <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-xs font-bold text-amber-300">
                  原始语种原著片段 ({collation.originalLanguage.split(' ')[0]})
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                {collation.standardCitation}
              </span>
            </div>

            <blockquote className="text-xs md:text-sm text-neutral-200 font-serif italic leading-relaxed whitespace-pre-line bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80 selection:bg-amber-500/30">
              "{collation.originalPassage}"
            </blockquote>

            {collation.englishTranslation && (
              <div className="mt-2.5 pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400 font-serif">
                <span className="text-neutral-500 font-sans font-semibold">权威英译对照: </span>
                <span className="italic">"{collation.englishTranslation}"</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 border-t border-neutral-800/60">
            <span>原典版本学考订：标准历史权威排版</span>
            <button
              onClick={() => handleCopy(collation.originalPassage, 'original_passage')}
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              {copiedSection === 'original_passage' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'original_passage' ? '已复制原文' : '复制原文'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: 中文权威译本对照 (Authoritative Chinese Translation Variants) */}
        <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold text-emerald-300">
                  权威中文译本对勘 (校勘代表译者)
                </span>
              </div>

              {/* Translator Selection Chips */}
              <div className="flex items-center space-x-1">
                {collation.chineseTranslations.map((trans, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTranslatorIdx(idx)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      selectedTranslatorIdx === idx
                        ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                        : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {trans.translator} 译
                  </button>
                ))}
              </div>
            </div>

            <blockquote className="text-xs md:text-sm text-neutral-200 font-serif leading-relaxed whitespace-pre-line bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80 selection:bg-emerald-500/30">
              "{activeTranslation.translatedText}"
            </blockquote>

            <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-300/90 leading-relaxed">
              <span className="font-bold text-emerald-400">【译者出版注】：</span>
              <span>{activeTranslation.editionOrPublisher}。</span>
              {activeTranslation.divergenceNotes && (
                <span className="block mt-0.5 text-neutral-300">
                  {activeTranslation.divergenceNotes}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 border-t border-neutral-800/60">
            <span>当前展示：{activeTranslation.translator} 译本</span>
            <button
              onClick={() => handleCopy(activeTranslation.translatedText, 'chinese_translation')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              {copiedSection === 'chinese_translation' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'chinese_translation' ? '已复制译文' : '复制译文'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Etymology & Lexical Genealogy (核心概念原语种词源考证) */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
            <span>核心术语原语种词源学与谱系拆解 (Etymological Anatomy)</span>
          </h4>
          <span className="text-[10px] text-neutral-500 font-mono">严格锁定希腊文/拉丁文/德文构词根</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {collation.keyTermsEtymology.map((termItem, idx) => (
            <div key={idx} className="bg-neutral-900/90 rounded-xl border border-neutral-800 p-3 space-y-1.5 hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-200 font-serif">
                  {termItem.term}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                  {termItem.originalLanguage}
                </span>
              </div>
              <div className="text-[11px] text-amber-400/90 font-mono bg-neutral-950 p-1.5 rounded border border-neutral-800/80">
                {termItem.morphology}
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-serif">
                {termItem.conceptualGenealogy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Translation Debate & Epistemic Tension (汉译论争与认识论断裂点) */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 space-y-2.5">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-purple-300">
            中译名家争论与认识论张力 (Translational Divergence & Epistemic Impact)
          </h4>
        </div>

        <div className="bg-neutral-950/70 rounded-xl border border-neutral-800/80 p-3 space-y-2 text-xs">
          <div>
            <span className="text-neutral-400 font-semibold">【核心争议焦点】：</span>
            <span className="text-neutral-200">{collation.translationDebate.coreControversy}</span>
          </div>
          <div>
            <span className="text-purple-400 font-semibold">【代表性论辩】：</span>
            <span className="text-neutral-300 leading-relaxed">{collation.translationDebate.representativeDebates}</span>
          </div>
          <div className="pt-1 border-t border-neutral-800/80 text-[11px] text-amber-400/90">
            <span className="font-semibold">【对当代代码与计算本体论的影响】：</span>
            <span>{collation.translationDebate.epistemicImpact}</span>
          </div>
        </div>
      </div>

      {/* 5. Socratic Questions (苏格拉底式发问终局) */}
      <div className="p-4 border-t border-neutral-800 bg-amber-950/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>苏格拉底式原典反思性追问 (Socratic Interrogation)</span>
          </div>
          {collation.socraticQuestions.map((sq, i) => (
            <p key={i} className="text-xs text-neutral-200 font-serif font-bold italic leading-relaxed pl-2 border-l-2 border-amber-500/80">
              "{sq}"
            </p>
          ))}
        </div>

        {targetSlideIndex && onNavigateSlide && (
          <button
            onClick={() => onNavigateSlide(targetSlideIndex)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 flex items-center space-x-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>定位课件 P.{targetSlideIndex}</span>
          </button>
        )}
      </div>
    </div>
  );
};
