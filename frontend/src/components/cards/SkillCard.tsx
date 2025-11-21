'use client';

import { Share2, Lock, ExternalLink, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
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

const GRADE_CONFIG = {
  S: { label: 'S', color: 'from-yellow-400 to-yellow-600', icon: '💎' },
  A: { label: 'A', color: 'from-purple-400 to-purple-600', icon: '🏆' },
  B: { label: 'B', color: 'from-blue-400 to-blue-600', icon: '🥈' },
  C: { label: 'C', color: 'from-green-400 to-green-600', icon: '🥉' },
  D: { label: 'D', color: 'from-gray-400 to-gray-600', icon: '📋' },
  F: { label: 'F', color: 'from-red-400 to-red-600', icon: '📝' }
} as const;

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  developing: 'Developing',
  accomplished: 'Accomplished',
  expert: 'Expert'
} as const;

export function SkillCard({
  skill,
  onStartChallenge,
  onViewFeedback,
  onRetake,
  onShare
}: SkillCardProps) {
  const isCompleted = skill.status === 'completed';

  // 응시 전 카드 (Locked state) - 더 좁은 카드
  if (!isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {DIFFICULTY_LABELS[skill.difficulty]}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2">
            {skill.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {skill.category}
          </p>

          {/* CTA Button */}
          <button
            onClick={onStartChallenge}
            className="mt-auto w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  // 응시 후 카드 (Completed) - 명함 형태, 심플한 디자인 (핵심 정보만)
  const gradeConfig = GRADE_CONFIG[skill.grade!];

  return (
    <div className="flex-shrink-0 w-[320px] h-[180px] bg-white rounded-2xl shadow-md border border-gray-200 p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 relative overflow-hidden group cursor-pointer">
      {/* 배경 그라데이션 - 은은하게 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradeConfig.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Grade Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${gradeConfig.color} text-white shadow-sm`}>
            <span className="text-sm">{gradeConfig.icon}</span>
            <span className="text-xs font-bold">{gradeConfig.label}</span>
          </div>

          {/* Share Button */}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Skill Info */}
        <div className="flex-1 min-h-0">
          <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">
            {skill.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {skill.category}
          </p>

          {/* Score with Percentile - Horizontal Layout */}
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900 leading-none">{skill.score}</span>
              <span className="text-sm text-gray-600 ml-1">/100</span>
            </div>
            {skill.percentile && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">
                  Top {100 - skill.percentile}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow Icon - Bottom Right */}
        <div className="flex justify-end mt-2">
          <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
