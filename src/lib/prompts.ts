import { BANNED_WORDS } from "./bannedWords";

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

const EXAMPLE_OPENINGS = `
HERE ARE EXAMPLES OF HOW TO START. Study these. Match this energy.

PERSONAL STORY START:
"Last Tuesday I was in line at Starbucks when I overheard two moms talking.

One was almost in tears.

She'd spent $3,000 on Facebook ads for her online course. Got 47 clicks. Zero sales.

I wanted to interrupt and tell her what she was missing. But I didn't. Instead, I'm telling you."

PATTERN INTERRUPT:
"You know that feeling when you open your email list dashboard?

And you see the unsubscribe count going up?

Yeah. That's not your fault.

Well, it kind of is. But not in the way you think."

CONFESSION STYLE:
"I'm gonna be honest with you.

I used to write emails that sounded like a robot having a panic attack.

'Leverage your synergies!' 'Transform your business!'

My subscribers hated me. I had a 2% open rate.

Then I learned one thing that changed everything."

UNCOMFORTABLE TRUTH:
"Your email list doesn't hate you.

They just forgot you exist.

Because every email you send sounds exactly like everyone else's.

Same structure. Same promises. Same boring hooks.

Let me show you what actually works."

LATE-NIGHT REALIZATION:
"It was 2am and I couldn't sleep.

I was scrolling through my sent emails from the past year.

And I realized something that made my stomach drop.

I was writing to impress other marketers. Not to connect with real people.

Everything changed when I stopped."

---

WRITE LIKE THESE EXAMPLES. Match this tone. This rhythm. This realness.
`;

const CREATIVE_DIRECTION = `
YOUR MISSION: Make them FEEL something.

Write like a human. Not a marketer. Not a copywriter. A human.

Sound like you're texting a friend at midnight when you had a breakthrough.

DROP THE READER INTO A MOMENT:
- A specific Tuesday afternoon
- Standing in their kitchen at 6am
- That feeling when they check their bank account
- The conversation they had yesterday that they can't stop thinking about

PAINT PICTURES THEY CAN SEE:
❌ "You'll be more productive"
✅ "You'll close your laptop at 3pm. Still have dinner with your kids. And not think about work until Monday."

❌ "Our solution helps struggling entrepreneurs"
✅ "You're staring at your screen. It's 11pm. You have 3 tabs open trying to figure out why nobody's buying."

MAKE IT ABOUT THEIR LIFE, NOT YOUR PRODUCT:
- Talk about what they DO, not what they SAY
- Reference the specific moments in their day/week
- Mirror their exact internal dialogue
- Show you've lived their struggle

USE REAL HUMAN LANGUAGE:
- "Look..."
- "Here's the thing..."
- "I mean..."
- "Yeah, but..."
- Sentence fragments. Because that's how people talk.
- One-liners that surprise them

AVOID LIKE POISON:
- Em dashes (—) → Use periods. Short sentences.
- Buzzwords: magical, transformative, synergy, revolutionary, game-changing, seamless
- Perfect structure → Break it. Add surprises.
- Clichés → "We're not your typical agency" (cringe)
- Marketing speak → Nobody talks like this in real life

THE BANNED WORD LIST (sounds like AI):
${BANNED_WORDS.join(", ")}

Also banned: very, extremely, really, probably, maybe, kind of, almost, clearly, truly, simply, literally, actually, definitely, absolutely, completely, totally, utterly, quite, rather, somewhat, fairly, pretty

PROOF THAT FEELS REAL:
Don't say "347 customers achieved results"
Say "Sarah was making $4K a month. Now she's at $15K. Took her 6 weeks."

Use:
- Specific names and numbers
- Before/after with details they can picture
- Stuff they can verify themselves
- "You know those ads you see everywhere? Yeah, those don't work."

SOCIAL IMPACT (show how others will see them):
Not: "You'll be successful"
But: "Your team will ask how you got so much done. Your spouse will notice you're not stressed anymore. People will think you hired help."

READING LEVEL: 6th grade maximum
- Short words (Anglo-Saxon, not Latin)
- 15 words per sentence max
- No jargon unless building credibility
- Break long thoughts into tiny sentences

RHYTHM & FLOW:
Short sentence.
Then a longer one that builds on the idea and keeps them reading.
Back to short.

Use triplets (three sentences that build):
"You're tired of this.
You've tried everything.
Nothing's worked."

ALWAYS END WITH P.S.:
Make it about the benefit + urgency + action

"P.S. Sarah went from $4K to $15K in 6 weeks using this. But the early access deal ends Friday. Click here before it's gone."

STRUCTURE (but hide it, make it feel natural):
1. Hook with a story moment (use the examples above)
2. Make it about THEIR situation, not your product
3. Show the pain (specific, visual, emotional)
4. Tease the solution (don't reveal everything)
5. Social proof that feels real
6. Clear action step
7. P.S. with urgency

NO ONE SHOULD RECOGNIZE THIS AS MARKETING.
It should feel like a friend sharing something that changed their life.
`;

export function buildEmailPrompt(
  settings: CampaignSettings,
  emailNumber: number = 1,
  totalEmails: number = 1,
  simplify: boolean = false
): string {
  const simplificationRules = simplify
    ? `
MAKE IT EVEN SIMPLER:
- 4th grade reading level
- 12 words per sentence max
- 2 sentences per paragraph max
- Replace every complex word with the simplest version
- Cut everything that isn't essential
`
    : '';

  const uniqueMechanismRules = settings.useUniqueMechanism
    ? `
CREATE A UNIQUE MECHANISM (but make it feel natural, not forced):

Give it a name people remember:
- "The 3-Minute Reset"
- "The Tuesday Method"
- "The Reverse Launch"

Find the surprising root cause:
- Something counterintuitive
- The 1% they've been missing
- "You think it's X, but it's actually Y"

Explain with a simple metaphor:
- Make the complex feel obvious
- Create an "oh shit" moment
- Use everyday comparisons

Weave it into the email naturally. Don't announce it like a product feature.

Return this in the JSON:
"uniqueMechanism": {
  "nickname": "The catchy name",
  "rootCause": "Why their current approach isn't working",
  "metaphor": "Simple explanation"
}
`
    : '';

  return `You're writing a high-converting email. Not as a copywriter. As a human who figured something out and wants to share it.

CAMPAIGN CONTEXT:
Email ${emailNumber} of ${totalEmails} - ${settings.campaignType}

WHO YOU'RE TALKING TO:
${settings.audience}

THEIR PAIN:
${settings.painPoint}

WHAT THEY WANT:
${settings.desiredResult}

THE PRODUCT:
${settings.productName} - ${settings.description}
Price: $${settings.price}

EMOTIONAL STATE TO TAP:
${settings.primaryEmotion}

${EXAMPLE_OPENINGS}

${CREATIVE_DIRECTION}

${simplificationRules}

${uniqueMechanismRules}

OUTPUT FORMAT (this is the only technical part):
Return valid JSON only:
{
  "subjectLines": [
    "Subject 1 (casual, curiosity-driven, no clickbait)",
    "Subject 2 (pattern interrupt or question)",
    "Subject 3 (personal or confession style)"
  ],
  "emailBody": "Full email text. Use [First Name] for personalization. Use \\n\\n for paragraph breaks. Sound human. Make them feel something.",
  "ctas": [
    "CTA 1 (conversational, low-pressure)",
    "CTA 2 (benefit-focused, specific)",
    "CTA 3 (urgency without desperation)"
  ]${settings.useUniqueMechanism ? `,
  "uniqueMechanism": {
    "nickname": "The name",
    "rootCause": "Why it works",
    "metaphor": "How to explain it"
  }` : ''}
}

Remember: Write like a human. Sound like a text message. Make them feel something. No one should recognize this as marketing.`;
}
