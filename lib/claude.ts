import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Cache the persona content so we don't read it from disk every time
let cachedPersona = '';

function getPersona() {
  if (cachedPersona) return cachedPersona;
  try {
    const personaPath = path.join(process.cwd(), 'prompts', 'code-reviewer-persona.md');
    cachedPersona = fs.readFileSync(personaPath, 'utf8');
    return cachedPersona;
  } catch (error) {
    console.error('Failed to read persona file:', error);
    // Fallback minimal persona
    return `You are Code Reviewer, an expert who provides thorough, constructive code reviews.
    You focus on correctness, security, maintainability, and performance.`;
  }
}

export async function generateReview(code: string, memoriesContext: string = '') {
  const persona = getPersona();

  const systemPrompt = `
${persona}

---
TEAM HISTORY & MEMORY:
The following are past review feedback items and team rules previously identified for this codebase.
If the current code repeats these mistakes, flag them as "⚠️ recurring — flagged before".
${memoriesContext ? memoriesContext : "No relevant past memory found."}

---
OUTPUT INSTRUCTIONS:
Return ONLY a JSON object with two keys:
1. "comments": Array of objects, each with:
   - "id": string (unique identifier)
   - "severity": "blocker" | "suggestion" | "nit"
   - "title": string (short summary)
   - "description": string (detailed reasoning and suggestion)
   - "line": number (approximate line number, optional)
   - "isRecurring": boolean (true if this relates to the TEAM HISTORY provided)
2. "newInsights": Array of strings (Any new, high-level patterns or architectural rules you noticed in this code that should be remembered for the future. Don't include trivial things, only team-level rules.)
`;

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please review the following code snippet:\n\n\`\`\`\n${code}\n\`\`\``
        }
      ],
      temperature: 0,
    });

    const responseText = (msg.content[0] as any).text;

    // Extract JSON if it's wrapped in markdown code blocks
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to generate review from Claude API');
  }
}