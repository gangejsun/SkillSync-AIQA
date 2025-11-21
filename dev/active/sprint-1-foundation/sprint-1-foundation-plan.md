# SkillSync Sprint 1: Foundation - Implementation Plan

## Executive Summary

**Goal:** Establish the foundational infrastructure for SkillSync platform including Next.js frontend, 6 microservices backend, Supabase database, and authentication system.

**Timeline:** Week 1-2 (10-14 days)

**Outcome:** A fully functional prototype running locally with mock data, ready for feature development in Sprint 2+.

---

## Current State

- PRD document exists with complete specifications
- No code infrastructure yet
- Target: Microservices Architecture (MSA)
- Tech Stack:
  - Frontend: Next.js 14 + TypeScript + Tailwind + Shadcn UI
  - Backend: Node.js + Express + TypeScript (6 services)
  - Database: Supabase (PostgreSQL + Auth + Storage)
  - External APIs: Claude API, GitHub API

---

## Implementation Phases

### Phase 1: Project Scaffolding (Day 1-2)

#### 1.1 Frontend Setup
**Task:** Initialize Next.js 14 project with TypeScript and Tailwind
- **Acceptance:**
  - Next.js app runs on localhost:3000
  - Tailwind configured with custom color palette from PRD
  - TypeScript strict mode enabled
- **Files:**
  - `frontend/` directory structure
  - `package.json` with all dependencies
  - `tailwind.config.ts` with custom colors
  - `tsconfig.json`

#### 1.2 Design System Configuration
**Task:** Set up Shadcn UI and custom design tokens
- **Acceptance:**
  - Shadcn components installed
  - Custom color palette applied
  - Typography system configured
  - Component library accessible
- **Files:**
  - `frontend/components/ui/` with Shadcn components
  - `frontend/styles/globals.css` with design tokens
  - `frontend/lib/utils.ts` for cn() utility

#### 1.3 Folder Structure
**Task:** Create complete frontend folder structure from PRD
- **Acceptance:**
  - All directories match PRD section "Frontend 아키텍처"
  - Route groups configured: (auth), (dashboard), (public)
  - Layout files created
- **Files:**
  - `frontend/app/(auth)/`, `(dashboard)/`, `(public)/`
  - `frontend/components/ui/`, `charts/`, `cards/`, `layouts/`
  - `frontend/lib/api/`, `mock/`, `utils/`

---

### Phase 2: Backend Services Infrastructure (Day 3-4)

#### 2.1 Create 6 Microservice Directories
**Task:** Set up folder structure for all backend services
- **Acceptance:**
  - 6 service directories created
  - Each has consistent structure: src/, routes/, controllers/, services/, mock/
  - Each has own package.json
- **Services:**
  1. `services/ai-usage-service/` (Port 3001)
  2. `services/challenge-service/` (Port 3002)
  3. `services/evaluation-service/` (Port 3003)
  4. `services/badge-service/` (Port 3004)
  5. `services/matching-service/` (Port 3005)
  6. `services/report-service/` (Port 3006)

#### 2.2 Initialize Each Service
**Task:** Set up Express + TypeScript boilerplate for each service
- **Acceptance:**
  - Each service has Express server configured
  - TypeScript compilation works
  - CORS enabled
  - Each service runs on designated port
- **Files per service:**
  - `src/index.ts` - Server entry point
  - `src/routes/` - Route definitions
  - `src/controllers/` - Request handlers
  - `src/services/` - Business logic
  - `package.json` with Express, TypeScript, dotenv
  - `tsconfig.json`
  - `.env.example`

#### 2.3 API Gateway Setup
**Task:** Create central API Gateway to route requests
- **Acceptance:**
  - Gateway runs on port 4000
  - Routes requests to appropriate services
  - Health check endpoint works
- **Files:**
  - `services/api-gateway/src/index.ts`
  - Proxy configuration for all 6 services

---

### Phase 3: Database & Auth Setup (Day 5-6)

#### 3.1 Supabase Project Creation
**Task:** Set up Supabase project and configure
- **Acceptance:**
  - Supabase project created
  - Connection strings obtained
  - Local Supabase CLI installed
- **Credentials:**
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_KEY

#### 3.2 Database Schema Deployment
**Task:** Deploy complete database schema from PRD
- **Acceptance:**
  - All tables created per PRD "데이터 모델" section
  - Foreign keys configured
  - Indexes added for performance
  - RLS policies applied
- **Files:**
  - `database/schema.sql` - Complete schema
  - `database/migrations/` - Migration files
  - `database/seed.sql` - Test data (optional)

#### 3.3 Supabase Auth Configuration
**Task:** Set up authentication with Supabase Auth
- **Acceptance:**
  - Email/password auth enabled
  - OAuth providers configured (Google, GitHub)
  - Auth middleware created for backend services
  - Frontend auth hooks configured
- **Files:**
  - `frontend/lib/supabase.ts` - Supabase client
  - `frontend/hooks/useAuth.ts` - Auth hook
  - `services/shared/middleware/auth.ts` - Backend auth middleware

---

### Phase 4: Mock Data Generation (Day 7-8)

#### 4.1 AI Usage Mock Data
**Task:** Create mock data file for AI Usage Service
- **Acceptance:**
  - Mock data matches PRD format
  - Includes 90 days of usage data
  - Multiple tools represented
- **Files:**
  - `services/ai-usage-service/src/mock/ai_usage_data.txt`

#### 4.2 Challenges Mock Data
**Task:** Create mock challenges library
- **Acceptance:**
  - At least 10 challenges across categories
  - All difficulty levels represented
  - Includes requirements and evaluation criteria
- **Files:**
  - `services/challenge-service/src/mock/challenges_data.txt`

#### 4.3 Evaluation Results Mock Data
**Task:** Create sample evaluation results
- **Acceptance:**
  - Multiple evaluation examples
  - All grade levels (S, A, B, C, D, F)
  - Includes feedback and code examples
- **Files:**
  - `services/evaluation-service/src/mock/evaluation_results.txt`

#### 4.4 Badges & Other Mock Data
**Task:** Create remaining mock data files
- **Acceptance:**
  - Badge data with image URLs
  - Job postings data
  - Candidate profiles
  - Team analytics
- **Files:**
  - `services/badge-service/src/mock/badges_data.txt`
  - `services/matching-service/src/mock/job_postings.txt`
  - `services/matching-service/src/mock/candidates.txt`
  - `services/report-service/src/mock/team_analytics.txt`

---

### Phase 5: Dev Docs for Each Service (Day 9-10)

#### 5.1 AI Usage Service Dev Docs
**Task:** Create dev docs for AI Usage Service
- **Acceptance:**
  - Plan, context, tasks files created
  - Follows Dev Docs Pattern
  - Documents API endpoints and responsibilities
- **Files:**
  - `dev/active/ai-usage-service/ai-usage-service-plan.md`
  - `dev/active/ai-usage-service/ai-usage-service-context.md`
  - `dev/active/ai-usage-service/ai-usage-service-tasks.md`

#### 5.2 Challenge Service Dev Docs
**Task:** Create dev docs for Challenge Service
- **Acceptance:**
  - Complete documentation
  - API specifications
  - Mock data integration plan
- **Files:**
  - `dev/active/challenge-service/challenge-service-plan.md`
  - `dev/active/challenge-service/challenge-service-context.md`
  - `dev/active/challenge-service/challenge-service-tasks.md`

#### 5.3 Evaluation Service Dev Docs
**Task:** Create dev docs for Evaluation Service
- **Acceptance:**
  - Claude API integration plan
  - GitHub API integration plan
  - Grading algorithm documentation
- **Files:**
  - `dev/active/evaluation-service/evaluation-service-plan.md`
  - `dev/active/evaluation-service/evaluation-service-context.md`
  - `dev/active/evaluation-service/evaluation-service-tasks.md`

#### 5.4 Badge Service Dev Docs
**Task:** Create dev docs for Badge Service
- **Files:**
  - `dev/active/badge-service/badge-service-plan.md`
  - `dev/active/badge-service/badge-service-context.md`
  - `dev/active/badge-service/badge-service-tasks.md`

#### 5.5 Matching Service Dev Docs
**Task:** Create dev docs for Matching Service
- **Files:**
  - `dev/active/matching-service/matching-service-plan.md`
  - `dev/active/matching-service/matching-service-context.md`
  - `dev/active/matching-service/matching-service-tasks.md`

#### 5.6 Report Service Dev Docs
**Task:** Create dev docs for Report Service
- **Files:**
  - `dev/active/report-service/report-service-plan.md`
  - `dev/active/report-service/report-service-context.md`
  - `dev/active/report-service/report-service-tasks.md`

---

### Phase 6: Integration & Testing (Day 11-12)

#### 6.1 Service Communication Test
**Task:** Verify all services can communicate
- **Acceptance:**
  - API Gateway routes to all services
  - Health checks pass
  - Mock data accessible via APIs
- **Test:**
  - GET /api/health on each service
  - GET /api/ai-usage/dashboard (mock)
  - GET /api/challenges (mock)

#### 6.2 Frontend-Backend Integration
**Task:** Connect frontend to backend services
- **Acceptance:**
  - API client functions work
  - Mock data displays in UI
  - Error handling works
- **Files:**
  - `frontend/lib/api/ai-usage.ts`
  - `frontend/lib/api/challenges.ts`
  - `frontend/lib/api/evaluation.ts`
  - `frontend/lib/api/matching.ts`

#### 6.3 Authentication Flow Test
**Task:** Verify complete auth flow
- **Acceptance:**
  - Sign up works
  - Login works
  - Protected routes redirect
  - JWT tokens validated
- **Test:**
  - Create test user
  - Login/logout
  - Access protected dashboard

---

### Phase 7: Documentation & Polish (Day 13-14)

#### 7.1 README Files
**Task:** Create comprehensive README for each component
- **Acceptance:**
  - Root README with project overview
  - README per service with setup instructions
  - Environment variables documented
- **Files:**
  - `README.md` (root)
  - `frontend/README.md`
  - `services/[each-service]/README.md`

#### 7.2 Environment Configuration
**Task:** Document all environment variables
- **Acceptance:**
  - `.env.example` files complete
  - Setup guide created
  - Development vs Production configs documented
- **Files:**
  - `.env.example` (root)
  - `frontend/.env.example`
  - Each service `.env.example`
  - `docs/ENVIRONMENT_SETUP.md`

#### 7.3 Development Scripts
**Task:** Create helper scripts for development
- **Acceptance:**
  - Start all services with one command
  - Stop all services easily
  - Database reset script
- **Files:**
  - `package.json` with scripts
  - `scripts/start-all.sh`
  - `scripts/stop-all.sh`
  - `scripts/reset-db.sh`

---

## Risk Assessment

### Technical Risks

**Risk 1: Microservices Complexity**
- **Impact:** Medium
- **Probability:** High
- **Mitigation:** Start with monorepo, shared utilities, consistent patterns

**Risk 2: Supabase Learning Curve**
- **Impact:** Low
- **Probability:** Medium
- **Mitigation:** Use official docs, start with simple schema

**Risk 3: Mock Data Quality**
- **Impact:** Low
- **Probability:** Low
- **Mitigation:** Follow PRD examples exactly, validate JSON format

### Timeline Risks

**Risk 4: Setup Takes Longer Than Expected**
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Prioritize core services (AI Usage, Challenge) over nice-to-haves

---

## Success Metrics

### Technical Metrics
- ✅ All 6 services start without errors
- ✅ Frontend builds and runs
- ✅ Database schema deploys successfully
- ✅ Auth flow works end-to-end
- ✅ Mock data accessible via APIs

### Code Quality Metrics
- ✅ TypeScript strict mode passes
- ✅ No ESLint errors
- ✅ Consistent code structure across services
- ✅ All .env.example files complete

### Documentation Metrics
- ✅ README in every directory
- ✅ Dev docs created for all 6 services
- ✅ API endpoints documented
- ✅ Setup guide complete

---

## Timeline Estimate

| Phase | Days | Key Deliverable |
|-------|------|----------------|
| Phase 1: Scaffolding | 2 | Frontend + folder structure |
| Phase 2: Backend Services | 2 | 6 services running |
| Phase 3: Database & Auth | 2 | Supabase configured |
| Phase 4: Mock Data | 2 | All mock files created |
| Phase 5: Dev Docs | 2 | 6 service dev docs |
| Phase 6: Integration | 2 | End-to-end working |
| Phase 7: Documentation | 2 | Production-ready docs |
| **Total** | **14 days** | **Fully functional prototype** |

---

## Dependencies

### External Services
- Supabase account (free tier OK for development)
- GitHub account (for OAuth)
- Google Cloud account (for OAuth, optional)

### Development Tools
- Node.js 18+
- npm or pnpm
- Supabase CLI
- Git

### API Keys Needed (Later Sprints)
- Anthropic Claude API key (Sprint 4)
- GitHub Personal Access Token (Sprint 2-3)

---

## Next Steps After Sprint 1

**Sprint 2 Focus:** AI Usage Dashboard (Week 3-4)
- Implement UI components
- Connect to mock data
- Build charts and visualizations
- LinkedIn sharing feature

**Sprint 3 Focus:** Challenge System (Week 5-7)
- Challenge listing
- Challenge submission
- File upload to S3
- Skill cards

---

## Notes

- All development uses mock data in Sprint 1
- Real API integrations start in Sprint 2+
- Focus on structure and patterns, not features
- This sprint sets foundation for all future work
