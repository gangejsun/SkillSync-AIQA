'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  mockChallenges,
  getDifficultyColor,
  getCategoryColor,
  getStatusColor,
  type DifficultyLevel,
  type ChallengeCategory,
} from '@/lib/mockChallenges'

export default function ChallengesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all')

  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (selectedDifficulty !== 'all' && challenge.difficulty !== selectedDifficulty) {
      return false
    }
    if (selectedCategory !== 'all' && challenge.category !== selectedCategory) {
      return false
    }
    return true
  })

  const stats = {
    total: mockChallenges.length,
    completed: mockChallenges.filter((c) => c.status === 'completed').length,
    inProgress: mockChallenges.filter((c) => c.status === 'in_progress').length,
    totalPoints: mockChallenges
      .filter((c) => c.status === 'completed')
      .reduce((sum, c) => sum + c.points, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AIQ Assessment
          </h1>
          <p className="text-gray-600">
            AI 활용 능력을 측정하는 실전 코딩 검사
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Challenges</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Points Earned</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalPoints}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDifficulty === diff
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'development', 'debugging', 'optimization', 'architecture', 'testing'] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Challenge List */}
        <div className="flex flex-col gap-6">
          {filteredChallenges.map((challenge) => (
            <Link
              key={challenge.challenge_id}
              href={`/challenges/${challenge.challenge_id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {challenge.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          challenge.category
                        )}`}
                      >
                        {challenge.category}
                      </span>
                      {challenge.status && challenge.status !== 'not_started' && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            challenge.status
                          )}`}
                        >
                          {challenge.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {challenge.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {challenge.points}
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {challenge.time_limit_minutes} min
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {challenge.test_cases} tests
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {challenge.participants} participants
                    </div>
                  </div>
                  <div className="font-medium">
                    Success Rate: {challenge.success_rate}%
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No challenges found with the selected filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
