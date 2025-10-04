import { detectBannedWords } from "./bannedWords";
import { calculateFleschKincaidGrade, calculateAvgSentenceLength } from "./readability";
import { hasPostScript } from "./postscript";

export interface CritiqueIssue {
  type: "banned-words" | "reading-level" | "formatting" | "opening" | "reader-focus";
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  details?: string;
  count?: number;
  suggestions?: string[];
}

export interface CritiqueResult {
  issues: CritiqueIssue[];
  score: number; // 0-100
  bannedWords: string[];
  gradeLevel: number;
  youYourRatio: number;
}

/**
 * Count "you/your" vs "we/I/me" words
 */
function calculateReaderFocusRatio(text: string): number {
  const lowerText = text.toLowerCase();
  
  const readerWords = (lowerText.match(/\b(you|your|you're|yours)\b/g) || []).length;
  const writerWords = (lowerText.match(/\b(we|i|me|my|our|us)\b/g) || []).length;
  
  const total = readerWords + writerWords;
  if (total === 0) return 0;
  
  return Math.round((readerWords / total) * 100);
}

/**
 * Check if email has weak opening
 */
function analyzeOpening(text: string): { isWeak: boolean; reason?: string } {
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || "";
  
  // Check if starts with question
  if (firstSentence.endsWith("?")) {
    return { 
      isWeak: true, 
      reason: "Email starts with a question (weak hook)" 
    };
  }
  
  // Check for generic openings
  const weakOpenings = [
    /^hi\b/i,
    /^hello\b/i,
    /^hey there\b/i,
    /^i hope this email finds you well\b/i,
    /^i wanted to reach out\b/i,
    /^just checking in\b/i,
  ];
  
  for (const pattern of weakOpenings) {
    if (pattern.test(firstSentence)) {
      return { 
        isWeak: true, 
        reason: "Generic greeting (lacks pattern interrupt)" 
      };
    }
  }
  
  return { isWeak: false };
}

/**
 * Find long paragraphs and sentences
 */
function analyzeFormatting(text: string): {
  longParagraphs: number;
  longSentences: number;
} {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let longParagraphs = 0;
  paragraphs.forEach(para => {
    const paraSentences = para.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (paraSentences.length > 3) longParagraphs++;
  });
  
  let longSentences = 0;
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 25) longSentences++;
  });
  
  return { longParagraphs, longSentences };
}

/**
 * Comprehensive email critique
 */
export function critiqueEmail(emailBody: string): CritiqueResult {
  const issues: CritiqueIssue[] = [];
  let score = 100;
  
  // 1. Banned words check
  const bannedWords = detectBannedWords(emailBody);
  if (bannedWords.length > 0) {
    score -= bannedWords.length * 5;
    issues.push({
      type: "banned-words",
      severity: "error",
      title: `Found ${bannedWords.length} banned word${bannedWords.length > 1 ? 's' : ''}`,
      description: "These words sound AI-generated and robotic",
      details: bannedWords.join(", "),
      count: bannedWords.length,
      suggestions: [
        "Use conversational, natural language instead",
        "Replace with specific benefits and outcomes",
        "Avoid marketing clichés and buzzwords",
      ],
    });
  }
  
  // 2. Reading level check
  const gradeLevel = calculateFleschKincaidGrade(emailBody);
  if (gradeLevel > 8) {
    score -= (gradeLevel - 8) * 3;
    issues.push({
      type: "reading-level",
      severity: "warning",
      title: `Reading level too high (${gradeLevel}th grade)`,
      description: "Emails should target 6-8th grade level for best engagement",
      suggestions: [
        "Use shorter words (3-4 syllables maximum)",
        "Break long sentences into 2-3 shorter ones",
        "Replace jargon with everyday language",
        "Use active voice instead of passive",
      ],
    });
  }
  
  // 3. Formatting check
  const { longParagraphs, longSentences } = analyzeFormatting(emailBody);
  
  if (longParagraphs > 0) {
    score -= longParagraphs * 4;
    issues.push({
      type: "formatting",
      severity: "warning",
      title: `${longParagraphs} paragraph${longParagraphs > 1 ? 's' : ''} exceed 3 sentences`,
      description: "Long paragraphs reduce readability and engagement",
      count: longParagraphs,
      suggestions: [
        "Break paragraphs into 2-3 sentences maximum",
        "Use white space to improve scannability",
        "One idea per paragraph",
      ],
    });
  }
  
  if (longSentences > 0) {
    score -= longSentences * 3;
    issues.push({
      type: "formatting",
      severity: "warning",
      title: `${longSentences} sentence${longSentences > 1 ? 's' : ''} exceed 25 words`,
      description: "Long sentences are hard to read and reduce clarity",
      count: longSentences,
      suggestions: [
        "Aim for 15-20 words per sentence",
        "Split complex thoughts into multiple sentences",
        "Use periods instead of commas and semicolons",
      ],
    });
  }
  
  // 4. P.S. check
  if (!hasPostScript(emailBody)) {
    score -= 10;
    issues.push({
      type: "formatting",
      severity: "error",
      title: "Missing P.S. section",
      description: "P.S. sections can boost conversions by 30%+",
      suggestions: [
        "Add P.S. that restates the main benefit",
        "Include urgency or bonus mention",
        "Repeat the call-to-action",
      ],
    });
  }
  
  // 5. Opening hook check
  const opening = analyzeOpening(emailBody);
  if (opening.isWeak) {
    score -= 8;
    issues.push({
      type: "opening",
      severity: "warning",
      title: "Weak opening hook",
      description: opening.reason || "First sentence doesn't grab attention",
      suggestions: [
        "Start with a bold claim or surprising fact",
        "Use pattern interrupt (curiosity, controversy)",
        "Lead with the biggest benefit",
        "Avoid questions in the opening line",
      ],
    });
  }
  
  // 6. You/Your ratio check
  const youYourRatio = calculateReaderFocusRatio(emailBody);
  if (youYourRatio < 70) {
    score -= 7;
    issues.push({
      type: "reader-focus",
      severity: "warning",
      title: `Only ${youYourRatio}% reader-focused (need 70%+)`,
      description: "Email is too self-focused instead of benefit-focused",
      suggestions: [
        "Replace 'we/I' with 'you' wherever possible",
        "Focus on benefits to the reader, not features",
        "Make it about their transformation, not your product",
        `Current ratio: ${youYourRatio}% "you/your" vs ${100 - youYourRatio}% "we/I/me"`,
      ],
    });
  }
  
  return {
    issues,
    score: Math.max(0, Math.min(100, score)),
    bannedWords,
    gradeLevel,
    youYourRatio,
  };
}

/**
 * Build prompt to fix all critique issues
 */
export function buildCritiqueFixPrompt(
  emailBody: string,
  issues: CritiqueIssue[]
): string {
  const issueDescriptions = issues
    .map((issue, i) => `${i + 1}. ${issue.title}: ${issue.description}`)
    .join("\n");

  return `You are a direct response copywriter editing an email to fix specific issues.

CURRENT EMAIL:
${emailBody}

ISSUES TO FIX:
${issueDescriptions}

Rewrite the email to fix ALL these issues while:
- Maintaining the same core message and offer
- Keeping the same structure (subject, body, CTA)
- Using natural, conversational language
- Focusing on reader benefits ("you/your" > 70%)
- Keeping reading level at 6-8th grade
- Breaking into short paragraphs (2-3 sentences max)
- Avoiding all banned words and AI clichés
- Including a strong P.S. section

Return ONLY the rewritten email body text, no JSON formatting.`;
}
