import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️ Anthropic API key not configured');
}

export const anthropic = new Anthropic({
  apiKey,
});

/**
 * Evaluate code using Claude API
 */
export async function evaluateCodeWithClaude(
  code: string,
  challenge: any
): Promise<any> {
  const prompt = `You are an expert code reviewer and evaluator. Please analyze the following code submission for a coding challenge and provide a detailed evaluation.

Challenge Title: ${challenge.title}
Challenge Description: ${challenge.description}
Challenge Requirements: ${JSON.stringify(challenge.requirements, null, 2)}

Submitted Code:
\`\`\`
${code}
\`\`\`

Please provide your evaluation in the following JSON format:
{
  "overall_score": <number 0-100>,
  "functionality_score": <number 0-100>,
  "code_quality_score": <number 0-100>,
  "performance_score": <number 0-100>,
  "tests_passed": <number>,
  "tests_failed": <number>,
  "test_results": [
    {
      "name": "<test name>",
      "status": "passed" or "failed",
      "message": "<optional message>"
    }
  ],
  "ai_feedback": {
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "improvements": ["<improvement 1>", "<improvement 2>", ...],
    "bestPractices": ["<best practice 1>", "<best practice 2>", ...],
    "security": ["<security issue 1>", "<security issue 2>", ...]
  },
  "detailed_analysis": "<detailed text analysis>"
}

Be thorough and constructive in your feedback.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      // Extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]);
        return evaluation;
      }
    }

    throw new Error('Failed to parse Claude response');
  } catch (error) {
    console.error('Error evaluating code with Claude:', error);
    throw error;
  }
}
