'use client';

import { CheckCircle2 } from 'lucide-react';

interface PromptQualityScoreProps {
  scores: {
    clarity: number;
    specificity: number;
    structure: number;
    examples: number;
    overall: number;
  };
}

export default function PromptQualityScore({ scores }: PromptQualityScoreProps) {
  const dimensions = [
    {
      name: 'Clarity',
      nameKo: '명확성',
      score: scores.clarity,
      weight: 30,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      description: 'Clear task, output format, and precise language',
    },
    {
      name: 'Specificity',
      nameKo: '구체성',
      score: scores.specificity,
      weight: 30,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      description: 'Detailed context, constraints, and requirements',
    },
    {
      name: 'Structure',
      nameKo: '구조',
      score: scores.structure,
      weight: 25,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      description: 'Logical organization and effective formatting',
    },
    {
      name: 'Examples',
      nameKo: '예시 활용',
      score: scores.examples,
      weight: 15,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      description: 'Relevant, diverse, and well-integrated examples',
    },
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-indigo-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Prompt Quality Dimensions</h3>
      <p className="mt-1 text-sm text-gray-600">
        Based on best practices from Claude, OpenAI, and Gemini
      </p>

      <div className="mt-6 space-y-6">
        {dimensions.map((dimension) => (
          <div key={dimension.name}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {dimension.name} ({dimension.nameKo})
                  </h4>
                  <span className="text-xs text-gray-500">{dimension.weight}% weight</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{dimension.description}</p>
              </div>
              <div className={`ml-4 text-2xl font-bold ${getScoreColor(dimension.score)}`}>
                {dimension.score}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className={`h-3 w-full rounded-full ${dimension.lightColor}`}>
                <div
                  className={`h-3 rounded-full ${dimension.color} transition-all duration-500`}
                  style={{ width: `${dimension.score}%` }}
                />
              </div>
            </div>

            {/* Score indicators */}
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span className="text-gray-400">|</span>
              <span>25</span>
              <span className="text-gray-400">|</span>
              <span>50</span>
              <span className="text-gray-400">|</span>
              <span>75</span>
              <span className="text-gray-400">|</span>
              <span>100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scoring Explanation */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Scoring Guide</h4>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>90-100: Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>80-89: Very Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>70-79: Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span>60-69: Fair</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <span>50-59: Needs Improvement</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span>0-49: Poor</span>
          </div>
        </div>
      </div>

      {/* Unified Criteria Info */}
      <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex items-start space-x-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
          <div className="text-xs text-indigo-900">
            <p className="font-semibold">Unified Evaluation Criteria</p>
            <p className="mt-1 text-indigo-800">
              This assessment uses a unified framework consolidating best practices from
              Claude (Anthropic), GPT (OpenAI), and Gemini (Google) to ensure consistent,
              comprehensive prompt quality evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
