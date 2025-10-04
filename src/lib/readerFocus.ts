/**
 * Count "you/your" vs "we/I/me" words
 */
export interface ReaderFocusMetrics {
  readerWords: number;
  writerWords: number;
  ratio: number;
  total: number;
}

export function calculateReaderFocus(text: string): ReaderFocusMetrics {
  const lowerText = text.toLowerCase();
  
  const readerWords = (lowerText.match(/\b(you|your|you're|yours)\b/g) || []).length;
  const writerWords = (lowerText.match(/\b(we|i|me|my|our|us|we're|our)\b/g) || []).length;
  
  const total = readerWords + writerWords;
  const ratio = total === 0 ? 0 : Math.round((readerWords / total) * 100);
  
  return {
    readerWords,
    writerWords,
    ratio,
    total,
  };
}

/**
 * Get rating for reader focus ratio
 */
export function getReaderFocusRating(ratio: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (ratio >= 70) {
    return { label: "Excellent", color: "text-green-600", icon: "✓" };
  }
  if (ratio >= 60) {
    return { label: "Good", color: "text-blue-600", icon: "✓" };
  }
  if (ratio >= 50) {
    return { label: "Fair", color: "text-yellow-600", icon: "!" };
  }
  return { label: "Poor", color: "text-red-600", icon: "✗" };
}

/**
 * Build prompt to increase reader focus
 */
export function buildReaderFocusPrompt(emailBody: string): string {
  return `You are a direct response copywriter editing an email to be more reader-focused.

CURRENT EMAIL:
${emailBody}

PROBLEM: The email is too self-focused (uses "we", "I", "our" too much).

TASK: Rewrite the email to be reader-focused:
- Replace "we/I/our" with "you/your" wherever possible
- Focus on THEIR benefits, not YOUR features
- Make it about their transformation, not your product
- Maintain the same core message and offer
- Keep the same structure and length
- Preserve all calls-to-action

EXAMPLE TRANSFORMATIONS:
❌ "We built this tool to help you..."
✅ "You'll get access to a tool that..."

❌ "Our system includes..."
✅ "You'll discover how to..."

❌ "I'm excited to share..."
✅ "You're about to learn..."

Return ONLY the rewritten email body text, no JSON formatting.
Keep it natural and conversational.`;
}
