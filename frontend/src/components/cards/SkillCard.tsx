'use client';

import { Share2, Lock, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    difficulty: 'beginner' | 'developing' | 'accomplished' | 'expert';
    status: 'locked' | 'in_progress' | 'completed';
    grade?: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    score?: number;
    completedAt?: string;
    percentile?: number;
    scores?: {
      functionality: number;
      code_quality: number;
      ai_usage: number;
      ui_ux: number;
    };
  };
  onStartChallenge?: () => void;
  onViewFeedback?: () => void;
  onRetake?: () => void;
  onShare?: () => void;
}

const GRADE_ICONS = {
  S: '💎',
  A: '🏆',
  B: '🥈',
  C: '🥉',
  D: '📋',
  F: '📝'
} as const;

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-700',
  developing: 'bg-blue-100 text-blue-700',
  accomplished: 'bg-purple-100 text-purple-700',
  expert: 'bg-red-100 text-red-700'
} as const;

export function SkillCard({
  skill,
  onStartChallenge,
  onViewFeedback,
  onRetake,
  onShare
}: SkillCardProps) {
  const isCompleted = skill.status === 'completed';

  // 응시 전 카드 (Locked state)
  if (!isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="text-center">
          {/* Lock Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>

          {/* Skill Name */}
          <h3 className="font-semibold text-xl text-gray-900 mb-2">
            {skill.name}
          </h3>

          {/* Difficulty Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${DIFFICULTY_COLORS[skill.difficulty]}`}>
            {skill.difficulty}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-2">
            Category: {skill.category}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Take this challenge to unlock your skill badge
          </p>

          {/* CTA Button */}
          <Button
            className="w-full"
            onClick={onStartChallenge}
          >
            Start Challenge
          </Button>
        </div>
      </div>
    );
  }

  // 응시 후 카드 (Completed with gradient - PRD design)
  return (
    <div className="relative overflow-hidden rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg">
      {/* 배경 그라데이션 (PRD 명세대로) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />

      {/* 컨텐츠 */}
      <div className="relative p-6 text-white">
        {/* Share 버튼 */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onShare}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 등급 배지 - 중앙 */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Grade Icon */}
            <div className="text-7xl flex items-center justify-center">
              {GRADE_ICONS[skill.grade!]}
            </div>
            {/* Score overlay */}
            <div className="absolute inset-0 flex items-center justify-center pt-3">
              <span className="text-3xl font-bold drop-shadow-lg">
                {skill.score}
              </span>
            </div>
          </div>
        </div>

        {/* 등급 텍스트 */}
        <div className="text-center mb-4">
          <p className="text-sm opacity-90 mb-1 tracking-wider">
            GRADE {skill.grade}
          </p>
          <h3 className="font-bold text-2xl mb-2">{skill.name}</h3>
          <p className="text-sm opacity-75">
            {skill.category} • {skill.difficulty}
          </p>
          <p className="text-sm opacity-75 mt-1">
            Verified: {new Date(skill.completedAt!).toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* 점수 바 */}
        <div className="mb-4">
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${skill.score}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2 opacity-90">
            {skill.score}/100
            {skill.percentile && (
              <span className="ml-2">
                • Top {100 - skill.percentile}%
              </span>
            )}
          </p>
        </div>

        {/* 세부 점수 */}
        {skill.scores && (
          <div className="space-y-2 text-sm mb-6">
            {Object.entries(skill.scores).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="opacity-75 capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="font-medium w-10 text-right">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={onViewFeedback}
            className="flex-1 py-2.5 px-4 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Feedback
          </button>
          <button
            onClick={onRetake}
            className="flex-1 py-2.5 px-4 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors font-medium text-sm"
          >
            Retake
          </button>
        </div>
      </div>
    </div>
  );
}
