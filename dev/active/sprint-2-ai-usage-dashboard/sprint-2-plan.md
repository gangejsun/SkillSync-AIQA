# Sprint 2: AI Usage Dashboard - Implementation Plan (TDD)

## Executive Summary

**Goal**: Build AI Usage Analytics Dashboard using Test-Driven Development
**Timeline**: Week 3-4 (7-10 days)
**Dependencies**: Sprint 1 complete (infrastructure + TDD setup)
**Outcome**: Fully functional AI Usage Dashboard with mock data, ready for real API integration

---

## TDD Approach for This Sprint

### Red-Green-Refactor Cycle

Every feature follows this pattern:
```
1. RED: Write failing test
   ↓
2. GREEN: Write minimal code to pass
   ↓
3. REFACTOR: Improve code quality
   ↓
4. COMMIT: Save progress
```

### Test Coverage Goals

| Component Type | Target Coverage |
|---------------|----------------|
| API Endpoints | 90% |
| Business Logic | 85% |
| UI Components | 75% |
| Integration | 70% |

---

## Feature Breakdown (TDD)

### Feature 1: API Key Connect UI

#### Test 1.1: Render Connect Page
```typescript
// RED
describe('AIUsageConnectPage', () => {
  it('renders connection form for Claude Code', () => {
    render(<AIUsageConnectPage />)
    expect(screen.getByText('Connect Your AI Tools')).toBeInTheDocument()
    expect(screen.getByLabelText(/Claude Code API Key/i)).toBeInTheDocument()
  })
})
```

**Then implement** `app/(dashboard)/ai-usage/connect/page.tsx`

#### Test 1.2: API Key Input Validation
```typescript
// RED
it('shows error for invalid API key format', async () => {
  render(<AIUsageConnectPage />)

  const input = screen.getByLabelText(/API Key/i)
  await userEvent.type(input, 'invalid-key')
  await userEvent.click(screen.getByText('Connect'))

  expect(await screen.findByText(/Invalid API key format/i)).toBeInTheDocument()
})
```

**Then implement** validation logic

#### Test 1.3: Successful Connection
```typescript
// RED
it('shows success message on successful connection', async () => {
  // Mock API response
  server.use(
    http.post('/api/ai-usage/connect', () => {
      return HttpResponse.json({ success: true, integration_id: 'uuid' })
    })
  )

  render(<AIUsageConnectPage />)

  await userEvent.type(screen.getByLabelText(/API Key/i), 'sk-ant-api03-valid-key')
  await userEvent.click(screen.getByText('Connect'))

  expect(await screen.findByText(/Connected successfully/i)).toBeInTheDocument()
})
```

**Then implement** connection logic with API call

---

### Feature 2: Backend - Connect Endpoint (TDD)

#### Test 2.1: POST /api/ai-usage/connect - Success
```typescript
// services/ai-usage-service/src/__tests__/routes/usage.routes.test.ts

describe('POST /api/ai-usage/connect', () => {
  it('stores encrypted API key and returns integration_id', async () => {
    const mockUser = { user_id: 'test-user-123' }
    const apiKey = 'sk-ant-api03-test-key'

    const response = await request(app)
      .post('/api/ai-usage/connect')
      .set('Authorization', `Bearer ${generateToken(mockUser)}`)
      .send({
        provider: 'claude_code',
        api_key: apiKey
      })
      .expect(200)

    expect(response.body).toMatchObject({
      success: true,
      integration_id: expect.any(String),
      last_synced_at: expect.any(String)
    })

    // Verify encrypted key stored in database
    const integration = await supabase
      .from('ai_tool_integrations')
      .select('encrypted_api_key')
      .eq('integration_id', response.body.integration_id)
      .single()

    expect(integration.data.encrypted_api_key).not.toBe(apiKey) // Should be encrypted
  })
})
```

**Then implement**:
1. `src/routes/usage.routes.ts` - Route handler
2. `src/controllers/usage.controller.ts` - Controller
3. `src/utils/crypto.ts` - Encryption utility
4. `src/services/integration.service.ts` - Database operations

#### Test 2.2: Invalid API Key Format
```typescript
it('returns 400 for invalid API key format', async () => {
  await request(app)
    .post('/api/ai-usage/connect')
    .set('Authorization', `Bearer ${generateToken(mockUser)}`)
    .send({
      provider: 'claude_code',
      api_key: 'invalid-key'
    })
    .expect(400)
    .expect((res) => {
      expect(res.body.error).toMatch(/invalid.*api key/i)
    })
})
```

**Then implement** validation logic

#### Test 2.3: Encryption/Decryption
```typescript
// src/__tests__/utils/crypto.test.ts

describe('Crypto Utils', () => {
  it('encrypts and decrypts correctly', () => {
    const plaintext = 'sk-ant-api03-secret-key'
    const encrypted = encrypt(plaintext)

    expect(encrypted).not.toBe(plaintext)
    expect(decrypt(encrypted)).toBe(plaintext)
  })

  it('throws error for invalid encrypted string', () => {
    expect(() => decrypt('invalid')).toThrow()
  })
})
```

**Then implement** `crypto.ts` with AES-256-CBC

---

### Feature 3: Mock Data Loading (TDD)

#### Test 3.1: Load Mock Usage Data
```typescript
// src/__tests__/services/mock-data.service.test.ts

describe('MockDataService', () => {
  it('loads mock data from file', async () => {
    const data = await MockDataService.getUserUsageData('mock-user-123')

    expect(data).toMatchObject({
      user_id: 'mock-user-123',
      tools: expect.arrayContaining([
        expect.objectContaining({
          tool_name: 'claude_code',
          last_90_days: expect.objectContaining({
            total_requests: expect.any(Number),
            active_days: expect.any(Number)
          })
        })
      ])
    })
  })

  it('returns null for non-existent user', async () => {
    const data = await MockDataService.getUserUsageData('non-existent')
    expect(data).toBeNull()
  })
})
```

**Then implement**:
1. Create mock data file `src/mock/ai_usage_data.json`
2. Implement `MockDataService.getUserUsageData()`

---

### Feature 4: Dashboard Data Endpoint (TDD)

#### Test 4.1: GET /api/ai-usage/dashboard - Mock Mode
```typescript
describe('GET /api/ai-usage/dashboard', () => {
  beforeAll(() => {
    process.env.USE_MOCK_DATA = 'true'
  })

  it('returns aggregated dashboard data', async () => {
    const response = await request(app)
      .get('/api/ai-usage/dashboard?days=90')
      .set('Authorization', `Bearer ${generateToken(mockUser)}`)
      .expect(200)

    expect(response.body).toMatchObject({
      total_interactions: expect.any(Number),
      active_days: expect.any(Number),
      top_tool: {
        name: expect.any(String),
        requests: expect.any(Number)
      },
      tools: expect.any(Array),
      heatmap_data: expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          count: expect.any(Number)
        })
      ])
    })

    expect(response.body.heatmap_data).toHaveLength(90)
  })
})
```

**Then implement**:
1. `src/controllers/usage.controller.ts` - getDashboard()
2. `src/services/metrics.service.ts` - aggregation logic

#### Test 4.2: Metrics Calculation
```typescript
// src/__tests__/services/metrics.service.test.ts

describe('MetricsService', () => {
  const mockMetrics = [
    { tool_name: 'claude_code', metric_date: '2025-11-01', request_count: 25 },
    { tool_name: 'claude_code', metric_date: '2025-11-02', request_count: 30 },
    { tool_name: 'cursor', metric_date: '2025-11-01', request_count: 15 }
  ]

  it('calculates total interactions', () => {
    const total = MetricsService.calculateTotalInteractions(mockMetrics)
    expect(total).toBe(70) // 25 + 30 + 15
  })

  it('identifies top tool', () => {
    const topTool = MetricsService.identifyTopTool(mockMetrics)
    expect(topTool).toEqual({
      name: 'claude_code',
      requests: 55
    })
  })

  it('generates heatmap data for 90 days', () => {
    const heatmap = MetricsService.generateHeatmapData(mockMetrics, 90)
    expect(heatmap).toHaveLength(90)
    expect(heatmap[0]).toMatchObject({
      date: expect.any(String),
      count: expect.any(Number)
    })
  })
})
```

**Then implement** `MetricsService` methods

---

### Feature 5: Dashboard UI Components (TDD)

#### Test 5.1: Summary Cards
```typescript
// components/cards/__tests__/UsageSummaryCard.test.tsx

describe('UsageSummaryCard', () => {
  it('renders total interactions', () => {
    render(<UsageSummaryCard
      title="Total Interactions"
      value={4208}
      subtitle="Last 90 days"
    />)

    expect(screen.getByText('Total Interactions')).toBeInTheDocument()
    expect(screen.getByText('4,208')).toBeInTheDocument() // Formatted number
    expect(screen.getByText('Last 90 days')).toBeInTheDocument()
  })

  it('formats large numbers with commas', () => {
    render(<UsageSummaryCard value={1234567} />)
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })
})
```

**Then implement** `UsageSummaryCard.tsx`

#### Test 5.2: Usage Bar Chart
```typescript
// components/charts/__tests__/UsageBarChart.test.tsx

describe('UsageBarChart', () => {
  const mockData = [
    { name: 'Claude Code', requests: 1842, color: '#6366F1' },
    { name: 'Cursor', requests: 945, color: '#8B5CF6' },
    { name: 'Copilot', requests: 1421, color: '#10B981' }
  ]

  it('renders bar chart with data', () => {
    render(<UsageBarChart data={mockData} />)

    expect(screen.getByText('Claude Code')).toBeInTheDocument()
    expect(screen.getByText('1,842 requests')).toBeInTheDocument()
  })

  it('calculates bar width as percentage', () => {
    const { container } = render(<UsageBarChart data={mockData} totalInteractions={4208} />)

    const claudeBar = container.querySelector('[data-tool="claude_code"]')
    expect(claudeBar).toHaveStyle({ width: '43.78%' }) // 1842/4208 * 100
  })
})
```

**Then implement** `UsageBarChart.tsx`

#### Test 5.3: Activity Heatmap
```typescript
// components/charts/__tests__/ActivityHeatmap.test.tsx

describe('ActivityHeatmap', () => {
  const mockHeatmapData = Array.from({ length: 90 }, (_, i) => ({
    date: new Date(2025, 10, i + 1).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 50)
  }))

  it('renders 90 day cells', () => {
    const { container } = render(<ActivityHeatmap data={mockHeatmapData} />)

    const cells = container.querySelectorAll('[data-testid="heatmap-cell"]')
    expect(cells).toHaveLength(90)
  })

  it('applies correct color intensity', () => {
    const data = [
      { date: '2025-11-01', count: 0 },   // gray
      { date: '2025-11-02', count: 3 },   // light blue
      { date: '2025-11-03', count: 10 },  // medium blue
      { date: '2025-11-04', count: 25 }   // dark blue
    ]

    const { container } = render(<ActivityHeatmap data={data} />)

    const cells = container.querySelectorAll('[data-testid="heatmap-cell"]')
    expect(cells[0]).toHaveClass('bg-gray-100')
    expect(cells[1]).toHaveClass('bg-primary-200')
    expect(cells[2]).toHaveClass('bg-primary-400')
    expect(cells[3]).toHaveClass('bg-primary-600')
  })
})
```

**Then implement** `ActivityHeatmap.tsx`

---

### Feature 6: Dashboard Page Integration (TDD)

#### Test 6.1: Dashboard Page - Loading State
```typescript
// app/(dashboard)/ai-usage/__tests__/page.test.tsx

describe('AIUsagePage', () => {
  it('shows loading spinner while fetching data', () => {
    // Mock API to delay response
    server.use(
      http.get('/api/ai-usage/dashboard', async () => {
        await delay(100)
        return HttpResponse.json(mockDashboardData)
      })
    )

    render(<AIUsagePage />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

#### Test 6.2: Dashboard Page - Data Display
```typescript
it('displays dashboard data after loading', async () => {
  server.use(
    http.get('/api/ai-usage/dashboard', () => {
      return HttpResponse.json({
        total_interactions: 4208,
        active_days: 67,
        top_tool: { name: 'Claude Code', requests: 1842 }
      })
    })
  )

  render(<AIUsagePage />)

  expect(await screen.findByText('4,208')).toBeInTheDocument()
  expect(screen.getByText('67 / 90')).toBeInTheDocument()
  expect(screen.getByText('Claude Code')).toBeInTheDocument()
})
```

#### Test 6.3: Dashboard Page - Error Handling
```typescript
it('shows error message if API fails', async () => {
  server.use(
    http.get('/api/ai-usage/dashboard', () => {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 })
    })
  )

  render(<AIUsagePage />)

  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument()
  expect(screen.getByText('Retry')).toBeInTheDocument()
})
```

**Then implement** `app/(dashboard)/ai-usage/page.tsx`

---

### Feature 7: LinkedIn Share (TDD)

#### Test 7.1: Generate Share Image
```typescript
// services/badge-service/src/__tests__/services/share-image.service.test.ts

describe('ShareImageService', () => {
  it('generates LinkedIn share image with usage stats', async () => {
    const stats = {
      total_interactions: 4208,
      active_days: 67,
      top_tool: 'Claude Code'
    }

    const imageBuffer = await ShareImageService.generateUsageImage(stats)

    expect(imageBuffer).toBeInstanceOf(Buffer)
    expect(imageBuffer.length).toBeGreaterThan(1000) // Should be a real image
  })
})
```

#### Test 7.2: LinkedIn Share Button
```typescript
// components/buttons/__tests__/LinkedInShareButton.test.tsx

describe('LinkedInShareButton', () => {
  it('opens LinkedIn share dialog', async () => {
    const mockOpen = vi.fn()
    global.window.open = mockOpen

    render(<LinkedInShareButton stats={mockStats} />)

    await userEvent.click(screen.getByText('Share on LinkedIn'))

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
      '_blank'
    )
  })
})
```

**Then implement**:
1. `ShareImageService` in badge-service
2. `LinkedInShareButton` component

---

## Implementation Order (TDD)

### Week 1 (Day 1-3)
1. **Day 1**: Feature 2 (Backend Connect Endpoint)
   - Write tests for POST /api/ai-usage/connect
   - Implement encryption
   - Implement route and controller
   - All tests pass

2. **Day 2**: Feature 3 (Mock Data) + Feature 4 (Dashboard Endpoint)
   - Create mock data file
   - Write tests for mock data loading
   - Write tests for dashboard endpoint
   - Implement dashboard logic
   - All tests pass

3. **Day 3**: Feature 5 (UI Components - Part 1)
   - Summary cards tests + implementation
   - Bar chart tests + implementation
   - All component tests pass

### Week 2 (Day 4-7)
4. **Day 4**: Feature 5 (UI Components - Part 2)
   - Heatmap tests + implementation
   - All chart tests pass

5. **Day 5**: Feature 1 (Connect UI) + Feature 6 (Dashboard Page)
   - Connect page tests + implementation
   - Dashboard page tests + implementation
   - Integration tests pass

6. **Day 6**: Feature 7 (LinkedIn Share)
   - Share image tests + implementation
   - Share button tests + implementation
   - E2E test for share flow

7. **Day 7**: Polish & Bug Fixes
   - Address edge cases
   - Improve error messages
   - Refactor code
   - Ensure 80%+ coverage

---

## Test Coverage Requirements

### Must Have 90%+ Coverage
- API endpoints (`usage.routes.ts`, `usage.controller.ts`)
- Encryption utilities (`crypto.ts`)
- Metrics calculations (`metrics.service.ts`)

### Must Have 80%+ Coverage
- UI components (`UsageSummaryCard`, `UsageBarChart`, `ActivityHeatmap`)
- Page components (`AIUsagePage`, `AIUsageConnectPage`)

### Can Have 70%+ Coverage
- Mock data service
- Helper utilities

---

## Testing Tools & Libraries

### Frontend
- **Vitest**: Test runner
- **@testing-library/react**: Component testing
- **@testing-library/user-event**: User interaction simulation
- **msw**: API mocking

### Backend
- **Jest**: Test runner
- **Supertest**: HTTP testing
- **@faker-js/faker**: Test data generation

---

## Success Metrics

- [ ] All tests pass (`npm test` in frontend and backend)
- [ ] Coverage: Frontend ≥80%, Backend ≥85%
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Dashboard loads in <1 second (mock data)
- [ ] All user flows tested (connect, view dashboard, share)

---

## Timeline

| Feature | Days | Cumulative |
|---------|------|------------|
| Backend Connect | 1 | 1 |
| Mock Data + Dashboard API | 1 | 2 |
| UI Components (Part 1) | 1 | 3 |
| UI Components (Part 2) | 1 | 4 |
| Pages Integration | 1 | 5 |
| LinkedIn Share | 1 | 6 |
| Polish & Bugs | 1 | 7 |
| **Total** | **7 days** | **7 days** |

**Buffer**: +2-3 days for unexpected issues → **9-10 days total**

---

## References

- PRD Section: "Feature 1: AI Usage Analytics Dashboard"
- Sprint 1 TDD Setup: `sprint-1-tdd-setup-plan.md`
- Vitest Docs: https://vitest.dev/
- React Testing Library: https://testing-library.com/
