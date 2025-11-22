'use client'

import React, { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  mockQuizzes,
  mockSubmissions,
  getDifficultyColor,
  getCategoryColor,
  getStatusColor,
} from '@/lib/mockChallenges'

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const quiz = mockQuizzes.find((c) => c.quiz_id === params.id)
  const submissions = mockSubmissions.filter((s) => s.quiz_id === params.id)

  const [submissionType, setSubmissionType] = useState<'github' | 'url' | 'file'>('github')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AIQ Assessment Not Found</h1>
          <Link href="/challenges" className="text-indigo-600 hover:underline">
            ← Back to AIQ Assessment
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert('AIQ Assessment submitted! It will be evaluated by AI.')
    setShowSubmitForm(false)
    setIsSubmitting(false)
    setSubmissionUrl('')
    setSelectedFile(null)
    setSubmissionType('github')
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/challenges"
          className="text-indigo-600 hover:text-indigo-700 mb-6 inline-flex items-center gap-2"
        >
          ← Back to AIQ Assessment
        </Link>

        {/* Assessment Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                    quiz.difficulty
                  )}`}
                >
                  {quiz.difficulty}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    quiz.category
                  )}`}
                >
                  {quiz.category}
                </span>
                {quiz.status && quiz.status !== 'not_started' && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      quiz.status
                    )}`}
                  >
                    {quiz.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600 text-lg">{quiz.description}</p>
            </div>
            <div className="text-right ml-8">
              <div className="text-4xl font-bold text-indigo-600 mb-1">
                {quiz.points}
              </div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-600 pt-4 border-t">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Time Limit: {quiz.time_limit_minutes} minutes
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {quiz.test_cases} Test Cases
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {quiz.participants} Participants
            </div>
            <div>Success Rate: {quiz.success_rate}%</div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <ul className="space-y-3">
            {quiz.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
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
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {quiz.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {!showSubmitForm && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-6"
          >
            Start Challenge →
          </button>
        )}

        {/* Submission Form */}
        {showSubmitForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Solution</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="github"
                    checked={submissionType === 'github'}
                    onChange={(e) => setSubmissionType(e.target.value as 'github')}
                    className="mr-2"
                  />
                  GitHub Repository
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="url"
                    checked={submissionType === 'url'}
                    onChange={(e) => setSubmissionType(e.target.value as 'url')}
                    className="mr-2"
                  />
                  Website / Media URL
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={submissionType === 'file'}
                    onChange={(e) => setSubmissionType(e.target.value as 'file')}
                    className="mr-2"
                  />
                  File Upload
                </label>
              </div>
            </div>

            <div className="mb-6">
              {submissionType === 'file' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: ZIP, PDF, PNG, JPG, MP4 (Max 50MB)
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {submissionType === 'github' ? 'GitHub Repository URL' : 'Submission URL'}
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder={
                      submissionType === 'github'
                        ? 'https://github.com/username/repo'
                        : 'https://example.com/project'
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  {submissionType === 'github' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Make sure your repository is public and includes a README
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Previous Submissions */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Submissions</h2>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.submission_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <a
                      href={submission.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {submission.github_url}
                    </a>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${submission.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : submission.status === 'evaluating'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Submitted: {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                  {submission.score && (
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-indigo-600">
                        {submission.score}
                      </span>
                      <span className="text-gray-600">/100</span>
                    </div>
                  )}
                  {submission.feedback && (
                    <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 mb-3">
                      <strong>Feedback:</strong> {submission.feedback}
                    </div>
                  )}
                  {submission.status === 'completed' && submission.evaluation_result && (
                    <Link
                      href={`/challenges/results/${submission.submission_id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      View Detailed Results →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
