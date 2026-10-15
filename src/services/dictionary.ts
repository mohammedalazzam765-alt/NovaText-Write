/**
 * Built-in client-side dictionary and spell checking service
 * Zero-cost, instantaneous, runs 100% in the browser.
 */

// Common typos and misspellings with immediate corrections
export const COMMON_TYPOS: Record<string, string> = {
  teh: 'the',
  taht: 'that',
  adn: 'and',
  recieve: 'receive',
  recieved: 'received',
  recieving: 'receiving',
  seperate: 'separate',
  seperated: 'separated',
  seperation: 'separation',
  definately: 'definitely',
  definitly: 'definitely',
  occured: 'occurred',
  occuring: 'occurring',
  untill: 'until',
  neccessary: 'necessary',
  necesary: 'necessary',
  necessery: 'necessary',
  goverment: 'government',
  accomodate: 'accommodate',
  accomodation: 'accommodation',
  wierd: 'weird',
  truely: 'truly',
  alot: 'a lot',
  freind: 'friend',
  freinds: 'friends',
  calender: 'calendar',
  embarass: 'embarrass',
  embarassed: 'embarrassed',
  embarassing: 'embarrassing',
  enviroment: 'environment',
  enviromental: 'environmental',
  existance: 'existence',
  guarentee: 'guarantee',
  garantee: 'guarantee',
  harrass: 'harass',
  harrassment: 'harassment',
  independant: 'independent',
  independance: 'independence',
  inteligent: 'intelligent',
  inteligence: 'intelligence',
  mispell: 'misspell',
  mispelled: 'misspelled',
  mispelling: 'misspelling',
  noticable: 'noticeable',
  posession: 'possession',
  posess: 'possess',
  priviledge: 'privilege',
  priviledged: 'privileged',
  pronounciation: 'pronunciation',
  recommand: 'recommend',
  recomended: 'recommended',
  recomand: 'recommend',
  relevent: 'relevant',
  relevance: 'relevance',
  succesful: 'successful',
  succesfully: 'successfully',
  suprise: 'surprise',
  suprised: 'surprised',
  tommorrow: 'tomorrow',
  tomorow: 'tomorrow',
  twelth: 'twelfth',
  writting: 'writing',
  writen: 'written',
  acheive: 'achieve',
  acheived: 'achieved',
  acheivement: 'achievement',
  agressive: 'aggressive',
  agression: 'aggression',
  apparant: 'apparent',
  apparantly: 'apparently',
  arguement: 'argument',
  arguements: 'arguments',
  assasination: 'assassination',
  basicly: 'basically',
  begining: 'beginning',
  beleive: 'believe',
  beleived: 'believed',
  bizzare: 'bizarre',
  buisness: 'business',
  colleage: 'colleague',
  collegue: 'colleague',
  commited: 'committed',
  commitee: 'committee',
  concious: 'conscious',
  curiosity: 'curiosity',
  curiousity: 'curiosity',
  dilemna: 'dilemma',
  dissapear: 'disappear',
  dissapoint: 'disappoint',
  dissapointed: 'disappointed',
  facinating: 'fascinating',
  finaly: 'finally',
  flourescent: 'fluorescent',
  foriegn: 'foreign',
  forseeable: 'foreseeable',
  fourty: 'forty',
  fullfill: 'fulfill',
  gauge: 'gauge',
  guage: 'gauge',
  grammer: 'grammar',
  greatful: 'grateful',
  happend: 'happened',
  hierachy: 'hierarchy',
  humourous: 'humorous',
  imediately: 'immediately',
  immediatly: 'immediately',
  incidently: 'incidentally',
  interupt: 'interrupt',
  irrelevent: 'irrelevant',
  knowlege: 'knowledge',
  liason: 'liaison',
  libary: 'library',
  lisence: 'license',
  maintainance: 'maintenance',
  millenium: 'millennium',
  miniscule: 'minuscule',
  mischievious: 'mischievous',
  neice: 'niece',
  nieghbor: 'neighbor',
  occurence: 'occurrence',
  oppurtunity: 'opportunity',
  paralell: 'parallel',
  parrallel: 'parallel',
  paramenter: 'parameter',
  persue: 'pursue',
  pharoah: 'pharaoh',
  peice: 'piece',
  prefered: 'preferred',
  prefering: 'preferring',
  propoganda: 'propaganda',
  publically: 'publicly',
  questionaire: 'questionnaire',
  refered: 'referred',
  refering: 'referring',
  religous: 'religious',
  rember: 'remember',
  resistence: 'resistance',
  rythm: 'rhythm',
  seige: 'siege',
  similiar: 'similar',
  speach: 'speech',
  strenght: 'strength',
  succed: 'succeed',
  supercede: 'supersede',
  tendancy: 'tendency',
  therefor: 'therefore',
  thier: 'their',
  threshhold: 'threshold',
  tyrany: 'tyranny',
  unforseen: 'unforeseen',
  unfortunatly: 'unfortunately',
  unconcious: 'unconscious',
  vaccum: 'vacuum',
  vehical: 'vehicle',
  visable: 'visible',
  wether: 'whether',
  wich: 'which',
  wont: "won't",
  dont: "don't",
  cant: "can't",
  didnt: "didn't",
  isnt: "isn't",
  arent: "aren't",
  wasnt: "wasn't",
  werent: "weren't",
  hasnt: "hasn't",
  havent: "haven't",
  hadnt: "hadn't",
  couldnt: "couldn't",
  shouldnt: "shouldn't",
  wouldnt: "wouldn't",
  youre: "you're",
  theyre: "they're",
  weve: "we've",
  youve: "you've",
  theyve: "they've",
};

// Compute Levenshtein distance for fuzzy matching
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Check if a word is in common typos
export function getTypoCorrection(rawWord: string): { corrected: string; isTypo: boolean } {
  const clean = rawWord.toLowerCase().replace(/[^a-z']/g, '');
  if (!clean) return { corrected: rawWord, isTypo: false };

  if (COMMON_TYPOS[clean]) {
    let corrected = COMMON_TYPOS[clean];
    // Preserve case: Capitalized or UPPERCASE
    if (rawWord === rawWord.toUpperCase() && rawWord.length > 1) {
      corrected = corrected.toUpperCase();
    } else if (rawWord[0] === rawWord[0].toUpperCase()) {
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    }
    return { corrected, isTypo: true };
  }

  return { corrected: rawWord, isTypo: false };
}
