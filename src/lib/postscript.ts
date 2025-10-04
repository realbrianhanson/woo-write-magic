/**
 * Check if email contains P.S. section
 */
export function hasPostScript(text: string): boolean {
  return /P\.S\./i.test(text);
}

/**
 * Generate a strategic P.S. section based on email content
 */
export function buildPostScriptPrompt(
  emailBody: string,
  productName: string,
  mainBenefit: string,
  cta: string
): string {
  return `You are a direct response copywriting expert.

Given this email, create a compelling P.S. section that:
1. Restates the main benefit in a fresh, memorable way
2. Adds urgency or mentions a bonus/deadline
3. Repeats the call-to-action clearly

EMAIL BODY:
${emailBody}

PRODUCT: ${productName}
MAIN BENEFIT: ${mainBenefit}
CALL-TO-ACTION: ${cta}

Return ONLY the P.S. section text (including "P.S."). Keep it concise and punchy. Maximum 2-3 sentences.

Example format:
P.S. [benefit reminder + urgency + CTA]`;
}
