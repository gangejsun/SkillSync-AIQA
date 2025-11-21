# SkillSync - AI 활용 능력 평가 플랫폼 PRD v2.0

> **AI 코딩 어시스턴트 개발용 상세 기획서**  
> Claude Code, Cursor, Lovable, Gemini Code Assist와 함께 개발하기 위한 완전한 명세

---

## 📋 목차

1. [서비스 개요](#서비스-개요)
2. [기술 아키텍처](#기술-아키텍처)
3. [디자인 시스템](#디자인-시스템)
4. [핵심 기능 명세](#핵심-기능-명세)
5. [데이터 모델](#데이터-모델)
6. [API 명세](#api-명세)
7. [개발 우선순위](#개발-우선순위)

---

## 🎯 서비스 개요

### 서비스명
**SkillSync** (스킬싱크)

### 태그라인
"Sync Your AI Skills to Opportunities"

### 핵심 가치 제안
AI와 함께 일하는 능력을 실전 과제로 증명하고, 검증된 배지를 받아 채용 기회를 연결하는 플랫폼

### 타겟 사용자
- **Primary**: 구직자 (개발자, PM, 디자이너, 데이터 분석가)
- **Secondary**: 기업 채용 담당자, HR 매니저

### 핵심 차별화
1. ✅ **AI 활용 능력 특화** - 일반 코딩 테스트가 아닌 "AI를 얼마나 잘 활용하는가"
2. ✅ **사용량 데이터 통합** - Claude Code, Cursor 등 실제 사용 이력 연동
3. ✅ **실전 과제 중심** - 객관식이 아닌 프로젝트 구현으로 평가
4. ✅ **전 직군 커버** - 코딩 외에 PM, 디자인, 마케팅 등
5. ✅ **B2C 우선** - 구직자가 주도적으로 자신의 능력 증명

---

## 🏗 기술 아키텍처

### 전체 시스템 아키텍처 (MSA - Microservices Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                     (Next.js 14 + React)                    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Dashboard  │  │  Assessment  │  │   Profile    │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (API Gateway)
┌─────────────────────────────────────────────────────────────┐
│                      Backend Services                        │
│                    (Node.js + Express)                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  AI Usage    │  │  Challenge   │  │  Evaluation  │     │
│  │  Service     │  │  Service     │  │  Service     │     │
│  │  :3001       │  │  :3002       │  │  :3003       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Badge       │  │  Matching    │  │  Report      │     │
│  │  Service     │  │  Service     │  │  Service     │     │
│  │  :3004       │  │  :3005       │  │  :3006       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data & Storage Layer                      │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Supabase       │         │   AWS S3         │         │
│  │   (PostgreSQL)   │         │   (File Storage) │         │
│  │   - Auth         │         │   - Submissions  │         │
│  │   - Database     │         │   - Screenshots  │         │
│  │   - Storage      │         │   - Videos       │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Integrations                     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Claude API  │  │  GitHub API  │  │  LinkedIn    │     │
│  │  (Feedback)  │  │  (Copilot)   │  │  (Sharing)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 마이크로서비스별 책임

#### 1. AI Usage Service (AI 사용량 서비스)
**포트**: 3001  
**책임**: AI 도구 사용량 데이터 수집 및 시각화  
**기술 스택**: Node.js + Express  
**주요 기능**:
- API Key 검증 및 저장 (암호화)
- Claude Code Analytics API 호출
- GitHub Copilot Metrics API 호출
- 사용량 데이터 변환 및 집계
- 시각화용 데이터 제공

**Mock Data 파일**: `mock/ai_usage_data.txt`

#### 2. Challenge Service (과제 관리 서비스)
**포트**: 3002  
**책임**: 과제 CRUD, 제출, 배정  
**기술 스택**: Node.js + Express  
**주요 기능**:
- 과제 목록 조회 (직군/난이도 필터)
- 과제 상세 조회
- 과제 제출물 업로드 (S3 연동)
- 기업 커스텀 과제 생성
- 제출 상태 관리

**Mock Data 파일**: `mock/challenges_data.txt`

#### 3. Evaluation Service (평가 서비스)
**포트**: 3003  
**책임**: 제출물 평가 및 채점  
**기술 스택**: Node.js + Express + Claude API  
**주요 기능**:
- AI 자동 평가 (Claude API)
- GitHub Repo 분석
- 코드 품질 측정
- 점수 계산 및 등급 부여
- 피드백 생성

**Mock Data 파일**: `mock/evaluation_results.txt`

#### 4. Badge Service (배지 서비스)
**포트**: 3004  
**책임**: 스킬 카드, 배지, 인증서 생성  
**기술 스택**: Node.js + Express + Canvas API  
**주요 기능**:
- 등급별 배지 이미지 생성
- LinkedIn 공유용 이미지 생성
- 스킬 카드 렌더링
- 인증서 PDF 생성

**Mock Data 파일**: `mock/badges_data.txt`

#### 5. Matching Service (매칭 서비스)
**포트**: 3005  
**책임**: 구직자-기업 매칭  
**기술 스택**: Node.js + Express  
**주요 기능**:
- 매칭 점수 계산 알고리즘
- 채용 공고 추천
- 지원자 필터링 및 정렬
- 면접 초대 발송

**Mock Data 파일**: `mock/job_postings.txt`, `mock/candidates.txt`

#### 6. Report Service (리포트 서비스)
**포트**: 3006  
**책임**: 분석 및 리포트 생성  
**기술 스택**: Node.js + Express  
**주요 기능**:
- 팀/조직 스킬 분석
- 리포트 데이터 집계
- PDF 리포트 생성
- CSV Export

**Mock Data 파일**: `mock/team_analytics.txt`

### Frontend 아키텍처

```
src/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # 인증 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # 대시보드 그룹
│   │   ├── page.tsx              # 메인 대시보드
│   │   ├── ai-usage/             # AI 사용량
│   │   ├── challenges/           # 과제 목록
│   │   ├── profile/              # 내 프로필
│   │   └── jobs/                 # 채용 매칭
│   └── (public)/                 # 공개 페이지
│       ├── page.tsx               # 랜딩
│       └── about/
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # Shadcn UI 컴포넌트
│   ├── charts/                   # 차트 컴포넌트
│   ├── cards/                    # 스킬 카드 등
│   └── layouts/
├── lib/                          # 유틸리티
│   ├── api/                      # API 클라이언트
│   │   ├── ai-usage.ts
│   │   ├── challenges.ts
│   │   ├── evaluation.ts
│   │   └── matching.ts
│   ├── mock/                     # Mock 데이터
│   │   ├── ai-usage-data.ts
│   │   ├── challenges-data.ts
│   │   └── users-data.ts
│   └── utils/
└── styles/
    └── globals.css               # Tailwind + 커스텀
```

### Backend 서비스별 폴더 구조

```
services/
├── ai-usage-service/             # Port 3001
│   ├── src/
│   │   ├── routes/
│   │   │   └── usage.routes.ts
│   │   ├── controllers/
│   │   │   └── usage.controller.ts
│   │   ├── services/
│   │   │   ├── claude-code.service.ts
│   │   │   └── copilot.service.ts
│   │   ├── mock/
│   │   │   └── ai_usage_data.txt
│   │   └── index.ts
│   ├── package.json
│   └── .env.example
│
├── challenge-service/            # Port 3002
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── mock/
│   │   │   └── challenges_data.txt
│   │   └── index.ts
│   └── package.json
│
├── evaluation-service/           # Port 3003
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── ai-grader.service.ts
│   │   │   └── github-analyzer.service.ts
│   │   ├── mock/
│   │   │   └── evaluation_results.txt
│   │   └── index.ts
│   └── package.json
│
└── [나머지 서비스들도 동일 구조]
```

### 개발 환경 설정

**Frontend**
```bash
# Next.js 14 + TypeScript
npx create-next-app@latest skillsync-frontend --typescript --tailwind --app

# 주요 의존성
npm install @supabase/supabase-js
npm install recharts  # 차트
npm install lucide-react  # 아이콘
npm install @radix-ui/react-*  # Shadcn UI
npm install axios
npm install zustand  # 상태 관리
```

**Backend (각 서비스)**
```bash
# Node.js + Express + TypeScript
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express nodemon ts-node

# 공통 의존성
npm install axios  # 외부 API 호출
npm install jsonwebtoken bcrypt  # 인증
```

---

## 🎨 디자인 시스템

### 컬러 팔레트 (프로페셔널 & 신뢰감)

```css
/* Primary Colors - 깔끔하고 전문적 */
--primary-50: #EEF2FF;    /* 매우 연한 인디고 */
--primary-100: #E0E7FF;   /* 연한 인디고 */
--primary-200: #C7D2FE;   
--primary-300: #A5B4FC;   
--primary-400: #818CF8;   
--primary-500: #6366F1;   /* 메인 인디고 - 신뢰, 전문성 */
--primary-600: #4F46E5;   
--primary-700: #4338CA;   
--primary-800: #3730A3;   
--primary-900: #312E81;   /* 다크 인디고 */

/* Secondary Colors - 보조 */
--secondary-500: #8B5CF6; /* 퍼플 - 혁신, 창의성 */
--accent-500: #10B981;    /* 그린 - 성공, 긍정 */
--warning-500: #F59E0B;   /* 오렌지 - 주의 */
--error-500: #EF4444;     /* 레드 - 오류 */

/* Neutral Colors - 텍스트/배경 */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;      /* 밝은 배경 */
--gray-200: #E5E7EB;      
--gray-300: #D1D5DB;      /* 경계선 */
--gray-500: #6B7280;      /* 보조 텍스트 */
--gray-700: #374151;      /* 일반 텍스트 */
--gray-900: #111827;      /* 강조 텍스트 */

/* Gradient - 배지/카드 */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-card: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### 타이포그래피

```css
/* 폰트 패밀리 */
--font-sans: 'Pretendard', -apple-system, sans-serif;  /* 본문 */
--font-mono: 'Fira Code', monospace;  /* 코드 */

/* 폰트 크기 */
--text-xs: 0.75rem;    /* 12px - 캡션 */
--text-sm: 0.875rem;   /* 14px - 보조 */
--text-base: 1rem;     /* 16px - 본문 */
--text-lg: 1.125rem;   /* 18px - 소제목 */
--text-xl: 1.25rem;    /* 20px - 제목 */
--text-2xl: 1.5rem;    /* 24px - 큰 제목 */
--text-3xl: 1.875rem;  /* 30px - 히어로 */
--text-4xl: 2.25rem;   /* 36px - 페이지 제목 */

/* 폰트 굵기 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 간격 (Spacing)

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### 컴포넌트 스타일 가이드

#### 버튼
```tsx
// Primary Button
className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors"

// Secondary Button  
className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg border border-gray-300 transition-colors"

// Ghost Button
className="bg-transparent hover:bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
```

#### 카드 (Workera 이미지 참고)
```tsx
// 스킬 카드 (응시 전)
className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"

// 스킬 카드 (응시 후 - 그라데이션)
className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white"

// Achievement 카드
className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl text-white"
```

#### 입력 필드
```tsx
className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
```

---

## 🔧 핵심 기능 명세 (AI 코딩 도구가 구현 가능하도록)

### Feature 1: AI Usage Analytics Dashboard

#### 1.1 API Key 입력 화면

**파일**: `app/(dashboard)/ai-usage/connect/page.tsx`

```tsx
// UI 구조
<div className="max-w-2xl mx-auto p-8">
  <h1>Connect Your AI Tools</h1>
  
  {/* Claude Code 연동 */}
  <Card>
    <CardHeader>
      <CardTitle>Claude Code</CardTitle>
      <CardDescription>
        Connect your Anthropic API key to import usage data
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Label>API Key</Label>
      <Input 
        type="password"
        placeholder="sk-ant-api..."
        value={claudeApiKey}
        onChange={(e) => setClaudeApiKey(e.target.value)}
      />
      <p className="text-sm text-gray-500 mt-2">
        Find your API key at: 
        <a href="https://console.anthropic.com">
          console.anthropic.com
        </a>
      </p>
    </CardContent>
    <CardFooter>
      <Button onClick={handleConnectClaude}>
        Connect Claude Code
      </Button>
    </CardFooter>
  </Card>

  {/* GitHub Copilot 연동 */}
  <Card>
    <CardHeader>
      <CardTitle>GitHub Copilot</CardTitle>
      <CardDescription>
        Connect your GitHub Personal Access Token
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Label>Personal Access Token</Label>
      <Input 
        type="password"
        placeholder="ghp_..."
        value={githubToken}
        onChange={(e) => setGithubToken(e.target.value)}
      />
      <p className="text-sm text-gray-500 mt-2">
        Generate token at: 
        <a href="https://github.com/settings/tokens">
          github.com/settings/tokens
        </a>
        <br/>
        Required scopes: read:user, read:org
      </p>
    </CardContent>
    <CardFooter>
      <Button onClick={handleConnectGitHub}>
        Connect GitHub Copilot
      </Button>
    </CardFooter>
  </Card>
</div>
```

**API 엔드포인트**:
```
POST /api/ai-usage/connect
Body: {
  "provider": "claude_code" | "github_copilot" | "cursor",
  "api_key": "encrypted_key_string"
}
Response: {
  "success": true,
  "integration_id": "uuid",
  "last_synced_at": "2025-11-20T10:30:00Z"
}
```

**Backend 구현** (`services/ai-usage-service/src/controllers/usage.controller.ts`):

```typescript
import { Request, Response } from 'express';
import { ClaudeCodeService } from '../services/claude-code.service';
import { encrypt } from '../utils/crypto';

export class UsageController {
  async connectProvider(req: Request, res: Response) {
    const { provider, api_key } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // API Key 암호화 저장
    const encryptedKey = encrypt(api_key);
    
    // Supabase에 저장
    const { data, error } = await supabase
      .from('ai_tool_integrations')
      .insert({
        user_id: userId,
        tool_name: provider,
        integration_method: 'api',
        encrypted_api_key: encryptedKey,
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // 즉시 첫 동기화 시도
    try {
      if (provider === 'claude_code') {
        await ClaudeCodeService.syncUsageData(userId, api_key);
      }
      // ... 다른 provider 처리
    } catch (syncError) {
      // 동기화 실패해도 연동은 성공
      console.error('Initial sync failed:', syncError);
    }
    
    return res.json({
      success: true,
      integration_id: data.integration_id,
      last_synced_at: new Date().toISOString()
    });
  }
}
```

**Mock 데이터** (`services/ai-usage-service/src/mock/ai_usage_data.txt`):

```json
{
  "user_id": "mock-user-123",
  "tools": [
    {
      "tool_name": "claude_code",
      "last_90_days": {
        "total_requests": 1842,
        "total_tokens": 1250000,
        "active_days": 67,
        "daily_breakdown": [
          {"date": "2025-11-20", "requests": 25, "tokens": 18500},
          {"date": "2025-11-19", "requests": 32, "tokens": 22300},
          {"date": "2025-11-18", "requests": 18, "tokens": 12100}
        ],
        "top_projects": [
          {"project": "e-commerce-app", "requests": 487},
          {"project": "portfolio-site", "requests": 352}
        ]
      }
    },
    {
      "tool_name": "cursor_ai",
      "last_90_days": {
        "total_requests": 945,
        "active_days": 52,
        "acceptance_rate": 0.78
      }
    },
    {
      "tool_name": "github_copilot",
      "last_90_days": {
        "total_suggestions": 3421,
        "total_acceptances": 2156,
        "acceptance_rate": 0.63,
        "lines_suggested": 15234,
        "lines_accepted": 9598
      }
    }
  ]
}
```

#### 1.2 사용량 대시보드 화면

**파일**: `app/(dashboard)/ai-usage/page.tsx`

**UI 구조** (Workera 이미지 스타일 참고):

```tsx
export default function AIUsagePage() {
  const usageData = useAIUsage(); // Zustand store
  
  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          AI Usage Analytics
        </h1>
        <p className="text-gray-600">
          Last synced: {usageData.lastSynced}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              Total Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary-600">
              {usageData.totalInteractions.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last 90 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              Active Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary-600">
              {usageData.activeDays} / 90
            </p>
            <Progress value={(usageData.activeDays / 90) * 100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              Top Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {usageData.topTool.name}
            </p>
            <p className="text-gray-600">
              {usageData.topTool.requests.toLocaleString()} requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown - 바 차트 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Usage Breakdown (Last 90 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData.tools.map((tool) => (
              <div key={tool.name} className="flex items-center gap-4">
                <div className="w-40 text-sm font-medium text-gray-700">
                  {tool.displayName}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 rounded-lg transition-all"
                        style={{ width: `${(tool.requests / usageData.totalInteractions) * 100}%` }}
                      />
                    </div>
                    <span className="w-32 text-sm text-gray-600 text-right">
                      {tool.requests.toLocaleString()} requests
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-13 gap-1">
            {/* 13주 × 7일 = 91일 */}
            {usageData.heatmapData.map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded ${
                  day.count === 0 ? 'bg-gray-100' :
                  day.count < 5 ? 'bg-primary-200' :
                  day.count < 15 ? 'bg-primary-400' :
                  'bg-primary-600'
                }`}
                title={`${day.date}: ${day.count} requests`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Less active</span>
            <span>More active</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="mr-2" /> Export Report
        </Button>
        <Button onClick={handleShareLinkedIn}>
          <Share2 className="mr-2" /> Share on LinkedIn
        </Button>
      </div>
    </div>
  );
}
```

#### 1.3 Claude Code 데이터 가져오기 로직

**파일**: `services/ai-usage-service/src/services/claude-code.service.ts`

```typescript
import axios from 'axios';

export class ClaudeCodeService {
  private static readonly ANALYTICS_API = 'https://api.anthropic.com/v1/organizations/usage_report/claude_code';

  static async syncUsageData(userId: string, apiKey: string) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 90);

    try {
      // Claude Code Analytics API 호출
      const response = await axios.get(this.ANALYTICS_API, {
        headers: {
          'anthropic-version': '2023-06-01',
          'x-api-key': apiKey,
          'content-type': 'application/json'
        },
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        }
      });

      const analyticsData = response.data.data;

      // 데이터 변환 및 저장
      const metrics = analyticsData.map((dayData: any) => ({
        user_id: userId,
        tool_name: 'claude_code',
        metric_date: dayData.date,
        request_count: dayData.core_metrics?.num_sessions || 0,
        token_count: dayData.model_breakdown?.[0]?.tokens?.input + 
                     dayData.model_breakdown?.[0]?.tokens?.output || 0,
        lines_of_code: dayData.core_metrics?.lines_of_code?.added || 0,
        acceptance_rate: null // Claude Code doesn't provide this
      }));

      // Supabase에 일괄 저장
      const { error } = await supabase
        .from('ai_usage_metrics')
        .upsert(metrics, {
          onConflict: 'user_id,tool_name,metric_date'
        });

      if (error) throw error;

      return { success: true, recordsCount: metrics.length };

    } catch (error) {
      console.error('Claude Code sync error:', error);
      throw new Error(`Failed to sync Claude Code data: ${error.message}`);
    }
  }

  // Mock 모드일 때
  static async getMockData() {
    const fs = require('fs').promises;
    const mockData = await fs.readFile(
      './mock/ai_usage_data.txt', 
      'utf-8'
    );
    return JSON.parse(mockData);
  }
}
```

**환경 변수** (`.env.example`):
```bash
# Development Mode
USE_MOCK_DATA=true  # true: Mock 사용, false: 실제 API

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# External APIs
CLAUDE_API_BASE_URL=https://api.anthropic.com/v1
GITHUB_API_BASE_URL=https://api.github.com
```

---

### Feature 2: Challenge System (과제 시스템)

#### 2.1 과제 목록 화면

**파일**: `app/(dashboard)/challenges/page.tsx`

```tsx
export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const challenges = useChallenges({ category, difficulty });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Challenges
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="development">💻 Development</SelectItem>
            <SelectItem value="data">📊 Data</SelectItem>
            <SelectItem value="design">🎨 Design</SelectItem>
            <SelectItem value="business">💼 Business</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">🌱 Beginner</SelectItem>
            <SelectItem value="developing">🌿 Developing</SelectItem>
            <SelectItem value="accomplished">🌳 Accomplished</SelectItem>
            <SelectItem value="expert">🌟 Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 과제 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}

// 개별 과제 카드 컴포넌트
function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const userSubmission = useUserSubmission(challenge.id);
  const isCompleted = userSubmission?.status === 'completed';

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow cursor-pointer",
      isCompleted && "border-2 border-green-500"
    )}>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={getDifficultyVariant(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
          {isCompleted && (
            <Badge variant="success">
              <Check className="w-3 h-3 mr-1" /> Completed
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">{challenge.title}</CardTitle>
        <CardDescription>{challenge.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{challenge.timeLimit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{challenge.completionsCount} completed</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>Pass rate: {challenge.passRate}%</span>
          </div>
        </div>

        {isCompleted && userSubmission && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">
                Your Grade: {userSubmission.grade}
              </span>
              <span className="text-2xl">
                {getGradeEmoji(userSubmission.grade)}
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Score: {userSubmission.score}/100
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => router.push(`/challenges/${challenge.id}`)}
          variant={isCompleted ? "outline" : "default"}
        >
          {isCompleted ? 'View Details' : 'Start Challenge'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### 2.2 과제 상세 & 제출 화면

**파일**: `app/(dashboard)/challenges/[id]/page.tsx`

```typescript
export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const challenge = useChallenge(params.id);
  const [submission, setSubmission] = useState({
    githubUrl: '',
    deployedUrl: '',
    readmeFile: null,
    aiConversation: null,
    selfConfidence: 3
  });

  const handleSubmit = async () => {
    // 파일 업로드 to S3
    const readmeUrl = await uploadFile(submission.readmeFile);
    const conversationUrl = submission.aiConversation 
      ? await uploadFile(submission.aiConversation)
      : null;

    // API 호출
    const response = await fetch('/api/challenges/submit', {
      method: 'POST',
      body: JSON.stringify({
        challenge_id: challenge.id,
        github_url: submission.githubUrl,
        deployed_url: submission.deployedUrl,
        readme_url: readmeUrl,
        ai_conversation_url: conversationUrl,
        self_confidence: submission.selfConfidence
      })
    });

    if (response.ok) {
      toast.success('Submitted successfully! Evaluation will take 24-48 hours.');
      router.push('/challenges');
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-8">
      {/* 과제 설명 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {challenge.title}
            </h1>
            <p className="text-gray-600">{challenge.category} • {challenge.difficulty}</p>
          </div>
          <Badge className="text-lg px-4 py-2">
            {challenge.difficulty}
          </Badge>
        </div>

        {/* 과제 정보 */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Time Limit</p>
            <p className="text-lg font-semibold text-gray-900">{challenge.timeLimit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Submissions</p>
            <p className="text-lg font-semibold text-gray-900">{challenge.completionsCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Score</p>
            <p className="text-lg font-semibold text-gray-900">{challenge.avgScore}/100</p>
          </div>
        </div>

        {/* 요구사항 */}
        <div className="prose max-w-none">
          <h2>📋 Challenge Description</h2>
          <p>{challenge.description}</p>

          <h3>Requirements:</h3>
          <ul>
            {challenge.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>

          <h3>💡 AI Tools You Can Use:</h3>
          <ul>
            {challenge.allowedTools.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>

          <h3>📤 What to Submit:</h3>
          <ul>
            {challenge.submissionRequirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>

          <h3>🏆 Evaluation Criteria:</h3>
          <ul>
            {Object.entries(challenge.evaluationCriteria).map(([key, value]) => (
              <li key={key}>{key}: {value}%</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 제출 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
          <CardDescription>
            Fill in all required fields before submitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GitHub URL */}
          <div>
            <Label htmlFor="github">GitHub Repository *</Label>
            <Input
              id="github"
              placeholder="https://github.com/username/project"
              value={submission.githubUrl}
              onChange={(e) => setSubmission({...submission, githubUrl: e.target.value})}
              required
            />
          </div>

          {/* Deployed URL */}
          <div>
            <Label htmlFor="deployed">Deployed URL *</Label>
            <Input
              id="deployed"
              placeholder="https://your-project.vercel.app"
              value={submission.deployedUrl}
              onChange={(e) => setSubmission({...submission, deployedUrl: e.target.value})}
              required
            />
          </div>

          {/* README Upload */}
          <div>
            <Label htmlFor="readme">README File *</Label>
            <Input
              id="readme"
              type="file"
              accept=".md,.txt"
              onChange={(e) => setSubmission({...submission, readmeFile: e.target.files[0]})}
              required
            />
          </div>

          {/* AI Conversation (Optional) */}
          <div>
            <Label htmlFor="conversation">AI Conversation History (Optional)</Label>
            <Input
              id="conversation"
              type="file"
              accept=".json,.txt,.md"
              onChange={(e) => setSubmission({...submission, aiConversation: e.target.files[0]})}
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload your chat history with Claude, ChatGPT, or other AI tools
            </p>
          </div>

          {/* Self-confidence */}
          <div>
            <Label>Self-Assessment</Label>
            <p className="text-sm text-gray-600 mb-3">How confident are you in your submission?</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all",
                    submission.selfConfidence >= level
                      ? "bg-primary-500 border-primary-600 text-white"
                      : "bg-white border-gray-300 text-gray-400 hover:border-primary-300"
                  )}
                  onClick={() => setSubmission({...submission, selfConfidence: level})}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Once submitted, you cannot edit your work. Make sure everything is correct.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!submission.githubUrl || !submission.deployedUrl || !submission.readmeFile}
          >
            Submit for Review
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

#### 2.3 Challenge Service API

**파일**: `services/challenge-service/src/routes/challenge.routes.ts`

```typescript
import express from 'express';
import { ChallengeController } from '../controllers/challenge.controller';

const router = express.Router();
const controller = new ChallengeController();

// GET /api/challenges - 과제 목록 조회
router.get('/', controller.getChallenges);

// GET /api/challenges/:id - 과제 상세 조회
router.get('/:id', controller.getChallengeById);

// POST /api/challenges/submit - 과제 제출
router.post('/submit', controller.submitChallenge);

// GET /api/challenges/:id/submissions - 내 제출 이력
router.get('/:id/submissions', controller.getMySubmissions);

export default router;
```

**Controller 구현**:

```typescript
export class ChallengeController {
  async getChallenges(req: Request, res: Response) {
    const { category, difficulty, userId } = req.query;

    // Mock 모드
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockData = await this.loadMockData('challenges_data.txt');
      const filtered = this.filterChallenges(mockData, { category, difficulty });
      return res.json({ challenges: filtered });
    }

    // 실제 DB 쿼리
    let query = supabase
      .from('challenges')
      .select(`
        *,
        submissions:submissions(count)
      `)
      .eq('is_published', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ challenges: data });
  }

  async submitChallenge(req: Request, res: Response) {
    const { 
      challenge_id, 
      github_url, 
      deployed_url, 
      readme_url,
      ai_conversation_url,
      self_confidence 
    } = req.body;
    const userId = req.user.id;

    // Supabase에 제출 기록
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        challenge_id,
        user_id: userId,
        github_url,
        deployed_url,
        readme_url,
        ai_conversation_url,
        self_confidence,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 평가 서비스에 큐 추가 (비동기)
    await fetch('http://localhost:3003/api/evaluate/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: data.submission_id })
    });

    res.json({ 
      success: true, 
      submission_id: data.submission_id,
      message: 'Submitted successfully. Evaluation will take 24-48 hours.'
    });
  }

  private async loadMockData(filename: string) {
    const fs = require('fs').promises;
    const content = await fs.readFile(`./mock/${filename}`, 'utf-8');
    return JSON.parse(content);
  }
}
```

**Mock 데이터** (`services/challenge-service/src/mock/challenges_data.txt`):

```json
[
  {
    "challenge_id": "ch-001",
    "category": "development",
    "subcategory": "frontend",
    "difficulty": "accomplished",
    "title": "AI를 활용한 실시간 채팅 앱 구현",
    "short_description": "Claude Code 또는 Cursor AI를 활용하여 실시간 채팅 구현",
    "description": "Claude Code 또는 Cursor AI를 활용하여 실시간 채팅 애플리케이션을 구현하세요...",
    "requirements": [
      "React + TypeScript 사용",
      "실시간 메시징 (WebSocket or Firebase)",
      "메시지 검색 기능",
      "Responsive Design (모바일 대응)",
      "AI 코드 생성 비율 > 60%"
    ],
    "submission_requirements": [
      "GitHub Repository (Public)",
      "README.md with setup instructions",
      "Deployed link (Vercel/Netlify)",
      "(Optional) Screen recording"
    ],
    "allowed_tools": [
      "Claude Code",
      "Cursor AI",
      "GitHub Copilot",
      "ChatGPT"
    ],
    "evaluation_criteria": {
      "functionality": 40,
      "code_quality": 30,
      "ai_usage": 20,
      "ui_ux": 10
    },
    "time_limit_hours": 48,
    "completions_count": 247,
    "pass_rate": 68,
    "avg_score": 76,
    "is_published": true,
    "created_by": "platform"
  },
  {
    "challenge_id": "ch-002",
    "category": "business",
    "subcategory": "pm",
    "difficulty": "beginner",
    "title": "AI를 활용한 신규 기능 기획서 작성",
    "short_description": "특정 문제를 해결하는 신규 기능을 AI와 협업하여 기획",
    "requirements": [
      "문제 정의 (Problem Statement)",
      "솔루션 제안 (Proposed Solution)",
      "핵심 기능 3가지 (Key Features)",
      "성공 지표 (Success Metrics)"
    ],
    "submission_requirements": [
      "기획서 PDF 또는 Notion 링크",
      "(Optional) AI 대화 이력"
    ],
    "time_limit_hours": 1,
    "completions_count": 1247,
    "pass_rate": 82,
    "avg_score": 81,
    "is_published": true
  }
]
```

---

### Feature 3: Skill Card & Badge System

#### 3.1 스킬 카드 컴포넌트

**파일**: `components/cards/SkillCard.tsx`

```tsx
interface SkillCardProps {
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
  };
}

export function SkillCard({ skill }: SkillCardProps) {
  const isCompleted = skill.status === 'completed';

  if (!isCompleted) {
    // 응시 전 카드 (Workera 이미지 참고)
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {skill.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Level: {skill.difficulty}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Take this challenge to unlock your skill badge
            </p>
            <Button className="w-full">
              Start Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 응시 후 카드 (그라데이션, Workera 스타일)
  return (
    <Card className="overflow-hidden relative group hover:scale-105 transition-transform">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
      
      {/* 컨텐츠 */}
      <CardContent className="relative p-6 text-white">
        {/* Share 버튼 */}
        <div className="absolute top-4 right-4">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* 등급 배지 */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* 다이아몬드 아이콘 (Workera 스타일) */}
            <div className="w-24 h-24 flex items-center justify-center">
              {getGradeIcon(skill.grade)} {/* 💎🏆🥈🥉 etc */}
            </div>
            {/* 점수 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{skill.score}</span>
            </div>
          </div>
        </div>

        {/* 등급 텍스트 */}
        <div className="text-center mb-4">
          <p className="text-sm opacity-90 mb-1">GRADE {skill.grade}</p>
          <h3 className="font-bold text-xl mb-2">{skill.name}</h3>
          <p className="text-sm opacity-75">
            Verified: {new Date(skill.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* 점수 바 */}
        <div className="mb-4">
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${skill.score}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2 opacity-90">
            {skill.score}/100 • Top {100 - skill.percentile}%
          </p>
        </div>

        {/* 세부 점수 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-75">Functionality</span>
            <span className="font-medium">90%</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">Code Quality</span>
            <span className="font-medium">85%</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">AI Usage</span>
            <span className="font-medium">92%</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-75">UI/UX</span>
            <span className="font-medium">80%</span>
          </div>
        </div>

        {/* 액션 */}
        <div className="mt-6 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={() => router.push(`/feedback/${skill.id}`)}
          >
            View Feedback
          </Button>
          <Button 
            variant="outline"
            className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={handleRetake}
          >
            Retake
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Feature 4: AI Evaluation Service (평가 서비스)

#### 4.1 자동 평가 엔진

**파일**: `services/evaluation-service/src/services/ai-grader.service.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

export class AIGraderService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
  }

  async evaluateSubmission(submission: Submission, challenge: Challenge) {
    // 1. GitHub Repo 분석
    const repoAnalysis = await this.analyzeGitHubRepo(submission.github_url);
    
    // 2. README 분석
    const readmeContent = await this.fetchReadme(submission.readme_url);
    
    // 3. AI 대화 이력 분석 (있는 경우)
    const aiUsageAnalysis = submission.ai_conversation_url
      ? await this.analyzeAIConversation(submission.ai_conversation_url)
      : null;

    // 4. Claude에게 종합 평가 요청
    const evaluation = await this.comprehensiveEvaluation({
      challenge,
      repoAnalysis,
      readmeContent,
      aiUsageAnalysis
    });

    return evaluation;
  }

  private async comprehensiveEvaluation(context: any) {
    const prompt = `
You are an expert code reviewer and mentor evaluating a coding challenge submission.

Challenge: ${context.challenge.title}
Requirements: ${JSON.stringify(context.challenge.requirements)}
Evaluation Criteria: ${JSON.stringify(context.challenge.evaluation_criteria)}

Submission Analysis:
- GitHub Repository: ${context.repoAnalysis.summary}
- File Count: ${context.repoAnalysis.fileCount}
- Lines of Code: ${context.repoAnalysis.linesOfCode}
- Technologies Used: ${context.repoAnalysis.technologies.join(', ')}
- README Quality: ${context.readmeContent.length > 500 ? 'Detailed' : 'Basic'}
${context.aiUsageAnalysis ? `- AI Usage: ${context.aiUsageAnalysis.summary}` : ''}

Please provide a comprehensive evaluation in JSON format:

{
  "scores": {
    "functionality": 0-100,
    "code_quality": 0-100,
    "ai_usage": 0-100,
    "ui_ux": 0-100,
    "total": 0-100
  },
  "grade": "S" | "A" | "B" | "C" | "D" | "F",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "feedback": "Detailed feedback in Korean (800-1200 words)",
  "code_examples": [
    {
      "issue": "문제점",
      "current_code": "현재 코드",
      "improved_code": "개선된 코드",
      "explanation": "설명"
    }
  ],
  "recommended_resources": ["resource 1", "resource 2", "resource 3"],
  "next_steps": "What to do next"
}

Be encouraging but honest. Provide specific, actionable feedback.
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const evaluationText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
    
    // JSON 파싱
    const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse evaluation JSON');
    }

    return JSON.parse(jsonMatch[0]);
  }

  private async analyzeGitHubRepo(githubUrl: string) {
    // GitHub API를 통해 repo 분석
    const repoPath = githubUrl.replace('https://github.com/', '');
    const [owner, repo] = repoPath.split('/');

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const repoData = await response.json();

    // 파일 목록 가져오기
    const contentsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const contents = await contentsResponse.json();

    return {
      summary: repoData.description || 'No description',
      fileCount: contents.length,
      linesOfCode: await this.estimateLinesOfCode(owner, repo),
      technologies: this.detectTechnologies(contents),
      hasTests: contents.some((file: any) => 
        file.name.includes('test') || file.name.includes('spec')
      ),
      stars: repoData.stargazers_count,
      lastUpdated: repoData.updated_at
    };
  }
}
```

**Mock 데이터** (`services/evaluation-service/src/mock/evaluation_results.txt`):

```json
{
  "submission_id": "sub-001",
  "challenge_id": "ch-001",
  "user_id": "user-123",
  "scores": {
    "functionality": 90,
    "code_quality": 85,
    "ai_usage": 92,
    "ui_ux": 80,
    "total": 88
  },
  "grade": "A",
  "strengths": [
    "Excellent AI tool usage - effectively leveraged Claude Code for component generation",
    "Clean code structure with proper TypeScript typing",
    "All required features implemented and working correctly"
  ],
  "weaknesses": [
    "UI could be more polished with loading states",
    "Missing accessibility features (ARIA labels)"
  ],
  "suggestions": [
    "Add loading states for async operations",
    "Implement error boundaries",
    "Add keyboard navigation support"
  ],
  "feedback": "전체적으로 매우 우수한 제출물입니다. 특히 AI 도구를 활용한 코드 생성 능력이 인상적입니다...",
  "code_examples": [
    {
      "issue": "Loading state 부재",
      "current_code": "const sendMessage = async (text) => { await api.send(text); };",
      "improved_code": "const sendMessage = async (text) => { setIsLoading(true); try { await api.send(text); } finally { setIsLoading(false); } };",
      "explanation": "사용자 경험 향상을 위해 로딩 상태를 추가하세요"
    }
  ],
  "recommended_resources": [
    "https://react.dev/learn/accessibility",
    "https://www.framer.com/motion/",
    "SkillSync Learn - Error Handling Module"
  ],
  "next_steps": "You're ready for the Expert level! Try 'Advanced React Patterns with AI'",
  "evaluated_at": "2025-11-20T15:30:00Z",
  "evaluator_type": "ai"
}
```

---

### Feature 5: AIQ Personality Assessment

#### 5.1 설문 화면

**파일**: `app/(dashboard)/aiq-assessment/page.tsx`

```typescript
const QUESTIONS = [
  {
    id: 1,
    dimension: '속도 vs 완성도',
    question: '나는 AI를 사용할 때, 작업을 빨리 진행하는 것이 중요하다고 느끼는 편이다.',
    affects: ['U'],  // Usage & Productivity
    weight: 1.0
  },
  {
    id: 2,
    dimension: '속도 vs 완성도',
    question: '나는 AI를 사용할 때, 결과물의 완성도와 디테일을 충분히 맞추는 것이 중요하다고 느끼는 편이다.',
    affects: ['P'],  // Performance & Quality
    weight: 1.0
  },
  // ... 18개 더
];

export default function AIQAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(0));

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 문항 → 결과 계산
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    // 능력치 점수 계산
    const capabilities = calculateCapabilities(finalAnswers);
    
    // 유형 판정
    const aiqType = determineAIQType(capabilities);

    // API 저장
    await fetch('/api/aiq/submit', {
      method: 'POST',
      body: JSON.stringify({
        answers: finalAnswers,
        capabilities,
        aiq_type: aiqType
      })
    });

    router.push('/aiq-assessment/results');
  };

  return (
    <div className="container max-w-3xl mx-auto p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>AIQ Assessment</CardTitle>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} / 20
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / 20) * 100} />
        </CardHeader>

        <CardContent>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {QUESTIONS[currentQuestion].question}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { value: 1, label: '① 전혀 그렇지 않음' },
              { value: 2, label: '② 그렇지 않음' },
              { value: 3, label: '③ 그러함' },
              { value: 4, label: '④ 매우 그러함' }
            ].map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  answers[currentQuestion] === option.value
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300 bg-white"
                )}
                onClick={() => handleAnswer(option.value)}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* 팁 */}
          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              정답은 없습니다. 평소 업무 습관을 솔직히 선택하세요.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            ⏱ Estimated: {Math.max(0, 15 - currentQuestion)} min remaining
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

// 능력치 계산 함수
function calculateCapabilities(answers: number[]) {
  const capabilities = {
    U: 0,  // Usage & Productivity
    P: 0,  // Performance & Quality
    C: 0,  // AI Contribution
    R: 0,  // Prompting & Communication
    E: 0,  // Ethical
    S: 0,  // Strategic
    Co: 0, // Collaboration
    F: 0   // Fundamentals
  };

  QUESTIONS.forEach((q, index) => {
    const answer = answers[index];
    q.affects.forEach(capability => {
      capabilities[capability] += (answer / 4) * 100 * q.weight;
    });
  });

  // 정규화 (0-100)
  Object.keys(capabilities).forEach(key => {
    capabilities[key] = Math.min(100, capabilities[key] / countAffects(key) * 100);
  });

  return capabilities;
}
```

---

## 📊 데이터 모델 (Supabase Schema)

### SQL 스키마 정의

**파일**: `database/schema.sql`

```sql
-- Users (Supabase Auth 확장)
CREATE TABLE user_profiles (
  profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  role VARCHAR(50),
  years_experience INTEGER,
  location VARCHAR(100),
  aiq_type VARCHAR(50),
  bio TEXT,
  avatar_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Tool Integrations
CREATE TABLE ai_tool_integrations (
  integration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  tool_name VARCHAR(50) NOT NULL,  -- 'claude_code', 'cursor', 'copilot'
  integration_method VARCHAR(20) DEFAULT 'api',  -- 'api', 'csv', 'screenshot'
  encrypted_api_key TEXT,  -- Encrypted
  last_synced_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Usage Metrics
CREATE TABLE ai_usage_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES ai_tool_integrations(integration_id),
  metric_date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  lines_of_code INTEGER DEFAULT 0,
  acceptance_rate FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(integration_id, metric_date)
);

-- Challenges
CREATE TABLE challenges (
  challenge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,  -- 'development', 'data', 'design', 'business'
  subcategory VARCHAR(50),
  difficulty VARCHAR(20) NOT NULL,  -- 'beginner', 'developing', 'accomplished', 'expert'
  title VARCHAR(200) NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL,  -- Array of requirements
  submission_requirements JSONB NOT NULL,
  allowed_tools JSONB,
  evaluation_criteria JSONB NOT NULL,  -- {"functionality": 40, "code_quality": 30, ...}
  time_limit_hours INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT true,  -- true: platform, false: custom
  created_by UUID REFERENCES user_profiles(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(challenge_id),
  user_id UUID REFERENCES user_profiles(user_id),
  github_url VARCHAR(500),
  deployed_url VARCHAR(500),
  readme_url VARCHAR(500),  -- S3 URL
  ai_conversation_url VARCHAR(500),  -- S3 URL
  screenshot_url VARCHAR(500),
  video_url VARCHAR(500),
  self_confidence INTEGER CHECK (self_confidence BETWEEN 1 AND 5),
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'evaluating', 'completed', 'rejected'
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Evaluations
CREATE TABLE evaluations (
  evaluation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(submission_id),
  total_score FLOAT NOT NULL,
  grade VARCHAR(1) NOT NULL,  -- 'S', 'A', 'B', 'C', 'D', 'F'
  functionality_score FLOAT,
  code_quality_score FLOAT,
  ai_usage_score FLOAT,
  ui_ux_score FLOAT,
  feedback TEXT,
  strengths JSONB,  -- Array of strings
  weaknesses JSONB,
  suggestions JSONB,
  code_examples JSONB,  -- Array of {issue, current, improved, explanation}
  recommended_resources JSONB,
  next_steps TEXT,
  evaluated_at TIMESTAMP DEFAULT NOW(),
  evaluator_type VARCHAR(20) DEFAULT 'ai'  -- 'ai', 'human', 'hybrid'
);

-- AIQ Assessments
CREATE TABLE aiq_assessments (
  aiq_assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  answers JSONB NOT NULL,  -- Array of 20 integers (1-4)
  usage_productivity_score INTEGER,
  performance_quality_score INTEGER,
  ai_contribution_score INTEGER,
  prompting_communication_score INTEGER,
  ethical_responsible_score INTEGER,
  strategic_creative_score INTEGER,
  collaboration_adaptability_score INTEGER,
  ai_fundamentals_score INTEGER,
  aiq_type VARCHAR(50),  -- 'speed_executor', 'precision_analyst', etc
  confidence_level FLOAT,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Badges (Achievement System)
CREATE TABLE user_badges (
  badge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  badge_type VARCHAR(50),  -- 'skill_grade', 'achievement', 'milestone'
  skill_name VARCHAR(100),
  grade VARCHAR(1),
  score INTEGER,
  image_url VARCHAR(500),  -- Generated badge image
  earned_at TIMESTAMP DEFAULT NOW(),
  shared_on_linkedin BOOLEAN DEFAULT false,
  share_count INTEGER DEFAULT 0
);

-- Job Postings (채용 공고)
CREATE TABLE job_postings (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES user_profiles(user_id),  -- Company account
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  remote_ok BOOLEAN DEFAULT false,
  salary_min INTEGER,
  salary_max INTEGER,
  employment_type VARCHAR(20),  -- 'full_time', 'part_time', 'contract'
  experience_level VARCHAR(20),  -- 'entry', 'mid', 'senior'
  required_skills JSONB NOT NULL,  -- [{"skill_name": "React", "min_grade": "B", "weight": "high"}]
  preferred_aiq_types JSONB,  -- ['speed_executor', 'creative_innovator']
  min_ai_percentile INTEGER DEFAULT 50,
  status VARCHAR(20) DEFAULT 'open',  -- 'open', 'closed', 'filled'
  max_applicants INTEGER DEFAULT 100,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_postings(job_id),
  user_id UUID REFERENCES user_profiles(user_id),
  match_score INTEGER,
  status VARCHAR(20) DEFAULT 'applied',  -- 'applied', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'
  applied_at TIMESTAMP DEFAULT NOW(),
  interview_scheduled_at TIMESTAMP,
  hired_at TIMESTAMP,
  UNIQUE(job_id, user_id)
);
```

### RLS (Row Level Security) 정책

```sql
-- Users can only see their own data
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Challenges are public
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published challenges"
  ON challenges FOR SELECT
  USING (is_published = true);

-- Submissions: users see own, companies see applicants
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🔌 API 명세 (OpenAPI 3.0 스타일)

### AI Usage Service API

```yaml
/api/ai-usage/connect:
  post:
    summary: Connect AI tool with API key
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              provider:
                type: string
                enum: [claude_code, cursor, github_copilot]
              api_key:
                type: string
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                success: boolean
                integration_id: string
                last_synced_at: string

/api/ai-usage/sync:
  post:
    summary: Manually trigger sync
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              integration_id: string
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                success: boolean
                records_synced: integer

/api/ai-usage/dashboard:
  get:
    summary: Get usage dashboard data
    parameters:
      - name: days
        in: query
        schema:
          type: integer
          default: 90
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                total_interactions: integer
                active_days: integer
                top_tool: object
                tools: array
                heatmap_data: array
```

### Challenge Service API

```yaml
/api/challenges:
  get:
    summary: Get challenges list
    parameters:
      - name: category
        in: query
        schema:
          type: string
      - name: difficulty
        in: query
        schema:
          type: string
      - name: status
        in: query
        schema:
          type: string
          enum: [all, not_started, in_progress, completed]
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                challenges: array

/api/challenges/{id}:
  get:
    summary: Get challenge details
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
    responses:
      200:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Challenge'

/api/challenges/submit:
  post:
    summary: Submit challenge solution
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              challenge_id: string
              github_url: string
              deployed_url: string
              readme_url: string
              ai_conversation_url: string
              self_confidence: integer
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                success: boolean
                submission_id: string
                message: string
```

---

## 🎯 개발 우선순위 & 로드맵

### Sprint 1 (Week 1-2): Foundation

**목표**: 기본 인프라 구축 & Mock Data로 프로토타입

- [ ] Next.js 프로젝트 셋업
- [ ] Tailwind + Shadcn UI 설정
- [ ] Supabase 프로젝트 생성 & 스키마 배포
- [ ] 6개 마이크로서비스 폴더 구조 생성
- [ ] Mock 데이터 파일 작성 (6개 서비스)
- [ ] API Gateway 구축 (Express)
- [ ] 인증 시스템 (Supabase Auth)

**Deliverable**: 로컬 환경에서 실행 가능한 프로토타입

### Sprint 2 (Week 3-4): AI Usage Dashboard

- [ ] AI Usage Dashboard UI 구현
- [ ] API Key 입력 & 저장 (암호화)
- [ ] Mock Data로 사용량 시각화
- [ ] Bar chart, Heatmap 구현 (Recharts)
- [ ] LinkedIn 공유 기능

**Deliverable**: AI Usage 기능 완성 (Mock)

### Sprint 3 (Week 5-7): Challenge System (Core)

- [ ] 과제 목록 페이지
- [ ] 과제 상세 페이지
- [ ] 제출 폼 & 파일 업로드 (S3)
- [ ] 스킬 카드 컴포넌트 (응시 전/후)
- [ ] Mock 평가 결과 표시

**Deliverable**: Challenge 기능 완성 (Mock)

### Sprint 4 (Week 8-9): AI Evaluation Engine

- [ ] Claude API 통합
- [ ] GitHub API 통합 (Repo 분석)
- [ ] 자동 평가 로직 구현
- [ ] 피드백 생성 & 표시
- [ ] 등급 배지 이미지 생성

**Deliverable**: 실제 AI 평가 작동

### Sprint 5 (Week 10-11): AIQ Assessment

- [ ] 20문항 설문 UI
- [ ] 능력치 계산 알고리즘
- [ ] 유형 판정 로직
- [ ] 결과 페이지 (Radar chart)
- [ ] AIQ 리포트 PDF 생성

**Deliverable**: AIQ 기능 완성

### Sprint 6 (Week 12): Polish & Testing

- [ ] 전체 UX 흐름 테스트
- [ ] 버그 수정
- [ ] 성능 최적화
- [ ] 모바일 반응형 체크
- [ ] Closed Beta 준비

**Deliverable**: Beta-ready Product

---

## 🛠 개발 가이드 (AI 코딩 도구용)

### Claude Code / Cursor에게 요청하는 방법

#### 예시 1: AI Usage Dashboard 개발

```
I need to build the AI Usage Analytics Dashboard for SkillSync.

Requirements:
- Next.js 14 app router
- UI should match the Workera style (provided images)
- Use Tailwind CSS with the color palette defined in the PRD
- Implement bar charts for tool usage breakdown
- Implement heatmap for activity calendar
- Use Mock data from mock/ai_usage_data.txt
- Components should use Shadcn UI

Please create:
1. app/(dashboard)/ai-usage/page.tsx - Main dashboard
2. components/charts/UsageBarChart.tsx - Bar chart component
3. components/charts/ActivityHeatmap.tsx - Heatmap component
4. lib/mock/ai-usage-data.ts - Mock data loader

Follow the exact UI structure from the PRD section "Feature 1.2".
Use the design system colors and typography specified.
```

#### 예시 2: Evaluation Service 개발

```
I need to build the AI Evaluation Service (Port 3003) for SkillSync.

This microservice will:
1. Receive submission data from Challenge Service
2. Analyze GitHub repository
3. Use Claude API to generate comprehensive feedback
4. Calculate scores and assign grades
5. Save results to Supabase

Tech stack:
- Node.js + Express + TypeScript
- Claude SDK (@anthropic-ai/sdk)
- Supabase client
- Mock mode support (USE_MOCK_DATA env variable)

Files to create:
- services/evaluation-service/src/index.ts
- services/evaluation-service/src/controllers/evaluation.controller.ts
- services/evaluation-service/src/services/ai-grader.service.ts
- services/evaluation-service/src/services/github-analyzer.service.ts
- services/evaluation-service/src/mock/evaluation_results.txt

Refer to the PRD section "Feature 4: AI Evaluation Service" for detailed logic.
Follow the exact prompt template for Claude API.
```

### Cursor / Lovable에게 전체 컴포넌트 생성 요청

```
Create a complete SkillCard component for SkillSync based on the PRD.

The card should have two states:
1. Before completion: Simple card with lock icon
2. After completion: Gradient card with grade badge (Workera style)

Props interface:
- skill: { id, name, category, difficulty, status, grade, score, percentile }

UI Requirements:
- Use Tailwind CSS with the color palette from PRD
- Gradient: from-indigo-600 via-purple-600 to-pink-500
- Show grade icon (💎 for S, 🏆 for A, etc.)
- Display score bar with animation
- Breakdown scores (functionality, code_quality, ai_usage, ui_ux)
- Action buttons: View Feedback, Retake, Share

Refer to PRD section "Feature 3.1" for exact UI structure.
Use the code example provided.
```

---

## 📦 배포 가이드

### Frontend 배포 (Vercel)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd skillsync-frontend
vercel --prod

# 환경 변수 설정 (Vercel Dashboard)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_GATEWAY_URL=https://api.skillsync.io
```

### Backend Services 배포 (Railway / Fly.io)

각 마이크로서비스별로 독립 배포:

```bash
# AI Usage Service
cd services/ai-usage-service
flyctl launch --name skillsync-ai-usage
flyctl deploy

# Challenge Service
cd services/challenge-service
flyctl launch --name skillsync-challenge
flyctl deploy

# ... 나머지 서비스들도 동일
```

### Supabase 설정

```bash
# Supabase CLI 설치
npm install -g supabase

# 로컬 Supabase 시작 (개발용)
supabase start

# 스키마 적용
supabase db push

# Production 배포
supabase link --project-ref your-project-ref
supabase db push
```
