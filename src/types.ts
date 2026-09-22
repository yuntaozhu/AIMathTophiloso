export type AgentRole = 'user' | 'agenda_guardian' | 'deep_epistemic' | 'sandbox_compiler';

export interface SlideItem {
  index: number;
  sectionNumber?: number;
  sectionTitle?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  formula?: string;
  quote?: {
    text: string;
    author: string;
  };
  details?: string;
  codeSnippet?: string;
  notes?: string;
  keywords?: string[];
}

export interface Citation {
  sourceTitle: string;
  chunkId: string;
  pageOrSection: string;
  quoteText: string;
  similarity?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: AgentRole;
  content: string;
  timestamp: string;
  slideIndex: number;
  highlightedText?: string;
  isBarrage?: boolean;
  citations?: Citation[];
  sandboxCode?: string;
  simulationConfig?: SimulationConfig;
  antiDriftAlert?: {
    isDrifting: boolean;
    reason: string;
    guidingQuestion: string;
  };
}

export interface SimulationConfig {
  title: string;
  description: string;
  agentCount: number;
  ticks: number;
  parameters: Record<string, number | boolean | string>;
  code: string;
}

export interface SlideEpistemicInsight {
  summary: string;
  mathematicalMapping: string;
  ontologyCode: string;
  computableQuestion: string;
  paradigmTag: string;
}

export interface KaibanWorkflowStep {
  step: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
  timestamp: string;
}

export interface KaibanWorkflowResult {
  slideIndex: number;
  slideTitle: string;
  sectionTitle?: string;
  paradigm: string;
  formalAnalysis: string;
  crossDomainMapping: string;
  ontologyCode: string;
  bdiSimulationSuggestion?: string;
  verificationVerdict: string;
  workflowSteps: KaibanWorkflowStep[];
}

export interface DocumentChunk {
  id: string;
  source_title: string;
  chunk_text: string;
  embedding: number[];
  metadata: {
    page?: number | string;
    section?: string;
    year?: number;
    authors?: string;
    keywords?: string[];
    domain?: string;
    category?: string;
  };
}

export interface SeminarLog {
  id: string;
  slide_index: number;
  user_query: string;
  ai_response: string;
  agent_role: AgentRole;
  timestamp: string;
  highlighted_text?: string;
}

export interface PresenterSyncState {
  currentSlide: number;
  presenterName: string;
  laserPointer?: { x: number; y: number } | null;
  activeHighlight?: string | null;
  lastUpdated: number;
}

export interface PresenterStudyNote {
  slideIndex: number;
  coreThesis: string;
  epistemicBackground: string;
  pedagogicalKeypoints: string[];
  crossDomainAnalogy: string;
  falsificationOrTrap: string;
  blackboardPrompt: string;
}

export interface ChineseTranslationVariant {
  translator: string;
  editionOrPublisher: string;
  translatedText: string;
  divergenceNotes?: string;
}

export interface PhilologicalCollation {
  id: string;
  sourceDocId?: string;
  author: string;
  workOriginalTitle: string;
  workChineseTitle: string;
  originalLanguage: string;
  standardCitation: string;
  originalPassage: string;
  originalPassageNormalized?: string;
  englishTranslation?: string;
  chineseTranslations: ChineseTranslationVariant[];
  keyTermsEtymology: {
    term: string;
    originalLanguage: string;
    morphology: string;
    conceptualGenealogy: string;
  }[];
  translationDebate: {
    coreControversy: string;
    representativeDebates: string;
    epistemicImpact: string;
  };
  socraticQuestions: string[];
}

