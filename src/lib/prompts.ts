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

${READABILITY_RULES}
${simplificationRules}

DIRECT RESPONSE FRAMEWORK:
1. Hook with pattern interrupt (first 3 seconds critical)
2. Amplify the pain or desire
3. Present transformation/solution
4. Build credibility with proof
5. Create urgency
6. Clear, compelling call-to-action

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
  ]
}

Remember: Simple words. Short sentences. Maximum impact.`;
}
