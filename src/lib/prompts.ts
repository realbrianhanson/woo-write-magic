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
  competitorCopy?: string;
  audienceReviews?: string;
  voiceTone?: string;
  voiceExamples?: string[];
  specificObjections?: string[];
  differentiation?: {
    unfair_advantage: string;
    vs_competitors: string;
    category_position: string;
  };
  transformationTimeline?: {
    time_to_first_results: string;
    specific_metrics: string;
    progression: string;
  };
  funnelContext?: {
    traffic_temperature: string;
    funnel_stage: string;
    sequence_position_context: string;
  };
}

const STORY_STRUCTURES = {
  mistake: {
    name: "The Mistake I Made",
    examples: `
EXAMPLE 1:
"Three years ago I made a $47,000 mistake.

I hired a 'growth agency' to scale my email list.

They promised 10,000 subscribers in 90 days. Professional landing pages. Automated funnels. The works.

What I got: 9,847 fake emails. A 0.3% open rate. And a PayPal dispute.

That's when I learned the one thing that actually builds an engaged list..."

EXAMPLE 2:
"I launched my course to 2,300 people last month.

Made $412.

Know why?

Because I followed every 'expert's' advice. Perfect sales page. Video testimonials. Early bird pricing.

I forgot the one thing that actually matters: They didn't know me yet.

Here's what I did instead..."
`,
  },
  weird: {
    name: "The Weird Thing I Noticed",
    examples: `
EXAMPLE 1:
"I was scrolling Instagram at 11pm when I noticed something weird.

Every single course creator I follow posts the same content.

'5 tips for...'
'The secret to...'
'How I went from X to Y...'

Same format. Same energy. Same boring results.

But one guy? Different.

He posts photos of his messy desk. Rants about stuff that pisses him off. Shares his actual revenue numbers.

And he's doing 6 figures a month.

Here's what he's doing that nobody else is..."

EXAMPLE 2:
"You ever notice how the best-performing emails are the ugly ones?

No fancy design. No images. Just plain text that looks like your friend wrote it drunk at 2am.

I tested this last week. Sent two versions of the same email.

Version A: Beautiful template. Logo. Formatted perfectly.
Version B: Plain text. Typo in the subject line. Looked terrible.

Version B got 4x the clicks.

Weird, right?"
`,
  },
  truth: {
    name: "The Uncomfortable Truth",
    examples: `
EXAMPLE 1:
"Nobody cares about your product.

I know that stings. But it's true.

They don't care about your features. Your benefits. Your testimonials.

They care about Thursday at 2pm when their boss asks for the third revision.

They care about checking their bank account and feeling sick.

They care about their kid asking why they work so much.

If your marketing doesn't speak to THAT? You're invisible."

EXAMPLE 2:
"Your email list doesn't hate you.

They just forgot you exist.

You email them once a month with 'value content' and wonder why they don't buy.

Here's what they're thinking: 'Who is this? Did I sign up for this?'

You need to email MORE, not less. And make every email feel like a text from a friend.

That's it. That's the whole thing."
`,
  },
  realization: {
    name: "The 2AM Realization",
    examples: `
EXAMPLE 1:
"It was 2:47am and I couldn't sleep.

I was lying there thinking about the 347 people on my email list who never open my emails.

And it hit me.

I was writing to impress other marketers. Not to connect with real people.

Every email sounded like a TED talk. Professional. Polished. Perfect.

And totally forgettable.

The next morning I deleted my entire email sequence and started over.

One simple change doubled my open rates..."

EXAMPLE 2:
"Last night I was reviewing my sales calls from the past month.

Same objection every time: 'I need to think about it.'

At 1am I realized something.

They weren't saying 'I need to think about it.'

They were saying 'I don't trust you yet.'

Changed my entire approach. Now I'm closing 60% instead of 20%."
`,
  },
  conversation: {
    name: "The Overheard Conversation",
    examples: `
EXAMPLE 1:
"Last Tuesday I was in line at Starbucks when I overheard two moms talking.

One was almost in tears.

She'd spent $3,000 on Facebook ads for her online course. Got 47 clicks. Zero sales.

The other one goes: 'Did you email your list?'

'I don't have a list. Nobody tells you how to build one that actually works.'

I wanted to interrupt and tell her. But I didn't.

Instead, I'm telling you..."

EXAMPLE 2:
"I was at a coffee shop last week working on my laptop.

Two guys next to me were talking about their startup.

One says: 'We need to go viral.'

The other one: 'Or we could just email the 50 people who actually asked for updates.'

First guy: 'That's not scalable.'

Dude. You have zero revenue. Email the 50 people.

This is the problem with everyone..."
`,
  },
  surprise: {
    name: "AI Surprise Mode",
    examples: `
MIX IT UP. Choose your own story structure based on what fits best.

Could be:
- A confession ("I'm gonna be honest with you...")
- A pattern interrupt ("You know that feeling when...")  
- A personal story (specific moment, real details)
- An uncomfortable truth ("Nobody wants to hear this but...")
- A late-night realization ("It was 2am and...")
- An overheard conversation ("I was at X when I heard...")

Just make it REAL. Make it SPECIFIC. Make them FEEL something.

Start with a hook that drops them into a moment they recognize.
`,
  },
};

function getStoryExamples(): string {
  const storyData = STORY_STRUCTURES.surprise;
  
  return `
${storyData.examples}

MATCH THIS ENERGY. This tone. This rhythm. This realness.
`;
}

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

  const voiceContext = settings.voiceTone && settings.voiceExamples && settings.voiceExamples.length > 0
    ? `
VOICE & TONE TO MATCH:
Voice Style: ${settings.voiceTone}

EXAMPLE EMAILS IN THIS VOICE:
${settings.voiceExamples.map((ex, i) => `
EXAMPLE ${i + 1}:
${ex}
---
`).join('\n')}

CRITICAL: Match this exact voice, tone, sentence structure, and energy level.
`
    : settings.voiceTone
    ? `
VOICE STYLE: ${settings.voiceTone}
Write in this voice consistently throughout.
`
    : '';

  const objectionsContext = settings.specificObjections && settings.specificObjections.length > 0
    ? `
SPECIFIC OBJECTIONS TO ADDRESS:
${settings.specificObjections.map((obj, i) => `${i + 1}. "${obj}"`).join('\n')}

CRITICAL: Pre-empt these objections subtly in the email. Don't list them, weave them into the narrative.
Address the real concern behind each objection, not just the surface-level statement.
`
    : '';

  const differentiationContext = settings.differentiation
    ? `
DIFFERENTIATION & POSITIONING:

Your Unfair Advantage:
${settings.differentiation.unfair_advantage || 'Not specified'}

You vs. Competitors:
${settings.differentiation.vs_competitors || 'Not specified'}

Category Position:
${settings.differentiation.category_position || 'Not specified'}

USE THIS to show why they should choose YOU, not just any solution.
`
    : '';

  const transformationContext = settings.transformationTimeline
    ? `
TRANSFORMATION TIMELINE:

Time to First Results:
${settings.transformationTimeline.time_to_first_results || 'Not specified'}

Specific Metrics:
${settings.transformationTimeline.specific_metrics || 'Not specified'}

Week-by-Week Progression:
${settings.transformationTimeline.progression || 'Not specified'}

CRITICAL: Use SPECIFIC timelines and metrics. Paint the picture of their journey.
Make the transformation feel real, achievable, and believable.
`
    : '';

  const funnelContext = settings.funnelContext
    ? `
FUNNEL CONTEXT:

Traffic Temperature: ${settings.funnelContext.traffic_temperature}
${settings.funnelContext.traffic_temperature === 'cold' ? '→ They don\'t know you. Build trust first, then sell.' : 
  settings.funnelContext.traffic_temperature === 'warm' ? '→ They know you exist. Convince them you\'re the right choice.' :
  '→ They\'re ready. Just remove final objections and close.'}

Funnel Stage: ${settings.funnelContext.funnel_stage}
${settings.funnelContext.funnel_stage === 'awareness' ? '→ Focus on the PROBLEM they\'re facing.' :
  settings.funnelContext.funnel_stage === 'consideration' ? '→ Focus on your SOLUTION to their problem.' :
  '→ Focus on the OFFER and why they should buy NOW.'}

${settings.funnelContext.sequence_position_context ? `
Sequence Context:
${settings.funnelContext.sequence_position_context}

CRITICAL: Reference what came before. Build on the narrative arc.
` : ''}
`
    : '';

  return `You're writing 3 DIFFERENT VERSIONS of a high-converting email. Each version uses a different strategic approach.

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

${voiceContext}

${objectionsContext}

${differentiationContext}

${transformationContext}

${funnelContext}

${getStoryExamples()}

${settings.competitorCopy ? `
COMPETITOR COPY ANALYSIS:
Below is competitor email copy. Analyze their patterns and avoid them:

${settings.competitorCopy}

CRITICAL: DO NOT copy their style, structure, or phrases.
Instead:
- If they're formal, be casual
- If they use long paragraphs, use short ones
- If they lead with features, lead with story
- Find what makes YOUR voice different
- Stand out from their approach
` : ''}

${settings.audienceReviews ? `
AUDIENCE VOICE & FEEDBACK:
Below are real customer reviews and feedback about competitor products. Use their exact language, pain points, and desires:

${settings.audienceReviews}

CRITICAL INSTRUCTIONS:
- MIRROR their language and phrases in your copy
- Address the EXACT pain points they mention
- Use their words, not marketing jargon
- Reference specific frustrations they called out
- Tap into the emotions behind their complaints
- Position your product as solving what they dislike
- Amplify what they wish existed

Example: If they say "I was spending 3 hours every morning just trying to figure out..." 
→ You write: "You know that feeling. 3 hours every morning. Just trying to figure out..."

STEAL THEIR WORDS. Make them feel heard.
` : ''}

${CREATIVE_DIRECTION}

${simplificationRules}

${uniqueMechanismRules}

OUTPUT FORMAT:
Return valid JSON with 3 DIFFERENT VARIANTS:

{
  "variants": [
    {
      "type": "safe",
      "approach": "Proven structure, low-risk, tested formula",
      "subject_lines": [
        "Subject 1 (benefit-focused, clear)",
        "Subject 2 (social proof angle)",
        "Subject 3 (curiosity with clarity)"
      ],
      "body": "Full email text for SAFE variant. Use [First Name]. Use \\n\\n for paragraph breaks.",
      "ctas": [
        "CTA 1 (direct, benefit-driven)",
        "CTA 2 (low-pressure, specific)",
        "CTA 3 (action-oriented)"
      ]
    },
    {
      "type": "aggressive",
      "approach": "Bold, polarizing, challenges status quo",
      "subject_lines": [
        "Subject 1 (provocative, pattern interrupt)",
        "Subject 2 (controversial truth)",
        "Subject 3 (calls out the BS)"
      ],
      "body": "Full email text for AGGRESSIVE variant. Bolder voice, stronger opinions, more polarizing.",
      "ctas": [
        "CTA 1 (urgent, direct)",
        "CTA 2 (FOMO-driven)",
        "CTA 3 (challenge-based)"
      ]
    },
    {
      "type": "pattern_interrupt",
      "approach": "Unexpected angle, breaks the mold",
      "subject_lines": [
        "Subject 1 (completely unexpected)",
        "Subject 2 (weird but intriguing)",
        "Subject 3 (makes them go 'wait, what?')"
      ],
      "body": "Full email text for PATTERN INTERRUPT variant. Completely different angle from what they expect.",
      "ctas": [
        "CTA 1 (creative, unique)",
        "CTA 2 (ties back to the pattern break)",
        "CTA 3 (surprising but clear)"
      ]
    }
  ],
  "subject_line_variants": [
    {"category": "curiosity", "subject": "Subject line here", "character_count": 45, "predicted_performance": "high"},
    {"category": "benefit", "subject": "Subject line here", "character_count": 52, "predicted_performance": "medium"},
    {"category": "fear", "subject": "Subject line here", "character_count": 38, "predicted_performance": "high"},
    {"category": "social_proof", "subject": "Subject line here", "character_count": 41, "predicted_performance": "medium"},
    {"category": "urgency", "subject": "Subject line here", "character_count": 36, "predicted_performance": "high"},
    {"category": "curiosity", "subject": "Different curiosity angle", "character_count": 44, "predicted_performance": "medium"},
    {"category": "benefit", "subject": "Another benefit angle", "character_count": 50, "predicted_performance": "high"},
    {"category": "pattern_interrupt", "subject": "Unexpected angle", "character_count": 39, "predicted_performance": "high"},
    {"category": "social_proof", "subject": "Another proof angle", "character_count": 47, "predicted_performance": "medium"},
    {"category": "urgency", "subject": "Time-based urgency", "character_count": 40, "predicted_performance": "high"}
  ],
  "critique": {
    "readability_score": 85,
    "spam_triggers": ["free", "guarantee"],
    "curiosity_gaps": ["Opens with strong hook", "Withholds solution details effectively"],
    "weak_points": ["CTA could be stronger", "Missing specific proof point in paragraph 3"],
    "strengths": ["Strong emotional resonance", "Clear transformation timeline", "Mirrors audience language well"],
    "improvement_suggestions": ["Add specific metric in opening", "Strengthen P.S. with urgency", "Include one more objection pre-emption"]
  },
  "testing_recommendations": [
    "Test Subject Line #1 (curiosity) vs #7 (benefit) - both predicted high",
    "A/B test Safe variant vs Aggressive variant to gauge audience tolerance",
    "Test CTA placement: mid-email vs end-only",
    "Try removing the P.S. to see if it affects conversion"
  ]${settings.useUniqueMechanism ? `,
  "uniqueMechanism": {
    "nickname": "The name",
    "rootCause": "Why it works",
    "metaphor": "How to explain it"
  }` : ''}
}

Remember: 
- Generate 3 COMPLETE variants with different strategic approaches
- 10 subject lines categorized by type
- Pre-send critique with specific feedback
- Testing recommendations based on the variants
- Write like a human. Sound like a text message. Make them feel something.`;
}
