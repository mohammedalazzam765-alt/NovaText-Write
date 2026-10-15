import { TextStats } from '../types';

/**
 * Count syllables in an English word
 */
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;

  // Remove trailing silent 'e', 'es', 'ed'
  const cleaned = w.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function computeTextStats(text: string): TextStats {
  const clean = text.trim();
  if (!clean) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      fleschScore: 100,
      readabilityGrade: 'Easy',
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const wordsList = clean.split(/\s+/).filter(Boolean);
  const words = wordsList.length;

  const sentenceMatches = clean.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  const sentences = Math.max(1, sentenceMatches ? sentenceMatches.length : 1);

  const paragraphsList = text.split(/\n+/).filter((p) => p.trim().length > 0);
  const paragraphs = Math.max(1, paragraphsList.length);

  // Reading time (average 225 words/min)
  const readingTimeMinutes = Math.max(0.1, Number((words / 225).toFixed(1)));
  // Speaking time (average 130 words/min)
  const speakingTimeMinutes = Math.max(0.1, Number((words / 130).toFixed(1)));

  // Syllables count for Flesch Reading Ease
  let totalSyllables = 0;
  for (const w of wordsList) {
    totalSyllables += countSyllables(w);
  }

  // Flesch Reading Ease formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const wordsPerSentence = words / sentences;
  const syllablesPerWord = totalSyllables / Math.max(1, words);
  let flesch = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  flesch = Math.min(100, Math.max(0, Math.round(flesch)));

  let readabilityGrade = 'Very Easy (5th Grade)';
  if (flesch >= 90) readabilityGrade = 'Very Easy (5th Grade)';
  else if (flesch >= 80) readabilityGrade = 'Easy (6th Grade)';
  else if (flesch >= 70) readabilityGrade = 'Fairly Easy (7th Grade)';
  else if (flesch >= 60) readabilityGrade = 'Standard (8th–9th Grade)';
  else if (flesch >= 50) readabilityGrade = 'Fairly Difficult (High School)';
  else if (flesch >= 30) readabilityGrade = 'Difficult (College)';
  else readabilityGrade = 'Very Difficult (Graduate Level)';

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    fleschScore: flesch,
    readabilityGrade,
  };
}

export function detectTone(text: string): { primary: string; secondary: string; confidence: number } {
  const lower = text.toLowerCase();
  let professionalScore = 0;
  let confidentScore = 0;
  let casualScore = 0;
  let analyticalScore = 0;

  if (/\b(furthermore|moreover|consequently|regarding|facilitate|utilize|favorable)\b/.test(lower)) professionalScore += 3;
  if (/\b(certainly|definitely|proven|undoubtedly|clear|demonstrates|vital|essential)\b/.test(lower)) confidentScore += 3;
  if (/\b(hey|awesome|cool|stuff|pretty|yeah|kinda|gonna|wanna|super)\b/.test(lower)) casualScore += 3;
  if (/\b(data|analysis|hypothesis|percentage|evidence|findings|metric|methodology)\b/.test(lower)) analyticalScore += 3;

  const scores = [
    { name: 'Professional', val: professionalScore },
    { name: 'Confident', val: confidentScore },
    { name: 'Casual', val: casualScore },
    { name: 'Analytical', val: analyticalScore },
  ].sort((a, b) => b.val - a.val);

  return {
    primary: scores[0].val > 0 ? scores[0].name : 'Neutral & Balanced',
    secondary: scores[1].val > 0 ? scores[1].name : 'Clear Prose',
    confidence: Math.min(95, 70 + (scores[0].val * 5)),
  };
}
