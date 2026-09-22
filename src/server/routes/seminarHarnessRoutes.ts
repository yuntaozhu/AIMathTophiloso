import type { Express, Request, Response } from 'express';
import {
  appendSeminarLog,
  getSeminarLogs,
  buildStructuredMinutes
} from '../seminarLogStore';
import { runHarnessDemo } from '../../services/harnessRunner';

/**
 * Phase 5：研讨日志 / 纪要 / Harness / health（从 server.ts 拆出）。
 */
export function registerSeminarHarnessRoutes(
  app: Express,
  opts: {
    getCurrentSlideIndex: () => number;
    getAI: () => { models: { generateContent: (args: any) => Promise<any> } } | null;
  }
): void {
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'ai-math-tophiloso',
      vercel: Boolean(process.env.VERCEL),
      time: new Date().toISOString()
    });
  });

  app.get('/api/seminar/logs', (_req, res) => {
    const logs = getSeminarLogs();
    res.json({
      status: 'success',
      logs,
      count: logs.length
    });
  });

  app.post('/api/seminar/log', (req, res) => {
    try {
      const body = req.body || {};
      const entry = appendSeminarLog({
        slide_index: Number(body.slide_index) || opts.getCurrentSlideIndex() || 1,
        user_query: String(body.user_query || ''),
        ai_response: String(body.ai_response || ''),
        agent_role: String(body.agent_role || 'user'),
        highlighted_text: body.highlighted_text,
        citations: body.citations,
        discussion_tag: body.discussion_tag,
        kind: body.kind || 'user',
        is_barrage: Boolean(body.is_barrage)
      });
      res.json({ status: 'success', logId: entry.id, entry });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/harness/run', (req, res) => {
    try {
      const { thesis, claimClass, slideIndex } = req.body || {};
      const run = runHarnessDemo({
        thesis,
        claimClass,
        slideIndex: Number(slideIndex) || opts.getCurrentSlideIndex() || 80
      });

      appendSeminarLog({
        slide_index: run.slideIndex,
        user_query: run.thesis.slice(0, 280),
        ai_response: `Harness ${run.passed ? 'PASS' : 'BLOCK'} · gates=${run.gates
          .map(g => `${g.name}:${g.exitCode}`)
          .join(',')}`,
        agent_role: 'system',
        kind: 'system'
      });

      res.json({
        status: 'success',
        run,
        demoOnly: true
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/seminar/generate-summary', async (req: Request, res: Response) => {
    try {
      const logs = getSeminarLogs();
      const mode = (req.body?.mode as string) || 'structured';
      const humanNotes = req.body?.humanNotes as
        | { anomaly?: string; strongestObjection?: string; unresolved?: string }
        | undefined;

      if (mode !== 'narrative') {
        let markdown = buildStructuredMinutes(logs);
        if (humanNotes) {
          markdown = markdown
            .replace(
              /1\. \*\*现场调参反常\*\*：/,
              `1. **现场调参反常**：${humanNotes.anomaly || ''}`
            )
            .replace(
              /2\. \*\*最强异议\*\*：/,
              `2. **最强异议**：${humanNotes.strongestObjection || ''}`
            )
            .replace(
              /3\. \*\*会后未决\*\*：/,
              `3. **会后未决**：${humanNotes.unresolved || ''}`
            );
        }
        return res.json({
          status: 'success',
          title: '可计算认识论：本场按页研讨纪要',
          generatedAt: new Date().toLocaleString('zh-CN'),
          markdownSummary: markdown,
          mode: 'structured',
          logCount: logs.length,
          source: 'offline_fallback',
          fromFallback: true
        });
      }

      const ai = opts.getAI();
      const logSummary = logs
        .map(
          (l, i) =>
            `[第${l.slide_index}页 ${l.kind || l.agent_role} ${i + 1}] ${l.user_query}\n→ ${(l.ai_response || '').slice(0, 200)}...`
        )
        .join('\n\n');

      const prompt = `请基于本次学术研讨会按页日志，生成一份精炼 Markdown 纪要（勿空泛）。
主题：可计算认识论
日志：
${logSummary || '（尚无日志）'}

大纲：1) 综述 2) 形式化 vs 开放性 3) Ontology as Code 4) 多智能体升级 5) 沙盒实证 6) 未决与学者责任
文末保留「人工补记三句」空行。`;

      let summaryText = '';
      let summarySource: 'live_ai' | 'offline_fallback' = 'offline_fallback';
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt
          });
          summaryText = response.text || '';
          if (summaryText) summarySource = 'live_ai';
        } catch {
          /* Graceful fallback */
        }
      }

      if (!summaryText) {
        summaryText = buildStructuredMinutes(logs);
        summarySource = 'offline_fallback';
      }

      return res.json({
        status: 'success',
        title: '可计算认识论：学术研讨会深度会议纪要',
        generatedAt: new Date().toLocaleString('zh-CN'),
        markdownSummary: summaryText,
        mode: 'narrative',
        logCount: logs.length,
        source: summarySource,
        fromFallback: summarySource !== 'live_ai'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
