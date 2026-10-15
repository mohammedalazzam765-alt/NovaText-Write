import { GrammarIssue } from '../types';
import { getTypoCorrection } from './dictionary';

interface RulePattern {
  id: string;
  category: 'grammar' | 'punctuation' | 'style';
  regex: RegExp;
  replacement: string | ((match: string, ...args: string[]) => string);
  message: string;
  explanation: string;
}

const GRAMMAR_AND_STYLE_RULES: RulePattern[] = [
  // Subject-Verb Agreement
  {
    id: 'sva-they-is',
    category: 'grammar',
    regex: /\b(they|we|you)\s+is\b/gi,
    replacement: '$1 are',
    message: 'Subject-verb agreement error',
    explanation: 'Plural pronouns ("they", "we", "you") require the plural verb "are" instead of "is".',
  },
  {
    id: 'sva-he-are',
    category: 'grammar',
    regex: /\b(he|she|it)\s+are\b/gi,
    replacement: '$1 is',
    message: 'Subject-verb agreement error',
    explanation: 'Singular third-person pronouns ("he", "she", "it") require "is" instead of "are".',
  },
  {
    id: 'sva-he-have',
    category: 'grammar',
    regex: /\b(he|she|it)\s+have\b/gi,
    replacement: '$1 has',
    message: 'Subject-verb agreement error',
    explanation: 'Singular third-person subjects take "has" rather than "have".',
  },
  {
    id: 'sva-they-has',
    category: 'grammar',
    regex: /\b(they|we|you|I)\s+has\b/gi,
    replacement: '$1 have',
    message: 'Subject-verb agreement error',
    explanation: '"They", "we", "you", and "I" take the plural/base form "have".',
  },
  {
    id: 'sva-we-was',
    category: 'grammar',
    regex: /\b(we|they|you)\s+was\b/gi,
    replacement: '$1 were',
    message: 'Subject-verb agreement error',
    explanation: 'Plural subjects require "were" in the past tense.',
  },
  {
    id: 'sva-he-were',
    category: 'grammar',
    regex: /\b(he|she|it)\s+were\b/gi,
    replacement: '$1 was',
    message: 'Subject-verb agreement error',
    explanation: 'Singular subjects require "was" in the past indicative mood.',
  },

  // Commonly Confused Words
  {
    id: 'confused-your-youre',
    category: 'grammar',
    regex: /\byour\s+(going|doing|welcome|invited|right|wrong|sure|crazy|ready|finished)\b/gi,
    replacement: "you're $1",
    message: 'Confused word: "your" vs "you\'re"',
    explanation: '"Your" shows possession. Use "you\'re" (short for "you are") before an adjective or participle.',
  },
  {
    id: 'confused-their-there',
    category: 'grammar',
    regex: /\b(is|are|was|were)\s+their\b/gi,
    replacement: '$1 there',
    message: 'Confused word: "their" vs "there"',
    explanation: '"Their" indicates possession. Use "there" to indicate existence or location.',
  },
  {
    id: 'confused-its-it-is',
    category: 'grammar',
    regex: /\bit's\s+(own|color|name|purpose|tail|size|price|value)\b/gi,
    replacement: 'its $1',
    message: 'Confused word: "it\'s" vs "its"',
    explanation: '"Its" is the possessive form. "It\'s" is the contraction for "it is" or "it has".',
  },
  {
    id: 'confused-then-than',
    category: 'grammar',
    regex: /\b(better|worse|more|less|greater|smaller|faster|slower|higher|lower|older|younger)\s+then\b/gi,
    replacement: '$1 than',
    message: 'Comparison word: "then" vs "than"',
    explanation: 'Use "than" for comparisons. Use "then" to refer to time or sequences.',
  },
  {
    id: 'confused-affect-effect',
    category: 'grammar',
    regex: /\b(the|an|positive|negative|direct|lasting)\s+affect\b/gi,
    replacement: '$1 effect',
    message: 'Noun vs verb: "affect" vs "effect"',
    explanation: '"Effect" is usually a noun meaning a result. "Affect" is typically a verb meaning to influence.',
  },
  {
    id: 'confused-loose-lose',
    category: 'grammar',
    regex: /\b(don't|cannot|will|might|could)\s+loose\b/gi,
    replacement: '$1 lose',
    message: 'Confused word: "loose" vs "lose"',
    explanation: '"Loose" means not tight. "Lose" is a verb meaning to misplace or suffer defeat.',
  },
  {
    id: 'confused-could-of',
    category: 'grammar',
    regex: /\b(could|would|should|might|must)\s+of\b/gi,
    replacement: '$1 have',
    message: 'Incorrect idiom: "could of"',
    explanation: 'The spoken phrase sounds like "of", but the correct grammatical phrasing is "could have" or "could\'ve".',
  },

  // Repeated words
  {
    id: 'repeated-words',
    category: 'grammar',
    regex: /\b(the|is|in|that|and|to|for|of|with|a|an)\s+\1\b/gi,
    replacement: '$1',
    message: 'Repeated word',
    explanation: 'The word is repeated twice in succession.',
  },

  // Capitalization & Lowercase "i"
  {
    id: 'lowercase-i',
    category: 'grammar',
    regex: /(\s|^)i(\s|[.,!?;])/g,
    replacement: '$1I$2',
    message: 'Capitalization of pronoun "I"',
    explanation: 'The personal pronoun "I" should always be capitalized in English.',
  },

  // Redundancy & Wordiness (Style)
  {
    id: 'wordy-in-order-to',
    category: 'style',
    regex: /\bin order to\b/gi,
    replacement: 'to',
    message: 'Wordy phrase',
    explanation: '"In order to" can be simplified to "to" for clearer and more concise writing.',
  },
  {
    id: 'wordy-due-to-the-fact',
    category: 'style',
    regex: /\bdue to the fact that\b/gi,
    replacement: 'because',
    message: 'Wordy phrasing',
    explanation: '"Due to the fact that" can be replaced by "because" to enhance readability.',
  },
  {
    id: 'wordy-at-this-point-in-time',
    category: 'style',
    regex: /\bat this point in time\b/gi,
    replacement: 'currently',
    message: 'Cluttered phrasing',
    explanation: '"At this point in time" is verbose. Use "now" or "currently".',
  },
  {
    id: 'wordy-first-and-foremost',
    category: 'style',
    regex: /\bfirst and foremost\b/gi,
    replacement: 'first',
    message: 'Redundant idiom',
    explanation: '"First and foremost" is a clichéd redundancy. "First" conveys the full meaning.',
  },
  {
    id: 'wordy-for-the-purpose-of',
    category: 'style',
    regex: /\bfor the purpose of\b/gi,
    replacement: 'for',
    message: 'Wordy phrase',
    explanation: 'Simplify "for the purpose of" to "for" or "to".',
  },
  {
    id: 'wordy-each-and-every',
    category: 'style',
    regex: /\beach and every\b/gi,
    replacement: 'each',
    message: 'Redundant pair',
    explanation: '"Each and every" repeats the same concept. Choose "each" or "every".',
  },
  {
    id: 'wordy-end-result',
    category: 'style',
    regex: /\bend result\b/gi,
    replacement: 'result',
    message: 'Redundant modifier',
    explanation: 'A result is already at the end. Use "result".',
  },
  {
    id: 'wordy-future-plans',
    category: 'style',
    regex: /\bfuture plans\b/gi,
    replacement: 'plans',
    message: 'Redundant modifier',
    explanation: 'Plans by definition refer to the future. Use "plans".',
  },
  {
    id: 'wordy-close-proximity',
    category: 'style',
    regex: /\bclose proximity\b/gi,
    replacement: 'proximity',
    message: 'Redundancy',
    explanation: 'Proximity already means closeness. Use "proximity" or "near".',
  },
  {
    id: 'wordy-completely-eliminate',
    category: 'style',
    regex: /\bcompletely eliminate\b/gi,
    replacement: 'eliminate',
    message: 'Unnecessary adverb',
    explanation: 'To eliminate is absolute. "Completely" is redundant.',
  },

  // Punctuation Mechanics
  {
    id: 'punct-spaced-comma',
    category: 'punctuation',
    regex: /\s+([,.:;?!])/g,
    replacement: '$1',
    message: 'Unnecessary space before punctuation',
    explanation: 'Punctuation marks should attach directly to the preceding word without leading space.',
  },
  {
    id: 'punct-missing-space-after',
    category: 'punctuation',
    regex: /([,;:])([A-Za-z0-9])/g,
    replacement: '$1 $2',
    message: 'Missing space after punctuation',
    explanation: 'Add a space after punctuation marks to ensure proper word separation.',
  },
];

/**
 * Scan text and return list of actionable grammar, spelling, punctuation, and style issues.
 */
export function analyzeGrammar(text: string): GrammarIssue[] {
  if (!text || text.trim().length === 0) return [];

  const issues: GrammarIssue[] = [];
  let issueCounter = 0;

  // 1. Check Grammar, Style, Punctuation Rules
  for (const rule of GRAMMAR_AND_STYLE_RULES) {
    const regex = new RegExp(rule.regex.source, rule.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchedText = match[0];
      const start = match.index;
      const end = start + matchedText.length;

      let replacement = '';
      if (typeof rule.replacement === 'function') {
        replacement = rule.replacement(matchedText, ...match.slice(1));
      } else {
        // String replacement with backreferences
        replacement = matchedText.replace(rule.regex, rule.replacement);
      }

      // Avoid self-replacement
      if (replacement.trim() !== matchedText.trim()) {
        issueCounter++;
        issues.push({
          id: `rule-${rule.id}-${issueCounter}`,
          category: rule.category,
          start,
          end,
          matchedText,
          replacement,
          message: rule.message,
          explanation: rule.explanation,
          ruleId: rule.id,
        });
      }
    }
  }

  // 2. Check Spelling / Common Typos Word by Word
  const wordRegex = /\b[A-Za-z']+\b/g;
  let wordMatch: RegExpExecArray | null;

  while ((wordMatch = wordRegex.exec(text)) !== null) {
    const rawWord = wordMatch[0];
    const start = wordMatch.index;
    const end = start + rawWord.length;

    // Skip if this span already overlaps with an existing rule issue
    const alreadyFlagged = issues.some(
      (iss) => (start >= iss.start && start < iss.end) || (end > iss.start && end <= iss.end)
    );
    if (alreadyFlagged) continue;

    const typoCheck = getTypoCorrection(rawWord);
    if (typoCheck.isTypo) {
      issueCounter++;
      issues.push({
        id: `spelling-${issueCounter}`,
        category: 'spelling',
        start,
        end,
        matchedText: rawWord,
        replacement: typoCheck.corrected,
        message: `Spelling error: "${rawWord}"`,
        explanation: `Did you mean "${typoCheck.corrected}"?`,
        ruleId: 'common-typo',
      });
    }
  }

  // Sort by starting position
  issues.sort((a, b) => a.start - b.start);

  return issues;
}

/**
 * Apply all suggestions or a single suggestion to text.
 */
export function applySuggestion(text: string, issue: GrammarIssue): string {
  return text.slice(0, issue.start) + issue.replacement + text.slice(issue.end);
}

export function applyAllSuggestions(text: string, issues: GrammarIssue[]): string {
  // Sort descending by index so replacing doesn't shift earlier offsets
  const sorted = [...issues].sort((a, b) => b.start - a.start);
  let updated = text;
  for (const issue of sorted) {
    updated = updated.slice(0, issue.start) + issue.replacement + updated.slice(issue.end);
  }
  return updated;
}
