import express from "express";
import http from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { CORE_DOCUMENTS, searchKnowledgeBase } from "./src/data/knowledgeBase";
import { SEMINAR_SLIDES } from "./src/data/slides";
import { getPresenterStudyNote } from "./src/data/presenterNotes";
import { findPhilologicalCollation, PHILOLOGICAL_CORPUS } from "./src/data/philologyCorpus";
import { generateViaAiGateway } from "./src/services/aiGateway";
import {
  appendSeminarLog,
  getSeminarLogs,
  buildStructuredMinutes
} from "./src/server/seminarLogStore";
import { runHarnessDemo } from "./src/services/harnessRunner";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client with proper User-Agent telemetry
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}



// Realtime Server-Authoritative State
let currentSlideIndex = 1;
let presenterSocketId: string | null = null;
let activeLaserPointer: { x: number; y: number } | null = null;
let activeHighlight: string | null = null;
const connectedUsers = new Map<string, { id: string; name: string; isPresenter: boolean }>();

// Socket.io initialization
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  const userName = `学者_${socket.id.substring(0, 4)}`;
  const isFirst = connectedUsers.size === 0;
  connectedUsers.set(socket.id, { id: socket.id, name: userName, isPresenter: isFirst });
  if (isFirst) presenterSocketId = socket.id;

  // Send initial authoritative sync state
  socket.emit("sync:state", {
    currentSlide: currentSlideIndex,
    isPresenter: socket.id === presenterSocketId,
    presenterId: presenterSocketId,
    userCount: connectedUsers.size,
    laserPointer: activeLaserPointer,
    activeHighlight,
    historyLogs: getSeminarLogs().slice(-20)
  });

  io.emit("attendees:update", {
    count: connectedUsers.size,
    presenterId: presenterSocketId
  });

  // Switch role to Presenter
  socket.on("role:claim-presenter", () => {
    presenterSocketId = socket.id;
    for (const [id, user] of connectedUsers.entries()) {
      user.isPresenter = id === socket.id;
    }
    io.emit("presenter:changed", { presenterId: socket.id, presenterName: userName });
    socket.emit("role:confirmed", { isPresenter: true });
  });

  // Presenter Slide Navigation Change
  socket.on("slide:change", (data: { slideIndex: number }) => {
    if (data.slideIndex >= 1 && data.slideIndex <= SEMINAR_SLIDES.length) {
      currentSlideIndex = data.slideIndex;
      activeLaserPointer = null;
      activeHighlight = null;
      io.emit("slide:synced", {
        slideIndex: currentSlideIndex,
        byUser: userName,
        timestamp: Date.now()
      });
    }
  });

  // Laser Pointer Broadcast
  socket.on("laser:move", (pos: { x: number; y: number } | null) => {
    activeLaserPointer = pos;
    socket.broadcast.emit("laser:synced", pos);
  });

  // Highlight Text Broadcast
  socket.on("highlight:text", (data: { text: string | null; slideIndex: number }) => {
    activeHighlight = data.text;
    io.emit("highlight:synced", data);
  });

  // Chat message & Barrage (弹幕) — 完整转发证据链字段（P0-2）
  socket.on("chat:send", (msg: {
    id?: string;
    sender: string;
    content: string;
    role?: string;
    isBarrage?: boolean;
    slideIndex?: number;
    highlightedText?: string;
    citations?: any[];
    sandboxCode?: string;
    simulationConfig?: any;
    antiDriftAlert?: any;
    responseSource?: string;
    discussionTag?: string;
    timestamp?: string;
  }) => {
    const newMsg = {
      id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: msg.sender || userName,
      content: msg.content,
      role: msg.role || 'user',
      isBarrage: !!msg.isBarrage,
      slideIndex: msg.slideIndex ?? currentSlideIndex,
      highlightedText: msg.highlightedText || null,
      timestamp: msg.timestamp || new Date().toLocaleTimeString(),
      citations: msg.citations,
      sandboxCode: msg.sandboxCode,
      simulationConfig: msg.simulationConfig,
      antiDriftAlert: msg.antiDriftAlert,
      responseSource: msg.responseSource,
      discussionTag: msg.discussionTag
    };

    io.emit("chat:received", newMsg);
    if (newMsg.isBarrage) {
      io.emit("barrage:new", newMsg);
    }
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    if (presenterSocketId === socket.id) {
      const nextPresenter = connectedUsers.keys().next().value || null;
      presenterSocketId = nextPresenter;
      if (nextPresenter) {
        const u = connectedUsers.get(nextPresenter);
        if (u) u.isPresenter = true;
      }
      io.emit("presenter:changed", { presenterId: presenterSocketId, presenterName: "系统自动指派" });
    }
    io.emit("attendees:update", {
      count: connectedUsers.size,
      presenterId: presenterSocketId
    });
  });
});

// ==================== REST API ROUTES ====================

// 1. RAG Knowledge Base Search (pgvector documents table semantics)
app.get("/api/rag/search", (req, res) => {
  try {
    const query = String(req.query.q || "");
    const topK = parseInt(String(req.query.topK || "4"), 10);
    const results = searchKnowledgeBase(query, topK);
    res.json({
      status: "success",
      query,
      results: results.map(r => ({
        id: r.doc.id,
        source_title: r.doc.source_title,
        chunk_text: r.doc.chunk_text,
        similarity: Number(r.similarity.toFixed(4)),
        metadata: r.doc.metadata
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Philosophy API Proxy & Gateway ====================
// Official docs: https://philosophyapi.pythonanywhere.com/documentation/
// In-memory cache to bypass browser CORS and provide instant resilient responses
const philosophyCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchFromPhilosophyAPI(endpoint: string, queryParams: Record<string, string> = {}) {
  const qStr = new URLSearchParams(queryParams).toString();
  const cacheKey = `${endpoint}?${qStr}`;
  const cached = philosophyCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = `https://philosophyapi.pythonanywhere.com/api/${endpoint}/${qStr ? `?${qStr}` : ''}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`Philosophy API returned HTTP ${response.status}`);
    }
    const data = await response.json();
    philosophyCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    clearTimeout(timeout);
    if (cached) return cached.data;
    throw err;
  }
}

app.get("/api/philosophy/philosophers", async (req, res) => {
  try {
    const data = await fetchFromPhilosophyAPI("philosophers");
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: "Failed to fetch philosophers from Philosophy API", details: err.message });
  }
});

app.get("/api/philosophy/ideas", async (req, res) => {
  try {
    const queryParams: Record<string, string> = {};
    if (req.query.search) queryParams.search = String(req.query.search);
    if (req.query.page) queryParams.page = String(req.query.page);
    const data = await fetchFromPhilosophyAPI("ideas", queryParams);
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: "Failed to fetch ideas from Philosophy API", details: err.message });
  }
});

app.get("/api/philosophy/schools", async (req, res) => {
  try {
    const data = await fetchFromPhilosophyAPI("schools");
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: "Failed to fetch schools from Philosophy API", details: err.message });
  }
});

app.get("/api/philosophy/books", async (req, res) => {
  try {
    const data = await fetchFromPhilosophyAPI("books");
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: "Failed to fetch books from Philosophy API", details: err.message });
  }
});

// ==================== 多语言原典溯源辅助 (Multilingual Philological Search & Collation) ====================
const dynamicPhilologyCache = new Map<string, any>();

app.all("/api/philology/search", async (req, res) => {
  try {
    const docId = String(req.body?.docId || req.query?.docId || "");
    const sourceTitle = String(req.body?.sourceTitle || req.query?.sourceTitle || "");
    const author = String(req.body?.author || req.query?.author || "");
    const query = String(req.body?.query || req.query?.query || req.query?.q || "");

    const cacheKey = `${docId}|${sourceTitle}|${author}|${query}`.toLowerCase();
    if (dynamicPhilologyCache.has(cacheKey)) {
      return res.json({
        status: "success",
        source: "cache",
        collation: dynamicPhilologyCache.get(cacheKey)
      });
    }

    // 1. Check local peer-reviewed authoritative corpus
    const localMatch = findPhilologicalCollation(docId || sourceTitle || author || query);
    if (localMatch) {
      dynamicPhilologyCache.set(cacheKey, localMatch);
      return res.json({
        status: "success",
        source: "curated_corpus",
        collation: localMatch
      });
    }

    // 2. If not found in local curated corpus, invoke Gemini 3.8 Flash to perform scholarly philological collation
    const ai = getAI();
    if (ai) {
      const scholarlyPrompt = `你是一位精通西方哲学史（从前苏格拉底到后现代）、分析哲学、德国古典哲学及现象学的资深哲学教授与古典学文献学家。
用户正在研讨文献：“${sourceTitle || query || author || "经典哲学文本"}”（作者/线索：${author || "经典思想家"}，查询词：${query}）。
请严格按照最高学院派文献学（Philology）标准，提供该文献的原始语种版本（如德语、拉丁语、古希腊语或法语原典）与权威中文译本的对勘摘要。

请输出严格的 JSON 数据格式：
{
  "id": "phil-dynamic-${Date.now()}",
  "sourceDocId": "${docId || "dynamic"}",
  "author": "思想家全名及生卒年 (如：勒内·笛卡尔 René Descartes, 1596-1650)",
  "workOriginalTitle": "原始语种著述全名及发表年份 (如：Meditationes de prima philosophia, 1641)",
  "workChineseTitle": "标准中文译名 (如：第一哲学沉思集)",
  "originalLanguage": "原典语言 (如：拉丁语 Latina / 德语 Deutsch / 古希腊语 Ἑλληνική)",
  "standardCitation": "学术界标准编页或引注格式 (如：AT VII: 25 / AA IV: 75 / Bekker 1003a)",
  "originalPassage": "原典核心关键命题或段落原文字句 (必须是准确的历史原始语种，保留原汁原味德文/拉丁文/希腊文拼写)",
  "originalPassageNormalized": "原典句式提炼摘要",
  "englishTranslation": "权威英译本及译者 (如：Trans. John Cottingham)",
  "chineseTranslations": [
    {
      "translator": "代表性学术译者姓名 (如：庞景仁 或 王太庆)",
      "editionOrPublisher": "出版机构或代表版次 (如：商务印书馆 汉译世界学术名著)",
      "translatedText": "权威中文译文内容",
      "divergenceNotes": "该译本对核心术语的翻译策略与得失辨析"
    },
    {
      "translator": "第二位代表性译者 (如存在不同学术流派译本对照)",
      "editionOrPublisher": "出版机构或学术丛书",
      "translatedText": "对照译文内容",
      "divergenceNotes": "两译本分歧与概念重心偏向"
    }
  ],
  "keyTermsEtymology": [
    {
      "term": "核心概念术语 (如：Cogito / Ousia / Anschauung / Dasein)",
      "originalLanguage": "源语言",
      "morphology": "词形构词结构分解 (前缀+词根+后缀)",
      "conceptualGenealogy": "概念从源头到该著述的义理演进史"
    }
  ],
  "translationDebate": {
    "coreControversy": "中文学界围绕该文献核心概念的主要论争焦点",
    "representativeDebates": "代表性学者争论观点 (如'我思故我在' vs '我思故我是')",
    "epistemicImpact": "该翻译取向对当代哲学与认知计算建模的深层认识论影响"
  },
  "socraticQuestions": [
    "直击该论证脆弱假定或翻译概念失真的苏格拉底式发问1",
    "直击该论证脆弱假定或翻译概念失真的苏格拉底式发问2"
  ]
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: scholarlyPrompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed.workOriginalTitle && parsed.originalPassage) {
          dynamicPhilologyCache.set(cacheKey, parsed);
          return res.json({
            status: "success",
            source: "live_ai",
            collation: parsed
          });
        }
      } catch (aiErr) {
        // Fallback to closest curated text if API unavailable
      }
    }

    // Default fallback to Kant CPR as default archetype — 明确标为未校验兜底
    const fallback = PHILOLOGICAL_CORPUS['doc-kant-cpr'];
    return res.json({
      status: "success",
      source: "unverified_fallback",
      warning: "未找到匹配底本，已返回康德 CPR 作为形态学示例，请勿当作本议题原文。",
      collation: fallback
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Agenda Guardian Agent (基于 Doubao API 或超低延迟 Gemini 3.8 Flash)
app.post("/api/agent/agenda", async (req, res) => {
  try {
    const { slideIndex, currentDiscussion, recentMessages } = req.body;
    const currentSlide = SEMINAR_SLIDES.find(s => s.index === slideIndex) || SEMINAR_SLIDES[0];

    const slideContext = `当前幻灯片：第${currentSlide.index}页 - 《${currentSlide.title}》\n关键词：${(currentSlide.keywords || []).join(", ")}\n内容概述：${currentSlide.bullets?.join("; ") || currentSlide.details || ""}`;
    const discussionContext = currentDiscussion || (recentMessages || []).map((m: any) => `${m.sender}: ${m.content}`).join("\n");

    const prompt = `你名为“议程管理智能体（Agenda Guardian）”，是学术研讨会的会务协调与议程防偏移卫士。
【当前PPT上下文】
${slideContext}

【近期研讨讨论流】
${discussionContext || "暂无用户发言"}

请以严谨的学术态度执行以下任务：
1. 评估当前讨论是否偏离了当前PPT主题（例如讨论与当前Slide毫无关联的琐碎杂事）；给出0-100的偏移度分值（0为高度契合，100为完全脱缰）。
2. 如果发生偏移或讨论陷入停滞，请根据当前PPT的核心数学或社科概念，提出一个具有启发性的引导性学术追问（Guiding Question）。
3. 提取当前聊天池的核心弹幕观点摘要（20字以内的一句话总结）。

请输出严格的 JSON 格式：
{
  "isDrifting": boolean,
  "driftScore": number,
  "reason": "简析讨论状态",
  "guidingQuestion": "引导性学术追问",
  "barrageSummary": "弹幕摘要"
}`;

    let payload: Record<string, unknown> | null = null;

    // Check if Doubao API key is configured
    const doubaoKey = process.env.DOUBAO_API_KEY;
    if (doubaoKey && doubaoKey.trim().length > 0) {
      try {
        const modelEndpoint = process.env.DOUBAO_MODEL_ENDPOINT || "doubao-pro-32k";
        const doubaoRes = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${doubaoKey.trim()}`
          },
          body: JSON.stringify({
            model: modelEndpoint,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });
        if (doubaoRes.ok) {
          const dData = await doubaoRes.json();
          const parsed = JSON.parse(dData.choices[0].message.content);
          payload = { ...parsed, source: "live_ai", provider: "doubao" };
        }
      } catch (dErr) {
        // Fallback to Gemini smoothly if Volcengine model endpoint returns 404 or needs deployment endpoint
      }
    }

    // Default fast low-latency fallback with Gemini 3.8 Flash
    if (!payload) {
      const ai = getAI();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });
          const parsed = JSON.parse(response.text?.trim() || "{}");
          payload = { ...parsed, source: "live_ai", provider: "gemini" };
        } catch (geminiErr: any) {
          // Fallback gracefully on temporary upstream 503/429/high-demand
        }
      }
    }

    // Offline / robust fallback
    if (!payload) {
      payload = {
        isDrifting: false,
        driftScore: 18,
        reason: "讨论聚焦于当前PPT阐述的‘系统1灵感与系统2形式化Kernel’双轮协同机制。",
        guidingQuestion: `在当前第${currentSlide.index}页中，如何将社科反思性映射至状态机闭环中？`,
        barrageSummary: "聚焦形式化内核与社科反思性",
        source: "offline_fallback",
        fromFallback: true
      };
    }

    appendSeminarLog({
      slide_index: currentSlide.index,
      user_query: (currentDiscussion || "").slice(0, 240) || "(议程体检)",
      ai_response: `偏移 ${payload.driftScore}% · ${payload.reason}\n引导：${payload.guidingQuestion}`,
      agent_role: "agenda_guardian",
      kind: "agenda"
    });

    return res.json(payload);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Deep Epistemic Cognitive Engine (基于 Gemini 高上下文 RAG 推理与跨域映射)
app.post("/api/gemini/epistemic", async (req, res) => {
  try {
    const { query, slideIndex, highlightedText, discussionTag } = req.body;
    const currentSlide = SEMINAR_SLIDES.find(s => s.index === slideIndex) || SEMINAR_SLIDES[0];

    // Retrieve Top-K RAG Knowledge Chunks
    const ragResults = searchKnowledgeBase(query + " " + (highlightedText || "") + " " + currentSlide.title, 4);
    const ragContext = ragResults.map((r, i) => `【文献[${i+1}]】《${r.doc.source_title}》（出处/节选：${r.doc.metadata.section || r.doc.metadata.page}）：\n${r.doc.chunk_text}`).join("\n\n");

    const citations = ragResults.map((r, i) => ({
      sourceTitle: r.doc.source_title,
      chunkId: r.doc.id,
      pageOrSection: r.doc.metadata.section || `P.${r.doc.metadata.page}`,
      quoteText: r.doc.chunk_text.slice(0, 120) + "...",
      similarity: Number(r.similarity.toFixed(3))
    }));

    const systemPrompt = `你名为“可计算认识论引擎（Executable Epistemology Engine）”，是运行在多端同步学术研讨 Web 应用程序后端的资深 AI 架构师与跨学科认知学者。
你的使命是打破纯数学、理论物理与人文社科之间的认识论壁垒，协助参会者将高度抽象的哲学思辨与历史社科理论，转化为“可执行、可仿真、可证伪”的代码模型与数学映射。

【你的核心理论范式锚点】：
1. 纯数学的认识论跃迁：哈维·弗里德曼的具体数学不完备性、逆向数学（Reverse Mathematics）、有理立方体模型与大基数必然性；特里斯坦·布克马斯特与科尔多瓦对 Navier-Stokes / 3D Euler 光滑外力爆破的有限时间奇点突破。
2. 计算复杂性与拓扑相变：邓煜关于无穷维相空间流形与偏微分方程奇异性的五重阶梯（存在性 -> 测度 -> 余维数 -> 拓扑性质 -> 完全分类/孤子分辨猜想）；Bourgain 区域正测度相变；余维数-1 中心稳定流形相界；四色定理的 O(n log n) 并行归约与平坦区域。
3. 热力学计算底座：连续朗之万动力学、概率比特（p-bit）网络与自发吉布斯收敛。
4. 生成式多智能体微架构：Joon Sung Park 的 Generative Agents（记忆流三维打分、二阶反思树、自顶向下规划、场景图、Social Simulacra）；杨凌等的 DFM 发现基座模型七大能力与 Zetema 研究状态。

【核心指令】：
- 反击“中庸偏置（RLHF Trap）”：严禁预设智能体为老好人，在动力学中注入马基雅维利博弈、资源匮乏存量硬约束、寻租与偏见过滤。
- 强制概念操作化（Ontology as Code）：主动提供数据结构或面向对象（OOP）基类定义。
- 跨域隐喻对齐：主动利用偏微分方程相界、余维数超曲面、分形拓扑等数学物理概念映射社科危机。
- 使用严格的 LaTeX 公式语法（行内 $...$，独立块 $$...$$）。
- 在回答中明确引用所参考的文献标注，格式为【文献引用：出处】。`;

    const userPrompt = `【当前研讨幻灯片】
第 ${currentSlide.index} 页 - 《${currentSlide.title}》
${currentSlide.subtitle ? `副标题：${currentSlide.subtitle}\n` : ""}${currentSlide.bullets ? `核心要点：${currentSlide.bullets.join("\n")}\n` : ""}${highlightedText ? `【参会者当前高亮选中的文本】：\n"${highlightedText}"\n` : ""}
【动态检索到的核心文献知识库】
${ragContext}

【参会者提出的研讨问题】
${query}`;

    let aiAnswer = "";
    let responseSource: "live_ai" | "offline_fallback" = "offline_fallback";

    // Prefer Vercel AI Gateway when configured (observability + failover on Vercel)
    const viaGateway = await generateViaAiGateway({
      system: systemPrompt,
      user: userPrompt
    });
    if (viaGateway) {
      aiAnswer = viaGateway;
      responseSource = "live_ai";
    }

    const ai = getAI();
    if (!aiAnswer && ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            { text: systemPrompt },
            { text: userPrompt }
          ]
        });
        aiAnswer = response.text || "";
        if (aiAnswer) responseSource = "live_ai";
      } catch (geminiErr: any) {
        // Fallback to scholarly deterministic analysis on transient upstream load
      }
    }

    if (!aiAnswer) {
      responseSource = "offline_fallback";
      // Deterministic highly scholarly fallback response
      aiAnswer = `### 认识论解析与跨域映射

针对您在第 ${currentSlide.index} 页探讨的命题：“${query}”${highlightedText ? `（聚焦于高亮片段：“${highlightedText}”）` : ""}，我们必须将其从纯粹的思辨同义反复，提升至**高维动力系统与计算认识论**的严密视阈中予以审视：

#### 1. 跨域映射：社会危机与高余维数中心稳定流形的跨越
在邓煜教授关于非线性偏微分方程奇异性理论的第二阶与第三阶论述中【文献引用：邓煜《无穷维相空间中的奇异性景观与 AGI 的认知边界》】，相空间演化受控于鞍点孤立子 $Q$ 的线性化谱算子：
$$\\mathcal{L} = -\\Delta - f'(Q)$$
当算子仅存在唯一负本征值 $\\lambda_0 < 0$ 时，中心稳定流形 $W^{cs}(Q)$ 在相空间中具有严格**余维数 1（Codimension 1）**，作为划分全局耗散渐近平衡与有限时间爆破灾难的超曲面相界（Separatrix）。

映射至历史社会动力学：社会系统的制度均衡并非平坦的宽容吸引盆，而是一张在高维预期空间中穿行的余维数-1 脆弱薄膜。微观行为人的马基雅维利寻租倾向，犹如向系统注入的自发能量扰动。一旦扰动跨越临界幅值 $A^*(\\sigma)$，系统将不可避免地被卷入自相似奇异性坍缩（如明末白银流动性枯竭所诱发的小农违约暴动雪崩）。

#### 2. 概念操作化：Ontology as Code
拒绝将此现象归结为不可计算的模糊语词。我们将其操作化为显式状态转移机：
\`\`\`typescript
interface EpistemicAgent {
  id: string;
  ideologyVector: Float64Array; // 意识形态亲和度
  resourceStock: { capital: number; rent: number; food: number };
  survivalMargin: number; // 距离余维数相界的临界测度距离
  
  transition(fieldGradient: Vector): Action {
    if (this.resourceStock.food < 10) {
      // 突破 RLHF 偏置，自发转向激进抗粮博弈
      return this.executeRadicalDefection();
    }
    return this.maintainInstitutionalEquilibrium();
  }
}
\`\`\`

#### 3. 弗里德曼具体数学不完备性的深层启示
正如哈维·弗里德曼在“有理立方体”模型中指出的【文献引用：哈维·弗里德曼《具体数学不完备性与逆向数学》】，局部一阶规则系统无法在其内部完成自洽证明。社会科学企图仅靠微观理性人的局部契约消弭全面内卷，在认识论上必然遭遇不完备性死锁，必须依赖高阶宪制元规则作为“大基数公理”实施外生锚定。`;
    }

    // Persist to seminar_logs (JSONL + memory)
    const logEntry = appendSeminarLog({
      slide_index: slideIndex,
      user_query: query,
      ai_response: aiAnswer,
      agent_role: "deep_epistemic",
      highlighted_text: highlightedText,
      citations,
      discussion_tag: discussionTag || undefined,
      kind: "qa"
    });

    res.json({
      status: "success",
      response: aiAnswer,
      citations,
      logId: logEntry.id,
      source: responseSource,
      fromFallback: responseSource !== "live_ai"
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Sandbox Compiler Agent (基于 Gemini 将自然语言思想实验编译为可执行 BDI 仿真代码)
app.post("/api/gemini/sandbox", async (req, res) => {
  try {
    const { promptText, slideIndex } = req.body;
    const ai = getAI();

    const systemPrompt = `你名为“沙盘编译智能体（Sandbox Compiler Agent）”，是可计算认识论系统的代码生成与多智能体仿真专家。
你的任务是将用户提出的哲学思想实验或历史社科猜想（例如：无知之幕、阶层内卷、公地悲剧、微观史学博弈）转化为可直接在浏览器端运行的 JavaScript 仿真模型，并输出适合 ECharts 渲染的数据指标与参数。

代码规范要求：
- 拒绝 RLHF 老好人设定，必须包含马基雅维利式博弈偏置、存量硬约束、二阶反思判定。
- 必须包含构造函数/类定义、迭代步骤（step/tick）、数据采集（如基尼系数、遵从率、相变概率）。
- 请输出严格 JSON 格式：
{
  "title": "沙盘名称",
  "description": "理论背景与假设说明",
  "agentCount": 50,
  "ticks": 12,
  "parameters": {
    "scarcity": 0.6,
    "machiavellianWeight": 0.5
  },
  "code": "// 完整的JavaScript代码片段...",
  "explanation": "该沙盘如何映射了哲学/社会学理论"
}`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            { text: systemPrompt },
            { text: `请将以下思想实验编译为可执行仿真沙盘：\n${promptText}\n当前Slide索引：${slideIndex || 1}` }
          ],
          config: {
            responseMimeType: "application/json"
          }
        });
        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed.code && parsed.title) {
          return res.json({ ...parsed, source: "live_ai", fromFallback: false });
        }
      } catch (geminiErr: any) {
        // Fallback gracefully on temporary upstream 503/429
      }
    }

    // High quality deterministic fallback matching the slide/topic
    return res.json({
        title: "反事实思想实验沙盘：制度约束与马基雅维利背叛动态",
        description: "基于 BDI 状态机构建 50 名具有异质自私系数的智能体，检验在存量挤压下社会契约的相变破裂过程。",
        agentCount: 50,
        ticks: 12,
        parameters: {
          scarcityShock: 0.65,
          machiavellianWeight: 0.55
        },
        code: `// 编译生成的 BDI 状态机仿真代码
class MultiAgentSimulation {
  constructor(n, scarcity, machiavellian) {
    this.agents = Array.from({length: n}, (_, i) => ({
      id: i,
      capital: 10 + Math.random() * 50,
      machiavellian: Math.random() * machiavellian
    }));
  }
}`,
        explanation: "代码将规范伦理中的抽象原则解构为可微状态演化，揭示了相界破裂的具体临界点。",
        source: "offline_fallback",
        fromFallback: true
      });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. KaibanJS Multi-Agent Epistemic Workflow Orchestration
app.post("/api/kaiban/workflow", async (req, res) => {
  try {
    const { slideIndex, query } = req.body;
    const currentSlide = SEMINAR_SLIDES.find(s => s.index === slideIndex) || SEMINAR_SLIDES[0];

    // Dynamic import of KaibanJS workflow service
    const { runKaibanEpistemicWorkflow } = await import("./src/services/kaibanWorkflow");
    const result = await runKaibanEpistemicWorkflow(currentSlide, query);

    res.json({
      status: "success",
      result
    });
  } catch (err: any) {
    console.error("KaibanJS workflow error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Slide-Synchronized Deep Epistemic Cognitive Insight
app.get("/api/gemini/slide-insight/:index", async (req, res) => {
  try {
    const slideIdx = parseInt(req.params.index, 10) || 1;
    const currentSlide = SEMINAR_SLIDES.find(s => s.index === slideIdx) || SEMINAR_SLIDES[0];

    // Search relevant literature in RAG knowledge base for this exact slide
    const searchTerms = `${currentSlide.title} ${(currentSlide.keywords || []).join(" ")} ${currentSlide.sectionTitle || ""}`;
    const ragResults = searchKnowledgeBase(searchTerms, 3);
    const citations = ragResults.map((r, i) => ({
      sourceTitle: r.doc.source_title,
      chunkId: r.doc.id,
      pageOrSection: r.doc.metadata.section || `P.${r.doc.metadata.page}`,
      quoteText: r.doc.chunk_text.slice(0, 140) + "...",
      similarity: Number(r.similarity.toFixed(3))
    }));

    const ai = getAI();
    let insightMarkdown = "";
    let mathematicalMapping = "";
    let computableQuestion = "";

    if (ai) {
      const prompt = `你名为“可计算认识论引擎（Executable Epistemology Engine）”。
当前学术研讨会幻灯片切换到了：
【第 ${currentSlide.index} 页 - 《${currentSlide.title}》】
${currentSlide.sectionTitle ? `篇章：${currentSlide.sectionTitle}\n` : ""}${currentSlide.subtitle ? `副标题：${currentSlide.subtitle}\n` : ""}${currentSlide.bullets ? `要点：${currentSlide.bullets.join("; ")}\n` : ""}${currentSlide.details ? `详述：${currentSlide.details}\n` : ""}${currentSlide.formula ? `核心公式：${currentSlide.formula}\n` : ""}

参考研讨文献背景：
${ragResults.map(r => `《${r.doc.source_title}》: ${r.doc.chunk_text.slice(0, 200)}...`).join("\n\n")}

请针对该页课件输出一份结构化的“深度认知引擎同步研读解析”：
1. 【认识论内核与范式锚点】：一两句话点出该页探讨的核心数学不完备性、高维流形相变或多智能体微架构机制。
2. 【跨域数学物理映射】：将社科/历史/哲学命题映射到邓煜余维数相变、弗里德曼大基数或连续朗之万动力学（使用严谨的 LaTeX 公式）。
3. 【概念操作化代码原型（Ontology as Code）】：提供一个微型的 TypeScript 接口或状态机模型。
4. 【启发式可证伪学术追问】：提出一个直接切中该页命题弱点或边界的尖锐问题。

请输出严格的 JSON 格式：
{
  "summary": "认识论内核简析",
  "mathematicalMapping": "跨域数学物理映射（含LaTeX公式）",
  "ontologyCode": "// 简短TypeScript代码",
  "computableQuestion": "启发式学术追问",
  "paradigmTag": "所属理论范式标签"
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed.summary && parsed.mathematicalMapping) {
          return res.json({
            status: "success",
            slideIndex: currentSlide.index,
            title: currentSlide.title,
            sectionTitle: currentSlide.sectionTitle,
            keywords: currentSlide.keywords,
            citations,
            source: "live_ai",
            insight: { ...parsed, responseSource: "live_ai" }
          });
        }
      } catch (genErr: any) {
        // Fallback cleanly without unhandled exceptions on 503/429 spikes
      }
    }

    // High quality deterministic fallback matching slide topic and presenter notes
    const note = getPresenterStudyNote(currentSlide);
    const keywords = currentSlide.keywords || [];
    const primaryKw = keywords[0] || "可计算认识论";

    res.json({
      status: "success",
      slideIndex: currentSlide.index,
      title: currentSlide.title,
      sectionTitle: currentSlide.sectionTitle,
      keywords: currentSlide.keywords,
      citations,
      source: "offline_fallback",
      insight: {
        summary: note.coreThesis || `第 ${currentSlide.index} 页直击“${currentSlide.title}”，要求突破经院注疏同义反复，在形式化证明器与面向对象状态机之间确立双向映射。`,
        mathematicalMapping: note.crossDomainAnalogy || `在无穷维相空间中，系统演化受控于线性化算子谱结构 $\\mathcal{L} = -\\Delta - f'(Q)$。当存在负本征模时，中心稳定流形具有严格余维数 1（Codimension 1），构成制度瓦解的超曲面相界。`,
        ontologyCode: `// 第 ${currentSlide.index} 页《${currentSlide.title}》形式化状态机模型
interface SlideEpistemicModel {
  slideId: ${currentSlide.index};
  paradigm: "${primaryKw}";
  falsifiableState: { entropy: number; complianceRatio: number; resourceScarcity: number };
  evalTransition(flux: number): 'equilibrium' | 'phase_transition_collapse';
}`,
        computableQuestion: note.falsificationOrTrap || `若将第 ${currentSlide.index} 页中的命题作为基本假设注入多智能体仿真沙盘，在遭遇资源紧缩扰动时系统何时涌现违约相变？`,
        paradigmTag: primaryKw,
        responseSource: "offline_fallback"
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Seminar Logs & Academic Minutes Synthesis
app.get("/api/seminar/logs", (_req, res) => {
  const logs = getSeminarLogs();
  res.json({
    status: "success",
    logs,
    count: logs.length
  });
});

/** Client ingest：沙盒调参结论、异议标签发言等写入 JSONL */
app.post("/api/seminar/log", (req, res) => {
  try {
    const body = req.body || {};
    const entry = appendSeminarLog({
      slide_index: Number(body.slide_index) || currentSlideIndex || 1,
      user_query: String(body.user_query || ""),
      ai_response: String(body.ai_response || ""),
      agent_role: String(body.agent_role || "user"),
      highlighted_text: body.highlighted_text,
      citations: body.citations,
      discussion_tag: body.discussion_tag,
      kind: body.kind || "user",
      is_barrage: Boolean(body.is_barrage)
    });
    res.json({ status: "success", logId: entry.id, entry });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** Phase 4：Harness 示范（默认可关；不进入研讨默认路径） */
app.post("/api/harness/run", (req, res) => {
  try {
    const { thesis, claimClass, slideIndex } = req.body || {};
    const run = runHarnessDemo({
      thesis,
      claimClass,
      slideIndex: Number(slideIndex) || currentSlideIndex || 64
    });

    appendSeminarLog({
      slide_index: run.slideIndex,
      user_query: run.thesis.slice(0, 280),
      ai_response: `Harness ${run.passed ? "PASS" : "BLOCK"} · gates=${run.gates
        .map(g => `${g.name}:${g.exitCode}`)
        .join(",")}`,
      agent_role: "system",
      kind: "system"
    });

    res.json({
      status: "success",
      run,
      demoOnly: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/seminar/generate-summary", async (req, res) => {
  try {
    const logs = getSeminarLogs();
    // P3-1：默认按页结构化；可选 mode=narrative 走长文（需 AI）
    const mode = (req.body?.mode as string) || "structured";
    const humanNotes = req.body?.humanNotes as
      | { anomaly?: string; strongestObjection?: string; unresolved?: string }
      | undefined;

    if (mode !== "narrative") {
      let markdown = buildStructuredMinutes(logs);
      if (humanNotes) {
        markdown = markdown
          .replace(
            /1\. \*\*现场调参反常\*\*：/,
            `1. **现场调参反常**：${humanNotes.anomaly || ""}`
          )
          .replace(
            /2\. \*\*最强异议\*\*：/,
            `2. **最强异议**：${humanNotes.strongestObjection || ""}`
          )
          .replace(
            /3\. \*\*会后未决\*\*：/,
            `3. **会后未决**：${humanNotes.unresolved || ""}`
          );
      }
      return res.json({
        status: "success",
        title: "可计算认识论：本场按页研讨纪要",
        generatedAt: new Date().toLocaleString("zh-CN"),
        markdownSummary: markdown,
        mode: "structured",
        logCount: logs.length,
        source: "offline_fallback",
        fromFallback: true
      });
    }

    const ai = getAI();
    const logSummary = logs
      .map(
        (l, i) =>
          `[第${l.slide_index}页 ${l.kind || l.agent_role} ${i + 1}] ${l.user_query}\n→ ${(l.ai_response || "").slice(0, 200)}...`
      )
      .join("\n\n");

    const prompt = `请基于本次学术研讨会按页日志，生成一份精炼 Markdown 纪要（勿空泛）。
主题：可计算认识论
日志：
${logSummary || "（尚无日志）"}

大纲：1) 综述 2) 形式化 vs 开放性 3) Ontology as Code 4) 多智能体升级 5) 沙盒实证 6) 未决与学者责任
文末保留「人工补记三句」空行。`;

    let summaryText = "";
    let summarySource: "live_ai" | "offline_fallback" = "offline_fallback";
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt
        });
        summaryText = response.text || "";
        if (summaryText) summarySource = "live_ai";
      } catch (genErr: any) {
        // Graceful fallback
      }
    }

    if (!summaryText) {
      summaryText = buildStructuredMinutes(logs);
      summarySource = "offline_fallback";
    }

    res.json({
      status: "success",
      title: "可计算认识论：学术研讨会深度会议纪要",
      generatedAt: new Date().toLocaleString("zh-CN"),
      markdownSummary: summaryText,
      mode: "narrative",
      logCount: logs.length,
      source: summarySource,
      fromFallback: summarySource !== "live_ai"
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware in dev, static files in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const host = process.env.HOST || "0.0.0.0";
  server.listen(PORT, host, () => {
    console.log(`Executable Epistemology Engine server running on http://${host}:${PORT}`);
  });
}

const isVercel = Boolean(process.env.VERCEL);

if (!isVercel) {
  start();
} else if (process.env.NODE_ENV === "production") {
  // Vercel Fluid：静态前端由 CDN 提供；此处只挂 API + Socket
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
}

// Vercel Functions（含 WebSocket / Socket.IO）导出 HTTP server
export default server;
