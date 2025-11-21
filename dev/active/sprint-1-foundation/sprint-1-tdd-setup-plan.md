# Sprint 1: TDD Infrastructure Setup - Plan

## Executive Summary

**Goal**: Establish comprehensive Test-Driven Development (TDD) infrastructure for SkillSync platform
**Timeline**: 1-2 days
**Dependencies**: Sprint 1 Foundation (basic project structure)
**Outcome**: Fully configured testing environment ready for TDD development in Sprint 2+

---

## Why TDD for SkillSync?

### Benefits
1. **Quality Assurance**: Catch bugs early in development
2. **Design Improvement**: Better API and component design
3. **Documentation**: Tests serve as living documentation
4. **Confidence**: Refactor without fear
5. **Speed**: Faster development in long run

### TDD Cycle
```
┌─────────────────────────────────────┐
│  RED: Write failing test            │
│  ↓                                   │
│  GREEN: Make test pass (minimal)    │
│  ↓                                   │
│  REFACTOR: Improve code quality     │
│  ↓                                   │
│  REPEAT for next feature            │
└─────────────────────────────────────┘
```

---

## Testing Stack Selection

### Frontend Testing
**Framework**: **Vitest** (recommended for Vite/Next.js)
- Faster than Jest
- Native ESM support
- Vite-compatible
- React Testing Library integration

**Alternative**: Jest + React Testing Library
- More mature ecosystem
- Wider community support

**UI Component Testing**: **Storybook** + **Chromatic**
- Visual regression testing
- Component isolation

### Backend Testing
**Framework**: **Jest** (Node.js standard)
- Mature and stable
- Great TypeScript support
- Easy mocking

**API Testing**: **Supertest**
- HTTP assertion library
- Express integration

**Database Testing**: **Supabase Test Helpers**
- Mock Supabase client
- Transaction rollback

---

## Implementation Plan

### Phase 1: Frontend Test Setup (Day 1)

#### 1.1 Install Vitest
```bash
cd frontend
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jsdom
```

**Acceptance**:
- Vitest installed
- Testing libraries available
- `npm test` command works

#### 1.2 Configure Vitest
**File**: `frontend/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
```

**Acceptance**:
- Configuration file created
- Paths resolved correctly
- Coverage reporting enabled

#### 1.3 Create Test Setup File
**File**: `frontend/tests/setup.ts`

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
}))

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))
```

**Acceptance**:
- Setup runs before tests
- Mocks configured
- Matchers available

#### 1.4 Create Test Utilities
**File**: `frontend/tests/utils.tsx`

```typescript
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create wrapper with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Custom render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export everything
export * from '@testing-library/react'
```

**Acceptance**:
- Render utility works
- Providers wrapped
- All Testing Library exports available

#### 1.5 Add Test Scripts
**File**: `frontend/package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

**Acceptance**:
- All scripts run without error
- Coverage report generates

---

### Phase 2: Backend Test Setup (Day 1)

#### 2.1 Install Jest (Per Service)
```bash
cd services/ai-usage-service
npm install -D jest @types/jest ts-jest
npm install -D supertest @types/supertest
npm install -D @faker-js/faker
```

**Repeat for all 6 services**

**Acceptance**:
- Jest installed in all services
- Supertest available
- Faker for mock data generation

#### 2.2 Configure Jest
**File**: `services/ai-usage-service/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/mock/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}
```

**Acceptance**:
- Jest configured per service
- Coverage thresholds set
- TypeScript support enabled

#### 2.3 Create Test Setup
**File**: `services/ai-usage-service/tests/setup.ts`

```typescript
import { supabase } from '../src/lib/supabase'

// Mock Supabase
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}))

// Test lifecycle
beforeAll(async () => {
  // Setup test database
})

afterAll(async () => {
  // Cleanup
})

beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks()
})
```

**Acceptance**:
- Mocks configured
- Database helpers available
- Clean state per test

#### 2.4 Create Test Helpers
**File**: `services/ai-usage-service/tests/helpers.ts`

```typescript
import request from 'supertest'
import { app } from '../src/index'
import { faker } from '@faker-js/faker'

// API test helper
export const apiTest = () => request(app)

// Mock data generators
export const mockUser = () => ({
  user_id: faker.string.uuid(),
  email: faker.internet.email(),
  display_name: faker.person.fullName(),
})

export const mockAIUsageMetric = () => ({
  metric_id: faker.string.uuid(),
  integration_id: faker.string.uuid(),
  metric_date: faker.date.recent({ days: 90 }),
  request_count: faker.number.int({ min: 0, max: 100 }),
  token_count: faker.number.int({ min: 0, max: 10000 }),
})

// Auth token helper
export const mockAuthToken = (userId: string) => {
  // Generate JWT
  return 'Bearer mock-token'
}
```

**Acceptance**:
- API helper works
- Mock data realistic
- Auth tokens valid

#### 2.5 Add Test Scripts
**File**: `services/ai-usage-service/package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

**Acceptance**:
- Scripts run successfully
- Coverage reports generated

---

### Phase 3: Integration Test Setup (Day 2)

#### 3.1 E2E Test Structure
**Directory**: `tests/e2e/`

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

**Acceptance**:
- Directory structure created
- Helpers available

#### 3.2 Create E2E Test Helpers
**File**: `tests/e2e/helpers/setup.ts`

```typescript
import { supabase } from '../../../frontend/lib/supabase'

export async function setupTestUser() {
  // Create test user in Supabase
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test-password-123',
  })

  if (error) throw error
  return data.user
}

export async function cleanupTestUser(userId: string) {
  // Delete test user
  await supabase.auth.admin.deleteUser(userId)
}

export async function seedTestData() {
  // Insert test challenges, mock data, etc.
}
```

**Acceptance**:
- User creation works
- Cleanup works
- Data seeding works

#### 3.3 Write Sample E2E Test
**File**: `tests/e2e/auth.test.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can sign up, login, and logout', async ({ page }) => {
    // Visit signup page
    await page.goto('http://localhost:3000/signup')

    // Fill form
    await page.fill('input[name="email"]', 'newuser@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Logout
    await page.click('button[aria-label="Logout"]')

    // Should redirect to home
    await expect(page).toHaveURL('/')
  })
})
```

**Acceptance**:
- E2E test runs
- Tests pass

---

### Phase 4: Test Documentation (Day 2)

#### 4.1 Create Testing Guide
**File**: `docs/TESTING_GUIDE.md`

**Contents**:
- Testing philosophy
- How to write tests (examples)
- How to run tests
- Coverage requirements
- CI/CD integration

**Acceptance**:
- Guide is comprehensive
- Examples are clear

#### 4.2 Create Test Templates
**File**: `docs/test-templates/`

```
test-templates/
├── component-test-template.tsx
├── api-test-template.ts
├── integration-test-template.ts
└── e2e-test-template.ts
```

**Each template includes**:
- Boilerplate setup
- Common patterns
- Example assertions

**Acceptance**:
- Templates created
- Copy-paste ready

---

## Testing Patterns

### Frontend Component Testing

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, userEvent } from '@/tests/utils'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with text', () => {
    renderWithProviders(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    renderWithProviders(<Button onClick={onClick}>Click</Button>)

    await userEvent.click(screen.getByText('Click'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
```

### Backend API Testing

```typescript
// usage.controller.test.ts
import { apiTest, mockUser, mockAuthToken } from '../../tests/helpers'
import { supabase } from '../lib/supabase'

describe('GET /api/ai-usage/dashboard', () => {
  it('returns dashboard data for authenticated user', async () => {
    const user = mockUser()
    const token = mockAuthToken(user.user_id)

    // Mock database response
    const mockData = { total_interactions: 100, active_days: 30 }
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockData, error: null })
    })

    const response = await apiTest()
      .get('/api/ai-usage/dashboard')
      .set('Authorization', token)
      .expect(200)

    expect(response.body).toMatchObject(mockData)
  })

  it('returns 401 if not authenticated', async () => {
    await apiTest()
      .get('/api/ai-usage/dashboard')
      .expect(401)
  })
})
```

---

## Coverage Requirements

### Minimum Coverage Targets

| Type | Threshold |
|------|-----------|
| Statements | 70% |
| Branches | 70% |
| Functions | 70% |
| Lines | 70% |

### Critical Path Coverage
- **Authentication**: 90%
- **Payment/Billing**: 90%
- **Data Encryption**: 90%
- **API Integrations**: 80%

### Excluded from Coverage
- Mock data files
- Type definitions
- Config files
- Migration scripts

---

## CI/CD Integration

### GitHub Actions Workflow
**File**: `.github/workflows/test.yml`

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json

  test-backend:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - ai-usage-service
          - challenge-service
          - evaluation-service
          - badge-service
          - matching-service
          - report-service
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd services/${{ matrix.service }} && npm ci
      - run: cd services/${{ matrix.service }} && npm test -- --coverage
```

**Acceptance**:
- Tests run on PR
- Coverage reported
- Build fails if tests fail

---

## Success Metrics

### Phase 1: Frontend
- [ ] Vitest configured and running
- [ ] Sample component test passes
- [ ] Coverage report generates
- [ ] Test script added to package.json

### Phase 2: Backend
- [ ] Jest configured in all 6 services
- [ ] Sample API test passes per service
- [ ] Supertest working
- [ ] Coverage thresholds set

### Phase 3: Integration
- [ ] E2E test framework installed
- [ ] Sample E2E test passes
- [ ] Test data seeding works

### Phase 4: Documentation
- [ ] Testing guide created
- [ ] Templates available
- [ ] CI/CD configured

---

## Timeline

| Phase | Duration | Key Deliverable |
|-------|----------|----------------|
| Phase 1: Frontend | 4 hours | Vitest configured |
| Phase 2: Backend | 4 hours | Jest in all services |
| Phase 3: Integration | 4 hours | E2E tests working |
| Phase 4: Docs | 4 hours | Testing guide complete |
| **Total** | **16 hours (2 days)** | **TDD-ready platform** |

---

## Risk Assessment

### Risk 1: Learning Curve
- **Impact**: Medium
- **Mitigation**: Provide templates and examples

### Risk 2: Slow Test Execution
- **Impact**: Low
- **Mitigation**: Parallel test execution, watch mode

### Risk 3: Mock Data Complexity
- **Impact**: Medium
- **Mitigation**: Use Faker.js, share fixtures

---

## Next Steps After Setup

**Sprint 2 Development**:
1. Write test for AI Usage Dashboard endpoint
2. Implement endpoint to pass test
3. Refactor code
4. Repeat for each feature

---

## References

- Vitest Docs: https://vitest.dev/
- Jest Docs: https://jestjs.io/
- React Testing Library: https://testing-library.com/react
- Supertest: https://github.com/ladjs/supertest
- TDD Best Practices: https://testdriven.io/
