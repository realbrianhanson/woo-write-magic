/**
 * Split text into paragraphs
 */
export function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter(p => p.trim().length > 0);
}

/**
 * Count sentences in a paragraph
 */
export function countSentences(paragraph: string): number {
  return paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
}

/**
 * Find paragraphs with more than maxSentences
 */
export function findLongParagraphs(
  text: string,
  maxSentences: number = 3
): Array<{ index: number; text: string; sentenceCount: number }> {
  const paragraphs = splitIntoParagraphs(text);
  const longOnes: Array<{ index: number; text: string; sentenceCount: number }> = [];

  paragraphs.forEach((para, index) => {
    const count = countSentences(para);
    if (count > maxSentences) {
      longOnes.push({ index, text: para, sentenceCount: count });
    }
  });

  return longOnes;
}

/**
 * Build prompt to break long paragraphs intelligently
 */
export function buildParagraphFormattingPrompt(longParagraphs: string[]): string {
  return `You are a copywriting editor improving email readability.

TASK: Break these long paragraphs into shorter ones (2-3 sentences each) at natural transition points.

RULES:
- Maintain exact meaning and flow
- Break at logical thought transitions
- Keep sentences intact (don't split sentences)
- Use double line breaks (\\n\\n) between new paragraphs
- Preserve all original text
- Don't add or remove any content

LONG PARAGRAPHS TO FORMAT:
${longParagraphs.map((p, i) => `
PARAGRAPH ${i + 1}:
${p}
`).join('\n---\n')}

Return a JSON array of the reformatted paragraphs:
["Reformatted paragraph 1\\n\\nNext part of paragraph 1", "Reformatted paragraph 2\\n\\nNext part", ...]

Each array item should be the reformatted version of the corresponding input paragraph.`;
}

/**
 * Apply formatted paragraphs to email body
 */
export function applyFormattedParagraphs(
  originalText: string,
  longParagraphs: Array<{ index: number; text: string }>,
  formattedParagraphs: string[]
): string {
  const allParagraphs = splitIntoParagraphs(originalText);
  
  // Create a map of which paragraphs to replace
  const replacements = new Map<number, string>();
  longParagraphs.forEach((lp, i) => {
    if (formattedParagraphs[i]) {
      replacements.set(lp.index, formattedParagraphs[i]);
    }
  });

  // Build new text with replacements
  const newParagraphs = allParagraphs.map((para, index) => {
    return replacements.get(index) || para;
  });

  return newParagraphs.join('\n\n');
}
