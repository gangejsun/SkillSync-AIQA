# SkillSync Sprint 1: Foundation - Context

## SESSION PROGRESS (2025-11-21)

### ✅ COMPLETED
- Dev docs structure created (plan, context, tasks)
- Sprint 1 implementation plan written
- Next.js 14 frontend project created with TypeScript and Tailwind
- Complete frontend folder structure (app router, components, lib, etc.)
- Tailwind configured with custom color palette from PRD
- All configuration files (tsconfig, next.config, postcss, etc.)
- Frontend README.md with setup instructions
- 6 microservices folder structures created
- All 6 services initialized with Express + TypeScript
- Each service has package.json, tsconfig.json, index.ts, .env.example
- API Gateway created with proxy configuration to all services
- Root README.md with comprehensive project overview
- AI Usage Service dev docs (plan.md) created as example

### 🟡 IN PROGRESS
- Creating remaining service dev docs (context.md and tasks.md for all services)
- Mock data file creation for all services

### ⚠️ BLOCKERS
- Need to install npm packages (not done yet to keep session fast)
- Need Supabase project creation and schema deployment

---

## Project Overview

**SkillSync** is an AI skills assessment platform that:
1. Connects to AI tools (Claude Code, Cursor, GitHub Copilot) to track usage
2. Provides coding challenges to assess AI collaboration skills
3. Awards verified badges based on performance
4. Matches candidates with companies based on AI proficiency

**Architecture:** Microservices (6 backend services + Next.js frontend + Supabase)

---

## Key Files & Directories

### Documentation
**[ai-skill-service-plan-prd.md](../../../ai-skill-service-plan-prd.md)**
- Complete product requirements document
- Contains all UI/UX specifications
- Database schema definitions
- API specifications
- Design system (colors, typography, components)

**[Dev Docs Pattern.md](../../../Dev Docs Pattern.md)**
- Methodology for maintaining context across sessions
- Three-file structure: plan, context, tasks
- Best practices for documentation

### Project Structure (To Be Created)
```
AIQA/
├── frontend/                 # Next.js 14 application
│   ├── app/                  # App router
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   └── (public)/        # Public pages
│   ├── components/          # React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── charts/          # Chart components (Recharts)
│   │   ├── cards/           # Skill cards, badges
│   │   └── layouts/         # Layout components
│   ├── lib/                 # Utilities
│   │   ├── api/             # API client functions
│   │   ├── mock/            # Mock data loaders
│   │   └── utils/           # Helper functions
│   └── styles/              # Global styles
│
├── services/                # Backend microservices
│   ├── ai-usage-service/    # Port 3001 - AI tool usage tracking
│   ├── challenge-service/   # Port 3002 - Challenge management
│   ├── evaluation-service/  # Port 3003 - AI-powered evaluation
│   ├── badge-service/       # Port 3004 - Badge generation
│   ├── matching-service/    # Port 3005 - Candidate-job matching
│   ├── report-service/      # Port 3006 - Analytics & reports
│   └── api-gateway/         # Port 4000 - Request routing
│
├── database/                # Database schemas & migrations
│   ├── schema.sql           # Complete Supabase schema
│   └── migrations/          # Migration files
│
└── dev/                     # Development documentation
    └── active/              # Current work
        └── sprint-1-foundation/  # This sprint
```

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Library:** Shadcn UI (Radix UI primitives)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State:** Zustand
- **HTTP Client:** Axios
- **Auth:** Supabase Auth

### Backend (All Services)
- **Runtime:** Node.js 18+
- **Framework:** Express
- **Language:** TypeScript
- **Auth:** JWT + Supabase
- **CORS:** Enabled for localhost:3000

### Database & Storage
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** AWS S3 (for file uploads)
- **ORM/Client:** Supabase JS Client

### External APIs (Future Sprints)
- Anthropic Claude API (evaluation)
- GitHub API (repo analysis, Copilot metrics)
- LinkedIn API (badge sharing)

---

## Design System Summary

### Color Palette
```css
/* Primary - Indigo (Professional, Trust) */
--primary-500: #6366F1;
--primary-600: #4F46E5;

/* Secondary - Purple (Innovation) */
--secondary-500: #8B5CF6;

/* Success - Green */
--accent-500: #10B981;

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-900: #111827;
```

### Typography
- **Font Family:** Pretendard (Korean + Latin)
- **Code Font:** Fira Code
- **Scale:** 12px to 36px

### Component Patterns
- **Cards:** Rounded-2xl, shadow-sm, border
- **Buttons:** px-6 py-3, rounded-lg
- **Gradient Cards:** from-indigo-600 via-purple-600 to-pink-500

---

## Microservices Responsibilities

### 1. AI Usage Service (Port 3001)
**Purpose:** Track and analyze AI tool usage

**Responsibilities:**
- Store encrypted API keys
- Fetch usage data from Claude Code API
- Fetch usage data from GitHub Copilot API
- Aggregate and visualize metrics
- Generate usage reports

**Key Endpoints:**
- POST /api/ai-usage/connect - Connect AI tool
- GET /api/ai-usage/dashboard - Get dashboard data
- POST /api/ai-usage/sync - Manually sync data

**Mock Data:** `ai_usage_data.txt`

### 2. Challenge Service (Port 3002)
**Purpose:** Manage coding challenges

**Responsibilities:**
- CRUD operations for challenges
- Filter by category/difficulty
- Handle submissions
- Track submission status
- File upload coordination

**Key Endpoints:**
- GET /api/challenges - List challenges
- GET /api/challenges/:id - Challenge details
- POST /api/challenges/submit - Submit solution

**Mock Data:** `challenges_data.txt`

### 3. Evaluation Service (Port 3003)
**Purpose:** AI-powered evaluation of submissions

**Responsibilities:**
- Analyze GitHub repositories
- Use Claude API for code review
- Calculate scores by criteria
- Generate detailed feedback
- Assign grades (S/A/B/C/D/F)

**Key Endpoints:**
- POST /api/evaluate/enqueue - Add to evaluation queue
- GET /api/evaluate/:id - Get evaluation results

**Mock Data:** `evaluation_results.txt`

### 4. Badge Service (Port 3004)
**Purpose:** Generate and manage badges

**Responsibilities:**
- Create badge images (Canvas API)
- Generate LinkedIn share images
- Render skill cards
- Create PDF certificates

**Key Endpoints:**
- POST /api/badges/generate - Generate badge
- GET /api/badges/:userId - User's badges

**Mock Data:** `badges_data.txt`

### 5. Matching Service (Port 3005)
**Purpose:** Match candidates with jobs

**Responsibilities:**
- Calculate matching scores
- Recommend jobs to candidates
- Filter candidates for companies
- Send interview invitations

**Key Endpoints:**
- GET /api/jobs - List job postings
- GET /api/jobs/recommendations - Job recommendations
- POST /api/jobs/:id/apply - Apply to job

**Mock Data:** `job_postings.txt`, `candidates.txt`

### 6. Report Service (Port 3006)
**Purpose:** Generate analytics and reports

**Responsibilities:**
- Team skill analysis
- Organization-wide metrics
- PDF report generation
- CSV export

**Key Endpoints:**
- GET /api/reports/team/:teamId - Team analytics
- GET /api/reports/export - Export data

**Mock Data:** `team_analytics.txt`

---

## Database Schema Overview

### Core Tables
- **user_profiles** - User information (extends Supabase auth.users)
- **ai_tool_integrations** - Connected AI tools per user
- **ai_usage_metrics** - Daily usage data per tool
- **challenges** - Challenge library
- **submissions** - User submissions
- **evaluations** - Evaluation results
- **aiq_assessments** - AIQ personality test results
- **user_badges** - Earned badges
- **job_postings** - Job listings
- **job_applications** - Applications

### Security
- Row Level Security (RLS) enabled
- Users see only their own data
- Companies see applicants for their jobs
- Challenges are public

---

## Current Sprint Goals

### Must Have (Sprint 1)
✅ Next.js project running
✅ All 6 services running on designated ports
✅ Supabase schema deployed
✅ Auth flow working (signup/login)
✅ Mock data files created
✅ Basic API routes responding with mock data
✅ Dev docs for each service

### Nice to Have
- Database seed data
- Docker compose file
- CI/CD pipeline setup

### Explicitly Out of Scope (Future Sprints)
- ❌ Real API integrations (Claude, GitHub)
- ❌ UI implementation (Sprint 2+)
- ❌ File upload to S3 (Sprint 3)
- ❌ Production deployment (Sprint 6)

---

## Environment Variables Needed

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
```

### Backend Services (.env)
```bash
# Common to all services
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
PORT=300X  # Different per service
USE_MOCK_DATA=true  # Sprint 1 uses mock data

# Service-specific (future sprints)
CLAUDE_API_KEY=  # Evaluation service
GITHUB_TOKEN=    # AI Usage, Evaluation services
AWS_S3_BUCKET=   # Challenge service
```

---

## Development Workflow

### Starting All Services (Once Set Up)
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev  # Port 3000

# Terminal 2 - API Gateway
cd services/api-gateway
npm run dev  # Port 4000

# Terminal 3-8 - Individual services
# Each service runs on its designated port (3001-3006)
```

### Or Use Script (To Be Created)
```bash
npm run dev:all  # Starts everything with concurrently
```

---

## Important Decisions Made

### 1. Monorepo Structure
**Decision:** Use a monorepo for frontend + all services
**Reason:** Easier to manage during development, shared types/utils
**Alternative Considered:** Separate repos per service (too complex for MVP)

### 2. Mock Data First
**Decision:** All services use mock data in Sprint 1
**Reason:** Can develop UI and structure without external dependencies
**Implementation:** USE_MOCK_DATA env variable toggles mock vs real APIs

### 3. TypeScript Everywhere
**Decision:** Strict TypeScript for frontend and backend
**Reason:** Better DX, catch errors early, easier refactoring
**Config:** strict: true, noImplicitAny: true

### 4. Shared Auth Middleware
**Decision:** Create shared auth middleware for all services
**Reason:** Consistent JWT validation, DRY principle
**Location:** `services/shared/middleware/auth.ts`

---

## Quick Resume Instructions

### If Context Reset Happens:

1. **Read this file first** - Understand current state
2. **Check tasks file** - See what's done vs pending
3. **Read plan file** - Review overall strategy
4. **Check SESSION PROGRESS** above for latest work

### To Continue Sprint 1:

1. **Check tasks.md** - Find next unchecked task
2. **Reference PRD** for exact specifications
3. **Follow Dev Docs Pattern** for any new services
4. **Update context.md** after completing tasks

### Key PRD Sections to Reference:
- Section "기술 아키텍처" - System architecture
- Section "Frontend 아키텍처" - Frontend structure
- Section "Backend 서비스별 폴더 구조" - Backend structure
- Section "데이터 모델" - Database schema
- Section "개발 환경 설정" - Setup instructions

---

## Useful Commands

### Frontend
```bash
# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app

# Install Shadcn UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input

# Install dependencies
npm install @supabase/supabase-js recharts lucide-react zustand axios
```

### Backend Services
```bash
# Initialize service
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express nodemon ts-node

# TypeScript config
npx tsc --init
```

### Supabase
```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Apply schema
supabase db push
```

---

## Next Session Checklist

Before starting work:
- [ ] Read this context file
- [ ] Check SESSION PROGRESS above
- [ ] Review tasks file for next task
- [ ] Ensure dev environment ready (Node.js, npm installed)

After completing work:
- [ ] Update SESSION PROGRESS
- [ ] Check off completed tasks in tasks.md
- [ ] Note any new decisions in "Important Decisions Made"
- [ ] Update blockers if any

---

## Reference Links

- **PRD:** `ai-skill-service-plan-prd.md`
- **Dev Docs Pattern:** `Dev Docs Pattern.md`
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Shadcn UI:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs
