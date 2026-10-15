export type AppMode = 'paraphrase' | 'grammar' | 'summarize' | 'plagiarism';

export type ParaphraseTone =
  | 'standard'
  | 'fluency'
  | 'formal'
  | 'academic'
  | 'creative'
  | 'casual'
  | 'shorten'
  | 'expand';

export type SynonymLevel = 'few' | 'balanced' | 'more';

export type IssueCategory = 'all' | 'spelling' | 'grammar' | 'punctuation' | 'style';

export interface GrammarIssue {
  id: string;
  category: 'spelling' | 'grammar' | 'punctuation' | 'style';
  start: number;
  end: number;
  matchedText: string;
  replacement: string;
  alternatives?: string[];
  message: string;
  explanation: string;
  ruleId: string;
}

export interface DiffToken {
  id: string;
  text: string;
  type: 'unchanged' | 'replaced' | 'added' | 'removed';
  originalText?: string;
  synonyms?: string[];
}

export interface ParaphraseResult {
  text: string;
  tokens: DiffToken[];
  tone: ParaphraseTone;
  changesCount: number;
  timestamp: number;
}

export interface SummaryResult {
  paragraph: string;
  bulletPoints: string[];
  keyTakeaways: string[];
  originalWords: number;
  summaryWords: number;
  reductionPercentage: number;
  keywords: string[];
}

export interface PlagiarismMatch {
  id: string;
  sentence: string;
  sourceDomain: string;
  sourceTitle: string;
  similarityScore: number;
  matchedPhrase: string;
}

export interface PlagiarismReport {
  originalityScore: number; // e.g. 94 (means 94% original)
  similarityScore: number;  // e.g. 6 (means 6% similar)
  totalSentences: number;
  matchedSentencesCount: number;
  matches: PlagiarismMatch[];
  riskLevel: 'clean' | 'low' | 'moderate' | 'high';
  timestamp: number;
}

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  fleschScore: number;
  readabilityGrade: string;
}

export interface HistoryItem {
  id: string;
  mode: AppMode;
  inputText: string;
  outputText: string;
  tone?: ParaphraseTone;
  timestamp: number;
}

export interface AiInferenceConfig {
  useExternalHuggingFace: boolean;
  hfModel: string;
  hfApiKey: string;
}
