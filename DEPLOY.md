# Vercel 部署说明（Phase 0）

项目：[ai-math-tophiloso](https://vercel.com/immanuels-projects-d581e442/ai-math-tophiloso)  
生产域：`https://ai-math-tophiloso.vercel.app`

## 架构要点

- 前端：Vite SPA → `dist/`（Vercel CDN）
- 后端：`api/index.ts` 导出 Node `http.Server`（Express + Socket.IO）
- 实时：Socket.IO **仅 websocket**（适配 [Vercel Fluid WebSocket](https://vercel.com/docs/functions/websockets)）
- AI：优先 `AI_GATEWAY_API_KEY`（[AI Gateway](https://vercel.com/docs/ai-gateway)），否则 `GEMINI_API_KEY`

## 必配环境变量（Project → Settings → Environment Variables）

| 变量 | 说明 |
|---|---|
| `GEMINI_API_KEY` | 直连 Gemini（无 Gateway 时） |
| `AI_GATEWAY_API_KEY` | 推荐：Vercel AI Gateway |
| `AI_GATEWAY_MODEL` | 可选，默认 `google/gemini-2.5-flash` |
| `DOUBAO_API_KEY` | 可选，议程卫士 |
| `APP_URL` | `https://ai-math-tophiloso.vercel.app` |

多实例研讨同步建议再加 Upstash Redis（Marketplace），当前为单 Fluid 实例内存同步。

## 本地

```bash
npm install
npm run dev
```

## 部署

连接 Git 后 push 即可；或：

```bash
npx vercel --prod
```

确保项目开启 **Fluid Compute**（WebSocket 依赖）。

## Phase 4：Harness 示范（可选）

在 **P.64–67** 课件条出现「Harness 示范」按钮（默认可关，不进研讨主路径）。

- API：`POST /api/harness/run` — Gate1 底本 / Gate2 反事实仿真 / Gate3 负知识
- 向观众说明：这是远期「Model + Harness」治理层原型，不是本场默认问答路径
