import React from 'react';
import { ResponseSource } from '../types';

const SOURCE_META: Record<
  ResponseSource,
  { label: string; className: string; title: string }
> = {
  live_ai: {
    label: '在线生成',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
    title: '本段由在线模型实时生成'
  },
  offline_fallback: {
    label: '离线讲稿',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
    title: '模型不可用，已使用本地预制讲稿；非现场论证'
  },
  curated_corpus: {
    label: '权威底本',
    className: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
    title: '来自本地策展语料 / 对勘库'
  },
  cache: {
    label: '缓存',
    className: 'bg-neutral-500/20 text-neutral-300 border-neutral-500/35',
    title: '命中服务端缓存'
  },
  unverified_fallback: {
    label: '未校验兜底',
    className: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    title: '找不到精确底本时的兜底结果，请勿当作已核实引用'
  }
};

export function ResponseSourceBadge({
  source,
  className = ''
}: {
  source?: ResponseSource | null;
  className?: string;
}) {
  if (!source) return null;
  const meta = SOURCE_META[source];
  if (!meta) return null;

  return (
    <span
      title={meta.title}
      className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-semibold tracking-wide ${meta.className} ${className}`}
    >
      {meta.label}
    </span>
  );
}
