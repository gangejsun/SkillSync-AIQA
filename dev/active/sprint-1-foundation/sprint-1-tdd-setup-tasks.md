# Sprint 1: TDD Infrastructure Setup - Tasks

## Phase 1: Frontend Test Setup ⏳ IN PROGRESS

### Vitest Installation
- [ ] Install Vitest and dependencies
  ```bash
  cd frontend
  npm install -D vitest @vitest/ui
  npm install -D @testing-library/react @testing-library/jest-dom
  npm install -D @testing-library/user-event jsdom
  ```
  - Acceptance: All packages in package.json

### Vitest Configuration
- [ ] Create vitest.config.ts
  - Copy configuration from plan
  - Configure jsdom environment
  - Setup coverage reporting
  - Acceptance: `npx vitest --version` works

- [ ] Create tests/setup.ts
  - Import jest-dom matchers
  - Configure cleanup
  - Mock Next.js router
  - Mock Supabase client
  - Acceptance: Setup file loads without errors

- [ ] Create tests/utils.tsx
  - Create AllTheProviders wrapper
  - Implement renderWithProviders
  - Re-export Testing Library
  - Acceptance: Utility file exports correctly

### Test Scripts
- [ ] Add test scripts to package.json
  ```json
  {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
  ```
  - Acceptance: `npm test` runs (even with 0 tests)

### Sample Frontend Test
- [ ] Create sample Button component test
  - File: `frontend/tests/components/Button.test.tsx`
  - Test: renders, onClick, disabled state
  - Acceptance: Test passes

---

## Phase 2: Backend Test Setup ⏳ NOT STARTED

### AI Usage Service (Port 3001)
- [ ] Install Jest dependencies
  ```bash
  cd services/ai-usage-service
  npm install -D jest @types/jest ts-jest
  npm install -D supertest @types/supertest
  npm install -D @faker-js/faker
  ```
  - Acceptance: Dependencies installed

- [ ] Create jest.config.js
  - Copy configuration from plan
  - Set coverage thresholds
  - Acceptance: Jest configuration valid

- [ ] Create tests/setup.ts
  - Mock Supabase
  - Setup/teardown hooks
  - Acceptance: Setup runs before tests

- [ ] Create tests/helpers.ts
  - API test helper (supertest)
  - Mock data generators
  - Auth token helper
  - Acceptance: Helpers export correctly

- [ ] Add test scripts to package.json
  ```json
  {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
  ```
  - Acceptance: `npm test` works

- [ ] Write sample API test
  - File: `src/__tests__/controllers/usage.controller.test.ts`
  - Test: GET /health endpoint
  - Acceptance: Test passes

### Challenge Service (Port 3002)
- [ ] Install Jest dependencies
- [ ] Create jest.config.js
- [ ] Create tests/setup.ts
- [ ] Create tests/helpers.ts
- [ ] Add test scripts
- [ ] Write sample API test (GET /health)

### Evaluation Service (Port 3003)
- [ ] Install Jest dependencies
- [ ] Create jest.config.js
- [ ] Create tests/setup.ts
- [ ] Create tests/helpers.ts
- [ ] Add test scripts
- [ ] Write sample API test (GET /health)

### Badge Service (Port 3004)
- [ ] Install Jest dependencies
- [ ] Create jest.config.js
- [ ] Create tests/setup.ts
- [ ] Create tests/helpers.ts
- [ ] Add test scripts
- [ ] Write sample API test (GET /health)

### Matching Service (Port 3005)
- [ ] Install Jest dependencies
- [ ] Create jest.config.js
- [ ] Create tests/setup.ts
- [ ] Create tests/helpers.ts
- [ ] Add test scripts
- [ ] Write sample API test (GET /health)

### Report Service (Port 3006)
- [ ] Install Jest dependencies
- [ ] Create jest.config.js
- [ ] Create tests/setup.ts
- [ ] Create tests/helpers.ts
- [ ] Add test scripts
- [ ] Write sample API test (GET /health)

### API Gateway (Port 4000)
- [ ] Install Jest dependencies
- [ ] Create jest.config.js
- [ ] Create tests/setup.ts
- [ ] Write sample test (health check aggregation)
- [ ] Acceptance: Gateway test passes

---

## Phase 3: Integration Test Setup ⏳ NOT STARTED

### E2E Framework Installation
- [ ] Install Playwright (or Cypress)
  ```bash
  cd /Users/gyeong/Documents/AIQA
  npm install -D @playwright/test
  npx playwright install
  ```
  - Acceptance: Playwright installed

### E2E Test Structure
- [ ] Create tests/e2e/ directory structure
  ```
  tests/
  └── e2e/
      ├── auth.test.ts
      ├── ai-usage.test.ts
      ├── challenges.test.ts
      └── helpers/
          ├── setup.ts
          ├── teardown.ts
          └── fixtures.ts
  ```
  - Acceptance: Directories created

### E2E Helpers
- [ ] Create tests/e2e/helpers/setup.ts
  - setupTestUser()
  - cleanupTestUser()
  - seedTestData()
  - Acceptance: Functions export

- [ ] Create tests/e2e/helpers/fixtures.ts
  - mockChallenge()
  - mockEvaluation()
  - mockBadge()
  - Acceptance: Fixtures realistic

### Sample E2E Test
- [ ] Write authentication E2E test
  - File: tests/e2e/auth.test.ts
  - Flow: signup → login → logout
  - Acceptance: E2E test passes

- [ ] Add E2E script to root package.json
  ```json
  {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
  ```
  - Acceptance: Script runs

---

## Phase 4: Test Documentation ⏳ NOT STARTED

### Testing Guide
- [ ] Create docs/TESTING_GUIDE.md
  - Section 1: Testing Philosophy
  - Section 2: Running Tests
  - Section 3: Writing Tests
  - Section 4: Examples
  - Section 5: CI/CD Integration
  - Acceptance: Guide is comprehensive

### Test Templates
- [ ] Create docs/test-templates/ directory
- [ ] Create component-test-template.tsx
  - Boilerplate imports
  - Describe/it structure
  - Common assertions
  - Acceptance: Template copy-paste ready

- [ ] Create api-test-template.ts
  - Supertest setup
  - Mock data
  - API call examples
  - Acceptance: Template works

- [ ] Create integration-test-template.ts
  - Database setup/teardown
  - Multi-service integration
  - Acceptance: Template functional

- [ ] Create e2e-test-template.ts
  - Playwright setup
  - Page object pattern
  - Acceptance: Template runnable

### Coverage Configuration
- [ ] Configure code coverage reporting
  - Istanbul/NYC for backend
  - Vitest coverage for frontend
  - Acceptance: Coverage reports generate

- [ ] Set coverage thresholds
  - 70% statements, branches, functions, lines
  - Acceptance: Build fails if below threshold

---

## Phase 5: CI/CD Integration ⏳ NOT STARTED

### GitHub Actions Workflow
- [ ] Create .github/workflows/test.yml
  - Job: test-frontend
  - Job: test-backend (matrix for 6 services)
  - Job: test-e2e
  - Acceptance: Workflow file valid

- [ ] Configure Codecov
  - Install codecov action
  - Upload coverage reports
  - Acceptance: Coverage shows in PR

- [ ] Test CI/CD locally
  - Use `act` to run GitHub Actions locally
  - Verify all jobs pass
  - Acceptance: CI runs successfully

### Pre-commit Hooks (Optional)
- [ ] Install Husky
  ```bash
  npm install -D husky lint-staged
  npx husky install
  ```
  - Acceptance: Husky installed

- [ ] Create pre-commit hook
  - Run tests on changed files
  - Run linter
  - Acceptance: Hook blocks bad commits

---

## Verification Checklist

### Frontend Tests
- [ ] `cd frontend && npm test` runs successfully
- [ ] Sample component test passes
- [ ] Coverage report generates
- [ ] Test UI opens (`npm run test:ui`)

### Backend Tests (Per Service)
- [ ] `cd services/ai-usage-service && npm test` passes
- [ ] `cd services/challenge-service && npm test` passes
- [ ] `cd services/evaluation-service && npm test` passes
- [ ] `cd services/badge-service && npm test` passes
- [ ] `cd services/matching-service && npm test` passes
- [ ] `cd services/report-service && npm test` passes
- [ ] `cd services/api-gateway && npm test` passes

### Integration Tests
- [ ] E2E tests run (`npm run test:e2e`)
- [ ] Authentication flow test passes
- [ ] Test data seeds correctly

### Documentation
- [ ] TESTING_GUIDE.md exists and is clear
- [ ] Test templates available
- [ ] Examples are copy-paste ready

### CI/CD
- [ ] GitHub Actions workflow runs
- [ ] All jobs pass
- [ ] Coverage uploaded to Codecov

---

## Ready for Sprint 2 Checklist

- [ ] All test frameworks installed
- [ ] Sample tests pass in frontend and all backend services
- [ ] E2E framework working
- [ ] Documentation complete
- [ ] CI/CD configured
- [ ] Team trained on TDD approach
- [ ] Coverage thresholds enforced

---

## Quick Reference

### Running Tests

```bash
# Frontend
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run test:ui          # Visual UI

# Backend (example: AI Usage Service)
cd services/ai-usage-service
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage

# E2E
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Playwright UI

# All at once (future)
npm run test:all         # Run all tests (frontend + backend + e2e)
```

### Writing Your First Test

**Component Test:**
```typescript
// Button.test.tsx
import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/tests/utils'
import { Button } from './Button'

describe('Button', () => {
  it('renders text', () => {
    renderWithProviders(<Button>Hello</Button>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

**API Test:**
```typescript
// usage.controller.test.ts
import { apiTest } from '../../tests/helpers'

describe('GET /api/ai-usage/dashboard', () => {
  it('returns data', async () => {
    const res = await apiTest()
      .get('/api/ai-usage/dashboard')
      .expect(200)

    expect(res.body).toHaveProperty('total_interactions')
  })
})
```

---

## Timeline Estimate

| Phase | Hours | Cumulative |
|-------|-------|------------|
| Phase 1: Frontend Setup | 4h | 4h |
| Phase 2: Backend Setup (6 services + gateway) | 8h | 12h |
| Phase 3: Integration Tests | 3h | 15h |
| Phase 4: Documentation | 2h | 17h |
| Phase 5: CI/CD | 2h | 19h |
| **Total** | **19 hours (~2.5 days)** | **19h** |

**Buffer**: Add 1 day for unexpected issues → **3-4 days total**

---

## Notes

- Start with frontend tests (easier)
- Backend tests follow same pattern for all services
- E2E tests can be added incrementally
- Documentation evolves with examples
- CI/CD can be configured last

---

## Support Resources

- **Vitest Docs**: https://vitest.dev/
- **Jest Docs**: https://jestjs.io/
- **Testing Library**: https://testing-library.com/
- **Playwright**: https://playwright.dev/
- **TDD Guide**: https://testdriven.io/

---

## Next: Sprint 2 Development

Once TDD setup is complete, proceed to Sprint 2 where you'll use TDD to build:
- AI Usage Dashboard UI
- API endpoints (test-first)
- Charts and visualizations
- LinkedIn sharing feature

Every feature will follow: **Test → Code → Refactor**
