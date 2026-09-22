import type { RequestHandler } from 'express';

/**
 * Vercel rewrite `/api/*` → `/api` 会丢掉子路径；从转发头恢复。
 */
export const vercelPathRestore: RequestHandler = (req, _res, next) => {
  if (!process.env.VERCEL) return next();
  const candidates = [
    req.headers['x-invoke-path'],
    req.headers['x-forwarded-uri'],
    req.headers['x-vercel-forwarded-path'],
    req.headers['x-matched-path']
  ];
  for (const raw of candidates) {
    if (typeof raw !== 'string' || !raw.startsWith('/')) continue;
    const pathOnly = raw.split('?')[0];
    if (pathOnly === '/api' || pathOnly === '/') continue;
    const queryIdx = typeof req.url === 'string' ? req.url.indexOf('?') : -1;
    const query = queryIdx >= 0 ? req.url.slice(queryIdx) : '';
    if (pathOnly.startsWith('/socket.io') || pathOnly.startsWith('/api/')) {
      req.url = pathOnly + query;
      break;
    }
  }
  next();
};
