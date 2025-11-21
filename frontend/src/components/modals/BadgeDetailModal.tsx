'use client';

import { X, Share2, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

interface BadgeDetailModalProps {
  skill: {
    id: string;
    name: string;
    category: string;
    difficulty: 'beginner' | 'developing' | 'accomplished' | 'expert';
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
    completedAt: string;
    percentile?: number;
    scores?: {
      functionality: number;
      code_quality: number;
      ai_usage: number;
      ui_ux: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onViewFeedback?: () => void;
  onRetake?: () => void;
  onShare?: () => void;
}

const GRADE_CONFIG = {
  S: { label: 'S', color: 'from-yellow-400 to-yellow-600', icon: '💎', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  A: { label: 'A', color: 'from-purple-400 to-purple-600', icon: '🏆', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  B: { label: 'B', color: 'from-blue-400 to-blue-600', icon: '🥈', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  C: { label: 'C', color: 'from-green-400 to-green-600', icon: '🥉', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  D: { label: 'D', color: 'from-gray-400 to-gray-600', icon: '📋', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  F: { label: 'F', color: 'from-red-400 to-red-600', icon: '📝', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
} as const;

const SCORE_LABELS: Record<string, string> = {
  functionality: 'Functionality',
  code_quality: 'Code Quality',
  ai_usage: 'AI Usage',
  ui_ux: 'UI/UX'
};

export function BadgeDetailModal({
  skill,
  isOpen,
  onClose,
  onViewFeedback,
  onRetake,
  onShare
}: BadgeDetailModalProps) {
  const gradeConfig = GRADE_CONFIG[skill.grade];

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`relative p-6 border-b ${gradeConfig.borderColor} ${gradeConfig.bgColor}`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-start gap-4">
              {/* Grade Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradeConfig.color} text-white shadow-lg`}>
                <span className="text-3xl">{gradeConfig.icon}</span>
                <span className="text-xl font-bold">{gradeConfig.label}</span>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {skill.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {skill.category} • {skill.difficulty}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Score Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Overall Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">{skill.score}</span>
                    <span className="text-xl text-gray-600">/100</span>
                  </div>
                </div>

                {skill.percentile && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-2xl font-bold">Top {100 - skill.percentile}%</span>
                    </div>
                    <p className="text-sm text-gray-600">Percentile Rank</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradeConfig.color} transition-all duration-500`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>

            {/* Detailed Scores */}
            {skill.scores && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(skill.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {SCORE_LABELS[key] || key}
                        </span>
                        <span className="text-sm font-bold text-gray-900">{value}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Date */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Completed on {new Date(skill.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onViewFeedback}
                className="flex-1 py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Feedback
              </button>
              <button
                onClick={onRetake}
                className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Retake Challenge
              </button>
              <button
                onClick={onShare}
                className="py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 text-gray-700 font-medium transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
