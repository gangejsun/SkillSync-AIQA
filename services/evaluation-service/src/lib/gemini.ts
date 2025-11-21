/**
 * Google Gemini API Integration
 *
 * Evaluates code submissions and prompts using Google's Gemini AI model
 * with unified prompt quality criteria.
 */

import {
  generateEvaluationPrompt,
  calculateOverallScore,
  PromptQualityScore,
} from './prompt-evaluation-criteria';

// Type definitions for Gemini API
interface GeminiConfig {
  apiKey: string;
  model: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

interface EvaluationResult {
  scores: PromptQualityScore;
  feedback: {
    clarity: DimensionFeedback;
    specificity: DimensionFeedback;
    structure: DimensionFeedback;
    examples: DimensionFeedback;
  };
  overallAssessment: string;
  topRecommendations: string[];
  metadata: {
    model: string;
    tokensUsed: number;
    evaluatedAt: string;
  };
}

interface DimensionFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

/**
 * Initialize Gemini configuration
 */
function getGeminiConfig(): GeminiConfig {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  return {
    apiKey,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest',
  };
}

/**
 * Call Gemini API with retry logic
 */
async function callGeminiAPI(
  prompt: string,
  config: GeminiConfig,
  retries = 3
): Promise<GeminiResponse> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${endpoint}?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2, // Lower temperature for more consistent evaluations
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error (${response.status}): ${JSON.stringify(errorData)}`
        );
      }

      const data: GeminiResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Gemini API attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Failed to call Gemini API after all retries');
}

/**
 * Parse Gemini response and extract evaluation data
 */
function parseEvaluationResponse(response: GeminiResponse): {
  evaluation: EvaluationResult;
  tokensUsed: number;
} {
  // Extract text from response
  const text = response.candidates[0]?.content?.parts[0]?.text;
  if (!text) {
    throw new Error('No text content in Gemini response');
  }

  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonText = jsonMatch ? jsonMatch[1] : text;

  // Parse JSON
  let parsedData: any;
  try {
    parsedData = JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON:', text);
    throw new Error('Failed to parse evaluation response as JSON');
  }

  // Validate and normalize scores
  const scores = {
    clarity: Math.max(0, Math.min(100, parsedData.scores?.clarity || 0)),
    specificity: Math.max(0, Math.min(100, parsedData.scores?.specificity || 0)),
    structure: Math.max(0, Math.min(100, parsedData.scores?.structure || 0)),
    examples: Math.max(0, Math.min(100, parsedData.scores?.examples || 0)),
    overall: 0,
  };

  // Calculate overall score using weighted formula
  scores.overall = Math.round(calculateOverallScore(scores));

  // Get tokens used
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  const evaluation: EvaluationResult = {
    scores,
    feedback: parsedData.feedback || {
      clarity: { score: scores.clarity, strengths: [], improvements: [], recommendations: [] },
      specificity: { score: scores.specificity, strengths: [], improvements: [], recommendations: [] },
      structure: { score: scores.structure, strengths: [], improvements: [], recommendations: [] },
      examples: { score: scores.examples, strengths: [], improvements: [], recommendations: [] },
    },
    overallAssessment: parsedData.overallAssessment || 'No assessment provided',
    topRecommendations: parsedData.topRecommendations || [],
    metadata: {
      model: 'gemini',
      tokensUsed,
      evaluatedAt: new Date().toISOString(),
    },
  };

  return { evaluation, tokensUsed };
}

/**
 * Evaluate a prompt using Gemini API with unified criteria
 */
export async function evaluatePromptWithGemini(
  submittedPrompt: string,
  challenge: {
    title: string;
    description: string;
    assessment_type: 'coding' | 'prompt_engineering';
  }
): Promise<EvaluationResult> {
  const config = getGeminiConfig();

  // Generate evaluation prompt using unified criteria
  const evaluationPrompt = generateEvaluationPrompt(
    submittedPrompt,
    `${challenge.title}\n\n${challenge.description}`,
    challenge.assessment_type
  );

  // Call Gemini API
  const response = await callGeminiAPI(evaluationPrompt, config);

  // Parse and return evaluation
  const { evaluation } = parseEvaluationResponse(response);

  return evaluation;
}

/**
 * Evaluate code submission with Gemini
 */
export async function evaluateCodeWithGemini(
  code: string,
  challenge: {
    title: string;
    description: string;
    difficulty: string;
    category: string;
  }
): Promise<{
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  tokensUsed: number;
}> {
  const config = getGeminiConfig();

  const prompt = `You are an expert code reviewer. Evaluate the following code submission for a coding challenge.

## Challenge Details
Title: ${challenge.title}
Difficulty: ${challenge.difficulty}
Category: ${challenge.category}
Description: ${challenge.description}

## Submitted Code
\`\`\`
${code}
\`\`\`

## Evaluation Criteria
1. **Correctness** (40%): Does the code solve the problem correctly?
2. **Code Quality** (30%): Is the code clean, readable, and well-structured?
3. **Efficiency** (20%): Is the solution efficient in terms of time and space complexity?
4. **Best Practices** (10%): Does it follow language best practices and conventions?

## Response Format
Provide your evaluation in JSON format:

\`\`\`json
{
  "score": <0-100>,
  "feedback": "Overall feedback summary",
  "strengths": ["strength 1", "strength 2", "..."],
  "improvements": ["improvement 1", "improvement 2", "..."],
  "correctness": {
    "score": <0-100>,
    "comment": "..."
  },
  "codeQuality": {
    "score": <0-100>,
    "comment": "..."
  },
  "efficiency": {
    "score": <0-100>,
    "comment": "..."
  },
  "bestPractices": {
    "score": <0-100>,
    "comment": "..."
  }
}
\`\`\``;

  const response = await callGeminiAPI(prompt, config);

  // Extract text from response
  const text = response.candidates[0]?.content?.parts[0]?.text;
  if (!text) {
    throw new Error('No text content in Gemini response');
  }

  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonText = jsonMatch ? jsonMatch[1] : text;

  // Parse JSON
  let parsedData: any;
  try {
    parsedData = JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON:', text);
    throw new Error('Failed to parse evaluation response as JSON');
  }

  return {
    score: Math.max(0, Math.min(100, parsedData.score || 0)),
    feedback: parsedData.feedback || 'No feedback provided',
    strengths: parsedData.strengths || [],
    improvements: parsedData.improvements || [],
    tokensUsed: response.usageMetadata?.totalTokenCount || 0,
  };
}

/**
 * Estimate API cost based on tokens used
 * Gemini 1.5 Pro pricing (as of 2024):
 * - Input: $0.00125 per 1K tokens
 * - Output: $0.005 per 1K tokens
 * Using average estimate of $0.003 per 1K tokens
 */
export function estimateAPICost(tokensUsed: number): number {
  const costPer1KTokens = 0.003;
  return (tokensUsed / 1000) * costPer1KTokens;
}

/**
 * Get available Gemini models
 */
export function getAvailableModels(): string[] {
  return [
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-1.0-pro',
  ];
}
