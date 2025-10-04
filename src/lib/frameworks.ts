export interface CopyFramework {
  id: string;
  name: string;
  acronym: string;
  description: string;
  structure: string[];
  bestFor: string[];
  prompt: string;
}

export const COPY_FRAMEWORKS: Record<string, CopyFramework> = {
  AIDA: {
    id: "AIDA",
    name: "Attention, Interest, Desire, Action",
    acronym: "AIDA",
    description: "Classic four-step psychological model guiding prospects from awareness to purchase",
    structure: [
      "Attention: Hook with pattern interrupt",
      "Interest: Build curiosity and relevance",
      "Desire: Show transformation and benefits",
      "Action: Clear, compelling CTA"
    ],
    bestFor: ["Product Launch", "Lead-to-Sale"],
    prompt: `Follow the AIDA framework:
    
ATTENTION: Open with a bold pattern interrupt that stops the scroll
- Use surprising fact, controversial statement, or bold question
- First 3 seconds are critical

INTEREST: Build curiosity and show relevance
- Connect to their specific situation
- Tease the solution without revealing it yet

DESIRE: Paint vivid picture of transformation
- Show before/after scenarios
- Use emotional triggers
- Stack benefits

ACTION: Clear, urgent call-to-action
- Remove friction
- Add urgency
- Make it easy to say yes`
  },

  PAS: {
    id: "PAS",
    name: "Problem, Agitation, Solution",
    acronym: "PAS",
    description: "Three-step framework leveraging emotional pain points",
    structure: [
      "Problem: Identify the core pain point",
      "Agitation: Amplify the emotional cost",
      "Solution: Present your product as the answer"
    ],
    bestFor: ["Re-engagement", "Deadline & Scarcity"],
    prompt: `Follow the PAS framework:

PROBLEM: Identify their biggest pain point
- Be specific and relatable
- Show you understand their struggle

AGITATION: Amplify the emotional cost
- What happens if they don't solve this?
- Use "what if" scenarios
- Build urgency through consequence

SOLUTION: Present your product as the answer
- Position as the missing piece
- Show how it eliminates the pain
- Make it feel inevitable`
  },

  BAB: {
    id: "BAB",
    name: "Before-After-Bridge",
    acronym: "BAB",
    description: "Shows transformation journey through current state, desired state, and path",
    structure: [
      "Before: Current painful situation",
      "After: Desired outcome/transformation",
      "Bridge: How your product gets them there"
    ],
    bestFor: ["Product Launch", "Post-Purchase", "Nurture & Value"],
    prompt: `Follow the BAB framework:

BEFORE: Paint picture of current struggle
- Specific pain points they face daily
- Emotional weight of the situation
- Make it relatable

AFTER: Show vivid transformation
- Specific outcomes they'll achieve
- How life/business changes
- Make it tangible and believable

BRIDGE: Show the path (your product)
- How it bridges the gap
- Why it works when others failed
- Make it feel achievable`
  },

  PASTOR: {
    id: "PASTOR",
    name: "Problem, Amplify, Story, Transformation, Offer, Response",
    acronym: "PASTOR",
    description: "Six-step persuasive framework combining storytelling with problem-solving",
    structure: [
      "Problem: Identify core issue",
      "Amplify: Make pain vivid",
      "Story: Share transformation narrative",
      "Transformation: Show what's possible",
      "Offer: Present solution",
      "Response: Clear CTA"
    ],
    bestFor: ["Product Launch", "Lead-to-Sale"],
    prompt: `Follow the PASTOR framework:

PROBLEM: Identify the core issue
- Be specific and relatable

AMPLIFY: Make the pain vivid
- Show cost of inaction
- Use emotional triggers

STORY: Share transformation narrative
- Real customer example
- Relatable struggle to success

TRANSFORMATION: Show what's possible
- Specific outcomes
- Tangible results

OFFER: Present your solution
- Clear value proposition
- Stack benefits

RESPONSE: Clear call-to-action
- Remove objections
- Add urgency`
  },

  QUEST: {
    id: "QUEST",
    name: "Qualify, Understand, Educate, Stimulate, Transition",
    acronym: "QUEST",
    description: "Five-step framework for nurturing prospects through education",
    structure: [
      "Qualify: Identify ideal reader",
      "Understand: Show empathy",
      "Educate: Provide value",
      "Stimulate: Create desire",
      "Transition: Move to action"
    ],
    bestFor: ["Nurture & Value", "Lead-to-Sale"],
    prompt: `Follow the QUEST framework:

QUALIFY: Identify if this is for them
- Call out specific audience
- Set expectations

UNDERSTAND: Show you get their situation
- Demonstrate empathy
- Prove you understand the problem

EDUCATE: Teach them something valuable
- Provide actionable insight
- Build trust through value

STIMULATE: Create desire for solution
- Show gap between current and possible
- Build urgency

TRANSITION: Move them to action
- Natural segue to offer
- Clear next step`
  },

  "4U": {
    id: "4U",
    name: "Urgent, Unique, Ultra-specific, Useful",
    acronym: "4U",
    description: "Headline and offer framework creating compelling, action-driving copy",
    structure: [
      "Urgent: Time-sensitive element",
      "Unique: Differentiator",
      "Ultra-specific: Concrete details",
      "Useful: Clear benefit"
    ],
    bestFor: ["Deadline & Scarcity", "Product Launch"],
    prompt: `Follow the 4U framework:

URGENT: Create time pressure
- Deadline
- Limited availability
- FOMO element

UNIQUE: What makes this different
- Unique mechanism
- Proprietary approach
- Why competitors can't copy

ULTRA-SPECIFIC: Use concrete numbers
- Specific results
- Exact timeframes
- Precise benefits

USEFUL: Clear, tangible benefit
- What they get
- How it helps
- Why it matters`
  },

  PPPP: {
    id: "PPPP",
    name: "Picture, Promise, Prove, Push",
    acronym: "PPPP",
    description: "Four-step framework combining visualization with proof",
    structure: [
      "Picture: Vivid visualization",
      "Promise: Core benefit claim",
      "Prove: Evidence and credibility",
      "Push: Call-to-action"
    ],
    bestFor: ["Product Launch", "Re-engagement"],
    prompt: `Follow the PPPP framework:

PICTURE: Paint vivid mental image
- Show transformation
- Make it tangible
- Use sensory details

PROMISE: Make bold claim
- Specific outcome
- Timeframe
- Believable yet exciting

PROVE: Back it up
- Social proof
- Data/results
- Testimonials

PUSH: Strong call-to-action
- Create urgency
- Remove friction
- Make it irresistible`
  },
};

/**
 * Match campaign type and emotion to best framework
 */
export function selectBestFramework(
  campaignType: string,
  emotion: string
): CopyFramework {
  // Emotion-based framework selection
  const emotionMap: Record<string, string> = {
    "Fear of Missing Out": "4U",
    "Desire for Status": "BAB",
    "Hope & Transformation": "PASTOR",
    "Fear of Loss": "PAS",
    "Greed & Opportunity": "AIDA",
  };

  // Campaign type-based framework selection
  const campaignMap: Record<string, string> = {
    "Product Launch": "AIDA",
    "Lead-to-Sale": "PASTOR",
    "Deadline & Scarcity": "4U",
    "Re-engagement": "PAS",
    "Nurture & Value": "QUEST",
    "Post-Purchase": "BAB",
  };

  // Prioritize emotion, fallback to campaign type
  const frameworkId = emotionMap[emotion] || campaignMap[campaignType] || "AIDA";
  
  return COPY_FRAMEWORKS[frameworkId];
}
