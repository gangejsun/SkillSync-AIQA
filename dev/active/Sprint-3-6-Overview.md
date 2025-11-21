# Sprint 3-6 Overview - SkillSync Development Roadmap

## Purpose

This document provides a high-level overview of Sprints 3-6. Each sprint will have its own detailed Dev Docs (plan, context, tasks, tests) created when ready to begin.

---

## Sprint 3: Challenge System (Week 5-7) 🎯

### Goal
Build complete challenge management system with submission and evaluation workflow

### Key Features (TDD)
1. **Challenge List Page**
   - Filter by category, difficulty
   - Display challenge cards
   - Show user's completion status

2. **Challenge Detail Page**
   - Full requirements display
   - Submission form (GitHub URL, deployed URL, files)
   - Self-confidence rating

3. **Submission API**
   - POST /api/challenges/submit
   - File upload to S3 (README, AI conversation)
   - Trigger evaluation queue

4. **Skill Card Component**
   - Before completion: Locked state
   - After completion: Gradient with grade badge
   - Share button integration

### Timeline: 10-14 days

### TDD Approach
- Write tests for challenge filters
- Write tests for submission form validation
- Write tests for file upload
- Write integration tests for S3 upload
- Write E2E test for complete submission flow

### Key Files to Create
- `app/(dashboard)/challenges/page.tsx` - Challenge list
- `app/(dashboard)/challenges/[id]/page.tsx` - Challenge detail
- `components/cards/ChallengeCard.tsx` - Challenge card
- `components/cards/SkillCard.tsx` - Skill progress card
- `services/challenge-service/src/routes/challenge.routes.ts`
- `services/challenge-service/src/controllers/challenge.controller.ts`

### Dependencies
- Sprint 1: Infrastructure
- Sprint 2: UI component patterns
- AWS S3 setup (for file upload)

---

## Sprint 4: AI Evaluation Engine (Week 8-9) 🤖

### Goal
Build AI-powered code evaluation system using Claude API

### Key Features (TDD)
1. **GitHub Repository Analyzer**
   - Clone and analyze repo
   - Count lines of code
   - Detect technologies used
   - Check for tests

2. **Claude API Integration**
   - Send code + requirements to Claude
   - Request structured evaluation (JSON)
   - Parse and validate response

3. **Evaluation Service**
   - POST /api/evaluate/enqueue - Add to evaluation queue
   - GET /api/evaluate/:id - Get evaluation results
   - Score calculation (functionality, code quality, AI usage, UI/UX)
   - Grade assignment (S, A, B, C, D, F)

4. **Feedback Display**
   - Detailed evaluation report
   - Code examples with improvements
   - Recommended resources
   - Next steps

### Timeline: 7-10 days

### TDD Approach
- Mock Claude API responses for tests
- Write tests for repo analysis logic
- Write tests for score calculations
- Write tests for grade assignment algorithm
- Integration test with real Claude API (optional)
- E2E test: Submit challenge → Receive evaluation

### Key Files to Create
- `services/evaluation-service/src/services/ai-grader.service.ts`
- `services/evaluation-service/src/services/github-analyzer.service.ts`
- `app/(dashboard)/feedback/[id]/page.tsx` - Evaluation results
- `components/evaluation/FeedbackReport.tsx`
- `components/evaluation/CodeExample.tsx`

### Dependencies
- Sprint 3: Submission system
- Claude API key
- GitHub Personal Access Token

---

## Sprint 5: Badge & Matching System (Week 10-11) 🏆

### Goal
Build badge generation system and job matching algorithm

### Key Features (TDD)

#### Part A: Badge Service
1. **Badge Image Generation**
   - Generate badge images with Canvas API
   - LinkedIn share format (1200x630)
   - Multiple badge designs by grade

2. **Certificate Generation**
   - PDF certificate with user info
   - Digital signature (optional)
   - Download and share

3. **Badge Endpoints**
   - POST /api/badges/generate
   - GET /api/badges/:userId
   - LinkedIn integration

#### Part B: Matching Service
1. **Job Recommendations**
   - Match algorithm: skills + grades + AIQ
   - Scoring system
   - Ranking

2. **Job Listing**
   - GET /api/jobs - List all jobs
   - GET /api/jobs/recommendations - Personalized
   - POST /api/jobs/:id/apply - Apply to job

3. **Company Dashboard** (Basic)
   - View applicants
   - Filter by criteria
   - Send interview invitations

### Timeline: 10-14 days

### TDD Approach
- Write tests for badge image generation
- Write tests for matching algorithm
- Write tests for scoring calculation
- Write tests for recommendation ranking
- Integration test: User badge → LinkedIn share
- E2E test: User views jobs → applies → company sees application

### Key Files to Create
- `services/badge-service/src/services/badge-generator.service.ts`
- `services/badge-service/src/services/certificate-generator.service.ts`
- `services/matching-service/src/services/matching-algorithm.service.ts`
- `app/(dashboard)/badges/page.tsx` - User badges
- `app/(dashboard)/jobs/page.tsx` - Job listings
- `app/(dashboard)/jobs/[id]/page.tsx` - Job detail

### Dependencies
- Sprint 3: Challenge completion
- Sprint 4: Evaluation results
- Canvas or Sharp library for image generation
- PDF library (PDFKit or similar)

---

## Sprint 6: AIQ Assessment & Polish (Week 12-14) 🧠

### Goal
Implement AIQ personality assessment and final polish

### Key Features (TDD)

#### Part A: AIQ Assessment
1. **Assessment Flow**
   - 20-question survey
   - Multiple choice (1-4 scale)
   - Progress indicator

2. **Capability Scoring**
   - Calculate 8 capability scores
   - Normalize to 0-100 scale
   - Determine AIQ type

3. **Results Display**
   - Radar chart visualization
   - AIQ type description
   - Recommendations

4. **AIQ API**
   - POST /api/aiq/submit - Submit answers
   - GET /api/aiq/results - Get AIQ profile
   - Update user profile with AIQ type

#### Part B: Final Polish
1. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

2. **Error Handling**
   - Global error boundary
   - Toast notifications
   - Retry mechanisms
   - Offline support

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast check

4. **Documentation**
   - API documentation (Swagger/OpenAPI)
   - Component library (Storybook)
   - Deployment guide
   - User guide

### Timeline: 10-14 days

### TDD Approach
- Write tests for each AIQ question
- Write tests for capability calculations
- Write tests for type determination
- Write tests for error boundary
- Write accessibility tests
- E2E test: Complete assessment → View results

### Key Files to Create
- `app/(dashboard)/aiq-assessment/page.tsx` - Assessment questions
- `app/(dashboard)/aiq-assessment/results/page.tsx` - Results
- `components/charts/RadarChart.tsx` - AIQ radar chart
- `components/errors/ErrorBoundary.tsx`
- `docs/API_DOCUMENTATION.md`
- `docs/DEPLOYMENT_GUIDE.md`

### Dependencies
- All previous sprints complete
- Production-ready infrastructure
- Monitoring and analytics setup

---

## Development Strategy Across All Sprints

### TDD Workflow (Every Sprint)
1. **Red**: Write failing test
2. **Green**: Make test pass
3. **Refactor**: Improve code
4. **Commit**: Save progress

### Test Coverage Goals (Every Sprint)
- API endpoints: ≥90%
- Business logic: ≥85%
- UI components: ≥75%
- Integration: ≥70%

### Daily Checklist (Every Sprint)
- [ ] All tests pass
- [ ] Code coverage meets threshold
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Update Dev Docs
- [ ] Commit with clear message

### Weekly Checklist (Every Sprint)
- [ ] Demo to stakeholders
- [ ] Code review
- [ ] Update PRD if needed
- [ ] Plan next week

---

## Resource Requirements

### Sprint 3
- AWS S3 account (file storage)
- Supabase storage setup

### Sprint 4
- Anthropic Claude API key ($$$)
- GitHub Personal Access Token

### Sprint 5
- Canvas or Sharp library
- PDF generation library
- LinkedIn API credentials (optional)

### Sprint 6
- Production hosting (Vercel)
- Monitoring service (Sentry, LogRocket)
- Analytics (PostHog, Mixpanel)

---

## Risk Assessment

### Technical Risks
| Risk | Sprint | Mitigation |
|------|--------|------------|
| Claude API rate limits | 4 | Implement queuing, caching |
| File upload failures | 3 | Retry logic, pre-signed URLs |
| Matching algorithm complexity | 5 | Start simple, iterate |
| Performance issues | 6 | Profile early, optimize incrementally |

### Timeline Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Claude API integration takes longer | High | Allocate extra time in Sprint 4 |
| Matching algorithm complexity | Medium | Use simple scoring first |
| Scope creep | High | Strict feature freeze after Sprint 5 |

---

## Success Metrics

### Sprint 3
- [ ] Users can browse and filter challenges
- [ ] Users can submit solutions
- [ ] Files upload to S3 successfully
- [ ] Coverage: ≥80%

### Sprint 4
- [ ] Submissions get evaluated by Claude API
- [ ] Evaluation results display correctly
- [ ] Feedback is actionable
- [ ] Coverage: ≥85%

### Sprint 5
- [ ] Badges generate correctly
- [ ] Job recommendations make sense
- [ ] Application flow works end-to-end
- [ ] Coverage: ≥80%

### Sprint 6
- [ ] AIQ assessment completes smoothly
- [ ] All features work together
- [ ] Performance is excellent (<2s page load)
- [ ] Coverage: ≥80% overall

---

## Next Steps

1. **Complete Sprint 2** (Current)
   - AI Usage Dashboard
   - All tests passing
   - Coverage ≥80%

2. **Create Sprint 3 Dev Docs**
   - Detailed plan
   - Context file
   - Task breakdown
   - Test specifications

3. **Begin Sprint 3 Development**
   - Follow TDD approach
   - Use TDD-Agent for guidance
   - Regular commits
   - Daily standups

4. **Iterate through Sprint 4-6**
   - Create Dev Docs at start of each sprint
   - Follow TDD religiously
   - Maintain high coverage
   - Deploy incrementally

---

## Agent Usage Guide

### When to Use Each Agent

**TDD-Agent**: Every feature development
- Use for: Backend endpoints, UI components, utilities
- Example: "Implement challenge submission API endpoint (TDD)"

**Integration-Test-Agent**: End of each feature
- Use for: E2E flows, cross-service tests
- Example: "Write integration tests for challenge submission flow"

**Mock-Data-Generator-Agent**: Sprint planning phase
- Use for: Creating test data, seeding databases
- Example: "Generate mock data for 20 challenges with varied difficulties"

---

## Conclusion

Sprints 3-6 will transform SkillSync from a prototype to a production-ready platform. Each sprint builds on the previous one, following strict TDD principles to ensure quality and maintainability.

**Key to Success**:
- Follow TDD religiously
- Write tests first, always
- Maintain high coverage
- Refactor continuously
- Deploy incrementally
- Get feedback early

**Total Timeline**: ~8-10 weeks for Sprints 3-6 (after Sprint 2 complete)

**Ready to Start Sprint 3?**
Create detailed Dev Docs: `sprint-3-challenge-system/`
