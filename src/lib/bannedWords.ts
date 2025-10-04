export const BANNED_WORDS = [
  "Skyrocket",
  "Game changing",
  "Game-changing",
  "Delve",
  "Moreover",
  "Embark",
  "Plethora",
  "unlock",
  "Transformative",
  "Synergy",
  "Unleash",
  "Revolutionize",
  "Revolutionary",
  "Unveil",
  "Unravel",
  "Demystify",
  "Insurmountable",
  "New Era",
  "Poised",
  "Unprecedented",
  "Ever-evolving",
  "Meticulously",
  "Bustling",
  "In the world of",
  "In today's digital era",
  "Embodies",
  "Embodiment",
  "Poignant",
  "Whimsical",
  "Palpable",
  "Hustle and bustle",
  "Realm",
  "Journey",
  "Navigate",
  "Supercharge",
  "Tailored",
  "Elegant",
] as const;

/**
 * Detect banned words in text (case-insensitive)
 */
export function detectBannedWords(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();

  BANNED_WORDS.forEach((word) => {
    const lowerWord = word.toLowerCase();
    if (lowerText.includes(lowerWord)) {
      found.push(word);
    }
  });

  return [...new Set(found)]; // Remove duplicates
}

/**
 * Find sentences containing banned words
 */
export function findSentencesWithBannedWords(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const bannedSentences: string[] = [];

  sentences.forEach((sentence) => {
    const sentenceBannedWords = detectBannedWords(sentence);
    if (sentenceBannedWords.length > 0) {
      bannedSentences.push(sentence.trim());
    }
  });

  return bannedSentences;
}

/**
 * Build prompt to replace sentences with banned words
 */
export function buildBannedWordReplacementPrompt(
  sentences: string[],
  context: string
): string {
  return `You are a direct response copywriter editing an email.

CONTEXT:
${context}

PROBLEM SENTENCES (contain AI-sounding words):
${sentences.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Rewrite ONLY these sentences to:
- Remove all AI-sounding clichés and buzzwords
- Use simple, conversational language
- Maintain the same meaning and benefit
- Sound natural and human

Return a JSON array of the rewritten sentences in the same order:
["Rewritten sentence 1", "Rewritten sentence 2", ...]`;
}
