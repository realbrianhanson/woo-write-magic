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

const STORYTELLING_RULES = `
STORYTELLING & CONNECTION (CRITICAL):
- Start with a RELATABLE MOMENT from real life
- Use "you" statements that mirror THEIR internal dialogue
- Tell micro-stories: specific scenes, not general statements
- Include sensory details (what they see, feel, hear)
- Show the character's emotional state through actions, not labels

Example transformation:
❌ "Many people struggle with email marketing"
✅ "You sit down Monday morning. Stare at that blank email. And think 'what the hell do I even say to these people?'"

STORY STRUCTURE:
- Struggle moment (relatable, specific situation)
- Internal conflict (what they're thinking/feeling)
- Turning point (moment of discovery)
- Transformation (specific before/after with details)
- New reality (what life looks like now)

THE MOM TEST PRINCIPLES:
- Talk about THEIR life, not your product
- Ask about specific past behaviors, not future hypotheticals
- Focus on their PROBLEMS and CONTEXT, not your solution
- Listen for what they DO, not what they SAY they'll do
- Example: Instead of "Would you use this?" → "Tell me about the last time you tried to solve this problem"

CRITICAL: Make it about THEM experiencing something, not you explaining something.
`;

const CORE_COPY_PRINCIPLES = `
PAINT CONCRETE, VISUAL SCENARIOS:
- Show specific, tangible situations - not generic descriptions
- Make pain and benefits VISIBLE in the reader's mind
- Create "mind movies" they can see themselves in
- Example: Instead of "improve your productivity" → "watch yourself close your laptop at 3pm, knowing you've finished everything"

SOCIAL PROOF & STATUS:
- Show how benefits affect how OTHERS perceive them
- Include social situations and reactions from people around them
- Example: "Your colleagues will ask if you hired a personal trainer"

LANGUAGE STYLE:
- Write like a FRIEND talking to a friend - casual, conversational
- Use powerful, visceral ACTIVE VERBS (not passive voice)
- Short, rhythmic sentences with varied length for flow
- Use Anglo-Saxon words over Latin ones (small vs. diminutive)
- Target 6th grade reading level
- Maximum 15-20 words per sentence
- ELIMINATE all qualifiers (very, extremely, really, probably)
- AVOID adverbs ending in -ly
- Use PROGRESSIVE TENSE for benefits ("is transforming" not "will transform")

PROOF MODALITIES - Combine claims with proof:
- Specificity: Use exact numbers, names, percentages ("347 customers", "Harvard scientists")
- Testable proof: Facts readers can verify themselves
- Metaphors: Simple comparisons that create instant understanding
- Technical credibility: Brief expert language that builds authority

CONVERSATIONAL FLOW:
- Vary sentence length (short, long, short for rhythm)
- Use triplets (3 sentences building momentum)
- Sprinkle in conversational phrases: "Here's the thing...", "Check this out...", "You know what?"
- Add transitions: "Plus...", "And...", "But here's the kicker..."

ELIMINATE RUTHLESSLY:
- NO redundancy or repetition
- NO unnecessary words
- NO vague language or unclear pronouns
- NO complex jargon unless building credibility
- Every sentence must be essential
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

Also AVOID these weak qualifiers: very, extremely, really, probably, maybe, kind of, almost, clearly, truly, simply, literally, actually, definitely, absolutely, completely, totally, utterly, quite, rather, somewhat, fairly, pretty

Write like a REAL HUMAN FRIEND. Casual. Direct. Powerful.
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
- Target 4th grade reading level
- Maximum 12 words per sentence
- Maximum 2 sentences per paragraph
- Replace ALL complex words with simple alternatives
- Cut every unnecessary word
- Break long sentences into short ones
- Use the simplest word that works
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

${STORYTELLING_RULES}
${CORE_COPY_PRINCIPLES}
${PS_REQUIREMENT}
${BANNED_WORDS_WARNING}
${simplificationRules}
${uniqueMechanismRules}

CRITICAL CONNECTION TECHNIQUES:
- Mirror their exact thoughts: "You're probably thinking..."
- Acknowledge their skepticism: "I know this sounds..."
- Validate their past attempts: "You've tried X before and..."
- Use their language patterns, not marketing speak
- Reference specific moments in their day/week
- Show you GET their situation before offering solution

OPENING REQUIREMENTS:
- Start with a STORY MOMENT, not a pitch
- Drop reader into a specific scene from their life
- Use second person ("you") to create immediacy
- Show, don't tell their pain/desire
- Make them nod and think "yes, that's exactly how I feel"

WRITING STRUCTURE - Use "blocks" for major pain/benefit sections:
1. Overarching statement
2. 3 specific, concrete examples with vivid details
3. 1-2 dimensional "lived experience" scenarios (create mind movies)
4. Deep emotional recap of how it makes them feel

Example block:
"You'll have your evenings back. [overarching]

No more staying late finishing reports.
No more missing dinner with your family.
No more working weekends to catch up. [3 specifics]

Picture this: You close your laptop at 5pm. Walk to your car. And actually enjoy your Friday night instead of thinking about Monday's deadlines. [mind movie]

You'll finally feel like you're living your life, not just surviving it." [emotional recap]

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
