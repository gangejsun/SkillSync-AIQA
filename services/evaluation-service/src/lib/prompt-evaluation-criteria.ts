/**
 * Unified Prompt Evaluation Criteria
 *
 * Consolidated best practices from Claude (Anthropic), OpenAI, and Google Gemini
 * to create a single evaluation framework for prompt quality assessment.
 *
 * This framework applies to both prompt engineering tasks and coding tasks
 * where prompts are used to generate solutions.
 */

export interface PromptQualityScore {
  clarity: number;        // 0-100
  specificity: number;    // 0-100
  structure: number;      // 0-100
  examples: number;       // 0-100
  overall: number;        // Weighted average
}

export interface EvaluationCriteria {
  dimension: string;
  weight: number;
  criteria: CriterionItem[];
}

export interface CriterionItem {
  aspect: string;
  description: string;
  positiveIndicators: string[];
  negativeIndicators: string[];
}

/**
 * Core evaluation dimensions with weights
 */
export const EVALUATION_WEIGHTS = {
  clarity: 0.30,      // 30%
  specificity: 0.30,  // 30%
  structure: 0.25,    // 25%
  examples: 0.15,     // 15%
};

/**
 * 1. Clarity (명확성) - 30%
 * The prompt should clearly communicate the task, desired output, and constraints.
 *
 * Best practices from:
 * - Claude: "Be clear and direct"
 * - OpenAI: "Write clear instructions"
 * - Gemini: "Be specific and clear about what you want"
 */
export const CLARITY_CRITERIA: EvaluationCriteria = {
  dimension: 'Clarity',
  weight: EVALUATION_WEIGHTS.clarity,
  criteria: [
    {
      aspect: 'Task Description',
      description: 'The main task or goal is explicitly stated',
      positiveIndicators: [
        'Clear verb describing the action (e.g., "Generate", "Analyze", "Create")',
        'Unambiguous task statement',
        'Primary objective is immediately obvious',
        'No vague or abstract language',
      ],
      negativeIndicators: [
        'Task is implied but not stated',
        'Multiple interpretations possible',
        'Ambiguous verbs (e.g., "handle", "deal with")',
        'Overly abstract or philosophical language',
      ],
    },
    {
      aspect: 'Output Format',
      description: 'The expected output format is clearly defined',
      positiveIndicators: [
        'Explicit format specification (JSON, markdown, code, etc.)',
        'Structure of output is described',
        'Length or size requirements stated',
        'Field names or sections specified',
      ],
      negativeIndicators: [
        'No mention of expected format',
        'Format is assumed or implied',
        'Unclear whether text, code, or structured data is expected',
      ],
    },
    {
      aspect: 'Language Precision',
      description: 'Language is precise and unambiguous',
      positiveIndicators: [
        'Technical terms used correctly',
        'Quantifiable metrics when appropriate',
        'Specific nouns instead of pronouns',
        'No unnecessary jargon or buzzwords',
      ],
      negativeIndicators: [
        'Vague words like "good", "better", "optimize"',
        'Unclear pronouns (it, this, that)',
        'Mixed terminology for same concept',
        'Unnecessarily complex language',
      ],
    },
  ],
};

/**
 * 2. Specificity (구체성) - 30%
 * The prompt should provide specific context, constraints, and requirements.
 *
 * Best practices from:
 * - Claude: "Provide context and details"
 * - OpenAI: "Provide reference text" and "Specify steps"
 * - Gemini: "Add context" and "Give examples"
 */
export const SPECIFICITY_CRITERIA: EvaluationCriteria = {
  dimension: 'Specificity',
  weight: EVALUATION_WEIGHTS.specificity,
  criteria: [
    {
      aspect: 'Contextual Information',
      description: 'Sufficient context is provided for the task',
      positiveIndicators: [
        'Background information included',
        'Domain or industry context specified',
        'User persona or audience defined',
        'Relevant constraints mentioned',
      ],
      negativeIndicators: [
        'No context provided',
        'Assumes too much prior knowledge',
        'Missing critical background information',
      ],
    },
    {
      aspect: 'Constraints and Requirements',
      description: 'Explicit constraints and requirements are stated',
      positiveIndicators: [
        'Technical constraints specified (language, framework, version)',
        'Performance requirements defined',
        'Edge cases mentioned',
        'Success criteria stated',
        'Limitations or boundaries clear',
      ],
      negativeIndicators: [
        'No constraints specified',
        'Open-ended without boundaries',
        'Edge cases not considered',
        'Success criteria undefined',
      ],
    },
    {
      aspect: 'Detail Level',
      description: 'Appropriate level of detail for the task',
      positiveIndicators: [
        'Key parameters specified with values',
        'Important steps detailed',
        'Specific data formats or schemas provided',
        'Concrete measurements or thresholds',
      ],
      negativeIndicators: [
        'Too high-level or abstract',
        'Missing important details',
        'Leaves too much to interpretation',
      ],
    },
  ],
};

/**
 * 3. Structure (구조) - 25%
 * The prompt should be well-organized and follow a logical flow.
 *
 * Best practices from:
 * - Claude: "Use structured formats" (XML tags, JSON, markdown)
 * - OpenAI: "Split complex tasks into simpler subtasks"
 * - Gemini: "Structure prompts clearly"
 */
export const STRUCTURE_CRITERIA: EvaluationCriteria = {
  dimension: 'Structure',
  weight: EVALUATION_WEIGHTS.structure,
  criteria: [
    {
      aspect: 'Organization',
      description: 'Prompt is logically organized and easy to follow',
      positiveIndicators: [
        'Clear sections or paragraphs',
        'Logical flow from context to task to output',
        'Related information grouped together',
        'Headers or labels for different parts',
      ],
      negativeIndicators: [
        'Wall of text with no structure',
        'Jumping between topics',
        'Repeated information',
        'Unclear organization',
      ],
    },
    {
      aspect: 'Step-by-Step Breakdown',
      description: 'Complex tasks are broken down into steps',
      positiveIndicators: [
        'Numbered or bulleted steps',
        'Sequential flow indicated',
        'Subtasks clearly defined',
        'Process or workflow outlined',
      ],
      negativeIndicators: [
        'Complex task presented as single instruction',
        'No breakdown of subtasks',
        'Unclear order of operations',
      ],
    },
    {
      aspect: 'Formatting',
      description: 'Proper use of formatting for readability',
      positiveIndicators: [
        'Code blocks for code',
        'Markdown or structured format used effectively',
        'XML/JSON tags for structured data',
        'Visual hierarchy with headers',
        'Lists for multiple items',
      ],
      negativeIndicators: [
        'No formatting used',
        'Inconsistent formatting',
        'Poor use of whitespace',
        'Code mixed with prose',
      ],
    },
  ],
};

/**
 * 4. Examples (예시 활용) - 15%
 * The prompt should include relevant examples when appropriate.
 *
 * Best practices from:
 * - Claude: "Use examples (multishot prompting)"
 * - OpenAI: "Provide examples" and "Few-shot prompting"
 * - Gemini: "Show, don't tell" with examples
 */
export const EXAMPLES_CRITERIA: EvaluationCriteria = {
  dimension: 'Examples',
  weight: EVALUATION_WEIGHTS.examples,
  criteria: [
    {
      aspect: 'Example Presence',
      description: 'Examples are provided when they would be helpful',
      positiveIndicators: [
        'Input/output examples included',
        'Sample code or data provided',
        'Edge case examples shown',
        'Multiple examples for variety',
      ],
      negativeIndicators: [
        'No examples when they would help',
        'Only description without demonstration',
      ],
    },
    {
      aspect: 'Example Quality',
      description: 'Examples are clear, relevant, and diverse',
      positiveIndicators: [
        'Examples are realistic',
        'Cover different scenarios',
        'Show both positive and negative cases',
        'Examples are well-formatted',
        'Examples match the specified format',
      ],
      negativeIndicators: [
        'Trivial or toy examples only',
        'All examples too similar',
        'Examples don\'t match requirements',
        'Poorly formatted examples',
      ],
    },
    {
      aspect: 'Example Integration',
      description: 'Examples are well-integrated into the prompt',
      positiveIndicators: [
        'Examples clearly labeled',
        'Explanation of what makes examples good',
        'Examples build on each other',
        'Clear separation from instructions',
      ],
      negativeIndicators: [
        'Examples confused with instructions',
        'No labels or context for examples',
        'Examples contradict instructions',
      ],
    },
  ],
};

/**
 * All criteria combined
 */
export const ALL_CRITERIA: EvaluationCriteria[] = [
  CLARITY_CRITERIA,
  SPECIFICITY_CRITERIA,
  STRUCTURE_CRITERIA,
  EXAMPLES_CRITERIA,
];

/**
 * Calculate overall score from dimension scores
 */
export function calculateOverallScore(scores: Omit<PromptQualityScore, 'overall'>): number {
  return (
    scores.clarity * EVALUATION_WEIGHTS.clarity +
    scores.specificity * EVALUATION_WEIGHTS.specificity +
    scores.structure * EVALUATION_WEIGHTS.structure +
    scores.examples * EVALUATION_WEIGHTS.examples
  );
}

/**
 * Get score level description
 */
export function getScoreLevel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Get detailed feedback template for each dimension
 */
export function getFeedbackTemplate(dimension: string): string {
  const templates: Record<string, string> = {
    clarity: `
## Clarity Assessment

### Strengths:
- [List what was clear and well-stated]

### Areas for Improvement:
- [List what could be clearer]

### Recommendations:
- Be more explicit about [specific aspect]
- Define [term or concept] clearly
- Remove ambiguous phrases like [examples]
`,
    specificity: `
## Specificity Assessment

### Strengths:
- [List specific details that were helpful]

### Areas for Improvement:
- [List what needs more detail]

### Recommendations:
- Add specific values for [parameter]
- Include constraints like [examples]
- Specify [missing detail]
`,
    structure: `
## Structure Assessment

### Strengths:
- [List organizational strengths]

### Areas for Improvement:
- [List structural issues]

### Recommendations:
- Break down [complex part] into steps
- Use headers to separate [sections]
- Format [element] as [format type]
`,
    examples: `
## Examples Assessment

### Strengths:
- [List effective examples]

### Areas for Improvement:
- [List missing or weak examples]

### Recommendations:
- Add examples for [scenario]
- Show edge cases like [examples]
- Diversify examples to cover [cases]
`,
  };

  return templates[dimension] || '';
}

/**
 * Generate evaluation prompt for Gemini API
 */
export function generateEvaluationPrompt(
  submittedPrompt: string,
  taskDescription: string,
  assessmentType: 'prompt_engineering' | 'coding'
): string {
  const typeContext = assessmentType === 'prompt_engineering'
    ? 'This is a prompt engineering task. Evaluate the quality of the prompt itself.'
    : 'This is a coding task. Evaluate the prompt used to generate or guide the code solution.';

  return `You are an expert in prompt engineering and AI interaction. Evaluate the following prompt based on our unified quality criteria.

${typeContext}

## Task Description
${taskDescription}

## Submitted Prompt
${submittedPrompt}

## Evaluation Criteria

Evaluate the prompt on these four dimensions (0-100 scale):

### 1. Clarity (30% weight)
- Is the task clearly stated?
- Is the desired output format explicit?
- Is the language precise and unambiguous?

Consider:
${CLARITY_CRITERIA.criteria.map(c => `- ${c.aspect}: ${c.description}`).join('\n')}

### 2. Specificity (30% weight)
- Is sufficient context provided?
- Are constraints and requirements explicit?
- Is the appropriate level of detail included?

Consider:
${SPECIFICITY_CRITERIA.criteria.map(c => `- ${c.aspect}: ${c.description}`).join('\n')}

### 3. Structure (25% weight)
- Is the prompt well-organized?
- Are complex tasks broken into steps?
- Is formatting used effectively?

Consider:
${STRUCTURE_CRITERIA.criteria.map(c => `- ${c.aspect}: ${c.description}`).join('\n')}

### 4. Examples (15% weight)
- Are examples provided when helpful?
- Are examples clear, relevant, and diverse?
- Are examples well-integrated?

Consider:
${EXAMPLES_CRITERIA.criteria.map(c => `- ${c.aspect}: ${c.description}`).join('\n')}

## Response Format

Provide your evaluation in the following JSON format:

\`\`\`json
{
  "scores": {
    "clarity": <0-100>,
    "specificity": <0-100>,
    "structure": <0-100>,
    "examples": <0-100>
  },
  "feedback": {
    "clarity": {
      "score": <0-100>,
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "recommendations": ["recommendation 1", "recommendation 2"]
    },
    "specificity": {
      "score": <0-100>,
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "recommendations": ["recommendation 1", "recommendation 2"]
    },
    "structure": {
      "score": <0-100>,
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "recommendations": ["recommendation 1", "recommendation 2"]
    },
    "examples": {
      "score": <0-100>,
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "recommendations": ["recommendation 1", "recommendation 2"]
    }
  },
  "overallAssessment": "A comprehensive summary of the prompt quality and key takeaways",
  "topRecommendations": [
    "Most important recommendation 1",
    "Most important recommendation 2",
    "Most important recommendation 3"
  ]
}
\`\`\`

Provide detailed, actionable feedback for each dimension.`;
}
