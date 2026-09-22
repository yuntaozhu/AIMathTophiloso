# Vercel 部署说明

项目：[ai-math-tophiloso](https://vercel.com/immanuels-projects-d581e442/ai-math-tophiloso)  
生产域：`https://ai-math-tophiloso.vercel.app`

## 架构要点

- 前端：Vite SPA → `dist/`（Vercel CDN）
- 后端：`api/index.js`（由 `npm run build:api` 从 `server.ts` 打成 CJS）导出 Node `http.Server`（Express + Socket.IO）
- 实时：Socket.IO **仅 websocket**（适配 [Vercel Fluid WebSocket](https://vercel.com/docs/functions/websockets)）
- AI：优先 `AI_GATEWAY_API_KEY`（[AI Gateway](https://vercel.com/docs/ai-gateway)），否则 `GEMINI_API_KEY`

## 必配环境变量

| 变量 | 说明 |
|---|---|
| `GEMINI_API_KEY` | 直连 Gemini（无 Gateway 时） |
| `AI_GATEWAY_API_KEY` | 推荐：Vercel AI Gateway |
| `AI_GATEWAY_MODEL` | 可选，默认 `google/gemini-2.5-flash` |
| `DOUBAO_API_KEY` | 可选，议程卫士 |
| `APP_URL` | `https://ai-math-tophiloso.vercel.app` |

多实例研讨同步建议再加 Upstash Redis（Marketplace），当前为单 Fluid 实例内存同步。

**注意**：不要挂已暂停的 Marketplace 资源（如 Suspended Supabase），否则部署会在开通阶段失败（`Resource provisioning failed`）。

## 本地

```bash
npm install
npm run dev
npm test          # Phase 5 冒烟单测
npm run lint
```

## 部署

```bash
npx vercel --prod
```

确保项目开启 **Fluid Compute**（WebSocket 依赖）。`vercel.json` 中 `functions` 指向 `api/index.js`（勿用 `.cjs`，Vercel 不识别）。

## 课件与工具页码（含开场论点 8 页）

| 用途 | 页码 |
|---|---|
| 开场论点 | P.3–P.10 |
| PDE / 记忆流 / 罗尔斯 / 明清沙盒 | 见控台「一键打开本页沙盒」 |
| Harness 示范 | P.72–P.75（或控台「Harness 示范」） |
| 45′ 彩排跳站 | 主讲控台开启「45′彩排」 |

## Phase 4：Harness 示范

- API：`POST /api/harness/run` — Gate1 底本 / Gate2 反事实 / Gate3 负知识
- 默认可关，不进研讨主路径

## 冒烟检查

```bash
curl -s https://ai-math-tophiloso.vercel.app/api/health
curl -s -X POST https://ai-math-tophiloso.vercel.app/api/harness/run \
  -H "Content-Type: application/json" \
  -d "{\"slideIndex\":72}"
```

期望：`health` 返回 `{ status: "ok" }`；Harness 返回 `gates` 三道 exit 码。
