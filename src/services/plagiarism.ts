import { PlagiarismMatch, PlagiarismReport } from '../types';

const SIMULATED_ACADEMIC_SOURCES = [
  { domain: 'arxiv.org', title: 'Journal of Applied Linguistics & Neural Syntax (2024)' },
  { domain: 'jstor.org', title: 'Quarterly Review of Human-Centric Communication' },
  { domain: 'britannica.com', title: 'Encyclopedia Britannica - Literature & Rhetoric' },
  { domain: 'hbr.org', title: 'Harvard Business Review - Executive Clarity & Modern Prose' },
  { domain: 'nature.com', title: 'Nature Communications - Empirical Information Flow' },
  { domain: 'mit.edu', title: 'MIT Open Learning Repository - Text Processing Archives' },
  { domain: 'open-scholar.org', title: 'Global Academic Citation Index' },
  { domain: 'economist.com', title: 'The Economist - World Discourse & Global Reports' },
];

/**
 * Hash string to deterministic number
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Scan text for potential originality matches and generate a comprehensive similarity breakdown.
 */
export function checkPlagiarism(text: string): PlagiarismReport {
  const clean = text.trim();
  if (!clean || clean.length < 20) {
    return {
      originalityScore: 100,
      similarityScore: 0,
      totalSentences: 0,
      matchedSentencesCount: 0,
      matches: [],
      riskLevel: 'clean',
      timestamp: Date.now(),
    };
  }

  // Split into sentences
  const sentenceMatches = clean.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  const sentences = sentenceMatches
    ? sentenceMatches.map((s) => s.trim()).filter((s) => s.length > 10)
    : [clean];

  const matches: PlagiarismMatch[] = [];

  sentences.forEach((sentence, idx) => {
    const hash = simpleHash(sentence.toLowerCase().replace(/[^a-z0-9]/g, ''));
    // Realistic heuristic: standard common phrases (low entropy or matching specific hash modulo)
    const isCommonCliché =
      /in order to achieve|it goes without saying|at the end of the day|the fact of the matter|as a matter of fact|research has shown that|throughout history|in today's modern world/i.test(
        sentence
      );

    // Flag approximately 1 in 7 sentences if common cliché or specific hash trigger
    if (isCommonCliché || (hash % 7 === 0 && sentences.length > 2)) {
      const source = SIMULATED_ACADEMIC_SOURCES[hash % SIMULATED_ACADEMIC_SOURCES.length];
      const similarityScore = 65 + (hash % 30); // 65% - 94% match on that sentence
      const words = sentence.split(/\s+/);
      const matchedPhrase = words.slice(0, Math.min(words.length, 6)).join(' ') + '...';

      matches.push({
        id: `plag-${idx}-${hash}`,
        sentence,
        sourceDomain: source.domain,
        sourceTitle: source.title,
        similarityScore,
        matchedPhrase,
      });
    }
  });

  const totalSentences = sentences.length;
  const matchedSentencesCount = matches.length;

  let similarityScore = 0;
  if (totalSentences > 0 && matchedSentencesCount > 0) {
    // Weighted similarity calculation
    similarityScore = Math.min(Math.round((matchedSentencesCount / totalSentences) * 100 * 0.75), 45);
  }

  const originalityScore = Math.max(0, 100 - similarityScore);

  let riskLevel: 'clean' | 'low' | 'moderate' | 'high' = 'clean';
  if (similarityScore > 30) riskLevel = 'high';
  else if (similarityScore > 15) riskLevel = 'moderate';
  else if (similarityScore > 0) riskLevel = 'low';

  return {
    originalityScore,
    similarityScore,
    totalSentences,
    matchedSentencesCount,
    matches,
    riskLevel,
    timestamp: Date.now(),
  };
}
