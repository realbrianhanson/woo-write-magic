import { BANNED_WORDS } from "./bannedWords";
import { selectBestFramework } from "./frameworks";

interface CampaignSettings {
  productName: string;
  description: string;
  price: number;
  audience: string;
  painPoint: string;
  desiredResult: string;
  campaignType: string;
  primaryEmotion: string;
  sequenceLength?: number;
  useUniqueMechanism?: boolean;
}

const READABILITY_RULES = `
CRITICAL READABILITY REQUIREMENTS:
- Write at 6th grade reading level
- Use short, simple words (avoid jargon and complex vocabulary)
- Maximum 2-3 sentences per paragraph
- Use short, punchy sentences for impact
- Average sentence length should be 15-20 words maximum
- Break up long thoughts into multiple short sentences
- Use active voice, not passive
- One idea per sentence
`;

const PS_REQUIREMENT = `
CRITICAL: ALWAYS END WITH P.S. SECTION
Every email MUST end with a P.S. that:
- Restates the main benefit in a fresh way
- Adds urgency or mentions a bonus/deadline
- Repeats the call-to-action

Format: 
P.S. [benefit reminder + urgency element + clear CTA]

Example:
"P.S. Remember, this framework helped 347 course creators add $10K/month to their revenue. But early access closes in 48 hours. Click here to claim your spot before it's gone."
`;

const BANNED_WORDS_WARNING = `
CRITICAL: AVOID AI-SOUNDING WORDS
Do NOT use these words - they sound robotic and AI-generated:
${BANNED_WORDS.join(", ")}

Write like a real human. Use conversational, natural language.
`;

export function buildEmailPrompt(
  settings: CampaignSettings,
  emailNumber: number = 1,
  totalEmails: number = 1,
  simplify: boolean = false
): string {
  const simplificationRules = simplify
    ? `
EXTRA SIMPLIFICATION REQUIRED:
- Target 4th-6th grade reading level
- Maximum 15 words per sentence
- Maximum 2 sentences per paragraph
- Replace ALL complex words with simple alternatives
- Cut any unnecessary words
`
    : '';

  const uniqueMechanismRules = settings.useUniqueMechanism
    ? `
UNIQUE MECHANISM REQUIREMENT:
You MUST create a compelling unique mechanism that positions this solution as different:

1. IDENTIFY ROOT CAUSE:
   - Find a surprising or counterintuitive root cause of their pain
   - Something they haven't heard before
   - Make it feel like "the missing 1% they've been overlooking"

2. CREATE CATCHY NICKNAME:
   - Give the mechanism a memorable name (e.g., "The 3-Minute Morning Reset", "The Revenue Reversal Method")
   - Make it sound proprietary and exclusive
   - Use numbers, metaphors, or power words

3. EXPLAIN WITH METAPHOR:
   - Use a simple, relatable metaphor to explain how it works
   - Make the complex feel simple
   - Create an "aha!" moment

4. INTEGRATE INTO EMAIL:
   - Position the unique mechanism as the core differentiator
   - Build intrigue around it
   - Make readers curious to learn more

IMPORTANT: Return the mechanism details in the metadata for display.
`
    : '';

  // Select best framework based on campaign type and emotion
  const framework = selectBestFramework(
    settings.campaignType,
    settings.primaryEmotion
  );

  return `You are a master direct response copywriter specializing in high-converting email campaigns.

CAMPAIGN TYPE: ${settings.campaignType}
EMAIL: ${emailNumber} of ${totalEmails}

PRODUCT DETAILS:
- Product: ${settings.productName}
- Description: ${settings.description}
- Price: $${settings.price}

AUDIENCE & PSYCHOLOGY:
- Target Audience: ${settings.audience}
- Pain Point: ${settings.painPoint}
- Desired Transformation: ${settings.desiredResult}
- Primary Emotion: ${settings.primaryEmotion}

COPYWRITING FRAMEWORK: ${framework.acronym} (${framework.name})
${framework.description}

${framework.prompt}

${READABILITY_RULES}
${PS_REQUIREMENT}
${BANNED_WORDS_WARNING}
${simplificationRules}
${uniqueMechanismRules}

OUTPUT REQUIREMENTS:
Return ONLY valid JSON in this exact format:
{
  "subjectLines": [
    "Subject line option 1",
    "Subject line option 2",
    "Subject line option 3"
  ],
  "emailBody": "Full email text with [First Name] personalization tag where appropriate. Use \\n\\n for paragraph breaks.",
  "ctas": [
    "CTA option 1",
    "CTA option 2", 
    "CTA option 3"
  ]${settings.useUniqueMechanism ? `,
  "uniqueMechanism": {
    "nickname": "The catchy name for the mechanism",
    "rootCause": "The surprising root cause explanation",
    "metaphor": "The simple metaphor used to explain it"
  }` : ''},
  "framework": {
    "id": "${framework.id}",
    "name": "${framework.name}"
  }
}

Remember: Follow the ${framework.acronym} framework structure. Simple words. Short sentences. Maximum impact.`;
}
