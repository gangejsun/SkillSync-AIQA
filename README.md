# SkillSync - AI 활용 능력 평가 플랫폼

> **"Sync Your AI Skills to Opportunities"**
> AI와 함께 일하는 능력을 실전 과제로 증명하고, 검증된 배지로 채용 기회를 연결합니다

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Tests%2029%20Passed-success)](https://vitest.dev/)

## 🎯 Project Overview

SkillSync helps users:
1. **Track AI Usage** - Connect AI tools and visualize usage analytics
2. **Take Challenges** - Complete real-world coding challenges using AI assistants
3. **Earn Badges** - Receive verified skill badges based on performance
4. **Find Jobs** - Get matched with companies looking for AI-proficient candidates

## 🏗 Architecture

**Microservices Architecture (MSA)**

```
Frontend (Next.js 14)  →  API Gateway (Port 4000)  →  6 Microservices
                                                      ├─ AI Usage (3001)
                                                      ├─ Challenge (3002)
                                                      ├─ Evaluation (3003)
                                                      ├─ Badge (3004)
                                                      ├─ Matching (3005)
                                                      └─ Report (3006)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (for database)

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd AIQA
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Each service
cd services/ai-usage-service
npm install
# Repeat for all 6 services and api-gateway
```

3. **Set up environment variables**
```bash
# Copy .env.example to .env in each directory
cp frontend/.env.example frontend/.env.local
cp services/api-gateway/.env.example services/api-gateway/.env
# Repeat for all services
```

4. **Start all services**

**Option 1: Manual (separate terminals)**
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - API Gateway
cd services/api-gateway && npm run dev

# Terminal 3-8 - Each microservice
cd services/ai-usage-service && npm run dev
cd services/challenge-service && npm run dev
cd services/evaluation-service && npm run dev
cd services/badge-service && npm run dev
cd services/matching-service && npm run dev
cd services/report-service && npm run dev
```

**Option 2: Using script (recommended)**
```bash
# To be created in Sprint 1
npm run dev:all
```

5. **Verify services are running**
```bash
# Check API Gateway health
curl http://localhost:4000/health

# Check individual services
curl http://localhost:3001/health  # AI Usage
curl http://localhost:3002/health  # Challenge
# ... etc
```

## 📁 Project Structure

```
AIQA/
├── frontend/                   # Next.js 14 App
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & API clients
│   │   ├── hooks/             # Custom hooks
│   │   └── styles/            # Global styles
│   └── package.json
│
├── services/                   # Backend Microservices
│   ├── ai-usage-service/      # Port 3001
│   ├── challenge-service/     # Port 3002
│   ├── evaluation-service/    # Port 3003
│   ├── badge-service/         # Port 3004
│   ├── matching-service/      # Port 3005
│   ├── report-service/        # Port 3006
│   └── api-gateway/           # Port 4000
│
├── database/                   # Database schemas
│   └── schema.sql             # Supabase schema
│
└── dev/                        # Development documentation
    └── active/                # Current sprint docs
        └── sprint-1-foundation/
```

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State:** Zustand
- **Charts:** Recharts
- **Auth:** Supabase Auth

### Backend (All Services)
- **Runtime:** Node.js 18+
- **Framework:** Express
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)

### External APIs (Future Sprints)
- Anthropic Claude API
- GitHub API
- LinkedIn API
- AWS S3 (file storage)

## 📊 Microservices Overview

### 1. AI Usage Service (Port 3001)
**Purpose:** Track and analyze AI tool usage

**Responsibilities:**
- Connect AI tools (Claude Code, Cursor, Copilot)
- Fetch usage metrics from APIs
- Aggregate and visualize data
- Generate usage reports

**Endpoints:**
- `POST /api/ai-usage/connect` - Connect AI tool
- `GET /api/ai-usage/dashboard` - Get dashboard data
- `POST /api/ai-usage/sync` - Sync usage data

### 2. Challenge Service (Port 3002)
**Purpose:** Manage coding challenges and submissions

**Responsibilities:**
- CRUD operations for challenges
- Handle submissions
- File upload coordination
- Track submission status

**Endpoints:**
- `GET /api/challenges` - List challenges
- `GET /api/challenges/:id` - Challenge details
- `POST /api/challenges/submit` - Submit solution

### 3. Evaluation Service (Port 3003)
**Purpose:** AI-powered evaluation of submissions

**Responsibilities:**
- Analyze GitHub repositories
- Use Claude API for code review
- Calculate scores
- Generate feedback

**Endpoints:**
- `POST /api/evaluate/enqueue` - Add to queue
- `GET /api/evaluate/:id` - Get results

### 4. Badge Service (Port 3004)
**Purpose:** Generate and manage badges

**Responsibilities:**
- Create badge images
- Generate LinkedIn share images
- Render skill cards
- Create PDF certificates

**Endpoints:**
- `POST /api/badges/generate` - Generate badge
- `GET /api/badges/:userId` - Get user badges

### 5. Matching Service (Port 3005)
**Purpose:** Match candidates with jobs

**Responsibilities:**
- Calculate matching scores
- Recommend jobs
- Filter candidates
- Send invitations

**Endpoints:**
- `GET /api/jobs` - List jobs
- `GET /api/jobs/recommendations` - Recommendations
- `POST /api/jobs/:id/apply` - Apply to job

### 6. Report Service (Port 3006)
**Purpose:** Generate analytics and reports

**Responsibilities:**
- Team skill analysis
- Organization metrics
- PDF report generation
- CSV export

**Endpoints:**
- `GET /api/reports/team/:teamId` - Team analytics
- `GET /api/reports/export` - Export data

### 7. API Gateway (Port 4000)
**Purpose:** Route requests to appropriate services

**Responsibilities:**
- Request routing
- Health checks
- Load balancing (future)
- Authentication (future)

## 🎨 Design System

### Colors
```css
/* Primary - Indigo */
--primary-500: #6366F1;
--primary-600: #4F46E5;

/* Secondary - Purple */
--secondary-500: #8B5CF6;

/* Accent - Green */
--accent-500: #10B981;
```

### Typography
- **Font Family:** Pretendard (Korean + Latin)
- **Code Font:** Fira Code
- **Scale:** 12px - 36px

## 📝 Development Status

**전체 완료율: 35%**

### ✅ 완료된 기능

#### AIQ 성격 분석 (100% 완료)
- ✅ 10개 질문 설문 조사
- ✅ 8차원 능력 분석 (U, P, C, R, E, S, Co, F)
- ✅ 8가지 성격 유형 판별
- ✅ Recharts 레이더 차트
- ✅ 29개 테스트 - 100% 통과

#### SkillCard 컴포넌트 (100% 완료)
- ✅ 그라데이션 배지 카드
- ✅ Locked/Completed 상태
- ✅ 등급 배지 시스템

#### 상태 관리 & 인프라 (100% 완료)
- ✅ Zustand Stores (AI Usage, Challenge)
- ✅ Supabase 클라이언트 (Mock/Real 모드)
- ✅ 환경 변수 설정

### Sprint 1: Foundation ✅
- [x] Next.js project setup
- [x] 6 microservices structure
- [x] API Gateway
- [x] Mock data system
- [x] AIQ Assessment implementation
- [ ] Supabase schema deployment

### Sprint 2: AI Usage Dashboard (Week 3-4)
- [ ] AI Usage UI implementation
- [ ] Chart components
- [ ] API Key connection flow
- [ ] LinkedIn sharing

### Sprint 3: Challenge System (Week 5-7)
- [ ] Challenge listing & filtering
- [ ] Challenge detail pages
- [ ] Submission flow
- [ ] File upload to S3

### Sprint 4: AI Evaluation Engine (Week 8-9)
- [ ] Claude API integration
- [ ] GitHub API integration
- [ ] Automated grading
- [ ] Feedback generation

## 🧪 Testing

```bash
# Frontend
cd frontend && npm run lint

# Backend services
cd services/ai-usage-service && npm run build
```

## 📚 Documentation

- **PRD:** [ai-skill-service-plan-prd.md](./ai-skill-service-plan-prd.md)
- **Dev Docs Pattern:** [Dev Docs Pattern.md](./Dev Docs Pattern.md)
- **Sprint 1 Plan:** [dev/active/sprint-1-foundation/](./dev/active/sprint-1-foundation/)

## 🤝 Contributing

This is a development project following the PRD specifications. For contributing:

1. Read the PRD document
2. Follow the Dev Docs Pattern
3. Update dev docs after significant changes
4. Maintain TypeScript strict mode

## 📄 License

ISC

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

---

**Status:** Sprint 1 - Foundation Setup (In Progress)
**Last Updated:** 2025-11-21
