// Philosophy API Client and Scholarly Mapping Service
// Grounded on https://philosophyapi.pythonanywhere.com/documentation/

import { DocumentChunk } from '../types';
import { registerDynamicDocument } from '../data/knowledgeBase';
import { registerThesisMetadata } from '../data/ragLiteratureAnalyzer';

export interface PhilosophyPhilosopher {
  id: number;
  name: string;
  nameZh?: string;
  photo: string;
  born_date: string;
  death_date: string;
  nationality: string;
  era: string;
  school: string[];
  ideas: string[];
  coreThesis?: string;
  recommendedSlideIndex?: number;
  recommendedSlideTitle?: string;
}

export interface PhilosophyIdea {
  id: number;
  quote: string;
  author: string;
}

export interface PhilosophySchool {
  id: number;
  name: string;
  philosophers: string[];
}

export interface PhilosophyBook {
  id: number;
  title: string;
  cover: string;
  abstract: string;
  country: string;
  language: string;
}

// Academic Chinese mapping, philosophical genealogies & slide anchors
export const PHILOSOPHER_ACADEMIC_META: Record<string, {
  nameZh: string;
  eraZh: string;
  paradigm: string;
  coreThesis: string;
  targetSlideIndex: number;
  targetSlideTitle: string;
  keywords: string[];
}> = {
  'René Descartes': {
    nameZh: '勒内·笛卡尔',
    eraZh: '17世纪唯理主义奠基期',
    paradigm: '数理逻辑与模型论',
    coreThesis: '确立普遍怀疑论与“我思故我在”（Cogito, ergo sum）第一哲学沉思原则，开启近代意识哲学与心物二元论（Res cogitans / Res extensa）。',
    targetSlideIndex: 55,
    targetSlideTitle: '现象学“非二元意识”的代码映射：主体消融与注意力重构',
    keywords: ['理性主义', '笛卡尔', '普遍怀疑', '我思故我在', '二元论', '第一哲学沉思']
  },
  'Immanuel Kant': {
    nameZh: '伊曼努尔·康德',
    eraZh: '18世纪启蒙时代 / 德国古典哲学',
    paradigm: '一般认识论',
    coreThesis: '发动哥白尼式哲学革命：先验感性论（时空直观）与知性十二范畴先验综合统一经验杂多，物自身不可直达，确立先验唯心论与实践理性公设。',
    targetSlideIndex: 29,
    targetSlideTitle: 'Ontology as Code：将模糊理论转化为强类型接口',
    keywords: ['纯粹理性批判', '先验范畴', '统觉统一', '物自身', '实践理性', '先验唯心论']
  },
  'Gottfried Wilhelm Leibniz': {
    nameZh: '戈特弗里德·威廉·莱布尼茨',
    eraZh: '17-18世纪唯理主义盛期',
    paradigm: '数理逻辑与模型论',
    coreThesis: '单子论（Monadology）与普遍符号语言（Characteristica Universalis）：主张实体皆为自足能动的精神单子，前定和谐构筑宇宙秩序，开启数理逻辑与计算主义先河。',
    targetSlideIndex: 30,
    targetSlideTitle: '斯宾诺莎公理模式的现代 OOP 映射',
    keywords: ['单子论', '普遍文字代数', '前定和谐', '充足理由律', '理性主义', '微积分']
  },
  'Arthur Schopenhauer': {
    nameZh: '阿图尔·叔本华',
    eraZh: '19世纪唯意志论与悲观主义',
    paradigm: '分布式多智能体与博弈',
    coreThesis: '《作为意志和表象的世界》：世界本质是盲目、冲动、无休止挣扎的生存意志（Wille zum Leben），个体表象皆受充足理由律四重根规约，唯有审美观照与解脱能消解痛苦。',
    targetSlideIndex: 48,
    targetSlideTitle: '第四章研讨问题与思辨：黑暗丛林与利他牺牲',
    keywords: ['意志与表象', '充足理由律', '生存意志', '哲学悲观主义', '先验唯心论']
  },
  'Georg Wilhelm Friedrich Hegel': {
    nameZh: '格奥尔格·威廉·弗里德里希·黑格尔',
    eraZh: '19世纪德国古典哲学集大成',
    paradigm: '社会科学本体论重构',
    coreThesis: '绝对唯心论与唯心辩证法：实体即主体，绝对精神通过“正-反-合”（Aufhebung）的历史辩证运动实现自我意识的完全显现，开启国家哲学与主奴辩证法。',
    targetSlideIndex: 45,
    targetSlideTitle: '阶级觉醒的二阶反思机制：从日常琐碎到制度合法性批判',
    keywords: ['辩证法', '扬弃', '绝对精神', '精神现象学', '主奴辩证法', '大逻辑']
  },
  'Ludwig Andreas von Feuerbach': {
    nameZh: '路德维希·费尔巴哈',
    eraZh: '19世纪唯物主义与青年黑格尔派',
    paradigm: '社会科学本体论重构',
    coreThesis: '人本学唯物主义与宗教异化批判：将思辨哲学拉回感性现实世界，论证神是人的本质在彼岸虚幻投影，为马克思历史唯物主义诞生奠定批判枢纽。',
    targetSlideIndex: 41,
    targetSlideTitle: '注入马基雅维利底色：自利、欺骗与寻租',
    keywords: ['人本学唯物主义', '异化批判', '基督教的本质', '感性实体', '青年黑格尔派']
  },
  'Søren Aabye Kierkegaard': {
    nameZh: '索伦·克尔凯郭尔',
    eraZh: '19世纪存在主义奠基人',
    paradigm: '一般认识论',
    coreThesis: '主观真理与生存跃迁：激烈反抗黑格尔全知系统对个体的吞噬，提出审美、伦理、宗教的生存三阶段，直面绝望（Fortvivlelse）与信仰的荒谬一跃。',
    targetSlideIndex: 50,
    targetSlideTitle: '传统思想实验的静态困境：从直觉纯化到动态时空缺失',
    keywords: ['存在主义', '恐惧与战栗', '主观真理', '信仰飞跃', '绝望', '致死的疾病']
  },
  'Martin Heidegger': {
    nameZh: '马丁·海德格尔',
    eraZh: '20世纪基础存在论与现象学',
    paradigm: '一般认识论',
    coreThesis: '《存在与时间》：解构主客二元实体论，此在（Dasein）的在世之在、前反思的上手状态（Zuhandenheit）与向死而在，警惕技术座架（Gestell）对生命意义的本体论暴政。',
    targetSlideIndex: 55,
    targetSlideTitle: '现象学“非二元意识”的代码映射：主体消融与注意力重构',
    keywords: ['存在与时间', '此在', '上手状态', '在手状态', '座架', '时间性']
  },
  'Aldous Leonard Huxley': {
    nameZh: '阿道斯·赫胥黎',
    eraZh: '20世纪长青哲学与技术反思',
    paradigm: '一般认识论',
    coreThesis: '《长青哲学》（The Perennial Philosophy）与技术乌托邦反思：探索意识之门与不同文明底层共同的灵性玄义，预警算法极权与感官娱乐麻醉对人类自省能力的剥夺。',
    targetSlideIndex: 68,
    targetSlideTitle: '终极追问与结语：波前过后的新生态与碳基文明的意义绿洲',
    keywords: ['长青哲学', '意识之门', '美丽新世界', '技术异化', '非二元知觉']
  },
  'Karl Popper': {
    nameZh: '卡尔·波普尔',
    eraZh: '20世纪批判理性主义与科学哲学',
    paradigm: '科学哲学与方法论',
    coreThesis: '证伪主义与分界标准：全称科学假说在逻辑上无法通过经验归纳证实，只能由反例经否定后件律（Modus Tollens）予以证伪；科学是一部猜想与反驳的进化史。',
    targetSlideIndex: 36,
    targetSlideTitle: '形式化检验与定理证明：Lean 4 / Coq 中的反例搜寻',
    keywords: ['科学哲学', '波普尔', '证伪主义', '划界标准', '否定后件律', '批判理性主义']
  },
  'Thomas Kuhn': {
    nameZh: '托马斯·库恩',
    eraZh: '20世纪科学历史主义与范式革命',
    paradigm: '科学哲学与方法论',
    coreThesis: '范式转换与不可通约性：常规科学是基于范式的解谜活动，反常积累引发危机，科学革命是格式塔视错觉般的范式转换，新旧范式不可通约。',
    targetSlideIndex: 31,
    targetSlideTitle: '斯坦福生成式智能体拆解：Joon Park 架构范式',
    keywords: ['科学革命的结构', '库恩', '范式', '常规科学', '不可通约性', '格式塔转换']
  },
  'Willard Van Orman Quine': {
    nameZh: '威拉德·蒯因',
    eraZh: '20世纪逻辑实用主义与分析哲学',
    paradigm: '科学哲学与方法论',
    coreThesis: '经验论教条批判与确认整体论：打破分析命题与综合命题的教条二分，提出信念之网（Web of Belief）；任何命题都作为整体共同面对经验法庭。',
    targetSlideIndex: 29,
    targetSlideTitle: 'Ontology as Code：将模糊理论转化为强类型接口',
    keywords: ['经验论的两个教条', '蒯因', '确认整体论', '信念之网', '本体论相对性']
  },
  'Imre Lakatos': {
    nameZh: '伊姆雷·拉卡托斯',
    eraZh: '20世纪科学研究纲领方法论',
    paradigm: '科学哲学与方法论',
    coreThesis: '科学研究纲领（MSRP）：由坚硬核（Hard Core）与辅助保护带（Protective Belt）构成；通过进步性问题转换与预测新事实评估纲领优劣。',
    targetSlideIndex: 44,
    targetSlideTitle: '可信可验证 Agent 的状态机约束与不变量守护',
    keywords: ['科学研究纲领', '拉卡托斯', '坚硬核', '保护带', '启发法', '问题转移']
  },
  'Paul Feyerabend': {
    nameZh: '保罗·费耶阿本德',
    eraZh: '20世纪激进科学哲学与认识论无政府主义',
    paradigm: '科学哲学与方法论',
    coreThesis: '《反对方法》与“怎么都行”：科学史上没有任何普遍有效的方法规则未曾被打破，主张反归纳与理论增生原则，批判科学沙文主义。',
    targetSlideIndex: 47,
    targetSlideTitle: '探索与利用之张力：打破局部极小的随机漫步与退火',
    keywords: ['反对方法', '费耶阿本德', '认识论无政府主义', '怎么都行', '理论增生']
  },
  'Rudolf Carnap': {
    nameZh: '鲁道夫·卡尔纳普',
    eraZh: '20世纪逻辑实证主义与维也纳学派',
    paradigm: '科学哲学与方法论',
    coreThesis: '《世界的逻辑构造》与统一科学：通过一阶逻辑与准分析，从纯瞬间基本体验逐级构造出物理对象、异己心智与社会客体，肃清无意义伪命题。',
    targetSlideIndex: 15,
    targetSlideTitle: '图灵可计算性与形式系统界限：不可判定性之深渊',
    keywords: ['世界的逻辑构造', '卡尔纳普', '逻辑实证主义', '准分析', '证实原则']
  }
};

// Resilient Fallback Dataset in case PythonAnywhere is unreachable
export const FALLBACK_PHILOSOPHERS: PhilosophyPhilosopher[] = [
  {
    id: 1,
    name: "René Descartes",
    nameZh: "勒内·笛卡尔",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg/800px-Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg",
    born_date: "1596-03-31",
    death_date: "1650-02-11",
    nationality: "French",
    era: "17th-century philosophy",
    school: ["Rationalism", "Cartesianism", "Mechanism", "Augustinianism", "Foundationalism"],
    ideas: [
      "I think, therefore I am",
      "It is not enough to have a good mind; the main thing is to use it well.",
      "Divide each difficulty into as many parts as is feasible and necessary to resolve it.",
      "If you would be a real seeker after truth, it is necessary that at least once in your life you doubt, as far as possible, all things",
      "Except our own thoughts, there is nothing absolutely in our power."
    ]
  },
  {
    id: 2,
    name: "Immanuel Kant",
    nameZh: "伊曼努尔·康德",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Immanuel_Kant_%28painted_portrait%29.jpg/800px-Immanuel_Kant_%28painted_portrait%29.jpg",
    born_date: "1724-04-22",
    death_date: "1804-02-12",
    nationality: "German",
    era: "Age of Enlightenment",
    school: ["Kantianism", "Transcendental idealism", "Classical liberalism"],
    ideas: [
      "Thoughts without content are empty, intuitions without concepts are blind.",
      "Two things fill the mind with ever new and increasing admiration and awe: the starry heavens above me and the moral law within me.",
      "Dare to know! Have the courage to use your own understanding!",
      "Morality is not the doctrine of how we may make ourselves happy, but of how we may make ourselves worthy of happiness.",
      "Experience without theory is blind, but theory without experience is mere intellectual play."
    ]
  },
  {
    id: 3,
    name: "Gottfried Wilhelm Leibniz",
    nameZh: "戈特弗里德·威廉·莱布尼茨",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Gottfried_Wilhelm_von_Leibniz.jpg/800px-Gottfried_Wilhelm_von_Leibniz.jpg",
    born_date: "1646-07-01",
    death_date: "1716-11-14",
    nationality: "German",
    era: "17th-18th Century Philosophy",
    school: ["Rationalism", "Optimism", "Conceptualism", "Foundationalism"],
    ideas: [
      "It is the knowledge of necessary and eternal truths that distinguishes us from the mere animals and gives us Reason and the sciences.",
      "The Monads have no windows, through which anything could come in or go out.",
      "Calculemus! (Let us calculate!) - When controversies arise, let us sit down to our desks and say: Let us calculate!",
      "Music is the pleasure the human mind experiences from counting without being aware that it is counting.",
      "There are two kinds of truths: those of reasoning and those of fact."
    ]
  },
  {
    id: 4,
    name: "Arthur Schopenhauer",
    nameZh: "阿图尔·叔本华",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Schopenhauer.jpg/800px-Schopenhauer.jpg",
    born_date: "1788-02-22",
    death_date: "1860-09-21",
    nationality: "German",
    era: "19th Century Philosophy",
    school: ["Transcendental idealism", "Continental philosophy", "Philosophical pessimism"],
    ideas: [
      "The world is my representation.",
      "Life swings like a pendulum backward and forward between pain and boredom.",
      "Talent hits a target no one else can hit; Genius hits a target no one else can see.",
      "Compassion is the basis of morality.",
      "Every man takes the limits of his own field of vision for the limits of the world."
    ]
  },
  {
    id: 5,
    name: "Georg Wilhelm Friedrich Hegel",
    nameZh: "格奥尔格·黑格尔",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Hegel_portrait_by_Schlesinger_1831.jpg/800px-Hegel_portrait_by_Schlesinger_1831.jpg",
    born_date: "1770-08-27",
    death_date: "1831-11-14",
    nationality: "German",
    era: "19th Century Philosophy",
    school: ["Conceptualism", "Continental philosophy", "German idealism", "Objective idealism", "Hegelianism"],
    ideas: [
      "What is rational is actual; and what is actual is rational.",
      "The owl of Minerva spreads its wings only with the falling of the dusk.",
      "We learn from history that we do not learn from history.",
      "The history of the world is none other than the progress of the consciousness of freedom.",
      "Truth is found neither in the thesis nor the antithesis, but in an emergent synthesis which reconciles the two."
    ]
  },
  {
    id: 6,
    name: "Ludwig Andreas von Feuerbach",
    nameZh: "路德维希·费尔巴哈",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ludwig_Feuerbach.jpg/800px-Ludwig_Feuerbach.jpg",
    born_date: "1804-07-28",
    death_date: "1872-09-13",
    nationality: "German",
    era: "19th Century Philosophy",
    school: ["Anthropological materialism", "Secular humanism", "Young Hegelians"],
    ideas: [
      "Man is what he eats (Der Mensch ist, was er isst).",
      "God is the projection of the human essence into the alien infinity.",
      "My religion is no religion. My philosophy is no philosophy. My theology is anthropology.",
      "Nature has not made any distinction between the spiritual and the material."
    ]
  },
  {
    id: 7,
    name: "Søren Aabye Kierkegaard",
    nameZh: "索伦·克尔凯郭尔",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kierkegaard.jpg/800px-Kierkegaard.jpg",
    born_date: "1813-05-05",
    death_date: "1855-11-11",
    nationality: "Danish",
    era: "19th Century Philosophy",
    school: ["Continental philosophy", "Existentialism"],
    ideas: [
      "Life can only be understood backwards; but it must be lived forwards.",
      "Anxiety is the dizziness of freedom.",
      "The most common form of despair is not being who you are.",
      "Faith is the highest passion in a human being.",
      "Truth is subjectivity."
    ]
  },
  {
    id: 8,
    name: "Martin Heidegger",
    nameZh: "马丁·海德格尔",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Heidegger_%281960%29.jpg/800px-Heidegger_%281960%29.jpg",
    born_date: "1889-09-26",
    death_date: "1976-05-26",
    nationality: "German",
    era: "20th Century Philosophy",
    school: ["Continental philosophy", "Existentialism", "Phenomenology", "Hermeneutics"],
    ideas: [
      "Why are there beings at all, rather than nothing?",
      "Language is the house of Being. In its home human beings dwell.",
      "Dasein is a being that does not simply occur among other beings. Rather, it is ontically distinguished by the fact that, in its very being, that being is an issue for it.",
      "The essence of technology is by no means anything technological.",
      "Mortals dwell in the way they preserve the fourfold in its essential being."
    ]
  },
  {
    id: 9,
    name: "Aldous Leonard Huxley",
    nameZh: "阿道斯·赫胥黎",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Aldous_Huxley_portrait.jpg/800px-Aldous_Huxley_portrait.jpg",
    born_date: "1894-07-26",
    death_date: "1963-11-22",
    nationality: "British",
    era: "20th Century Philosophy",
    school: ["Perennialism"],
    ideas: [
      "There are things known and there are things unknown, and in between are the doors of perception.",
      "The Perennial Philosophy is primarily concerned with the one, divine Reality substantial to the manifold world of things.",
      "Experience is not what happens to you; it's what you do with what happens to you.",
      "Technological progress has merely provided us with more efficient means for going backwards."
    ]
  },
  {
    id: 10,
    name: "Karl Popper",
    nameZh: "卡尔·波普尔",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Karl_Popper.jpg/800px-Karl_Popper.jpg",
    born_date: "1902-07-28",
    death_date: "1994-09-17",
    nationality: "Austrian-British",
    era: "20th Century Philosophy",
    school: ["Critical rationalism", "Philosophy of science", "Liberalism"],
    ideas: [
      "A theory that explains everything explains nothing.",
      "Our knowledge can only be finite, while our ignorance must necessarily be infinite.",
      "Science must begin with myths, and with the criticism of myths.",
      "No matter how many instances of white swans we may have observed, this does not justify the conclusion that all swans are white.",
      "In so far as a scientific statement speaks about reality, it must be falsifiable."
    ]
  },
  {
    id: 11,
    name: "Thomas Kuhn",
    nameZh: "托马斯·库恩",
    photo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Thomas_Kuhn.jpg/800px-Thomas_Kuhn.jpg",
    born_date: "1922-07-18",
    death_date: "1996-06-17",
    nationality: "American",
    era: "20th Century Philosophy",
    school: ["Philosophy of science", "Historical sociology of science"],
    ideas: [
      "Under normal conditions the research scientist is not an innovator but a solver of puzzles.",
      "The transfer of allegiance from paradigm to paradigm is a conversion experience that cannot be forced.",
      "Scientists take great pains to defend the assumption that they know what the world is like.",
      "Competition between segments of the scientific community is the only historical process that ever actually results in the rejection of one previously accepted theory.",
      "Truth may not be a goal of scientific inquiry at all."
    ]
  },
  {
    id: 12,
    name: "Willard Van Orman Quine",
    nameZh: "威拉德·蒯因",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/W_V_O_Quine.jpg/800px-W_V_O_Quine.jpg",
    born_date: "1908-06-25",
    death_date: "2000-12-25",
    nationality: "American",
    era: "20th Century Philosophy",
    school: ["Analytic philosophy", "Pragmatism", "Naturalism", "Confirmation holism"],
    ideas: [
      "To be is to be the value of a variable.",
      "Physical objects are epistemologically comparable to the gods of Homer.",
      "Our statements about the external world face the tribunal of sense experience not individually, but only as a corporate body.",
      "Total science is like a field of force whose boundary conditions are experience.",
      "No statement is immune to revision."
    ]
  },
  {
    id: 13,
    name: "Imre Lakatos",
    nameZh: "伊姆雷·拉卡托斯",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Imre_Lakatos.jpg/800px-Imre_Lakatos.jpg",
    born_date: "1922-11-09",
    death_date: "1974-02-02",
    nationality: "Hungarian-British",
    era: "20th Century Philosophy",
    school: ["Philosophy of science", "Sophisticated falsificationism", "Philosophy of mathematics"],
    ideas: [
      "Philosophy of science without history of science is empty; history of science without philosophy of science is blind.",
      "Blind commitment to a theory is not an intellectual virtue: it is an intellectual crime.",
      "All scientific research programmes are characterized by their 'hard core' surrounded by a protective belt.",
      "There are no crucial experiments in science at the moment of their occurrence.",
      "A programme is progressive if its theoretical growth anticipates its empirical growth."
    ]
  },
  {
    id: 14,
    name: "Paul Feyerabend",
    nameZh: "保罗·费耶阿本德",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Paul_Feyerabend.jpg/800px-Paul_Feyerabend.jpg",
    born_date: "1924-01-13",
    death_date: "1994-02-11",
    nationality: "Austrian",
    era: "20th Century Philosophy",
    school: ["Epistemological anarchism", "Philosophy of science"],
    ideas: [
      "The only principle that does not inhibit progress is: anything goes.",
      "Unanimity of opinion may be fitting for a church, for the frightened or greedy victims of some (ancient, or modern) myth; variety of opinion is necessary for objective knowledge.",
      "Science is an essentially anarchic enterprise: theoretical anarchism is more humanitarian and more likely to encourage progress.",
      "Knowledge is not a series of self-consistent theories that converges towards an ideal view.",
      "State and science should be separated."
    ]
  },
  {
    id: 15,
    name: "Rudolf Carnap",
    nameZh: "鲁道夫·卡尔纳普",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rudolf_Carnap.jpg/800px-Rudolf_Carnap.jpg",
    born_date: "1891-05-18",
    death_date: "1970-09-14",
    nationality: "German-American",
    era: "20th Century Philosophy",
    school: ["Logical positivism", "Vienna Circle", "Analytic philosophy"],
    ideas: [
      "The logic of science takes the place of the untestable philosophy.",
      "In logic, there are no morals. Everyone is at liberty to build up his own logic.",
      "A pseudo-proposition is a sequence of words that seems to have a meaning, but in reality has none.",
      "The meaning of a statement lies in the method of its verification.",
      "Science is a unified system of structural descriptions."
    ]
  }
];

// Client API Fetchers (Uses server proxy /api/philosophy to bypass CORS, with fallback)
export async function fetchPhilosophers(): Promise<PhilosophyPhilosopher[]> {
  try {
    const res = await fetch('/api/philosophy/philosophers');
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        return data.results.map((p: any) => attachChineseMetadata(p));
      }
    }
  } catch (e) {
    console.warn('Proxy fetch failed, using fallback dataset', e);
  }
  return FALLBACK_PHILOSOPHERS.map(p => attachChineseMetadata(p));
}

export async function fetchPhilosophyIdeas(search?: string, author?: string, page: number = 1): Promise<{ count: number; results: PhilosophyIdea[] }> {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (author) params.set('author', author);
    params.set('page', String(page));

    const res = await fetch(`/api/philosophy/ideas?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Proxy fetch ideas failed, generating local ideas', e);
  }

  // Fallback filtering from local dataset
  let allIdeas: PhilosophyIdea[] = [];
  let idCounter = 1;
  FALLBACK_PHILOSOPHERS.forEach(p => {
    p.ideas.forEach(q => {
      allIdeas.push({
        id: idCounter++,
        author: p.name,
        quote: q
      });
    });
  });

  if (author) {
    allIdeas = allIdeas.filter(i => i.author.toLowerCase().includes(author.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    allIdeas = allIdeas.filter(i => i.quote.toLowerCase().includes(s) || i.author.toLowerCase().includes(s));
  }

  return {
    count: allIdeas.length,
    results: allIdeas.slice((page - 1) * 15, page * 15)
  };
}

export async function fetchPhilosophySchools(): Promise<PhilosophySchool[]> {
  try {
    const res = await fetch('/api/philosophy/schools');
    if (res.ok) {
      const data = await res.json();
      return data.results || [];
    }
  } catch (e) {
    console.warn('Proxy fetch schools failed');
  }
  return [];
}

export function attachChineseMetadata(p: any): PhilosophyPhilosopher {
  const meta = PHILOSOPHER_ACADEMIC_META[p.name];
  return {
    ...p,
    nameZh: meta?.nameZh || p.name,
    coreThesis: meta?.coreThesis || `倡导${p.school?.join('、')}，关注本体论与人类理性界限。`,
    recommendedSlideIndex: meta?.targetSlideIndex || 55,
    recommendedSlideTitle: meta?.targetSlideTitle || '现象学与认识论代码映射'
  };
}

// Convert a Philosopher and ideas into a fully indexed RAG DocumentChunk and register it
export function importPhilosopherToRAG(philosopher: PhilosophyPhilosopher): DocumentChunk {
  const meta = PHILOSOPHER_ACADEMIC_META[philosopher.name] || {
    nameZh: philosopher.nameZh || philosopher.name,
    eraZh: philosopher.era,
    paradigm: '一般认识论',
    coreThesis: philosopher.coreThesis || '',
    targetSlideIndex: 55,
    targetSlideTitle: '现象学与认识论代码映射',
    keywords: philosopher.school || []
  };

  const docId = `doc-api-${philosopher.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const ideasListText = philosopher.ideas.map((q, idx) => `  [命题 ${idx + 1}] "${q}"`).join('\n');

  const chunkText = `【${meta.nameZh}（${philosopher.name}）哲学原典命题切片集】
时代与流派：${philosopher.era} · ${philosopher.nationality} · ${philosopher.school.join(' / ')}
【核心本体论命题】：${meta.coreThesis}
【入库权威哲学命题（Philosophy API Quotes）】：
${ideasListText}
【认识论与现代代码映射】：该思想家的本体论命题直接映射至研讨会课件 P.${meta.targetSlideIndex}《${meta.targetSlideTitle}》，为可计算认识论与形式化状态机提供形而上学奠基。`;

  const newDoc: DocumentChunk = {
    id: docId,
    source_title: `${meta.nameZh}（${philosopher.name}）：经典哲学原典与命题汇编`,
    chunk_text: chunkText,
    embedding: [],
    metadata: {
      page: `PhilosophyAPI/id-${philosopher.id}`,
      section: `Philosophy API 核心命题集（${philosopher.era}）`,
      year: parseInt(philosopher.death_date?.slice(0, 4) || '1900', 10),
      authors: `${philosopher.name} (${meta.nameZh})`,
      keywords: [
        meta.nameZh,
        philosopher.name,
        ...philosopher.school,
        ...(meta.keywords || []),
        'Philosophy API'
      ],
      domain: meta.paradigm
    }
  };

  // Register in runtime knowledge base
  registerDynamicDocument(newDoc);

  // Register in slide thesis registry
  registerThesisMetadata(docId, {
    sourceTitle: newDoc.source_title,
    authors: newDoc.metadata.authors || philosopher.name,
    year: newDoc.metadata.year || 1900,
    sectionOrPage: newDoc.metadata.section || 'Philosophy API',
    targetSlideIndex: meta.targetSlideIndex,
    targetSlideTitle: meta.targetSlideTitle,
    keywords: newDoc.metadata.keywords || [],
    ontologicalParadigm: meta.paradigm as any,
    coreThesis: meta.coreThesis,
    epistemicMappingToSlide: `对应 Slide P.${meta.targetSlideIndex}《${meta.targetSlideTitle}》`
  });

  return newDoc;
}
