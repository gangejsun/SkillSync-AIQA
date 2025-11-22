import Link from 'next/link';
import { ArrowRight, TrendingUp, Code, Award, Briefcase } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-2 text-gray-600">
          AI 스킬을 추적하고, AIQ 검사를 완료하며, 커리어 기회를 발견하세요.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI 도구 사용</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">847</p>
              <p className="mt-1 text-sm text-green-600">+12% 이번 주</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">완료한 AIQ 검사</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
              <p className="mt-1 text-sm text-gray-500">총 50개 중</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">획득한 배지</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
              <p className="mt-1 text-sm text-gray-500">다음 레벨까지 2개</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">매칭된 잡</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">24</p>
              <p className="mt-1 text-sm text-gray-500">3개 신규</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Usage Tracking */}
        <Link
          href="/ai-usage"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">AI 사용량 추적</h3>
              <p className="mt-2 text-sm text-gray-600">
                Claude Code, GitHub Copilot, Cursor 등 AI 도구 사용 패턴을 분석하고
                생산성을 향상시키세요.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
                대시보드 보기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* AIQ Assessment */}
        <Link
          href="/challenges"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">AI 활용 능력 검사</h3>
              <p className="mt-2 text-sm text-gray-600">
                실전 코딩 문제를 풀고 AI 피드백을 받아 스킬을 향상시키세요. 50개
                이상의 AIQ 검사가 준비되어 있습니다.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-purple-600">
                AIQ 검사 시작하기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* Job Matching */}
        <Link
          href="/jobs"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-green-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                잡 매칭 <span className="ml-2 text-xs text-gray-500">(준비중)</span>
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                AI 스킬 레벨에 맞는 채용 공고를 자동으로 추천받고, 프로필을 기업에
                공유하세요.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                매칭 보기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>

        {/* Badges & Certificates */}
        <Link
          href="/badges"
          className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-orange-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                배지 & 인증서 <span className="ml-2 text-xs text-gray-500">(준비중)</span>
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                퀴즈를 완료하고 배지를 획득하세요. LinkedIn에 공유하여 스킬을
                증명할 수 있습니다.
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-orange-600">
                내 배지 보기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <Code className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">&quot;React 상태 관리&quot;</span> 퀴즈를
                  완료했습니다
                </p>
                <p className="mt-1 text-xs text-gray-500">2시간 전</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  AI 도구를 <span className="font-medium">847회</span> 사용했습니다
                </p>
                <p className="mt-1 text-xs text-gray-500">오늘</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">&quot;TypeScript Master&quot;</span> 배지를
                  획득했습니다
                </p>
                <p className="mt-1 text-xs text-gray-500">어제</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
