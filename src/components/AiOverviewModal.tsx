import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Sparkles, X, Search, ExternalLink } from 'lucide-react';
import type { AiOverviewPayload, AiOverviewCitation } from '../data/aiOverviewCurated';
import { matchCuratedOverview } from '../data/aiOverviewCurated';

interface AiOverviewModalProps {
  query: string | null;
  onClose: () => void;
  onFollowUp?: (q: string) => void;
}

function CitationChip({ c }: { c: AiOverviewCitation }) {
  const inner = (
    <span className="inline-flex items-center gap-1 max-w-[12rem] truncate rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] text-neutral-700 shadow-sm hover:bg-sky-50 hover:border-sky-200">
      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white shrink-0">
        {(c.label[0] || '·').toUpperCase()}
      </span>
      <span className="truncate">{c.label}</span>
      {c.extra ? <span className="text-neutral-400 shrink-0">+{c.extra}</span> : null}
    </span>
  );
  if (c.url) {
    return (
      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex align-middle mx-0.5">
        {inner}
      </a>
    );
  }
  return <span className="inline-flex align-middle mx-0.5">{inner}</span>;
}

function LeadText({ lead, highlight }: { lead: string; highlight?: string }) {
  if (!highlight || !lead.includes(highlight)) {
    return <p className="text-[15px] leading-relaxed text-neutral-800">{lead}</p>;
  }
  const parts = lead.split(highlight);
  return (
    <p className="text-[15px] leading-relaxed text-neutral-800">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark className="bg-sky-100 text-neutral-900 rounded px-0.5">{highlight}</mark>
          )}
        </React.Fragment>
      ))}
    </p>
  );
}

function ConfoundingDag() {
  return (
    <div className="my-3 rounded-xl bg-neutral-100 border border-neutral-200 px-4 py-5 flex flex-col items-center gap-2">
      <div className="rounded-lg border-2 border-neutral-400 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800">
        [ 混淆变量 Z ]
      </div>
      <div className="flex items-center justify-center gap-10 w-full max-w-sm relative">
        <div className="absolute top-0 left-1/4 right-1/4 h-8 border-l-2 border-r-2 border-t-2 border-neutral-400 rounded-t-lg pointer-events-none" />
        <div className="mt-6 rounded-lg border-2 border-sky-500 bg-white px-3 py-1.5 text-sm font-semibold">
          [ 原因 X ]
        </div>
        <div className="mt-6 text-neutral-400 text-lg tracking-widest">- - -&gt;</div>
        <div className="mt-6 rounded-lg border-2 border-emerald-500 bg-white px-3 py-1.5 text-sm font-semibold">
          [ 结果 Y ]
        </div>
      </div>
      <p className="text-[11px] text-neutral-500 mt-1">后门路径示意：Z → X，Z → Y；虚线为待识别的 X–Y 关联</p>
    </div>
  );
}

export const AiOverviewModal: React.FC<AiOverviewModalProps> = ({ query, onClose, onFollowUp }) => {
  const [data, setData] = useState<AiOverviewPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ask, setAsk] = useState('');
  const [preferLive, setPreferLive] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState<{
    onlineAvailable: boolean;
    firecrawl: boolean;
    googleCse: boolean;
    gemini: boolean;
    aiGateway: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ai-overview/status')
      .then(r => r.json())
      .then(s => {
        if (!cancelled) {
          setOnlineStatus(s);
          if (s.onlineAvailable) setPreferLive(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOnlineStatus({
            onlineAvailable: false,
            firecrawl: false,
            googleCse: false,
            gemini: false,
            aiGateway: false
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      setEnriching(false);
      const local = matchCuratedOverview(query);
      if (local) setData(local);

      const wantLive = preferLive && (onlineStatus?.onlineAvailable ?? preferLive);
      if (local && wantLive) setEnriching(true);

      try {
        const res = await fetch('/api/ai-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, preferLive: wantLive })
        });
        if (!res.ok) throw new Error(await res.text());
        const json = (await res.json()) as AiOverviewPayload;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) {
          if (local) setData(local);
          else setError(e instanceof Error ? e.message : '加载失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setEnriching(false);
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [query, preferLive, onlineStatus?.onlineAvailable]);

  const sourceLabel = useMemo(() => {
    switch (data?.source) {
      case 'curated':
        return '本场精编';
      case 'google_search':
        return 'Google 检索增强';
      case 'live_ai':
        return 'Gemini 在线';
      case 'offline_fallback':
        return '知识库离线';
      default:
        return '';
    }
  }, [data?.source]);

  const backendHint = useMemo(() => {
    if (!onlineStatus) return '检测中…';
    const bits: string[] = [];
    if (onlineStatus.googleCse) bits.push('CSE');
    if (onlineStatus.firecrawl) bits.push('Firecrawl');
    if (onlineStatus.gemini) bits.push('Gemini');
    if (onlineStatus.aiGateway) bits.push('Gateway');
    return bits.length ? bits.join(' · ') : '未配置在线密钥';
  }, [onlineStatus]);

  if (!query) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/55 backdrop-blur-[2px] p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-3xl mt-4 sm:mt-10 mb-10 rounded-2xl bg-[#f8f9fa] text-neutral-900 shadow-2xl border border-neutral-200 overflow-hidden"
        role="dialog"
        aria-label="AI 概览"
      >
        {/* 伪搜索栏 */}
        <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 shadow-sm">
            <Search className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-sm text-neutral-800 truncate flex-1">{query}</span>
            {(loading || enriching) && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-semibold text-neutral-900">AI 概览</h2>
              {sourceLabel && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
                  {sourceLabel}
                </span>
              )}
              {enriching && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 animate-pulse">
                  正在在线增强…
                </span>
              )}
              <span className="text-[10px] text-neutral-400" title="已检测的后端">
                {backendHint}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPreferLive(v => !v)}
              className="text-[11px] text-sky-700 hover:underline inline-flex items-center gap-1"
              title="切换：在线检索（Google CSE / Firecrawl / Gemini grounding）↔ 仅精编"
            >
              <ExternalLink className="w-3 h-3" />
              {preferLive ? '仅用精编' : '开启在线增强'}
            </button>
          </div>

          {error && !data && <p className="text-sm text-rose-600 py-6">{error}</p>}

          {data && (
            <div className="space-y-5">
              <LeadText lead={data.lead} highlight={data.highlightPhrase} />
              {!!data.citations?.length && (
                <div className="flex flex-wrap gap-1.5">
                  {data.citations.slice(0, 5).map((c, i) => (
                    <CitationChip key={`${c.label}-${i}`} c={c} />
                  ))}
                </div>
              )}

              {data.sections.map((sec, si) => (
                <section key={si} className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-900">{sec.heading}</h3>
                  {sec.paragraphs?.map((p, pi) => (
                    <p key={pi} className="text-[14px] leading-relaxed text-neutral-700">
                      {p}
                    </p>
                  ))}
                  {sec.diagram === 'confounding_dag' && <ConfoundingDag />}
                  {sec.bullets && (
                    <ul className="space-y-2.5 pl-0 list-none">
                      {sec.bullets.map((b, bi) => (
                        <li key={bi} className="text-[14px] text-neutral-800 leading-relaxed">
                          {b.title && <span className="font-semibold">{b.title}：</span>}
                          <span>{b.text}</span>
                          {b.citation && (
                            <span className="ml-1 align-middle">
                              <CitationChip c={b.citation} />
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.table && (
                    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                      {sec.table.title && (
                        <div className="px-3 py-2 text-sm font-semibold border-b border-neutral-100">
                          {sec.table.title}
                        </div>
                      )}
                      <table className="w-full text-[12px] sm:text-[13px]">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-600">
                            <th className="text-left font-medium px-3 py-2">维度</th>
                            {sec.table.columns.map(col => (
                              <th key={col} className="text-left font-medium px-3 py-2">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map(row => (
                            <tr key={row.label} className="border-t border-neutral-100">
                              <td className="px-3 py-2.5 font-medium text-neutral-700 whitespace-nowrap">
                                {row.label}
                              </td>
                              {row.cells.map((cell, ci) => (
                                <td key={ci} className="px-3 py-2.5 text-neutral-800">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}

              {!!data.followUps?.length && (
                <div className="pt-2 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-2">想进一步了解哪方面？</p>
                  <div className="flex flex-wrap gap-2">
                    {data.followUps.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => (onFollowUp ? onFollowUp(f) : undefined)}
                        className="text-left text-[13px] text-sky-700 hover:underline"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                className="mt-2 flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 shadow-sm"
                onSubmit={e => {
                  e.preventDefault();
                  const q = ask.trim();
                  if (!q) return;
                  onFollowUp?.(q);
                  setAsk('');
                }}
              >
                <span className="text-sm text-neutral-400 shrink-0">尽情提问</span>
                <input
                  value={ask}
                  onChange={e => setAsk(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-neutral-800 placeholder:text-neutral-400"
                  placeholder="继续追问这一概念…"
                />
              </form>
            </div>
          )}

          {loading && !data && (
            <div className="flex items-center justify-center gap-2 py-16 text-neutral-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              正在加载…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiOverviewModal;
