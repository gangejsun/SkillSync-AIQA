'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockSubmissions, mockQuizzes } from '@/lib/mockQuizzes'

export default function EvaluationResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const submission = mockSubmissions.find((s) => s.submission_id === params.id)
  const quiz = submission
    ? mockQuizzes.find((c) => c.quiz_id === submission.quiz_id)
    : null

  if (!submission || !submission.evaluation_result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            AIQ Assessment Results Not Found
          </h1>
          <Link href="/challenges" className="text-indigo-600 hover:underline">
            ← Back to AIQ Assessment
          </Link>
        </div>
      </div>
    )
  }

  const result = submission.evaluation_result
  const passedTests = result.test_results.filter((t) => t.status === 'passed').length
  const totalTests = result.test_results.length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link
          href={`/challenges/${submission.quiz_id}`}
          className="text-indigo-600 hover:text-indigo-700 mb-6 inline-flex items-center gap-2"
        >
          ← Back to Assessment
        </Link>

        {/* Overall Score Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AIQ Assessment Results
              </h1>
              <p className="text-gray-600">{challenge?.title}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span>Submitted: {new Date(submission.submitted_at).toLocaleString()}</span>
                <span>•</span>
                <span>Evaluated: {new Date(result.evaluated_at).toLocaleString()}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {result.overall_score}
              </div>
              <div className="text-lg text-gray-600">Overall Score</div>
              <a
                href={submission.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                View Code on GitHub
              </a>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {result.code_quality.score}
              </div>
              <div className="text-sm text-gray-700">Code Quality</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {result.performance.score}
              </div>
              <div className="text-sm text-gray-700">Performance</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {passedTests}/{totalTests}
              </div>
              <div className="text-sm text-gray-700">Tests Passed</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="space-y-3">
            {result.test_results.map((test) => (
              <div
                key={test.test_id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  test.status === 'passed'
                    ? 'bg-green-50 border-green-200'
                    : test.status === 'failed'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {test.status === 'passed' ? (
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : test.status === 'failed' ? (
                    <svg
                      className="w-6 h-6 text-red-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{test.name}</div>
                    {test.error_message && (
                      <div className="text-sm text-red-600 mt-1">{test.error_message}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-gray-600">{test.execution_time_ms}ms</div>
                  <div className="font-semibold text-gray-900">
                    {test.score}/{test.max_score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Code Quality Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Code Quality</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Maintainability</span>
                  <span className="font-semibold">{result.code_quality.maintainability}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${result.code_quality.maintainability}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Complexity</span>
                  <span className="font-semibold">{result.code_quality.complexity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${Math.min(result.code_quality.complexity * 5, 100)}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Security Issues</span>
                  <span
                    className={`font-semibold ${
                      result.code_quality.security_issues === 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {result.code_quality.security_issues}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Code Smells</span>
                  <span className="font-semibold text-gray-900">
                    {result.code_quality.code_smells}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Duplications</span>
                  <span className="font-semibold text-gray-900">
                    {result.code_quality.duplications}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Comment Coverage</span>
                  <span className="font-semibold text-gray-900">
                    {result.code_quality.comments.coverage_percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Avg Response Time</span>
                <span className="text-lg font-semibold text-gray-900">
                  {result.performance.avg_response_time_ms}ms
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Memory Usage</span>
                <span className="text-lg font-semibold text-gray-900">
                  {result.performance.memory_usage_mb}MB
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">CPU Usage</span>
                <span className="text-lg font-semibold text-gray-900">
                  {result.performance.cpu_usage_percentage}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Requests/Second</span>
                <span className="text-lg font-semibold text-gray-900">
                  {result.performance.requests_per_second}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Evaluation Feedback</h2>

          {/* Overall Comment */}
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-gray-800 leading-relaxed">{result.ai_feedback.overall_comment}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Strengths
              </h3>
              <ul className="space-y-2">
                {result.ai_feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {result.ai_feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Practices */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Best Practices Followed
              </h3>
              <ul className="space-y-2">
                {result.ai_feedback.best_practices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Notes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Security
              </h3>
              <ul className="space-y-2">
                {result.ai_feedback.security_notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/challenges"
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center"
          >
            Browse More Challenges
          </Link>
          <button
            onClick={() => router.push(`/challenges/${submission.quiz_id}`)}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
