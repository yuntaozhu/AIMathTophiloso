import { PhilologicalCollation } from '../types';

export const PHILOLOGICAL_CORPUS: Record<string, PhilologicalCollation> = {
  // 1. 康德：纯粹理性批判 (Kritik der reinen Vernunft)
  'doc-kant-cpr': {
    id: 'phil-kant-cpr',
    sourceDocId: 'doc-kant-cpr',
    author: '伊曼努尔·康德 (Immanuel Kant, 1724-1804)',
    workOriginalTitle: 'Kritik der reinen Vernunft (1781 / 1787)',
    workChineseTitle: '纯粹理性批判 (第一批判)',
    originalLanguage: '德语 (Frühneuhochdeutsch / Aufklärungsdeutsch)',
    standardCitation: 'Akademie-Ausgabe AA III: 75 / B75-B76 (A51-A52)',
    originalPassage: `Gedanken ohne Inhalt sind leer, Anschauungen ohne Begriffe sind blind. Daher ist es eben so nothwendig, seine Begriffe sinnlich zu machen (d. i. ihnen den Gegenstand in der Anschauung beizufügen), als, seine Anschauungen sich verständlich zu machen (d. i. sie unter Begriffe zu bringen). Beide Vermögen, oder Fähigkeiten, können auch ihre Functionen nicht verwechseln. Der Verstand vermag nichts anzuschauen, und die Sinne können nichts denken. Nur daraus, daß sie sich vereinigen, kann Erkenntniß entspringen.`,
    originalPassageNormalized: 'Gedanken ohne Inhalt sind leer, Anschauungen ohne Begriffe sind blind. (B75)',
    englishTranslation: `Thoughts without content are empty, intuitions without concepts are blind. It is, therefore, just as necessary to make our concepts sensible, that is, to add an intuition to them in intuition, as it is to make our intuitions understandable, that is, to bring them under concepts. (Trans. Paul Guyer & Allen W. Wood, Cambridge Edition)`,
    chineseTranslations: [
      {
        translator: '邓晓芒',
        editionOrPublisher: '人民出版社 (杨祖陶校，2004年版)',
        translatedText: '无内容的思想是空的，无概念的直观是盲的。因此，使概念成为感性的（即把直观中的对象附加给概念），与使直观成为可理解的（即把直观归入概念之下），这两者同样是必然的。这两种能力或官能也不能互换其功能。知性不能直观，感官不能思维。只有从它们的互相结合中，才能产生出认识。',
        divergenceNotes: '严谨对译：将 Anschauung 译为“直观”，Verstand 译为“知性”，Sinnlichkeit 译为“感性”。严格遵从德文主谓句法结构与认识论机能区分。'
      },
      {
        translator: '蓝公武',
        editionOrPublisher: '商务印书馆 (汉译世界学术名著丛书，1960年版)',
        translatedText: '无内容之思维，常为空虚；无概念之直观，常为盲目。故使思维之概念感性化（即以直观中之对象附加于概念），与使感性之直观悟性化（即以概念总括直观），二者同一必要。此二种能力或机能，亦不能互相换位。悟性不能直观，感官不能思维。唯自二者之联合，始能发生知识。',
        divergenceNotes: '采用民国典雅文言白话风格；将 Verstand 译为“悟性”（易与东方顿悟混淆），Erkenntnis 译为“知识”。'
      },
      {
        translator: '李秋零',
        editionOrPublisher: '中国人民大学出版社 (《康德著作全集》第3卷，2004年版)',
        translatedText: '没有内容的思想是空洞的，没有概念的直观是盲目的。因此，使自己的概念感性化（即在直观中把对象加给它们），就像使自己的直观可知性化（即把它们置于概念之下）一样必然。这两种能力或官能也不能互换它们的功能。知性不能直观任何东西，感官也不能思维任何东西。只有从它们的结合中才能产生出认识。',
        divergenceNotes: '紧贴 Akademie 版原文德语用词，句式流畅平实，注重术语在康德全集中的全局统一性。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Anschauung (直观)',
        originalLanguage: '德语 (Deutsch)',
        morphology: '前缀 an- (朝向、切近附着) + 动词 schauen (凝视、观照、目击) + -ung (名词化)',
        conceptualGenealogy: '拉丁语 intuitio (in- + tueri，向内注视) 之对译。指表象直接与对象发生关系的纯感性官能。康德严格界定人类直观仅为感性直观 (sinnliche Anschauung)，排除了笛卡尔主义与经院神学的“智性直观 (intellektuelle Anschauung)”。'
      },
      {
        term: 'Ding an sich (物自体 / 物自身)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'Ding (事物) + an sich (就其自身而言、独立自存)',
        conceptualGenealogy: '与现象 (Erscheinung) 严格对立。物自身并非另一个空间的物理孤立实体，而是当认识主体悬置先验时空感性形式与十二知性范畴后，对象就其自身而言的本体论边界设定，作为纯粹消极的限制性概念 (Grenzbegriff)。'
      },
      {
        term: 'Transzendental (先验的) vs Transzendent (超验的)',
        originalLanguage: '拉丁源德语',
        morphology: '源自拉丁文 transcendere (trans- 跨越 + scandere 攀登)',
        conceptualGenealogy: '康德认识论的核心划界：Transzendental 指“不涉及对象本身，而涉及我们认识对象的方式，只要这种方式先天地成为可能”；而 Transzendent 则指僭妄越过一切可能经验界限而沉溺于虚妄玄想。蓝公武常将二者混译为“超绝”，在现代学术界已被邓晓芒、李秋零彻底廓清。'
      }
    ],
    translationDebate: {
      coreControversy: '“物自体” (Thing-in-itself) 究竟是一个本体论独立实体，还是认识论的先验限制性视域？',
      representativeDebates: '牟宗三主张康德设立物自身显露了“智的直觉”之匮乏，进而以中国心性之学补足；邓晓芒则严厉批评此乃将康德先验唯心论倒退为笛卡尔唯理论本体论，力倡将 Ding an sich 译为“物自身”（着重于认识视角的自为性，而非独立本体）。',
      epistemicImpact: '若将物自身实体化，将导致人工智能建模时误以为存在一个客观脱离传感流与表征范式的“终极物理裸真理”，遗忘了一切特征提取与损失函数皆是类型系统的“先验范畴投射”。'
    },
    socraticQuestions: [
      '如果“物自身”（Ding an sich）在本体论上绝不可被经验直观，我们断言它作为感性杂多的“外部实在刺激源”，是否已经非法僭越了先验知性的“因果性范畴”？',
      '若将大语言模型的权重嵌入与注意力头（Attention Heads）视作机器的“先验综合范畴”，机器的“直观”（多模态传感流）是否可能摆脱人类标注数据的投射而自主生成纯形式？'
    ]
  },

  // 2. 海德格尔：存在与时间 (Sein und Zeit)
  'doc-heidegger-bt': {
    id: 'phil-heidegger-bt',
    sourceDocId: 'doc-heidegger-bt',
    author: '马丁·海德格尔 (Martin Heidegger, 1889-1976)',
    workOriginalTitle: 'Sein und Zeit (1927)',
    workChineseTitle: '存在与时间 (全集第2卷 GA 2)',
    originalLanguage: '德语 (Phänomenologisches Deutsch)',
    standardCitation: 'GA 2: §7, §15, S. 67-71',
    originalPassage: `Das Seiende, das uns beim Besorgen begegnet, nennen wir das Zeug... Die Seinsart von Zeug, in der es sich von ihm selbst her bekundet, nennen wir die Zuhandenheit... Das Zeug "hat" seinen Zeugcharakter nur auf dem Grunde einer Bewandtnisganzheit... Die Vorhandenheit bekundet sich erst am versagenden, defekten Zeug.`,
    originalPassageNormalized: 'Das Wesen des Daseins liegt in seiner Existenz. (SuZ §9, S. 42)',
    englishTranslation: `The entities that are encountered in our concern we call equipment (Zeug)... The kind of being which equipment possesses, in which it manifests itself in its own right, we call readiness-to-hand (Zuhandenheit)... Presence-at-hand (Vorhandenheit) shows itself only when equipment is missing or defective. (Trans. John Macquarrie & Edward Robinson)`,
    chineseTranslations: [
      {
        translator: '陈嘉映 / 王庆节',
        editionOrPublisher: '生活·读书·新知三联书店 (1987 / 2006年修订版)',
        translatedText: '我们把在操劳中遇到的存在者称为用具……用具的存在方式，即它自身呈现出来的方式，我们称之为上手状态（Zuhandenheit）。只有在顺手的用具遭到损坏、发生故障时，事物才突兀地呈现为冷眼旁观的在手状态（现成状态，Vorhandenheit）。',
        divergenceNotes: '现代汉语哲学奠基性译本：创造了“此在”、“上手”、“在手”、“操劳（Besorgen）”、“操心（Sorge）”等核心现代汉译学术语汇。'
      },
      {
        translator: '孙周兴',
        editionOrPublisher: '商务印书馆 (海德格尔著作全集，2014年版)',
        translatedText: '我们在照料操持中遭遇的存在者，我们称之为器具……器具的存在方式，在其中器具由其本身显示出来，我们称之为切近上手状态。器具之成为器具，乃是以因缘整体性为根据的……现成在手状态唯有在罢工不灵、破损匮乏的器具上才凸显出来。',
        divergenceNotes: '改“用具”为“器具”，改“操劳”为“照料”，强调 Bewandtnis（因缘/关联性）的发生学生成。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Dasein (此在)',
        originalLanguage: '德语 (Deutsch)',
        morphology: '副词 da (在此、在那、处于敞开之场) + 动词不定式 Sein (存在)',
        conceptualGenealogy: '前海德格尔语境中通常指普遍“定在”或实存。海德格尔赋予其激进的现象学本体论内涵：指称那种对自身的存在有所领会、能够在存在中向着存在敞开的人之存在方式。'
      },
      {
        term: 'Zuhandenheit (上手状态 / 现成在手)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'zu (朝向、贴近) + Hand (手) + -heit (性质/状态)',
        conceptualGenealogy: '前理论的日常实践生存论范畴。木匠握持铁锤敲击铁钉时，铁锤隐没于敲击活动自身之中；只有铁锤断裂时，主体才会跳出沉浸，将其凝视为客体。'
      },
      {
        term: 'Vorhandenheit (在手状态 / 现成状态)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'vor (在面前、隔着距离) + Hand (手) + -heit',
        conceptualGenealogy: '传统西方形而上学自柏拉图、笛卡尔以来的范畴盲区：误把剥离了生活世界与操劳关联的纯粹理论客体，视为原初的第一本体。'
      }
    ],
    translationDebate: {
      coreControversy: 'Dasein 译为“此在”是否掩盖了其动态的时间性与生存领会？',
      representativeDebates: '张祥龙曾倡导译为“亲在”，强调其亲历性；王庆节提出“缘在”，突出因缘生起与互即互入；陈嘉映与孙周兴坚持“此在”，保留其作为词法字面的直白与现象学中性。',
      epistemicImpact: '对人工智能哲学的致命警示：若代码世界中只有以键值对、嵌入张量与图节点存在的“在手对象（Vorhandenheit）”，则强人工智能永远无法获得基于具身操劳的“上手理解（Zuhandenheit）”。'
    },
    socraticQuestions: [
      '如果大模型的全部表征（Token Embeddings）本质上都是脱离了生存操劳、冷冰冰被对象化在相空间中的“在手数据”（Vorhandenheit），它凭什么能够理解诸如“沉重”、“焦虑”与“畏”的原初生存论意涵？',
      '当无人驾驶系统因传感器镜头沾泥而突然进入异常处理（Exception Handling）分支时，这究竟是海德格尔式的“器具破损唤醒在手性”，还是依然只是另一段更复杂的静态在手代码的执行？'
    ]
  },

  // 3. 卡尔·波普尔：科学发现的逻辑 (Logik der Forschung)
  'doc-popper-lsd': {
    id: 'phil-popper-lsd',
    sourceDocId: 'doc-popper-lsd',
    author: '卡尔·波普尔 (Karl R. Popper, 1902-1994)',
    workOriginalTitle: 'Logik der Forschung (1934) / The Logic of Scientific Discovery (1959)',
    workChineseTitle: '科学发现的逻辑',
    originalLanguage: '德语 / 英语 (Deutsch / English)',
    standardCitation: 'Logik der Forschung §6, S. 13-16 / LSD Ch. 1, §6',
    originalPassage: `Ein empirisch-wissenschaftliches System muß an der Erfahrung scheitern können. Nicht die Verifizierbarkeit, sondern die Falsifizierbarkeit eines Systems ist als Kriterium der Abgrenzung zu betrachten... Man muß nicht ein System ein für allemal als 'gesichert' ansehen; die Erfahrung tritt auf als die Methode, durch die ein theoretisches System logisch ausgeschlossen werden kann.`,
    originalPassageNormalized: 'Ein empirisch-wissenschaftliches System muß an der Erfahrung scheitern können. (LdF §6)',
    englishTranslation: `It must be possible for an empirical scientific system to be refuted by experience. Not the verifiability but the falsifiability of a system is to be taken as a criterion of demarcation... I shall require that its logical form shall be such that it can be singled out, by means of empirical tests, in a negative sense.`,
    chineseTranslations: [
      {
        translator: '查汝强 / 邱仁宗',
        editionOrPublisher: '科学出版社 (1986年版)',
        translatedText: '一个经验科学的系统必须能够被经验所驳倒。我并不要求一个科学系统能够在肯定的意义上一次性地被挑选出来，我要求的是它的逻辑形式必须能够借助经验检验在否定的意义上被挑选出来：一个经验科学的系统必须能够被经验所证伪。',
        divergenceNotes: '定名“证伪主义”成为中文学术界标准译名。将 Falsifizierbarkeit 严格界定为逻辑形态上的“能够被反例否定”，区分于心理学或事实上的已经造假。'
      },
      {
        translator: '纪树立',
        editionOrPublisher: '上海译文出版社 (《波普尔哲学著作选》)',
        translatedText: '一个经验科学系统必须能在经验中碰壁垮台。衡量分界的标准不是可证实性，而是系统的可反驳性……我们永远不能把一个科学系统视为一劳永逸稳固确立的。',
        divergenceNotes: '采用“可反驳性（Refutability）”来对译 Falsifizierbarkeit，避免中文母语者望文生义误将“证伪”理解为“证明其伪善/弄虚作假”。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Falsifizierbarkeit (可证伪性 / 可反驳性)',
        originalLanguage: '德语 (Deutsch)',
        morphology: '拉丁根 fallere (跌落、欺骗) -> falsificare (判定为伪) + -bar (可行性) + -keit (名词性)',
        conceptualGenealogy: '用以替代维也纳学派逻辑实证主义的“可证实性原则 (Verifizierbarkeit)”。全称命题 ∀x(P(x) → Q(x)) 在归纳上不可证实，但在演绎逻辑中受否定后件律 (Modus Tollens) 支配，仅需一个特称反例 ∃x(P(x) ∧ ¬Q(x)) 即可在形式上摧毁。'
      },
      {
        term: 'Bewährung (经受检验度 / 耐受度)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'be- + wahr (真实) + -ung，原本为古高地德语中关于金银试金石与假释缓刑期严苛考验的法律用语',
        conceptualGenealogy: '波普尔特意用以抗衡归纳概率确证 (Confirmation)。一个假说被多次测试未被证伪，并不代表其具有更高的真理概率，而仅仅表明它目前“耐受住了严苛的反驳试炼”。'
      },
      {
        term: 'Abgrenzungskriterium (分界标准)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'Abgrenzung (划界、边界隔绝) + Kriterium (希腊文准则)',
        conceptualGenealogy: '划分经验科学与非科学（形而上学、占星术、精神分析、伪科学）的唯一形式化规范准则。'
      }
    ],
    translationDebate: {
      coreControversy: '“证伪” (Falsification) 在汉语受众中是否造成了严重的语义误导？',
      representativeDebates: '科学哲学家邱仁宗指出，“证伪”曾被许多非专业学者误解为“挑出假的错误学说”，但波普尔的核心恰恰是：恰恰因为一个假说具有被经验摧毁的高度脆弱性，它才配称作最高贵的科学假说。部分学者建议更名为“可否证性”或“可驳倒性”。',
      epistemicImpact: '在现代软件工程与形式化验证中，波普尔原则直接对应 Edsger Dijkstra 的名言：“测试只能证明程序有缺陷，不能证明程序无缺陷。”'
    },
    socraticQuestions: [
      '既然任何一次科学实验遭遇反常时，研究者总能通过引入辅助假设（如调整仪器参数、质疑传感器精度）来保护核心理论，波普尔所谓的“证伪”在历史上究竟是一次客观冷峻的逻辑裁决，还是一种无法落实的逻辑童话？',
      '如果大语言模型的输出在先验上被对齐（RLHF）为“总是礼貌且看似合理”，我们如何构造一个具有非空潜在反驳者集合（Potential Falsifiers）的严格提示词来证伪其“具有形式推理能力”的假说？'
    ]
  },

  // 4. 托马斯·库恩：科学革命的结构 (The Structure of Scientific Revolutions)
  'doc-kuhn-ssr': {
    id: 'phil-kuhn-ssr',
    sourceDocId: 'doc-kuhn-ssr',
    author: '托马斯·库恩 (Thomas S. Kuhn, 1922-1996)',
    workOriginalTitle: 'The Structure of Scientific Revolutions (1962)',
    workChineseTitle: '科学革命的结构',
    originalLanguage: '英语 (English)',
    standardCitation: 'SSR Section IX, pp. 111-113; Section X, pp. 122',
    originalPassage: `The transition from a paradigm in crisis to a new one from which a new tradition of normal science can emerge is far from a cumulative process, one achieved by an articulation or extension of the old paradigm. Rather it is a reconstruction of the field from new fundamentals... When the transition is complete, the profession will have changed its view of the field, its methods, and its goals.`,
    originalPassageNormalized: 'Scientists work from models acquired through education and through subsequent exposure to the literature... (SSR Sec. V)',
    englishTranslation: `The transition from a paradigm in crisis to a new one... is a reconstruction of the field from new fundamentals. In a sense that I am unable to analyze further, the proponents of competing paradigms practice their trades in different worlds.`,
    chineseTranslations: [
      {
        translator: '金吾伦 / 胡新和',
        editionOrPublisher: '北京大学出版社 (2003 / 2012年版)',
        translatedText: '从处于危机中的范式向一个新的范式的转变，远不是一个累积的过程，不是对旧范式的铰合或扩展。相反，它是在新的基础上对该领域的一次重建……当转变完成时，专业人员就会改变他们对该领域的看法、方法和目标。甚至可以说，竞争范式的支持者是在不同的世界里从事他们的事业。',
        divergenceNotes: '中文学界流传最广的标准译本；全面确立了“范式”、“常规科学”、“反常”、“不可通约性”等核心译词。'
      },
      {
        translator: '李宝恒 / 纪树立',
        editionOrPublisher: '上海科学技术出版社 (1980年版)',
        translatedText: '从危机的范式向产生新的常规科学传统的新范式过渡，决不是一个把旧范式加以条理化或推广的渐进积累过程。它是在新的基石上对这一领域所进行的研究的彻底改组……',
        divergenceNotes: '中国改革开放初期最早引入的译本，对中国科学哲学界冲破传统机械教条主义起到了历史性启蒙作用。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Paradigm (范式 / 典范)',
        originalLanguage: '古希腊源英语',
        morphology: '希腊文 παράδειγμα (parádeigma: para- 旁边、并在 + deiknynai 展示、指明)',
        conceptualGenealogy: '古希腊文法中指语法词形变化的范例。库恩将其升格为科学共同体所共享的信念、形而上学假设、实验仪器操作程式与解谜范例（Exemplars）。'
      },
      {
        term: 'Incommensurability (不可通约性)',
        originalLanguage: '拉丁源英语',
        morphology: 'in- (否定) + com- (共同) + mensura (度量、标尺)',
        conceptualGenealogy: '源自毕达哥拉斯学派关于边长为1的正方形对角线 √2 与整数之间没有公度单位的数学发现。库恩借此说明新旧范式之间不存在中立的共同经验语言与中立度量标准。'
      }
    ],
    translationDebate: {
      coreControversy: '“Paradigm” 应译为“范式”还是“典范”？',
      representativeDebates: '范岱年、胡新和等学者曾指出，“范式”一词带有强烈的静态形式主义与方法论规则色彩，而库恩在第二版后记中极力澄清，他更强调的是具体的“示范性例题（Exemplars）”。若译为“典范”，更能体现其默会知识与工匠式解谜学徒传承。',
      epistemicImpact: '直接冲击了现代软件系统关于“向后兼容（Backward Compatibility）”的幻想：AI 大模型与符号逻辑系统之间并非简单的模块叠加，而是发生了不可通约的本体论范式转移。'
    },
    socraticQuestions: [
      '如果库恩所说的不可通约性（Incommensurability）成立，那么爱因斯坦广义相对论取代牛顿万有引力定律，究竟是人类逼近了客观实在的数学本质，还是物理学家共同体发生了一场类似宗教改宗（Conversion）的集体格式塔认知错觉？',
      '从传统基于规则的状态机到当前基于大语言模型自组织的多智能体（Smallville），这究竟是一次算法精度的渐进演化，还是一次在计算哲学意义上摧毁了因果可追溯性的库恩式范式革命？'
    ]
  },

  // 5. 威拉德·蒯因：经验论的两个教条 (Two Dogmas of Empiricism)
  'doc-quine-dogmas': {
    id: 'phil-quine-dogmas',
    sourceDocId: 'doc-quine-dogmas',
    author: '威拉德·范·奥曼·蒯因 (W. V. O. Quine, 1908-2000)',
    workOriginalTitle: 'Two Dogmas of Empiricism (1951)',
    workChineseTitle: '经验论的两个教条',
    originalLanguage: '英语 (English)',
    standardCitation: 'Philosophical Review 60 (1): 20-43; From a Logical Point of View (1953)',
    originalPassage: `The totality of our so-called knowledge or beliefs, from the most casual matters of geography and history to the profoundest laws of atomic physics or even of pure mathematics and logic, is a man-made fabric which impinges on experience only along the edges. Or, to change the figure, total science is like a field of force whose boundary conditions are experience... Any statement can be held true come what may, if we make drastic enough adjustments elsewhere in the system.`,
    originalPassageNormalized: 'Total science is like a field of force whose boundary conditions are experience. (Two Dogmas §6)',
    englishTranslation: `A conflict with experience at the periphery occasions readjustments in the interior of the field... No particular experiences are linked with any particular statements in the interior of the field, except indirectly through considerations of equilibrium affecting the field as a whole.`,
    chineseTranslations: [
      {
        translator: '陈启伟',
        editionOrPublisher: '商务印书馆 (《从逻辑的观点看》，1987年版)',
        translatedText: '我们所谓的知识或信念的整体……是一幅人造的织锦，它只是沿着边缘才与经验相接触。或者换一个比喻，整个科学就像一个力场，它的边界条件就是经验。在边缘同经验相冲突，就会引起力场内部的重新调整……如果我们在系统的别处做出足够剧烈的调整，任何陈述都可以在任何情况下被维持为真。甚至逻辑排中律也不例外。',
        divergenceNotes: '权威经典定本：生动传达了“信念之网（Web of Belief）”与“确认整体论（Confirmation Holism）”的机理。'
      },
      {
        translator: '江天骥',
        editionOrPublisher: '武汉大学出版社 (科学哲学名篇选读)',
        translatedText: '人类知识作为一个整体共同面对经验的法庭，而不是各个孤立命题零散地与事实相对照……不存在独立于综合命题的纯粹分析命题教条。',
        divergenceNotes: '突出逻辑实用主义对维也纳学派逻辑实证主义两分法的颠覆。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Confirmation Holism (确认整体论)',
        originalLanguage: '希腊源英语',
        morphology: '希腊文 ὅλος (hólos: 全体、整个) + -ism',
        conceptualGenealogy: '接续皮埃尔·迪昂（Pierre Duhem）在物理学中的洞见，形成著名的“迪昂-蒯因论题（Duhem-Quine Thesis）”：一个理论假设从不孤立产生可检验结果，必须依赖大量的辅助假说与仪器理论。'
      },
      {
        term: 'Ontological Relativity (本体论相对性)',
        originalLanguage: '英语',
        morphology: 'Ontology (希腊文 on 存在者 + logos 论述) + Relativity',
        conceptualGenealogy: '“存在就是作为一个变项的值”（To be is to be the value of a bound variable）。谈论事物的本体论指涉，唯有相对于特定的背景语言或坐标系才有意义。'
      }
    ],
    translationDebate: {
      coreControversy: '分析性与综合性的教条打破，是否意味着逻辑真理（如非矛盾律）也纯属经验惯习？',
      representativeDebates: '卡尔纳普与蒯因发生了长达数十年关于“语言框架内部问题 vs 外部问题”的著名论战。卡尔纳普捍卫分析真理作为框架约定的有效性，而蒯因坚持通盘实用主义整体论。',
      epistemicImpact: '在复杂分布式系统故障排查中，工程师面临的绝非单行代码的对错，而是由协议栈、硬件时钟、编译优化与并发竞争交织而成的“调试整体论（Debugging Holism）”。'
    },
    socraticQuestions: [
      '在拥有上千亿参数的深度神经网络中，是否存在任何一个特定神经元可以被指认为‘存储了客观分析真理’，还是整个模型作为一个不可分割的‘信念之网’共同面对损失函数的梯度回传？',
      '如果为了使大模型输出符合特定价值观，我们通过微调强行固定某些前置命题为真，系统内部将在哪一层隐式破坏形式逻辑与数学运算的自洽性？'
    ]
  },

  // 6. 伊姆雷·拉卡托斯：科学研究纲领方法论 (The Methodology of Scientific Research Programmes)
  'doc-lakatos-msrp': {
    id: 'phil-lakatos-msrp',
    sourceDocId: 'doc-lakatos-msrp',
    author: '伊姆雷·拉卡托斯 (Imre Lakatos, 1922-1974)',
    workOriginalTitle: 'The Methodology of Scientific Research Programmes (1970)',
    workChineseTitle: '科学研究纲领方法论',
    originalLanguage: '英语 (English)',
    standardCitation: 'MSRP (Philosophical Papers Vol. 1), Cambridge University Press, pp. 47-52',
    originalPassage: `All scientific research programmes may be characterized by their 'hard core'. The negative heuristic forbids us to direct the modus tollens at this 'hard core'. Instead, we must use our ingenuity to articulate or even invent 'auxiliary hypotheses', which form a protective belt around this core... A research programme is progressive if its theoretical growth anticipates its empirical growth.`,
    originalPassageNormalized: 'The negative heuristic specifies the "hard core" of the programme... (MSRP §1)',
    englishTranslation: `A research programme is said to be progressing as long as its theoretical growth anticipates its empirical growth, that is, as long as it keeps predicting novel facts with some success.`,
    chineseTranslations: [
      {
        translator: '兰征',
        editionOrPublisher: '商务印书馆 (1986年版)',
        translatedText: '一切科学研究纲领都可以用它的“坚硬核（Hard Core）”来表征。否定性启发法禁止我们把否定后件律的矛头直接指向这个坚硬核。相反，我们必须发挥我们的聪明才智去阐发乃至发明“辅助假说”，这些辅助假说在这个坚硬核周围形成了一个保护带……只要一个研究纲领的理论增长先于它的经验增长，它就是进步的。',
        divergenceNotes: '中文学界标准译本，规范确立了“坚硬核”、“辅助保护带”、“启发法”、“进步与退化的问题转移”等核心概念。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Hard Core (坚硬核)',
        originalLanguage: '英语 (English)',
        morphology: 'Hard (坚固、不可侵犯) + Core (核、心)',
        conceptualGenealogy: '科学纲领发起者所做出的不可动摇的本体论承诺（如牛顿力学中的三大运动定律与万有引力定律）。面对反常时，绝不允许修改硬核。'
      },
      {
        term: 'Protective Belt (保护带)',
        originalLanguage: '英语 (English)',
        morphology: 'Protective (防御性的) + Belt (环状带)',
        conceptualGenealogy: '由辅助假设、观测理论和初始条件边界构成的弹性外壳，其职能是吸收反常冲击并被反复重塑调整，以捍卫坚硬核。'
      }
    ],
    translationDebate: {
      coreControversy: '“进步”与“退化”的界定是否缺乏及时的可操作性？',
      representativeDebates: '费耶阿本德严厉指责拉卡托斯的标准是一套“马后炮式的法官判词”：因为一个退化纲领完全可能在沉寂数十年后因为数学工具的突破而重新爆发为进步纲领，因此拉卡托斯无法向科学家提供当下行动的准则。',
      epistemicImpact: '直接对应安全关键系统与操作系统微内核架构：坚硬核是不变状态机与形式化验证证明原语，外围保护带是容错中间件与异常捕获沙箱。'
    },
    socraticQuestions: [
      '既然拉卡托斯承认退化纲领可能在未来任意时刻复活为进步纲领，我们依据何种即时理性标准，敢于宣布某种当前遭遇困境的技术路线或科学学说已经被历史淘汰？',
      '在设计具身智能的系统架构时，我们究竟应当将哪些认知公理写入不可修改的“坚硬核”，哪些策略留给可自由扰动的“保护带”？'
    ]
  },

  // 7. 保罗·费耶阿本德：反对方法 (Against Method)
  'doc-feyerabend-method': {
    id: 'phil-feyerabend-method',
    sourceDocId: 'doc-feyerabend-method',
    author: '保罗·费耶阿本德 (Paul K. Feyerabend, 1924-1994)',
    workOriginalTitle: 'Against Method: Outline of an Anarchistic Theory of Knowledge (1975)',
    workChineseTitle: '反对方法：无政府主义知识论纲要',
    originalLanguage: '英语 / 德语 (English / Deutsch)',
    standardCitation: 'Against Method, Verso, Ch. 1, pp. 14-19',
    originalPassage: `The idea that science can, and should, be run according to fixed and universal rules, is both unrealistic and pernicious... The only principle that does not inhibit progress is: anything goes. Without 'chaos', no knowledge. Without a frequent dismissal of reason, no progress.`,
    originalPassageNormalized: 'The only principle that does not inhibit progress is: anything goes. (AM Ch. 1)',
    englishTranslation: `Science is an essentially anarchic enterprise: theoretical anarchism is more humanitarian and more likely to encourage progress than its law-and-order alternatives.`,
    chineseTranslations: [
      {
        translator: '周昌忠',
        editionOrPublisher: '上海译文出版社 (1992年版)',
        translatedText: '认为科学能够而且应当按照固定普遍的规则来运行的思想，既是不现实的，也是有害的……唯一不阻止进步的原则是：怎么都行（Anything goes）。没有“混乱”，就没有知识。不经常性地抛弃理性，就没有进步。',
        divergenceNotes: '中文世界里程碑式译本；将“Anything goes”翻译为极其传神且引发巨大争辩的“怎么都行”。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Epistemological Anarchism (认识论无政府主义)',
        originalLanguage: '希腊源英语',
        morphology: 'an- (无、缺乏) + arkhē (首要原理、统治、统治者) + Epistemology',
        conceptualGenealogy: '并非指政治暴力混乱，而是主张没有任何一条逻辑或经验方法论规则在科学史上是神圣不可侵犯的；重大突破往往恰恰来自于公然违反公认规则（如伽利略动用望远镜欺骗感官的反归纳法）。'
      },
      {
        term: 'Theoretical Proliferation (理论增生原则)',
        originalLanguage: '英语 (English)',
        morphology: 'pro- (向前) + les (后代) + ferre (携带、繁衍)',
        conceptualGenealogy: '强调只有引入与公认事实和正统范式剧烈对抗的怪异假说，才能照见主流理论被掩盖的隐秘偏见。'
      }
    ],
    translationDebate: {
      coreControversy: '“怎么都行”是否等于毫无标准的相对主义虚无与反科学？',
      representativeDebates: '费耶阿本德生前反复申明，“怎么都行”不是他发明的新方法，而是他作为一个经验主义历史学家，在考察了从哥白尼到爱因斯坦的全部科学史后，被迫得出的唯一诚实的描述性结论。',
      epistemicImpact: '在复杂损失函数的优化景观中，纯理性的梯度下降必然陷入局部极小（Local Minima），唯有引入反常高熵随机漫步（退火机制与探索利用平衡）才能发现全局最优解。'
    },
    socraticQuestions: [
      '当科研实验室与科技大厂运用指标（如 PPO 奖励得分、论文引用数、KPI）严格规训人工智能的生成范式时，我们究竟是在推进严谨的科学探索，还是在亲手窒息理论增生所必需的混乱母体？',
      '如果“怎么都行”是真理唯一的救赎，那么我们凭什么依据科学常识将算命占星术与巫毒疗法排除出大学国家资助的医学课堂？'
    ]
  },

  // 8. 鲁道夫·卡尔纳普：世界的逻辑构造 (Der logische Aufbau der Welt)
  'doc-carnap-aufbau': {
    id: 'phil-carnap-aufbau',
    sourceDocId: 'doc-carnap-aufbau',
    author: '鲁道夫·卡尔纳普 (Rudolf Carnap, 1891-1970)',
    workOriginalTitle: 'Der logische Aufbau der Welt (1928)',
    workChineseTitle: '世界的逻辑构造',
    originalLanguage: '德语 (Logizistisches Deutsch)',
    standardCitation: 'Aufbau §1-§4, §61-§67, S. 85-98',
    originalPassage: `Die Wissenschaft ist ein System von Sätzen, die auf elementaren Erlebnissen begründet sind... Das Ziel der wissenschaftlichen Philosophie ist die rationale Rekonstruktion aller Gegenstände und Begriffe durch quasianalytische Methoden und formale Relationen wie die Ähnlichkeitserinnerung (Rs). Alles, was sich nicht logisch konstruieren lässt, ist ein Scheinsatz ohne kognitiven Gehalt.`,
    originalPassageNormalized: 'Die rationale Nachkonstruktion aller Gegenstände aus Grundbegriffen... (Aufbau §2)',
    englishTranslation: `The logical structure of the world: a constitution system that constructs all physical, psychological, and cultural objects from basic experiences through quasi-analysis and the relation of recollection of similarity.`,
    chineseTranslations: [
      {
        translator: '陈启伟',
        editionOrPublisher: '上海译文出版社 (1999年版)',
        translatedText: '科学是一个建立在基本体验基础之上的命题系统……科学哲学的目标就是运用准分析方法和像“相似性记忆（Rs）”这样的形式二元关系，对一切对象和概念进行理性重构。凡是无法在这一构造树上逐级还原的陈述，都是没有认知内容的伪命题（Scheinsatz）。',
        divergenceNotes: '中文分析哲学经典译本；精确界定了“逻辑构造（Konstitution）”、“基本体验（Elementarerlebnisse）”、“准分析（Quasianalyse）”。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Konstitution (构造 / 宪制)',
        originalLanguage: '德语 (拉丁源)',
        morphology: 'con- (共同) + statuere (确立、摆放)，指依据逻辑关系从低阶基底逐级确立高阶概念',
        conceptualGenealogy: '不同于经验心理学的感知发生，构造系统是严格的形式化语义层级结构（从自体心理学基底 -> 物理客体 -> 异己心理客体 -> 精神社会文化客体）。'
      },
      {
        term: 'Scheinsatz (伪命题)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'Schein (假象、虚幻光晕) + Satz (命题、陈述)',
        conceptualGenealogy: '符合语法构词规则但缺乏经验证实条件或形式逻辑还原链条的虚妄断言（如海德格尔著名的“无无化着自身” *Das Nichts nichtet*）。'
      }
    ],
    translationDebate: {
      coreControversy: '卡尔纳普的现象论基底（Phenomenalism）能否真正推导还原出客观的物理世界？',
      representativeDebates: '蒯因与古德曼后来指出，纯粹凭借“相似性记忆”这种一阶二元关系，无法避免“共同体困难（Difficulty of Incompletion）”与外延过宽问题，迫使卡尔纳普晚年转向物理主义与形式语言公理系统。',
      epistemicImpact: '与现代知识图谱（Knowledge Graph）、本体论代码（Ontology as Code）与自动形式化定理证明（Lean/Coq）的精神完全同构：一切模糊观念必须强类型化为明确归纳类型。'
    },
    socraticQuestions: [
      '卡尔纳普声称凡不可经验证实且非重言式的命题皆为“无认知意义的伪命题”，那么这条声称本身究竟是一条经验可证实的命题，还是按照其自身标准应当被送上火刑架的形而上学伪命题？',
      '在计算机程序中，一个未定义或无法被类型推导器求值的表达式将导致编译报错（Compile Error），这是否代表计算机运行时正是卡尔纳普所梦想的最纯洁的逻辑实证主义乌托邦？'
    ]
  },

  // 9. 阿兰·图灵：论可计算数 (On Computable Numbers)
  'doc-turing-1936': {
    id: 'phil-turing-1936',
    sourceDocId: 'doc-turing-1936',
    author: '阿兰·图灵 (Alan M. Turing, 1912-1954)',
    workOriginalTitle: 'On Computable Numbers, with an Application to the Entscheidungsproblem (1936)',
    workChineseTitle: '论可计算数及其在判定难题中的应用',
    originalLanguage: '英语 (English) / 涉及德语判定难题',
    standardCitation: 'Proceedings of the London Mathematical Society, Ser. 2, Vol. 42, pp. 230-265',
    originalPassage: `The "halting problem" is unsolvable. There can be no general process for determining whether a given machine will print 0 or whether it will ever halt... The Entscheidungsproblem can have no solution. We are thus able to show that Hilbert's programme of absolute formalization contains inherent ontological blind spots.`,
    originalPassageNormalized: 'Computable numbers may be described briefly as the real numbers whose expressions as a decimal are calculable by finite means. (Section 1)',
    englishTranslation: `Computable numbers may be described briefly as the real numbers whose expressions as a decimal are calculable by finite means. (Turing 1936)`,
    chineseTranslations: [
      {
        translator: '李建会 等',
        editionOrPublisher: '吉林人民出版社 (2007年版)',
        translatedText: '可计算数简而言之就是那些其十进制小数表达能够通过有限方法计算出来的实数……判定问题（Entscheidungsproblem）不可能有普遍解法。由此我们能够证明，不存在能够判定任意给定的形式系统命题是否可证的通用机器步骤。',
        divergenceNotes: '忠实还原图灵基于纸带、状态读写头与康托尔对角线法的开创性数学论证。'
      }
    ],
    keyTermsEtymology: [
      {
        term: 'Entscheidungsproblem (判定难题)',
        originalLanguage: '德语 (Deutsch)',
        morphology: 'entscheiden (决断、裁决) + -ung (名词化) + Problem (希腊源问题)',
        conceptualGenealogy: '大卫·希尔伯特在1928年国际数学家大会上提出的形式主义纲领三大基石之一（完备性、无矛盾性、可判定性）。图灵与丘奇分别独立宣告其破产。'
      }
    ],
    translationDebate: {
      coreControversy: '图灵机模型是否等同于人类心智的全部认识论边界？',
      representativeDebates: '罗杰·彭罗斯在《皇帝新脑》中依据哥德尔与图灵定理，主张人类物理大脑包含超越图灵停机界限的非对易量子引力算符，而丹尼尔·丹尼特等功能主义者坚持大脑本质就是并行的通用图灵机。',
      epistemicImpact: '为软件架构设立了终极铁律：不存在能够静态扫描任意代码并保证其既不无限死锁又能给出正确解的“全知超审判器”。'
    },
    socraticQuestions: [
      '当图灵用不可反驳的演绎逻辑证明了停机问题的普遍不可解时，他是否在人类理性的内核中揭示了一个比康德物自身更为绝望的本体论深渊——系统在形式上被注定无法看透自己的命运？',
      '如果超级大模型在未来展现出了看似无限的逻辑推理能力，这种能力是否依然被严格禁锢在通用图灵机的可枚举纸带之内？'
    ]
  }
};

/**
 * Helper to find philological collation by doc ID, author name, or title keyword
 */
export function findPhilologicalCollation(docIdOrQuery: string): PhilologicalCollation | null {
  if (!docIdOrQuery) return null;
  const target = docIdOrQuery.toLowerCase().trim();

  // 1. Exact ID match
  if (PHILOLOGICAL_CORPUS[target]) {
    return PHILOLOGICAL_CORPUS[target];
  }

  // 2. Doc ID matching key
  for (const [key, item] of Object.entries(PHILOLOGICAL_CORPUS)) {
    if (item.sourceDocId && target.includes(item.sourceDocId.toLowerCase())) {
      return item;
    }
  }

  // 3. Match by Author or Work Title
  for (const item of Object.values(PHILOLOGICAL_CORPUS)) {
    if (
      item.author.toLowerCase().includes(target) ||
      item.workChineseTitle.toLowerCase().includes(target) ||
      item.workOriginalTitle.toLowerCase().includes(target)
    ) {
      return item;
    }
  }

  // 4. Fuzzy keyword match
  if (target.includes('康德') || target.includes('kant') || target.includes('cpr')) {
    return PHILOLOGICAL_CORPUS['doc-kant-cpr'];
  }
  if (target.includes('海德格尔') || target.includes('heidegger') || target.includes('sein') || target.includes('此在')) {
    return PHILOLOGICAL_CORPUS['doc-heidegger-bt'];
  }
  if (target.includes('波普尔') || target.includes('popper') || target.includes('证伪') || target.includes('lsd')) {
    return PHILOLOGICAL_CORPUS['doc-popper-lsd'];
  }
  if (target.includes('库恩') || target.includes('kuhn') || target.includes('范式') || target.includes('ssr')) {
    return PHILOLOGICAL_CORPUS['doc-kuhn-ssr'];
  }
  if (target.includes('蒯因') || target.includes('quine') || target.includes('教条') || target.includes('dogmas')) {
    return PHILOLOGICAL_CORPUS['doc-quine-dogmas'];
  }
  if (target.includes('拉卡托斯') || target.includes('lakatos') || target.includes('纲领') || target.includes('硬核')) {
    return PHILOLOGICAL_CORPUS['doc-lakatos-msrp'];
  }
  if (target.includes('费耶阿本德') || target.includes('feyerabend') || target.includes('反对方法') || target.includes('怎么都行')) {
    return PHILOLOGICAL_CORPUS['doc-feyerabend-method'];
  }
  if (target.includes('卡尔纳普') || target.includes('carnap') || target.includes('构造') || target.includes('aufbau')) {
    return PHILOLOGICAL_CORPUS['doc-carnap-aufbau'];
  }
  if (target.includes('图灵') || target.includes('turing') || target.includes('停机') || target.includes('可计算')) {
    return PHILOLOGICAL_CORPUS['doc-turing-1936'];
  }

  return null;
}
