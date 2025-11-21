'use client';

import { CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import PromptQualityScore from './PromptQualityScore';

interface DimensionFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

interface DetailedFeedbackProps {
  feedback: {
    id: string;
    clarity_score: number;
    specificity_score: number;
    structure_score: number;
    examples_score: number;
    overall_quality_score: number;
    clarity_feedback: DimensionFeedback;
    specificity_feedback: DimensionFeedback;
    structure_feedback: DimensionFeedback;
    examples_feedback: DimensionFeedback;
    overall_assessment: string;
    top_recommendations: string[];
    evaluated_by: string;
    created_at: string;
  };
  challenge: {
    title: string;
    assessment_type: 'coding' | 'prompt_engineering';
  };
}

export default function DetailedFeedback({ feedback, challenge }: DetailedFeedbackProps) {
  const dimensions = [
    {
      name: 'Clarity',
      nameKo: '명확성',
      score: feedback.clarity_score,
      weight: 30,
      feedback: feedback.clarity_feedback,
      description: 'How clear and unambiguous the prompt is',
    },
    {
      name: 'Specificity',
      nameKo: '구체성',
      score: feedback.specificity_score,
      weight: 30,
      feedback: feedback.specificity_feedback,
      description: 'Level of detail and contextual information provided',
    },
    {
      name: 'Structure',
      nameKo: '구조',
      score: feedback.structure_score,
      weight: 25,
      feedback: feedback.structure_feedback,
      description: 'Organization and formatting of the prompt',
    },
    {
      name: 'Examples',
      nameKo: '예시 활용',
      score: feedback.examples_score,
      weight: 15,
      feedback: feedback.examples_feedback,
      description: 'Quality and relevance of provided examples',
    },
  ];

  const getScoreLevel = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 80) return { label: 'Very Good', color: 'text-blue-600' };
    if (score >= 70) return { label: 'Good', color: 'text-indigo-600' };
    if (score >= 60) return { label: 'Fair', color: 'text-yellow-600' };
    if (score >= 50) return { label: 'Needs Improvement', color: 'text-orange-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const overallLevel = getScoreLevel(feedback.overall_quality_score);

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Overall Quality Score</h2>
            <p className="mt-1 text-gray-600">
              Based on unified prompt evaluation criteria
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600">
              {feedback.overall_quality_score}
            </div>
            <div className={`mt-1 text-sm font-medium ${overallLevel.color}`}>
              {overallLevel.label}
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Quality Scores */}
      <PromptQualityScore
        scores={{
          clarity: feedback.clarity_score,
          specificity: feedback.specificity_score,
          structure: feedback.structure_score,
          examples: feedback.examples_score,
          overall: feedback.overall_quality_score,
        }}
      />

      {/* Overall Assessment */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Overall Assessment</h3>
        <p className="mt-3 whitespace-pre-wrap text-gray-700">
          {feedback.overall_assessment}
        </p>
      </div>

      {/* Top Recommendations */}
      {feedback.top_recommendations && feedback.top_recommendations.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Recommendations for Improvement
          </h3>
          <ul className="mt-3 space-y-2">
            {feedback.top_recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                  {index + 1}
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Dimension Feedback */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Feedback by Dimension
        </h3>

        {dimensions.map((dimension) => (
          <div
            key={dimension.name}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {dimension.name} ({dimension.nameKo})
                </h4>
                <p className="text-sm text-gray-600">{dimension.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">
                  {dimension.score}
                </div>
                <div className="text-xs text-gray-500">{dimension.weight}% weight</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${dimension.score}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            {dimension.feedback.strengths && dimension.feedback.strengths.length > 0 && (
              <div className="mt-4">
                <h5 className="flex items-center space-x-2 text-sm font-semibold text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Strengths</span>
                </h5>
                <ul className="mt-2 space-y-1">
                  {dimension.feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {dimension.feedback.improvements &&
              dimension.feedback.improvements.length > 0 && (
                <div className="mt-4">
                  <h5 className="flex items-center space-x-2 text-sm font-semibold text-orange-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>Areas for Improvement</span>
                  </h5>
                  <ul className="mt-2 space-y-1">
                    {dimension.feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Recommendations */}
            {dimension.feedback.recommendations &&
              dimension.feedback.recommendations.length > 0 && (
                <div className="mt-4">
                  <h5 className="flex items-center space-x-2 text-sm font-semibold text-indigo-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>Recommendations</span>
                  </h5>
                  <ul className="mt-2 space-y-1">
                    {dimension.feedback.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Evaluated by: <span className="font-medium">{feedback.evaluated_by}</span>
          </span>
          <span>
            {new Date(feedback.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
