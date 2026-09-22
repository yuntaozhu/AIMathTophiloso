import { PhilologicalCollation, DocumentChunk } from '../types';
import { findPhilologicalCollation, PHILOLOGICAL_CORPUS } from '../data/philologyCorpus';

/**
 * Searches and retrieves multilingual philological collation
 * Calls backend API /api/philology/search with instant local cache fallback
 */
export async function fetchPhilologicalCollation(
  target: { docId?: string; sourceTitle?: string; author?: string; query?: string } | DocumentChunk
): Promise<{ collation: PhilologicalCollation; source: string }> {
  let docId = '';
  let sourceTitle = '';
  let author = '';
  let query = '';

  if ('chunk_text' in target) {
    // It's a DocumentChunk
    docId = target.id;
    sourceTitle = target.source_title;
    author = target.metadata?.authors || '';
    query = target.metadata?.keywords?.join(' ') || '';
  } else {
    docId = target.docId || '';
    sourceTitle = target.sourceTitle || '';
    author = target.author || '';
    query = target.query || '';
  }

  // First check client-side corpus for instant <5ms response
  const localMatch = findPhilologicalCollation(docId || sourceTitle || author || query);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/philology/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ docId, sourceTitle, author, query }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.collation) {
        return {
          collation: data.collation,
          source: data.source || 'api'
        };
      }
    }
  } catch (err) {
    // Network or abort error - gracefully proceed to local match
  }

  if (localMatch) {
    return {
      collation: localMatch,
      source: 'local_corpus'
    };
  }

  // Default fallback to Kant CPR — client must treat as failure for mismatched docs
  return {
    collation: PHILOLOGICAL_CORPUS['doc-kant-cpr'],
    source: 'unverified_fallback'
  };
}
