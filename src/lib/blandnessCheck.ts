export const BLAND_PHRASES = [
  "I wanted to reach out",
  "I'm excited to share",
  "You might be wondering",
  "Let me ask you a question",
  "The truth is",
  "Here's the thing",
  "Imagine if",
  "What if I told you",
  "I hope this email finds you well",
  "I'm reaching out to",
  "I wanted to follow up",
  "Just checking in",
  "I thought you might be interested",
  "Allow me to introduce",
  "I'm writing to",
  "First and foremost",
  "At the end of the day",
  "Moving forward",
  "Circle back",
  "Touch base",
];

export interface BlandnessResult {
  isBland: boolean;
  foundPhrases: string[];
  count: number;
}

export function checkBlandness(text: string): BlandnessResult {
  const lowerText = text.toLowerCase();
  const foundPhrases: string[] = [];

  for (const phrase of BLAND_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      foundPhrases.push(phrase);
    }
  }

  return {
    isBland: foundPhrases.length > 0,
    foundPhrases,
    count: foundPhrases.length,
  };
}

export function buildHumanizePrompt(emailBody: string): string {
  return `This email sounds like generic marketing template copy. Make it human.

CURRENT EMAIL:
${emailBody}

PROBLEM: Template language detected. Sounds like every other marketing email.

YOUR MISSION: Rewrite this to sound like a REAL PERSON.

REMOVE ALL:
- Marketing speak ("I wanted to reach out", "I'm excited to share")
- Template phrases ("You might be wondering", "Let me ask you")
- Perfect polish - make it imperfect and real
- Corporate voice - write like texting a friend

START WITH:
- A story moment (specific Tuesday, conversation you overheard)
- A confession ("I'm gonna be honest...")
- A pattern interrupt ("You know that feeling when...")
- An uncomfortable truth ("Your email list doesn't hate you...")
- A late-night realization ("It was 2am and I couldn't sleep...")

SOUND LIKE:
- You're texting a friend at midnight
- You just had a breakthrough and need to share it
- You're sitting across from them at coffee
- Natural speech with fragments. Like this.

USE:
- "Look..."
- "I mean..."
- "Yeah, but..."
- Short. Punchy. Real.

NO ONE SHOULD RECOGNIZE THIS AS MARKETING.

Return ONLY the rewritten email body text.
Keep the same core message and offer.
Preserve all calls-to-action.
Make it feel human.`;
}
