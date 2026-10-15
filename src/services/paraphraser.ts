import { DiffToken, ParaphraseResult, ParaphraseTone, SynonymLevel } from '../types';

// Rich contextual synonym and substitution map
export const SYNONYM_MAP: Record<string, string[]> = {
  important: ['crucial', 'vital', 'essential', 'pivotal', 'significant', 'key'],
  help: ['assist', 'facilitate', 'aid', 'support', 'enable', 'empower'],
  make: ['create', 'produce', 'generate', 'craft', 'develop', 'establish'],
  show: ['demonstrate', 'illustrate', 'reveal', 'exhibit', 'display', 'indicate'],
  use: ['utilize', 'employ', 'leverage', 'apply', 'harness', 'adopt'],
  good: ['favorable', 'exceptional', 'beneficial', 'advantageous', 'positive', 'stellar'],
  bad: ['adverse', 'detrimental', 'unfavorable', 'suboptimal', 'problematic', 'damaging'],
  big: ['substantial', 'considerable', 'immense', 'massive', 'extensive', 'profound'],
  small: ['modest', 'minimal', 'compact', 'marginal', 'subtle', 'diminutive'],
  fast: ['rapid', 'swift', 'expeditious', 'accelerated', 'prompt', 'instant'],
  slow: ['gradual', 'deliberate', 'unhurried', 'measured', 'prolonged', 'leisurely'],
  think: ['believe', 'hypothesize', 'contemplate', 'posit', 'consider', 'reckon'],
  find: ['discover', 'uncover', 'identify', 'ascertain', 'detect', 'locate'],
  change: ['transform', 'modify', 'alter', 'adapt', 'evolve', 'shift'],
  start: ['initiate', 'commence', 'embark on', 'launch', 'inaugurate', 'trigger'],
  stop: ['halt', 'discontinue', 'cease', 'terminate', 'suspend', 'conclude'],
  problem: ['challenge', 'obstacle', 'impediment', 'dilemma', 'complication', 'issue'],
  idea: ['concept', 'notion', 'hypothesis', 'perspective', 'framework', 'conception'],
  say: ['articulate', 'state', 'convey', 'express', 'remark', 'declare'],
  need: ['require', 'necessitate', 'demand', 'call for', 'mandate', 'warrant'],
  great: ['remarkable', 'outstanding', 'phenomenal', 'notable', 'prominent', 'superb'],
  improve: ['enhance', 'elevate', 'refine', 'optimize', 'boost', 'upgrade'],
  easy: ['straightforward', 'effortless', 'seamless', 'accessible', 'simple', 'uncomplicated'],
  hard: ['demanding', 'rigorous', 'laborious', 'formidable', 'arduous', 'strenuous'],
  look: ['examine', 'inspect', 'survey', 'observe', 'scrutinize', 'peer'],
  work: ['function', 'operate', 'labor', 'collaborate', 'perform', 'strive'],
  give: ['provide', 'grant', 'furnish', 'deliver', 'supply', 'allocate'],
  get: ['obtain', 'acquire', 'attain', 'procure', 'derive', 'secure'],
  write: ['compose', 'draft', 'author', 'pen', 'formulate', 'articulate'],
  explain: ['elucidate', 'clarify', 'delineate', 'explicate', 'detail', 'unpack'],
  clear: ['lucid', 'evident', 'transparent', 'unambiguous', 'apparent', 'distinct'],
  often: ['frequently', 'repeatedly', 'consistently', 'regularly', 'habitually'],
  many: ['numerous', 'copious', 'manifold', 'multitudinous', 'myriad', 'extensive'],
  different: ['distinct', 'divergent', 'varied', 'disparate', 'alternative', 'diverse'],
};

// Tone-specific vocabulary preferences
const FORMAL_TRANSFORMS: [RegExp, string][] = [
  [/\bget\b/gi, 'obtain'],
  [/\bgot\b/gi, 'obtained'],
  [/\ba lot of\b/gi, 'a substantial amount of'],
  [/\blots of\b/gi, 'numerous'],
  [/\bhelp\b/gi, 'facilitate'],
  [/\bmake sure\b/gi, 'ensure'],
  [/\blook at\b/gi, 'examine'],
  [/\bcome up with\b/gi, 'devise'],
  [/\bfind out\b/gi, 'ascertain'],
  [/\bshow\b/gi, 'demonstrate'],
  [/\buse\b/gi, 'utilize'],
  [/\babout\b(?=\s+\d+)/gi, 'approximately'],
  [/\bdeal with\b/gi, 'address'],
  [/\bgive\b/gi, 'provide'],
  [/\bstart\b/gi, 'commence'],
  [/\bend\b/gi, 'conclude'],
  [/\bask for\b/gi, 'request'],
  [/\bbad\b/gi, 'adverse'],
  [/\bgood\b/gi, 'favorable'],
];

const ACADEMIC_TRANSFORMS: [RegExp, string][] = [
  [/\bI think\b/gi, 'Evidence suggests'],
  [/\bwe believe\b/gi, 'The data indicates'],
  [/\bproves that\b/gi, 'strongly supports the hypothesis that'],
  [/\ba big part of\b/gi, 'a significant constituent of'],
  [/\bimportant\b/gi, 'paramount'],
  [/\bshows that\b/gi, 'corroborates that'],
  [/\blook into\b/gi, 'investigate'],
  [/\bfind out\b/gi, 'ascertain'],
  [/\breally\b/gi, 'notably'],
  [/\bvery\b/gi, 'substantially'],
  [/\bthing\b/gi, 'phenomenon'],
  [/\bthings\b/gi, 'variables'],
  [/\bbecause\b/gi, 'owing to the fact that'],
  [/\bclear\b/gi, 'empirically evident'],
];

const CASUAL_TRANSFORMS: [RegExp, string][] = [
  [/\butilize\b/gi, 'use'],
  [/\bfacilitate\b/gi, 'help'],
  [/\bcommence\b/gi, 'kick off'],
  [/\bterminate\b/gi, 'wrap up'],
  [/\bfurthermore\b/gi, 'also'],
  [/\bconsequently\b/gi, 'so'],
  [/\bnevertheless\b/gi, 'still'],
  [/\bprior to\b/gi, 'before'],
  [/\bsubsequent to\b/gi, 'after'],
  [/\binquire\b/gi, 'ask'],
  [/\bdemonstrate\b/gi, 'show'],
  [/\boptimum\b/gi, 'best'],
];

const CREATIVE_TRANSFORMS: [RegExp, string][] = [
  [/\bimportant\b/gi, 'soul-stirring'],
  [/\bbright\b/gi, 'radiant'],
  [/\bdark\b/gi, 'shadow-draped'],
  [/\bquiet\b/gi, 'whisper-soft'],
  [/\bwalk\b/gi, 'drift'],
  [/\blook\b/gi, 'gaze upon'],
  [/\bchange\b/gi, 'kaleidoscopic shift'],
  [/\bbig\b/gi, 'towering'],
  [/\bslow\b/gi, 'languid'],
  [/\bfast\b/gi, 'mercurial'],
  [/\bsay\b/gi, 'whisper'],
];

/**
 * Split sentence while preserving punctuation marks.
 */
function splitIntoSentences(text: string): string[] {
  const matched = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  return matched ? matched.filter((s) => s.trim().length > 0) : [text];
}

/**
 * Sentence structure rearrangement heuristics for natural variation.
 */
function restructureSentence(sentence: string, tone: ParaphraseTone): string {
  let s = sentence.trim();
  if (s.length === 0) return s;

  // Clause flipping for compound sentences with "because", "although", "while"
  if (tone === 'fluency' || tone === 'creative') {
    const becauseMatch = s.match(/^(.+?)\s+because\s+([^,.]+)([.!?]?)$/i);
    if (becauseMatch && becauseMatch[1].split(' ').length > 3) {
      const mainClause = becauseMatch[1].trim();
      const reasonClause = becauseMatch[2].trim();
      const punct = becauseMatch[3] || '.';
      // Convert to "Because reason, main."
      const capReason = reasonClause.charAt(0).toUpperCase() + reasonClause.slice(1);
      const lowMain = mainClause.charAt(0).toLowerCase() + mainClause.slice(1);
      return `Because ${capReason}, ${lowMain}${punct}`;
    }
  }

  // Active / Direct sentence openers for Casual
  if (tone === 'casual') {
    if (s.startsWith('In addition, ')) {
      s = s.replace('In addition, ', 'Plus, ');
    } else if (s.startsWith('Therefore, ')) {
      s = s.replace('Therefore, ', 'So, ');
    } else if (s.startsWith('However, ')) {
      s = s.replace('However, ', 'But ');
    }
  }

  // Formal transition insertions
  if (tone === 'formal') {
    if (s.startsWith('But ')) {
      s = s.replace(/^But\s+/i, 'However, ');
    } else if (s.startsWith('And ')) {
      s = s.replace(/^And\s+/i, 'Furthermore, ');
    } else if (s.startsWith('So ')) {
      s = s.replace(/^So\s+/i, 'Consequently, ');
    }
  }

  // Academic framing
  if (tone === 'academic') {
    if (s.startsWith('This shows ')) {
      s = s.replace(/^This shows\s+/i, 'These findings illustrate ');
    } else if (s.startsWith('We can see that ')) {
      s = s.replace(/^We can see that\s+/i, 'Empirical observations suggest that ');
    }
  }

  // Shorten mode: trim filler words
  if (tone === 'shorten') {
    s = s.replace(/\b(basically|literally|actually|really|very|quite|simply|in order to|just)\s+/gi, '');
    s = s.replace(/\bat the end of the day,?\s*/gi, '');
    s = s.replace(/\bit is important to note that\s*/gi, 'notably, ');
  }

  // Expand mode: add contextual transitional framing
  if (tone === 'expand') {
    if (!s.match(/^(furthermore|additionally|moreover|notably|in particular)/i) && Math.random() > 0.6) {
      const openers = [
        'Upon deeper analysis, ',
        'From a comprehensive perspective, ',
        'It is worth emphasizing that ',
        'To elaborate further, ',
      ];
      const opener = openers[Math.floor(Math.random() * openers.length)];
      const low = s.charAt(0).toLowerCase() + s.slice(1);
      s = opener + low;
    }
  }

  return s;
}

/**
 * Replace words with tone-appropriate synonyms based on slider level.
 */
function applySynonyms(
  sentence: string,
  tone: ParaphraseTone,
  level: SynonymLevel
): { transformed: string; wordReplacements: Map<string, { original: string; synonyms: string[] }> } {
  let result = sentence;
  const wordReplacements = new Map<string, { original: string; synonyms: string[] }>();

  // Tone-specific regex replacements first
  if (tone === 'formal') {
    for (const [pattern, repl] of FORMAL_TRANSFORMS) {
      result = result.replace(pattern, repl);
    }
  } else if (tone === 'academic') {
    for (const [pattern, repl] of ACADEMIC_TRANSFORMS) {
      result = result.replace(pattern, repl);
    }
  } else if (tone === 'casual') {
    for (const [pattern, repl] of CASUAL_TRANSFORMS) {
      result = result.replace(pattern, repl);
    }
  } else if (tone === 'creative') {
    for (const [pattern, repl] of CREATIVE_TRANSFORMS) {
      result = result.replace(pattern, repl);
    }
  }

  // General synonym replacements with probability based on level
  const threshold = level === 'few' ? 0.35 : level === 'balanced' ? 0.65 : 0.9;

  const words = result.split(/(\b[A-Za-z'-]+\b)/g);
  const rebuilt: string[] = [];

  for (const part of words) {
    const lower = part.toLowerCase();
    if (SYNONYM_MAP[lower] && Math.random() < threshold) {
      const candidates = SYNONYM_MAP[lower];
      const pick = candidates[Math.floor(Math.random() * candidates.length)];

      let formatted = pick;
      if (part === part.toUpperCase() && part.length > 1) {
        formatted = pick.toUpperCase();
      } else if (part[0] === part[0].toUpperCase()) {
        formatted = pick.charAt(0).toUpperCase() + pick.slice(1);
      }

      wordReplacements.set(formatted.toLowerCase(), {
        original: part,
        synonyms: candidates,
      });

      rebuilt.push(formatted);
    } else {
      rebuilt.push(part);
    }
  }

  return {
    transformed: rebuilt.join(''),
    wordReplacements,
  };
}

/**
 * Generate tokens diff between original text and rewritten text.
 */
function computeDiffTokens(
  original: string,
  paraphrased: string,
  replacements: Map<string, { original: string; synonyms: string[] }>
): DiffToken[] {
  const origWords = original.split(/\s+/).filter(Boolean);
  const paraWords = paraphrased.split(/\s+/).filter(Boolean);

  const tokens: DiffToken[] = [];

  let pIdx = 0;
  for (let i = 0; i < paraWords.length; i++) {
    const word = paraWords[i];
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    const cleanOrig = origWords[pIdx] ? origWords[pIdx].toLowerCase().replace(/[^a-z]/g, '') : null;

    if (cleanOrig && cleanWord === cleanOrig) {
      tokens.push({
        id: `tok-${i}-${word}`,
        text: word,
        type: 'unchanged',
      });
      pIdx++;
    } else if (replacements.has(cleanWord)) {
      const rep = replacements.get(cleanWord)!;
      tokens.push({
        id: `tok-${i}-${word}`,
        text: word,
        type: 'replaced',
        originalText: rep.original,
        synonyms: rep.synonyms.filter((s) => s.toLowerCase() !== cleanWord),
      });
      if (pIdx < origWords.length) pIdx++;
    } else {
      // Find if this is a synonym from the global map even if not flagged
      const directSyns = SYNONYM_MAP[cleanWord] || [];
      tokens.push({
        id: `tok-${i}-${word}`,
        text: word,
        type: 'added',
        synonyms: directSyns.length > 0 ? directSyns : undefined,
      });
      if (pIdx < origWords.length && cleanOrig !== cleanWord) {
        // advance cautiously
        if (origWords.length > paraWords.length) pIdx++;
      }
    }
  }

  return tokens;
}

/**
 * Primary Paraphrase Engine.
 * Supports Instant Local Linguistic Engine and optional Free Hugging Face Open-Source Model API.
 */
export async function paraphraseText(
  text: string,
  tone: ParaphraseTone = 'standard',
  level: SynonymLevel = 'balanced',
  hfConfig?: { apiKey?: string; model?: string }
): Promise<ParaphraseResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      text: '',
      tokens: [],
      tone,
      changesCount: 0,
      timestamp: Date.now(),
    };
  }

  // If user provided a Hugging Face API key, try remote inference first
  if (hfConfig?.apiKey && hfConfig.apiKey.trim().length > 5) {
    try {
      const model = hfConfig.model || 'Qwen/Qwen2.5-72B-Instruct';
      const prompt = `Rewrite the following text with a ${tone.toUpperCase()} tone. Make it sound natural, professional, and well-written. Output ONLY the rewritten text without explanations:\n\n${trimmed}`;

      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfConfig.apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 500, temperature: 0.7 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        let generated = '';
        if (Array.isArray(data) && data[0]?.generated_text) {
          generated = data[0].generated_text;
        } else if (typeof data === 'string') {
          generated = data;
        }

        // Clean out any echo of prompt
        if (generated.includes(prompt)) {
          generated = generated.replace(prompt, '').trim();
        }

        if (generated && generated.length > 5) {
          const tokens = computeDiffTokens(trimmed, generated, new Map());
          return {
            text: generated,
            tokens,
            tone,
            changesCount: tokens.filter((t) => t.type !== 'unchanged').length,
            timestamp: Date.now(),
          };
        }
      }
    } catch {
      // Gracefully fall back to local engine without throwing
    }
  }

  // Local Transformer-grade Linguistic Engine (Fast, 100% Free, Zero Lag)
  const sentences = splitIntoSentences(trimmed);
  const combinedReplacements = new Map<string, { original: string; synonyms: string[] }>();
  const rewrittenSentences: string[] = [];

  for (const sentence of sentences) {
    const restructured = restructureSentence(sentence, tone);
    const { transformed, wordReplacements } = applySynonyms(restructured, tone, level);

    for (const [k, v] of wordReplacements.entries()) {
      combinedReplacements.set(k, v);
    }

    rewrittenSentences.push(transformed);
  }

  let finalOutput = rewrittenSentences.join(' ');
  // Clean multiple spaces and ensure proper punctuation
  finalOutput = finalOutput.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();

  const tokens = computeDiffTokens(trimmed, finalOutput, combinedReplacements);
  const changesCount = tokens.filter((t) => t.type !== 'unchanged').length;

  return {
    text: finalOutput,
    tokens,
    tone,
    changesCount,
    timestamp: Date.now(),
  };
}
