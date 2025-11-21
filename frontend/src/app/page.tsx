import Link from 'next/link';
import { ArrowRight, TrendingUp, Code, Award, Briefcase, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SkillSync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                로그인
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                대시보드로 이동
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
            <Sparkles className="h-4 w-4" />
            <span>AI 스킬 추적 & 커리어 매칭 플랫폼</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            AI 스킬을
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              기회로 연결하세요
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Claude Code, GitHub Copilot, Cursor 등 AI 도구 사용을 추적하고,
            <br />
            AIQ 검사로 실력을 증명하며, AI 스킬에 맞는 채용 기회를 발견하세요.
          </p>

          <div className="mt-10 flex items-center justify-center space-x-4">
            <Link
              href="/dashboard"
              className="group flex items-center space-x-2 rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700"
            >
              <span>시작하기</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/challenges"
              className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50"
            >
              AIQ 검사 둘러보기
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            무료로 시작하세요 · 신용카드 불필요
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-indigo-100 p-3">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI 사용량 추적</h3>
            <p className="mt-2 text-sm text-gray-600">
              Claude Code, GitHub Copilot 등 AI 도구 사용 패턴을 자동으로 분석하고 시각화합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-purple-100 p-3">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AIQ Assessment</h3>
            <p className="mt-2 text-sm text-gray-600">
              실전 문제를 풀고 AI가 코드를 평가해 AI 활용 능력을 측정하세요.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-green-100 p-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">배지 & 인증서</h3>
            <p className="mt-2 text-sm text-gray-600">
              AIQ 검사를 완료하고 배지를 획득해 LinkedIn에 공유하세요.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-orange-100 p-3">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">잡 매칭</h3>
            <p className="mt-2 text-sm text-gray-600">
              AI 스킬 레벨에 맞는 채용 공고를 자동으로 추천받으세요.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            AI 스킬을 추적하고 커리어 기회를 발견하는 여정을 시작하세요
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 hover:bg-gray-50"
            >
              무료로 가입하기
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              데모 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 SkillSync. All rights reserved.</p>
            <p className="mt-2">
              Frontend running on port 3000 ✓
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
