# SkillSync Sprint 1: Foundation - Task Checklist

## Phase 1: Project Scaffolding ⏳ NOT STARTED

### Frontend Setup
- [ ] Create Next.js 14 project with TypeScript
  - Run: `npx create-next-app@latest frontend --typescript --tailwind --app`
  - Acceptance: App runs on localhost:3000
- [ ] Configure Tailwind with custom colors from PRD
  - Update `tailwind.config.ts` with color palette
  - Acceptance: Custom colors available in CSS
- [ ] Enable TypeScript strict mode
  - Update `tsconfig.json`: `"strict": true`
  - Acceptance: No TypeScript errors

### Design System Setup
- [ ] Install Shadcn UI
  - Run: `npx shadcn-ui@latest init`
  - Acceptance: components.json created
- [ ] Install core Shadcn components
  - Run: `npx shadcn-ui@latest add button card input label select`
  - Acceptance: Components in `components/ui/`
- [ ] Create globals.css with design tokens
  - Add custom CSS variables for colors, typography, spacing
  - Acceptance: Design tokens accessible globally

### Frontend Folder Structure
- [ ] Create app router directories
  - `app/(auth)/login/`, `app/(auth)/signup/`
  - `app/(dashboard)/`, `app/(public)/`
  - Acceptance: Route groups configured
- [ ] Create component directories
  - `components/ui/`, `components/charts/`, `components/cards/`, `components/layouts/`
  - Acceptance: Directories exist
- [ ] Create lib directories
  - `lib/api/`, `lib/mock/`, `lib/utils/`
  - Acceptance: Directories exist
- [ ] Install frontend dependencies
  - Run: `npm install @supabase/supabase-js recharts lucide-react zustand axios`
  - Acceptance: All packages in package.json

---

## Phase 2: Backend Services Infrastructure ⏳ NOT STARTED

### Service Directories
- [ ] Create ai-usage-service directory structure
  - `services/ai-usage-service/src/{routes,controllers,services,mock}/`
  - Acceptance: Folder structure complete
- [ ] Create challenge-service directory structure
  - `services/challenge-service/src/{routes,controllers,services,mock}/`
  - Acceptance: Folder structure complete
- [ ] Create evaluation-service directory structure
  - `services/evaluation-service/src/{routes,controllers,services,mock}/`
  - Acceptance: Folder structure complete
- [ ] Create badge-service directory structure
  - `services/badge-service/src/{routes,controllers,services,mock}/`
  - Acceptance: Folder structure complete
- [ ] Create matching-service directory structure
  - `services/matching-service/src/{routes,controllers,services,mock}/`
  - Acceptance: Folder structure complete
- [ ] Create report-service directory structure
  - `services/report-service/src/{routes,controllers,services,mock}/`
  - Acceptance: Folder structure complete

### Initialize Services (Repeat for Each Service)

#### AI Usage Service (Port 3001)
- [ ] Initialize npm and install dependencies
  - Run: `npm init -y && npm install express cors dotenv`
  - Dev deps: `npm install -D typescript @types/node @types/express nodemon ts-node`
  - Acceptance: package.json with dependencies
- [ ] Create tsconfig.json
  - Run: `npx tsc --init`
  - Configure: target ES2020, module commonjs, outDir dist
  - Acceptance: TypeScript compiles
- [ ] Create src/index.ts with Express server
  - Listen on port 3001
  - CORS enabled for localhost:3000
  - Health check endpoint: GET /health
  - Acceptance: Server runs, health endpoint responds
- [ ] Create .env.example
  - PORT=3001, USE_MOCK_DATA=true, SUPABASE_URL, etc.
  - Acceptance: All env vars documented

#### Challenge Service (Port 3002)
- [ ] Initialize npm and install dependencies
- [ ] Create tsconfig.json
- [ ] Create src/index.ts with Express server (port 3002)
- [ ] Create .env.example

#### Evaluation Service (Port 3003)
- [ ] Initialize npm and install dependencies
- [ ] Create tsconfig.json
- [ ] Create src/index.ts with Express server (port 3003)
- [ ] Create .env.example

#### Badge Service (Port 3004)
- [ ] Initialize npm and install dependencies
- [ ] Create tsconfig.json
- [ ] Create src/index.ts with Express server (port 3004)
- [ ] Create .env.example

#### Matching Service (Port 3005)
- [ ] Initialize npm and install dependencies
- [ ] Create tsconfig.json
- [ ] Create src/index.ts with Express server (port 3005)
- [ ] Create .env.example

#### Report Service (Port 3006)
- [ ] Initialize npm and install dependencies
- [ ] Create tsconfig.json
- [ ] Create src/index.ts with Express server (port 3006)
- [ ] Create .env.example

### API Gateway
- [ ] Create api-gateway directory
  - `services/api-gateway/src/`
  - Acceptance: Directory exists
- [ ] Initialize API Gateway
  - Install express, http-proxy-middleware, cors
  - Port 4000
  - Acceptance: package.json created
- [ ] Create proxy configuration
  - Route /api/ai-usage/* to localhost:3001
  - Route /api/challenges/* to localhost:3002
  - Route /api/evaluate/* to localhost:3003
  - Route /api/badges/* to localhost:3004
  - Route /api/jobs/* to localhost:3005
  - Route /api/reports/* to localhost:3006
  - Acceptance: Gateway routes to all services
- [ ] Add health check aggregation
  - GET /health - Check all services
  - Acceptance: Returns status of all 6 services

---

## Phase 3: Database & Auth Setup ⏳ NOT STARTED

### Supabase Setup
- [ ] Create Supabase project
  - Go to supabase.com, create new project
  - Acceptance: Project created, connection strings obtained
- [ ] Install Supabase CLI
  - Run: `npm install -g supabase`
  - Acceptance: `supabase --version` works
- [ ] Save credentials
  - Copy SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
  - Acceptance: Credentials documented in .env.example files

### Database Schema
- [ ] Create database/schema.sql file
  - Copy complete schema from PRD section "데이터 모델"
  - Acceptance: SQL file created
- [ ] Deploy schema to Supabase
  - Option 1: Paste SQL in Supabase SQL Editor
  - Option 2: Use `supabase db push`
  - Acceptance: All tables created, no errors
- [ ] Verify tables created
  - Check Supabase Table Editor
  - Acceptance: 10+ tables visible
- [ ] Apply RLS policies
  - Copy RLS policies from PRD
  - Acceptance: RLS enabled on sensitive tables

### Authentication
- [ ] Enable email/password auth in Supabase
  - Supabase Dashboard > Authentication > Providers
  - Acceptance: Email provider enabled
- [ ] (Optional) Enable OAuth providers
  - Google, GitHub
  - Acceptance: OAuth configured
- [ ] Create frontend Supabase client
  - File: `frontend/lib/supabase.ts`
  - Initialize with NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
  - Acceptance: Client exports `supabase` singleton
- [ ] Create useAuth hook
  - File: `frontend/hooks/useAuth.ts`
  - Methods: signUp, signIn, signOut, user
  - Acceptance: Hook exports auth functions
- [ ] Create backend auth middleware
  - File: `services/shared/middleware/auth.ts`
  - Verify JWT from Authorization header
  - Acceptance: Middleware validates tokens

---

## Phase 4: Mock Data Generation ⏳ NOT STARTED

### AI Usage Mock Data
- [ ] Create ai_usage_data.txt
  - File: `services/ai-usage-service/src/mock/ai_usage_data.txt`
  - Content: Copy from PRD section "Feature 1.1" mock data
  - Include: 90 days of usage for Claude Code, Cursor, Copilot
  - Acceptance: Valid JSON, matches PRD format

### Challenges Mock Data
- [ ] Create challenges_data.txt
  - File: `services/challenge-service/src/mock/challenges_data.txt`
  - Content: Copy from PRD section "Feature 2.3" mock data
  - Include: At least 10 challenges, multiple categories and difficulties
  - Acceptance: Valid JSON array, all required fields present

### Evaluation Mock Data
- [ ] Create evaluation_results.txt
  - File: `services/evaluation-service/src/mock/evaluation_results.txt`
  - Content: Copy from PRD section "Feature 4.1" mock data
  - Include: Examples of all grades (S, A, B, C, D, F)
  - Acceptance: Valid JSON, includes feedback and code examples

### Badge Mock Data
- [ ] Create badges_data.txt
  - File: `services/badge-service/src/mock/badges_data.txt`
  - Include: Badge metadata, image URLs, skill names
  - Acceptance: Valid JSON

### Matching Mock Data
- [ ] Create job_postings.txt
  - File: `services/matching-service/src/mock/job_postings.txt`
  - Include: 20+ job postings with requirements
  - Acceptance: Valid JSON
- [ ] Create candidates.txt
  - File: `services/matching-service/src/mock/candidates.txt`
  - Include: Sample candidate profiles with skills
  - Acceptance: Valid JSON

### Report Mock Data
- [ ] Create team_analytics.txt
  - File: `services/report-service/src/mock/team_analytics.txt`
  - Include: Team-level aggregated data
  - Acceptance: Valid JSON

---

## Phase 5: Dev Docs for Each Service ⏳ NOT STARTED

### AI Usage Service Dev Docs
- [ ] Create dev/active/ai-usage-service/ directory
- [ ] Create ai-usage-service-plan.md
  - Implementation phases for AI Usage features
  - API endpoint specifications
  - External API integration plan (Claude Code API, Copilot API)
  - Acceptance: Complete plan following Dev Docs Pattern
- [ ] Create ai-usage-service-context.md
  - Key files, decisions, quick resume
  - Acceptance: Context file with SESSION PROGRESS section
- [ ] Create ai-usage-service-tasks.md
  - Task checklist for implementation
  - Acceptance: Tasks in checkbox format

### Challenge Service Dev Docs
- [ ] Create dev/active/challenge-service/ directory
- [ ] Create challenge-service-plan.md
  - CRUD operations plan
  - Submission flow
  - File upload integration
- [ ] Create challenge-service-context.md
- [ ] Create challenge-service-tasks.md

### Evaluation Service Dev Docs
- [ ] Create dev/active/evaluation-service/ directory
- [ ] Create evaluation-service-plan.md
  - Claude API integration strategy
  - GitHub API integration strategy
  - Grading algorithm specification
- [ ] Create evaluation-service-context.md
- [ ] Create evaluation-service-tasks.md

### Badge Service Dev Docs
- [ ] Create dev/active/badge-service/ directory
- [ ] Create badge-service-plan.md
  - Badge image generation approach
  - LinkedIn sharing strategy
- [ ] Create badge-service-context.md
- [ ] Create badge-service-tasks.md

### Matching Service Dev Docs
- [ ] Create dev/active/matching-service/ directory
- [ ] Create matching-service-plan.md
  - Matching algorithm specification
  - Scoring system
- [ ] Create matching-service-context.md
- [ ] Create matching-service-tasks.md

### Report Service Dev Docs
- [ ] Create dev/active/report-service/ directory
- [ ] Create report-service-plan.md
  - Analytics aggregation plan
  - PDF generation approach
- [ ] Create report-service-context.md
- [ ] Create report-service-tasks.md

---

## Phase 6: Integration & Testing ⏳ NOT STARTED

### Service Communication
- [ ] Test each service health endpoint
  - GET localhost:3001/health (AI Usage)
  - GET localhost:3002/health (Challenge)
  - GET localhost:3003/health (Evaluation)
  - GET localhost:3004/health (Badge)
  - GET localhost:3005/health (Matching)
  - GET localhost:3006/health (Report)
  - Acceptance: All return 200 OK
- [ ] Test API Gateway routing
  - GET localhost:4000/health
  - Acceptance: Gateway returns health of all services
- [ ] Create mock API endpoints
  - GET /api/ai-usage/dashboard (returns mock data)
  - GET /api/challenges (returns mock data)
  - Acceptance: Mock data returned via API

### Frontend-Backend Integration
- [ ] Create API client functions
  - File: `frontend/lib/api/ai-usage.ts`
  - Functions: fetchUsageDashboard(), connectProvider()
  - Acceptance: Functions call API Gateway
- [ ] Create challenge API client
  - File: `frontend/lib/api/challenges.ts`
  - Functions: fetchChallenges(), submitChallenge()
  - Acceptance: Functions call API Gateway
- [ ] Test API calls from frontend
  - Use React Query or plain fetch
  - Acceptance: Data flows from backend to frontend

### Authentication Flow
- [ ] Implement signup page
  - File: `app/(auth)/signup/page.tsx`
  - Use useAuth hook
  - Acceptance: Can create account
- [ ] Implement login page
  - File: `app/(auth)/login/page.tsx`
  - Use useAuth hook
  - Acceptance: Can login with email/password
- [ ] Implement logout
  - Add logout button in layout
  - Acceptance: Clears session
- [ ] Test protected routes
  - Dashboard should redirect if not logged in
  - Acceptance: Auth middleware works

---

## Phase 7: Documentation & Polish ⏳ NOT STARTED

### README Files
- [ ] Create root README.md
  - Project overview
  - Tech stack
  - Quick start guide
  - Acceptance: Clear introduction to project
- [ ] Create frontend/README.md
  - Frontend-specific setup
  - Available scripts
  - Acceptance: Frontend setup documented
- [ ] Create README per service
  - Service-specific documentation
  - API endpoints
  - Acceptance: 6 service READMEs created

### Environment Configuration
- [ ] Update root .env.example
  - All shared environment variables
  - Acceptance: Complete template
- [ ] Verify all service .env.example files
  - Each service has complete example
  - Acceptance: No missing env vars
- [ ] Create ENVIRONMENT_SETUP.md
  - Step-by-step guide to configure environment
  - Acceptance: Guide is clear and complete

### Development Scripts
- [ ] Create root package.json with scripts
  - Install: `npm install`
  - Use workspaces or lerna for monorepo
  - Acceptance: Root package.json configured
- [ ] Create start-all script
  - File: `scripts/start-all.sh`
  - Starts frontend, gateway, all 6 services
  - Use `concurrently` npm package
  - Acceptance: All services start with one command
- [ ] Create stop-all script
  - File: `scripts/stop-all.sh`
  - Kills all running processes
  - Acceptance: Cleanly stops all services
- [ ] (Optional) Create Docker Compose
  - File: `docker-compose.yml`
  - Containerize all services
  - Acceptance: `docker-compose up` works

---

## Sprint 1 Completion Checklist

### Technical Validation
- [ ] Frontend builds without errors (`npm run build`)
- [ ] All 6 services start without errors
- [ ] API Gateway routes to all services
- [ ] Database schema deployed successfully
- [ ] Mock data accessible via APIs
- [ ] Auth flow works end-to-end (signup, login, logout)

### Code Quality
- [ ] No TypeScript errors (frontend and backend)
- [ ] No ESLint warnings
- [ ] Consistent code formatting
- [ ] All .env.example files complete

### Documentation
- [ ] README in every major directory
- [ ] Dev docs created for all 6 services
- [ ] API endpoints documented
- [ ] Setup guide complete and tested

### Ready for Sprint 2
- [ ] All Sprint 1 tasks completed
- [ ] Prototype runs locally
- [ ] Team can start on Sprint 2 (AI Usage Dashboard UI)

---

## Quick Reference

### Ports
- Frontend: 3000
- API Gateway: 4000
- AI Usage Service: 3001
- Challenge Service: 3002
- Evaluation Service: 3003
- Badge Service: 3004
- Matching Service: 3005
- Report Service: 3006

### Key Commands
```bash
# Start frontend
cd frontend && npm run dev

# Start API Gateway
cd services/api-gateway && npm run dev

# Start a service
cd services/ai-usage-service && npm run dev

# Or start all at once (once scripts created)
npm run dev:all
```

### Next Sprint Preview
**Sprint 2 (Week 3-4): AI Usage Dashboard**
- Implement AI Usage Dashboard UI
- Connect to mock AI usage data
- Build charts (bar chart, heatmap)
- Implement LinkedIn sharing
