import { SummaryResult } from '../types';

/**
 * Text Summarizer Engine
 * Uses frequency-weighted extractive sentence ranking and salient conceptual extraction.
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself'
]);

export function summarizeText(
  text: string,
  mode: 'paragraph' | 'bullets' | 'key_takeaways' = 'paragraph',
  lengthRatio: 'short' | 'medium' | 'detailed' = 'medium'
): SummaryResult {
  const clean = text.trim();
  if (!clean) {
    return {
      paragraph: '',
      bulletPoints: [],
      keyTakeaways: [],
      originalWords: 0,
      summaryWords: 0,
      reductionPercentage: 0,
      keywords: [],
    };
  }

  const rawWords = clean.split(/\s+/).filter(Boolean);
  const originalWords = rawWords.length;

  // Split into sentences
  const sentenceMatches = clean.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  const sentences = sentenceMatches
    ? sentenceMatches.map((s) => s.trim()).filter((s) => s.length > 5)
    : [clean];

  if (sentences.length <= 2) {
    return {
      paragraph: clean,
      bulletPoints: sentences,
      keyTakeaways: sentences,
      originalWords,
      summaryWords: originalWords,
      reductionPercentage: 0,
      keywords: extractKeywords(clean),
    };
  }

  // 1. Calculate word frequencies (excluding stop words)
  const wordFreq: Record<string, number> = {};
  for (const word of rawWords) {
    const w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  }

  // Find max frequency for normalization
  const maxFreq = Math.max(...Object.values(wordFreq), 1);
  for (const k in wordFreq) {
    wordFreq[k] = wordFreq[k] / maxFreq;
  }

  // 2. Score sentences based on word salience + position weight
  interface ScoredSentence {
    text: string;
    score: number;
    originalIndex: number;
  }

  const scored: ScoredSentence[] = sentences.map((sent, idx) => {
    const words = sent.split(/\s+/).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
    let score = 0;
    for (const w of words) {
      if (wordFreq[w]) {
        score += wordFreq[w];
      }
    }
    // Normalize by length so super long sentences don't unfairly dominate
    const len = Math.max(words.length, 1);
    score = score / Math.sqrt(len);

    // Boost intro sentence and concluding sentence (journalistic inverted pyramid)
    if (idx === 0) score *= 1.35;
    if (idx === sentences.length - 1) score *= 1.15;

    return { text: sent, score, originalIndex: idx };
  });

  // 3. Determine number of sentences to retain
  let targetCount = 3;
  if (lengthRatio === 'short') {
    targetCount = Math.max(1, Math.ceil(sentences.length * 0.25));
  } else if (lengthRatio === 'medium') {
    targetCount = Math.max(2, Math.ceil(sentences.length * 0.45));
  } else {
    // detailed
    targetCount = Math.max(3, Math.ceil(sentences.length * 0.65));
  }

  // Pick top sentences by score, then sort them back into original document order
  const topSentences = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, targetCount)
    .sort((a, b) => a.originalIndex - b.originalIndex);

  const selectedTexts = topSentences.map((s) => s.text);
  const paragraph = selectedTexts.join(' ');
  const summaryWords = paragraph.split(/\s+/).filter(Boolean).length;
  const reductionPercentage = Math.max(0, Math.round(((originalWords - summaryWords) / originalWords) * 100));

  // Generate bullet points with high-intent lead-ins
  const bulletPoints = selectedTexts.map((s) => {
    // Trim leading transitional words
    const trimmed = s.replace(/^(however|therefore|moreover|furthermore|in addition),?\s*/i, '');
    return trimmed;
  });

  // Extract top keywords
  const keywords = extractKeywords(clean);

  // Generate key takeaways
  const keyTakeaways = selectedTexts.slice(0, 3).map((st, i) => {
    const firstFew = st.split(' ').slice(0, 3).join(' ');
    return `Core insight #${i + 1}: Focus on ${firstFew.toLowerCase()}...`;
  });

  return {
    paragraph,
    bulletPoints,
    keyTakeaways,
    originalWords,
    summaryWords,
    reductionPercentage,
    keywords,
  };
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freq: Record<string, number> = {};

  for (const w of words) {
    if (!STOP_WORDS.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}
