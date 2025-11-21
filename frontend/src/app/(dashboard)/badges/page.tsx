'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Filter, TrendingUp } from 'lucide-react';
import { SkillCard } from '@/components/cards/SkillCard';
import { BadgeDetailModal } from '@/components/modals/BadgeDetailModal';
import { mockSkills, getSkillStats, getCategories } from '@/lib/mockBadges';
import { Button } from '@/components/ui/Button';

type Skill = typeof mockSkills[0];

export default function BadgesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<Skill | null>(null);

  const stats = getSkillStats();
  const categories = getCategories();

  // Filter skills
  const filteredSkills = mockSkills.filter(skill => {
    if (selectedCategory !== 'all' && skill.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'all' && skill.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // Split into completed and locked
  const completedSkills = filteredSkills.filter(s => s.status === 'completed');
  const lockedSkills = filteredSkills.filter(s => s.status === 'locked');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">스킬 배지 & 인증서</h1>
          <p className="mt-2 text-gray-600">
            챌린지를 완료하고 검증된 스킬 배지를 획득하세요
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">획득한 배지</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.completed}</p>
              <p className="mt-1 text-xs text-gray-500">총 {stats.total}개 중</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">평균 점수</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avgScore}</p>
          <p className="mt-1 text-xs text-gray-500">100점 만점</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">진행률</p>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">
              {Math.round((stats.completed / stats.total) * 100)}%
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">다음 레벨까지</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {Math.max(0, 5 - (stats.completed % 5))} 챌린지
          </p>
          <p className="mt-1 text-xs text-gray-500">레벨 {Math.floor(stats.completed / 5) + 1}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Category:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex gap-2">
              {['all', 'completed', 'locked'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                    selectedStatus === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed Skills Section */}
      {completedSkills.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              획득한 스킬 배지
            </h2>
            <span className="text-sm text-gray-600">
              {completedSkills.length}개 획득
            </span>
          </div>

          {/* 가로 스크롤 컨테이너 */}
          <div className="relative -mx-6 px-6">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {completedSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => setSelectedBadge(skill)}
                >
                  <SkillCard
                    skill={skill}
                    onShare={() => {
                      // Mock: Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: `I earned ${skill.name} badge!`,
                          text: `I scored ${skill.score}/100 on ${skill.name} - Top ${100 - (skill.percentile || 0)}%!`,
                          url: window.location.href
                        });
                      } else {
                        alert('Sharing feature:\n' +
                          `${skill.name} - Grade ${skill.grade}\n` +
                          `Score: ${skill.score}/100\n` +
                          `(Real implementation will integrate with LinkedIn)`);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Locked Skills Section */}
      {lockedSkills.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              사용 가능한 챌린지
            </h2>
            <span className="text-sm text-gray-600">
              {lockedSkills.length}개 챌린지
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            챌린지를 완료하여 더 많은 스킬 배지를 획득하세요
          </p>

          {/* 그리드 레이아웃 */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {lockedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onStartChallenge={() => {
                  router.push(`/challenges/${skill.id}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            선택한 필터에 해당하는 스킬이 없습니다
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            다른 필터를 선택하거나 전체를 확인해보세요
          </p>
          <Button onClick={() => {
            setSelectedCategory('all');
            setSelectedStatus('all');
          }}>
            필터 초기화
          </Button>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Award className="w-8 h-8 text-indigo-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              스킬 배지 시스템
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              각 챌린지를 완료하면 검증된 스킬 배지를 받습니다. 배지는 LinkedIn에 공유하거나
              인증서로 다운로드할 수 있습니다. 고득점을 받을수록 더 높은 등급의 배지를 획득합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm font-medium">
                💎 S등급: 90점 이상
              </span>
              <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm font-medium">
                🏆 A등급: 80-89점
              </span>
              <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm font-medium">
                🥈 B등급: 70-79점
              </span>
              <span className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-sm font-medium">
                🥉 C등급: 60-69점
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && selectedBadge.status === 'completed' && selectedBadge.grade && selectedBadge.score !== undefined && (
        <BadgeDetailModal
          skill={selectedBadge as typeof selectedBadge & { grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'; score: number; completedAt: string }}
          isOpen={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          onViewFeedback={() => {
            alert(`View feedback for ${selectedBadge.name}\n(Feature in development)`);
            setSelectedBadge(null);
          }}
          onRetake={() => {
            router.push(`/challenges/${selectedBadge.id}`);
            setSelectedBadge(null);
          }}
          onShare={() => {
            if (navigator.share) {
              navigator.share({
                title: `I earned ${selectedBadge.name} badge!`,
                text: `I scored ${selectedBadge.score}/100 on ${selectedBadge.name} - Top ${100 - (selectedBadge.percentile || 0)}%!`,
                url: window.location.href
              });
            } else {
              alert('Sharing feature:\n' +
                `${selectedBadge.name} - Grade ${selectedBadge.grade}\n` +
                `Score: ${selectedBadge.score}/100\n` +
                `(Real implementation will integrate with LinkedIn)`);
            }
          }}
        />
      )}
    </div>
  );
}
