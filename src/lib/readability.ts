/**
 * Calculate Flesch-Kincaid Grade Level
 * Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
 */
export function calculateFleschKincaidGrade(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  return Math.round(
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  );
}

/**
 * Count syllables in a word
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  // Adjust for silent e
  if (word.endsWith('e')) count--;
  
  return Math.max(1, count);
}

/**
 * Calculate average paragraph length (in sentences)
 */
export function calculateAvgParagraphLength(text: string): number {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length === 0) return 0;

  const totalSentences = paragraphs.reduce((sum, para) => {
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sum + sentences.length;
  }, 0);

  return Math.round((totalSentences / paragraphs.length) * 10) / 10;
}

/**
 * Calculate average sentence length (in words)
 */
export function calculateAvgSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const totalWords = sentences.reduce((sum, sentence) => {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    return sum + words.length;
  }, 0);

  return Math.round((totalWords / sentences.length) * 10) / 10;
}

/**
 * Find paragraphs that exceed the sentence limit
 */
export function findLongParagraphs(text: string, maxSentences: number = 4): number {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  return paragraphs.filter(para => {
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length > maxSentences;
  }).length;
}

export interface ReadabilityMetrics {
  gradeLevel: number;
  avgParagraphLength: number;
  avgSentenceLength: number;
  longParagraphCount: number;
}

export function analyzeReadability(text: string): ReadabilityMetrics {
  return {
    gradeLevel: calculateFleschKincaidGrade(text),
    avgParagraphLength: calculateAvgParagraphLength(text),
    avgSentenceLength: calculateAvgSentenceLength(text),
    longParagraphCount: findLongParagraphs(text, 4),
  };
}
