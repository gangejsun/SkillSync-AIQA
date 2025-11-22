import { Mail, MapPin, Briefcase, Calendar, Award, Code, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">프로필</h1>
        <p className="mt-2 text-gray-600">내 정보를 관리하고 활동을 확인하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white">
                JD
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">John Doe</h2>
              <p className="mt-1 text-sm text-gray-600">개발자</p>

              <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                프로필 수정
              </button>
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="h-5 w-5" />
                <span>john@example.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>서울, 한국</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Briefcase className="h-5 w-5" />
                <span>Frontend Developer</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>가입일: 2024년 1월</span>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">주요 스킬</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
                React
              </span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                TypeScript
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                Next.js
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                Node.js
              </span>
              <span className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800">
                AI Tools
              </span>
            </div>

            <button className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              + 스킬 추가
            </button>
          </div>
        </div>

        {/* Right Column - Activity & Stats */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI 도구 사용</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">847</p>
                </div>
                <div className="rounded-full bg-indigo-100 p-3">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">완료한 퀴즈</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
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
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">최근 획득 배지</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-2xl">
                  🏆
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">TypeScript Master</h4>
                  <p className="text-xs text-gray-500">2024-01-15</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-2xl">
                  ⚛️
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">React Pro</h4>
                  <p className="text-xs text-gray-500">2024-01-10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">최근 활동</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
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

              <div className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
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

              <div className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
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

              <div className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="rounded-full bg-blue-100 p-2">
                  <Code className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">&quot;알고리즘 기초&quot;</span> 퀴즈를
                    시작했습니다
                  </p>
                  <p className="mt-1 text-xs text-gray-500">3일 전</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Link */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">계정 설정</h3>
                <p className="mt-1 text-sm text-gray-600">
                  비밀번호, 알림, 개인정보 설정을 관리하세요
                </p>
              </div>
              <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                설정으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
