# Sprint 2: AI Usage Dashboard - Context

## Quick Resume

**Status**: Sprint 2 - AI Usage Dashboard (TDD)
**Current Phase**: Planning Complete, Ready for Implementation
**Last Updated**: 2025-11-21

### What We're Building
AI Usage Analytics Dashboard that shows:
- Total interactions across AI tools (Claude Code, Cursor, Copilot)
- Active days heatmap (90 days)
- Tool usage breakdown (bar chart)
- LinkedIn sharing capability

### Approach
**Test-Driven Development (TDD)**: Write tests first, then implement

---

## Key Files

### Backend (services/ai-usage-service/)
- `src/routes/usage.routes.ts` - API routes
- `src/controllers/usage.controller.ts` - Request handlers
- `src/services/metrics.service.ts` - Metrics calculations
- `src/services/mock-data.service.ts` - Mock data loading
- `src/utils/crypto.ts` - API key encryption
- `src/mock/ai_usage_data.json` - Mock usage data

### Frontend (frontend/)
- `app/(dashboard)/ai-usage/page.tsx` - Main dashboard page
- `app/(dashboard)/ai-usage/connect/page.tsx` - API key connection
- `components/cards/UsageSummaryCard.tsx` - Summary card component
- `components/charts/UsageBarChart.tsx` - Bar chart component
- `components/charts/ActivityHeatmap.tsx` - Heatmap component
- `components/buttons/LinkedInShareButton.tsx` - Share button

### Tests
- `services/ai-usage-service/src/__tests__/` - Backend tests
- `frontend/tests/components/` - Component tests
- `frontend/tests/app/` - Page tests

---

## Key Decisions

### Technical Decisions
1. **Testing Framework**:
   - Frontend: Vitest (faster, Vite-compatible)
   - Backend: Jest (mature, stable)

2. **API Key Storage**:
   - AES-256-CBC encryption
   - Never store plain text
   - Environment variable for encryption key

3. **Mock Data**:
   - USE_MOCK_DATA=true in Sprint 2
   - Switch to real APIs in Sprint 4

4. **Chart Library**:
   - Custom components (not Recharts)
   - Better control, smaller bundle

### Design Decisions
1. **Color Intensity** (Heatmap):
   - 0 requests: gray-100
   - 1-5: primary-200
   - 6-15: primary-400
   - 16+: primary-600

2. **Data Aggregation**:
   - Always show 90 days (fill gaps with 0)
   - Sort by date ascending

3. **Number Formatting**:
   - Use toLocaleString() for commas
   - Example: 1234567 → "1,234,567"

---

## API Endpoints

### POST /api/ai-usage/connect
**Purpose**: Store encrypted API key for AI tool

**Request**:
```json
{
  "provider": "claude_code" | "cursor" | "github_copilot",
  "api_key": "sk-ant-api03-..."
}
```

**Response**:
```json
{
  "success": true,
  "integration_id": "uuid",
  "last_synced_at": "2025-11-21T10:00:00Z"
}
```

**Errors**:
- 401: Not authenticated
- 400: Invalid API key format
- 500: Server error

### GET /api/ai-usage/dashboard
**Purpose**: Get aggregated usage statistics

**Query Params**:
- `days`: Number of days (default: 90)

**Response**:
```json
{
  "total_interactions": 4208,
  "active_days": 67,
  "top_tool": {
    "name": "Claude Code",
    "requests": 1842
  },
  "tools": [
    {
      "name": "Claude Code",
      "requests": 1842,
      "percentage": 43.78
    },
    {
      "name": "Cursor AI",
      "requests": 945,
      "percentage": 22.46
    },
    {
      "name": "GitHub Copilot",
      "requests": 1421,
      "percentage": 33.76
    }
  ],
  "heatmap_data": [
    { "date": "2025-08-23", "count": 25 },
    { "date": "2025-08-24", "count": 30 },
    ...
    // 90 entries total
  ]
}
```

**Errors**:
- 401: Not authenticated
- 500: Server error

---

## Data Models

### ai_tool_integrations (Supabase)
```typescript
interface AIToolIntegration {
  integration_id: string (UUID)
  user_id: string (UUID, FK to user_profiles)
  tool_name: 'claude_code' | 'cursor' | 'github_copilot'
  encrypted_api_key: string
  last_synced_at: timestamp
  is_active: boolean
  created_at: timestamp
}
```

### ai_usage_metrics (Supabase)
```typescript
interface AIUsageMetric {
  metric_id: string (UUID)
  integration_id: string (UUID, FK to ai_tool_integrations)
  metric_date: date
  request_count: number
  token_count: number
  lines_of_code: number
  acceptance_rate: number (nullable)
  created_at: timestamp
}
```

---

## Component Props

### UsageSummaryCard
```typescript
interface UsageSummaryCardProps {
  title: string
  value: number
  subtitle?: string
  icon?: React.ReactNode
}
```

### UsageBarChart
```typescript
interface UsageBarChartProps {
  data: Array<{
    name: string
    requests: number
    color: string
  }>
  totalInteractions: number
}
```

### ActivityHeatmap
```typescript
interface ActivityHeatmapProps {
  data: Array<{
    date: string  // YYYY-MM-DD
    count: number
  }>
}
```

### LinkedInShareButton
```typescript
interface LinkedInShareButtonProps {
  stats: {
    total_interactions: number
    active_days: number
    top_tool: string
  }
}
```

---

## Environment Variables

### Backend (services/ai-usage-service/)
```bash
# Server
PORT=3001
NODE_ENV=development

# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...

# Feature Flags
USE_MOCK_DATA=true

# Encryption
ENCRYPTION_KEY=your-32-character-secret-key-here

# External APIs (Sprint 4+)
CLAUDE_API_KEY=sk-ant-api...
GITHUB_TOKEN=ghp_...
```

### Frontend (frontend/)
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Database (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## Testing Patterns

### Component Test Template
```typescript
import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/tests/utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent prop="value" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })
})
```

### API Test Template
```typescript
import request from 'supertest'
import { app } from '../index'
import { generateToken } from '../../tests/helpers'

describe('GET /api/my-endpoint', () => {
  it('returns data', async () => {
    const token = generateToken({ user_id: 'test-123' })

    const response = await request(app)
      .get('/api/my-endpoint')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toMatchObject({
      data: expect.any(Array)
    })
  })
})
```

---

## Common Pitfalls

1. **Forgetting to write tests first**
   - Always TDD: Test → Code → Refactor

2. **Not mocking external APIs**
   - Use MSW for frontend
   - Mock Supabase client in tests

3. **Hardcoding values**
   - Use environment variables
   - Use constants for magic numbers

4. **Not handling errors**
   - Always test error cases
   - Show meaningful error messages

5. **Skipping refactor step**
   - After tests pass, improve code
   - Don't leave messy code

---

## Progress Tracking

### Completed
- [x] Sprint 1: Infrastructure setup
- [x] Sprint 1: TDD setup

### In Progress
- [ ] Day 1: Backend Connect Endpoint
- [ ] Day 2: Mock Data + Dashboard API
- [ ] Day 3: UI Components Part 1
- [ ] Day 4: UI Components Part 2
- [ ] Day 5: Pages Integration
- [ ] Day 6: LinkedIn Share
- [ ] Day 7: Polish

### Next
- Sprint 3: Challenge System

---

## Daily Checklist

Before ending each day:
- [ ] All tests pass
- [ ] Code committed with meaningful message
- [ ] Coverage meets threshold
- [ ] No TypeScript errors
- [ ] Update this context file

---

## References

- **PRD**: `ai-skill-service-plan-prd.md` section "Feature 1: AI Usage Analytics Dashboard"
- **Sprint Plan**: `sprint-2-plan.md`
- **Tasks**: `sprint-2-tasks.md`
- **Tests**: `sprint-2-tests.md`
- **TDD Guide**: `docs/TESTING_GUIDE.md`
