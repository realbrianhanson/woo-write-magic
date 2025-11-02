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
  marketSophistication?: string;
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

function getMarketSophisticationStrategy(sophistication: string): string {
  const strategies: Record<string, string> = {
    virgin: `
═══════════════════════════════════════════════════════════════
MARKET STAGE: VIRGIN MARKET (You're First)
═══════════════════════════════════════════════════════════════
STRATEGY: Use DIRECT, SIMPLE CLAIMS. Don't overcomplicate.

Your audience has never heard this before. Keep it simple:
- State the benefit clearly
- Skip complex mechanisms  
- Simple proof (testimonials, before/after)
- Don't be fancy

HEADLINE: "Lose Weight" or "Make Money Online" or "Learn Spanish"
Not: "The Revolutionary New Method That..."

BODY FOCUS:
1. What they'll get
2. Simple proof it works
3. How to start
4. Clear CTA
`,

    early: `
═══════════════════════════════════════════════════════════════
MARKET STAGE: EARLY MARKET (1-3 Competitors)
═══════════════════════════════════════════════════════════════
STRATEGY: AMPLIFY the claim with specifics and numbers.

The claim still works, just needs to be BIGGER:
- Add specific numbers and timeframes
- Make measurable promises
- Use concrete examples
- Exceed competitor claims

HEADLINE: "Lose 47 Pounds in 90 Days" or "Make $10K Your First Month"
Not just: "Lose Weight" (too generic now)

BODY FOCUS:
1. Amplified promise (bigger, faster, specific)
2. Numbered proof and metrics
3. Detailed timeline
4. Strong social proof
`,

    saturated: `
═══════════════════════════════════════════════════════════════
MARKET STAGE: SATURATED MARKET (5-10+ Competitors)
═══════════════════════════════════════════════════════════════
STRATEGY: Introduce a NEW MECHANISM. Show HOW it works differently.

Claims don't work anymore. Everyone makes them. Show a NEW WAY:
- Feature your mechanism in the headline
- Give it a memorable name
- Explain HOW it's different
- Show why old methods failed

HEADLINE: "The 16:8 Method That Burns Fat While You Sleep"
Or: "The AI Funnel That Sells For You 24/7"
Not: "Lose Weight Fast" (burned out claim)

BODY STRUCTURE:
1. Acknowledge failed attempts with old methods
2. Explain WHY old methods don't work
3. Introduce YOUR mechanism (named and explained)
4. Show HOW it works step-by-step
5. Mechanism-specific proof
6. Clear mechanism-based CTA

Your mechanism must be:
- Believable (not magical)
- Different (not just renamed)
- Specific (not vague)
- Demonstrable (can show how it works)
`,

    'mechanism-wars': `
═══════════════════════════════════════════════════════════════
MARKET STAGE: MECHANISM WARS (Everyone Has Secrets)
═══════════════════════════════════════════════════════════════
STRATEGY: Make your mechanism EASIER, FASTER, or MORE PROVEN.

Everyone has a mechanism now. Yours must be demonstrably BETTER:
- Simpler to use
- Faster results
- More proven
- Side-by-side comparison

HEADLINE: "Enhanced 16:8 Method - Now 3x Faster Results"
Or: "AI Funnel 2.0 with Smart Retargeting Built In"

BODY STRUCTURE:
1. Acknowledge existing mechanisms
2. Point out their limitations (specific)
3. Introduce your IMPROVED mechanism
4. Show exactly what makes it better
5. Comparative proof
6. Simplicity emphasis

Focus on:
- Speed improvement
- Ease improvement  
- Better results
- Better experience
`,

    dead: `
═══════════════════════════════════════════════════════════════
MARKET STAGE: DEAD MARKET (Nothing Works)
═══════════════════════════════════════════════════════════════
STRATEGY: Focus on IDENTITY and TRANSFORMATION.

Your market has heard everything. Claims and mechanisms are ignored.
Make it about WHO THEY BECOME:
- Focus on identity not product
- Create tribal language
- Show the lifestyle
- Social proof of community
- Values and beliefs

HEADLINE: "For Entrepreneurs Who Chose Freedom Over Security"
Or: "Join 10,000 Who Finally Figured It Out"
Not: Any claim or mechanism (won't work)

BODY STRUCTURE:
1. Describe the identity (who is this for?)
2. Paint lifestyle picture
3. Contrast with "everyone else"
4. Show community social proof
5. Invite them to join
6. Product is almost secondary

You're selling membership in a tribe, not a product.
`
  };
  return strategies[sophistication] || strategies.saturated;
}

function getStoryExamples(): string {
  return `
═══════════════════════════════════════════════════════════════
STORY PRINCIPLES (Not Templates - Don't Copy These Examples)
═══════════════════════════════════════════════════════════════

PRINCIPLE 1: SPECIFICITY CREATES BELIEVABILITY

❌ VAGUE: "I made a big mistake last year"
✅ SPECIFIC: "Three years ago I spent $47,000 on a 'growth agency' that got me 9,847 fake emails"

❌ VAGUE: "Recently I had a realization"
✅ SPECIFIC: "Tuesday morning, 6:47am, staring at my bank account. That's when it hit me."

The more specific, the more real it feels.

PRINCIPLE 2: RECOGNITION BEFORE EDUCATION

Start with something they already feel/know:
- "You know that Sunday night feeling when..."
- "Ever notice how the best emails are the ugly ones?"
- "You're probably doing what I did for three months..."

Get them nodding "yes, I know that feeling" BEFORE teaching them anything.

PRINCIPLE 3: TENSION BEFORE RESOLUTION

❌ DON'T lead with: "I discovered how to 10x my revenue"
✅ DO lead with: "I was stuck at $4K a month for eight months. Tried everything. Then last Tuesday..."

Make them feel the pain FIRST. Then offer relief.

HOOK STYLES YOU CAN USE:

1. PERSONAL STORY MOMENT
   Drop into a specific scene with stakes
   "It was 2:47am and I couldn't sleep..."
   "Last Tuesday my client asked me a question I couldn't answer..."

2. PATTERN OBSERVATION
   Call out something they've noticed
   "Ever notice how every course creator posts the same content?"
   "You know that thing where you write the perfect email and nobody responds?"

3. TRUTH BOMB
   Say what nobody else will
   "Nobody cares about your product."
   "Your email list doesn't hate you. They just forgot you exist."

4. CONFESSION
   Admit something vulnerable
   "I was writing to impress other marketers. Not to connect with real people."
   "Here's what I got wrong for three years..."

5. RECOGNITION QUESTION
   Ask something that makes them think "wait, how did you know?"
   "Ever spend 3 hours writing one email?"
   "You know that feeling when you launch and nobody buys?"

6. CONTRAST/SURPRISE
   Set up expectation then break it
   "I launched to 2,300 people last month. Made $412."
   "My ugliest email got 4x the clicks of my beautiful one."

═══════════════════════════════════════════════════════════════

THE KEY: FEEL IT FIRST

Before writing, ask yourself:
- What emotion am I trying to create?
- What moment would make them feel that?
- What specific detail makes it real?

Then write from that feeling, not from a template.

VARIETY MATTERS: 
Don't use the same hook style every email. Mix it up. Keep them guessing.
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

Minimize weak qualifiers (don't overuse): very, extremely, quite, rather, somewhat, fairly

NATURAL WORDS YOU CAN USE:
really, actually, probably, maybe, almost, clearly, simply, literally, definitely, kind of

These aren't AI words - they're how humans talk. Use them naturally.

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

READING LEVEL: 6th-8th grade
- Use simple words when possible
- Vary sentence length naturally (5-25 words)
- No unnecessary jargon
- Write how people actually talk

RHYTHM & FLOW:
Create natural conversational rhythm using sentence variety:

✅ SHORT (5-10 words): Emphasize key points. Make it stick. Create urgency.
✅ MEDIUM (12-20 words): Most of your writing should flow naturally at this comfortable reading length for easy comprehension.
✅ LONGER (20-30 words): Build momentum and paint vivid pictures when you need to really draw them into a scene or explain something important.
✅ FRAGMENTS (2-4 words): For dramatic impact. Strategic emphasis. Use sparingly.

❌ DON'T DO THIS (mechanical pattern):
"Short sentence. Another short one. And another. One more."

✅ DO THIS INSTEAD (natural rhythm):
"Here's what happened. I spent three weeks testing different approaches, trying everything the experts recommended. Nothing worked. Then I tried something nobody talks about. Changed everything."

Think: How would you explain this over coffee? Write that.

PERSONALITY THROUGH PUNCTUATION:
- Ellipses (...) for trailing thoughts or suspense
- Em dashes (—) for conversational asides  
- Rhetorical questions to engage reader
- Parenthetical comments for personality

Example WITHOUT personality:
"I tested this approach and it worked well."

Example WITH personality:
"I tested this approach... and holy shit, it worked way better than I expected."

═══════════════════════════════════════════════════════════════
PROVEN EMAIL STRUCTURE - Follow This Flow:
═══════════════════════════════════════════════════════════════

1. HOOK (1-2 paragraphs)
   Start with one of these:
   - Specific moment: "Last Tuesday at 2:47pm..."
   - Direct question: "Know why most emails fail?"
   - Bold claim: "I'm going to tell you something nobody else will"
   - Observation: "Ever notice how..."

2. STORY/EXAMPLE (3-5 paragraphs)
   Tell something SPECIFIC:
   - Personal experience with real details
   - Customer situation (names, numbers, specifics)
   - Something you observed
   
   Make it feel like you're telling a friend over coffee.

3. LESSON/INSIGHT (2-4 paragraphs)
   Extract the principle:
   - "Here's why this matters..."
   - "The lesson?"
   - Connect story to their business/life
   - Make it actionable

4. BRIDGE TO OFFER (1-2 paragraphs)
   Natural transition:
   - "If you want to go deeper on this..."
   - "This is exactly what I cover in..."
   - NO apology for selling
   - Make it feel like the next logical step

5. SOFT CTA (1 paragraph)
   Keep it low-pressure:
   - Clear next step
   - Link or action
   - Brief close
   
   Instead of: "BUY NOW! LIMITED TIME!"
   Use: "If this interests you, here's where to learn more: [link]"

═══════════════════════════════════════════════════════════════

CRITICAL RULES:
- Stories BEFORE lessons (not the other way around)
- Entertainment BEFORE education
- Value BEFORE pitch
- Don't skip the story - that's where engagement happens

PARAGRAPH LENGTH:
- Target: 1-3 sentences per paragraph
- Maximum: 4 sentences (rare, for complex ideas)
- Use single-sentence paragraphs for emphasis
- Line breaks are your friend

Example of GOOD formatting:
"Here's what I learned.

Three years ago I tried this approach. Failed miserably. Lost $12,000.

Know why?

I was doing what everyone else said to do. Following the 'experts.'

Bad idea."

Example of BAD formatting (same content, worse):
"Here's what I learned. Three years ago I tried this approach and failed miserably and lost $12,000. Know why? I was doing what everyone else said to do and following the experts which was a bad idea."

ALWAYS END WITH P.S.:
Make it about the benefit + urgency + action

"P.S. Sarah went from $4K to $15K in 6 weeks using this. But the early access deal ends Friday. Click here before it's gone."

NO ONE SHOULD RECOGNIZE THIS AS MARKETING.
It should feel like a friend sharing something that changed their life.
`;

export function buildEmailPrompt(
  settings: CampaignSettings,
  emailNumber: number = 1,
  totalEmails: number = 1,
  simplify: boolean = false
): string {
  // Add market sophistication strategy at the very start
  const sophisticationStrategy = getMarketSophisticationStrategy(settings.marketSophistication || 'saturated');
  
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

${sophisticationStrategy}

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
