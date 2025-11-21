# Sprint 2: AI Usage Dashboard - Tasks (TDD)

## 🔴 RED → 🟢 GREEN → 🔵 REFACTOR

Every task follows TDD cycle:
1. Write failing test (RED)
2. Make test pass (GREEN)
3. Improve code (REFACTOR)
4. Commit

---

## Day 1: Backend Connect Endpoint ⏳ NOT STARTED

### Setup
- [ ] Create service directories if not exists
  ```bash
  cd services/ai-usage-service/src
  mkdir -p __tests__/{routes,controllers,services,utils}
  ```
  - Acceptance: Test directories exist

### Feature: Encryption Utilities (TDD)
- [ ] 🔴 Write test: encrypt() encrypts text
  - File: `src/__tests__/utils/crypto.test.ts`
  - Test: input → encrypted → different from input
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement encrypt()
  - File: `src/utils/crypto.ts`
  - Use crypto.createCipheriv (AES-256-CBC)
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: decrypt() decrypts correctly
  - Test: encrypt(text) → decrypt → equals original text
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement decrypt()
  - Use crypto.createDecipheriv
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: decrypt() throws on invalid input
  - Test: decrypt('invalid') → throws Error
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add error handling to decrypt()
  - Try-catch with meaningful error
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor crypto.ts
  - Extract key generation
  - Add JSDoc comments
  - Run: `npm test` → PASSES ✓

### Feature: POST /api/ai-usage/connect (TDD)
- [ ] 🔴 Write test: returns 401 if not authenticated
  - File: `src/__tests__/routes/usage.routes.test.ts`
  - Test: POST /api/ai-usage/connect without auth header → 401
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add auth middleware to route
  - File: `src/routes/usage.routes.ts`
  - Import and use auth middleware
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: returns 400 for invalid API key format
  - Test: POST with `api_key: "invalid"` → 400
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement validation
  - File: `src/controllers/usage.controller.ts`
  - Validate API key format (regex)
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: stores encrypted API key in database
  - Test: POST with valid key → database contains encrypted key
  - Mock Supabase
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement database storage
  - Call encrypt()
  - Insert into ai_tool_integrations table
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: returns integration_id on success
  - Test: POST → response contains { success: true, integration_id: string }
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Return integration_id in response
  - Modify controller to return integration data
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: triggers initial sync (async)
  - Test: POST → sync job queued
  - Mock sync service
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement async sync trigger
  - Fire-and-forget call to sync service
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor controller
  - Extract logic to service layer
  - Improve error messages
  - Run: `npm test` → PASSES ✓

### End of Day 1 Checklist
- [ ] All encryption tests pass
- [ ] All connect endpoint tests pass
- [ ] Code coverage ≥85%
- [ ] TypeScript compiles with no errors
- [ ] Commit: "feat(ai-usage): add connect endpoint with encryption (TDD)"

---

## Day 2: Mock Data + Dashboard Endpoint ⏳ NOT STARTED

### Feature: Mock Data Service (TDD)
- [ ] Create mock data file
  - File: `src/mock/ai_usage_data.json`
  - Content: Copy from PRD, ensure valid JSON
  - Acceptance: File exists, JSON valid

- [ ] 🔴 Write test: loads mock data from file
  - File: `src/__tests__/services/mock-data.service.test.ts`
  - Test: MockDataService.getUserUsageData('mock-user-123') → returns data
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement MockDataService.getUserUsageData()
  - File: `src/services/mock-data.service.ts`
  - Use fs.readFileSync + JSON.parse
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: returns null for non-existent user
  - Test: getUserUsageData('non-existent') → null
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add null check
  - Return null if user_id doesn't match
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Add caching (optional)
  - Add type definitions
  - Run: `npm test` → PASSES ✓

### Feature: Metrics Calculation (TDD)
- [ ] 🔴 Write test: calculateTotalInteractions()
  - File: `src/__tests__/services/metrics.service.test.ts`
  - Input: array of metrics
  - Output: sum of request_count
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement calculateTotalInteractions()
  - File: `src/services/metrics.service.ts`
  - Use Array.reduce()
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: calculateActiveDays()
  - Input: metrics array
  - Output: count of unique dates with count > 0
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement calculateActiveDays()
  - Use Set to get unique dates
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: identifyTopTool()
  - Input: metrics array
  - Output: { name, requests } for tool with most requests
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement identifyTopTool()
  - Group by tool_name, sum requests
  - Return max
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: generateHeatmapData()
  - Input: metrics, days: 90
  - Output: array of 90 objects { date, count }
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement generateHeatmapData()
  - Fill missing dates with count: 0
  - Sort by date
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor metrics.service.ts
  - Optimize algorithms
  - Add JSDoc
  - Run: `npm test` → PASSES ✓

### Feature: GET /api/ai-usage/dashboard (TDD)
- [ ] 🔴 Write test: returns 401 if not authenticated
  - File: `src/__tests__/routes/usage.routes.test.ts`
  - GET /api/ai-usage/dashboard without auth → 401
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add auth middleware
  - Add to route
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: returns aggregated data (mock mode)
  - Test: GET /dashboard?days=90 → { total_interactions, active_days, top_tool, tools, heatmap_data }
  - Set USE_MOCK_DATA=true
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement getDashboard() controller
  - Load mock data
  - Call metrics service methods
  - Return aggregated data
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: heatmap_data has exactly 90 entries
  - Assert: response.body.heatmap_data.length === 90
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Ensure heatmap always returns 90 days
  - Modify generateHeatmapData()
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: respects days query parameter
  - GET /dashboard?days=30 → 30 days of heatmap
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add days parameter handling
  - Parse query param
  - Pass to generateHeatmapData()
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor controller
  - Extract business logic to service
  - Improve response structure
  - Run: `npm test` → PASSES ✓

### End of Day 2 Checklist
- [ ] Mock data service tests pass
- [ ] Metrics calculation tests pass
- [ ] Dashboard endpoint tests pass
- [ ] Code coverage ≥85%
- [ ] Commit: "feat(ai-usage): add dashboard endpoint with metrics (TDD)"

---

## Day 3: UI Components Part 1 ⏳ NOT STARTED

### Feature: UsageSummaryCard (TDD)
- [ ] 🔴 Write test: renders title and value
  - File: `frontend/tests/components/cards/UsageSummaryCard.test.tsx`
  - Test: renders "Total Interactions" and "4,208"
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Create UsageSummaryCard component
  - File: `frontend/components/cards/UsageSummaryCard.tsx`
  - Accept props: title, value, subtitle
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: formats numbers with commas
  - Test: value 1234567 → displays "1,234,567"
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add number formatting
  - Use toLocaleString()
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: displays subtitle
  - Test: subtitle "Last 90 days" → visible
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add subtitle display
  - Render subtitle prop
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Add Tailwind classes from design system
  - Add icon support (optional)
  - Run: `npm test` → PASSES ✓

### Feature: UsageBarChart (TDD)
- [ ] 🔴 Write test: renders tool names
  - File: `frontend/tests/components/charts/UsageBarChart.test.tsx`
  - Test: displays "Claude Code", "Cursor", "Copilot"
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Create UsageBarChart component
  - File: `frontend/components/charts/UsageBarChart.tsx`
  - Map over data and render tool names
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: displays request counts
  - Test: shows "1,842 requests"
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add request count display
  - Format with toLocaleString()
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: calculates bar width as percentage
  - Test: Claude Code bar width = 43.78% (1842/4208 * 100)
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement percentage calculation
  - Calculate: (tool.requests / totalInteractions) * 100
  - Apply as inline style width
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: applies correct colors
  - Test: each tool has its designated color
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add color support
  - Accept color prop or use default palette
  - Apply bg-color class
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Animate bar widths (optional)
  - Improve accessibility (aria-labels)
  - Run: `npm test` → PASSES ✓

### End of Day 3 Checklist
- [ ] UsageSummaryCard tests pass
- [ ] UsageBarChart tests pass
- [ ] Components render correctly
- [ ] Code coverage ≥75%
- [ ] Commit: "feat(ai-usage): add summary card and bar chart (TDD)"

---

## Day 4: UI Components Part 2 ⏳ NOT STARTED

### Feature: ActivityHeatmap (TDD)
- [ ] 🔴 Write test: renders 90 day cells
  - File: `frontend/tests/components/charts/ActivityHeatmap.test.tsx`
  - Test: container has 90 cells
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Create ActivityHeatmap component
  - File: `frontend/components/charts/ActivityHeatmap.tsx`
  - Map over data (90 entries) and render cells
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: applies correct color intensity
  - Test: count 0 → gray-100, count 5 → primary-200, count 15 → primary-600
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement color intensity logic
  - Function: getColorClass(count)
  - 0 → gray, 1-5 → light, 6-15 → medium, 16+ → dark
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: shows tooltip on hover
  - Test: hover cell → tooltip shows "Nov 1: 25 requests"
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add tooltip
  - Use Radix UI Tooltip or title attribute
  - Format: `${date}: ${count} requests`
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: displays legend
  - Test: "Less active" and "More active" labels visible
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add legend
  - Render color scale legend
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Organize cells in grid (13 weeks × 7 days)
  - Add smooth transitions
  - Run: `npm test` → PASSES ✓

### End of Day 4 Checklist
- [ ] ActivityHeatmap tests pass
- [ ] Heatmap displays correctly
- [ ] All UI component tests pass
- [ ] Commit: "feat(ai-usage): add activity heatmap (TDD)"

---

## Day 5: Pages Integration ⏳ NOT STARTED

### Feature: AIUsageConnectPage (TDD)
- [ ] 🔴 Write test: renders connection form
  - File: `frontend/tests/app/(dashboard)/ai-usage/connect/page.test.tsx`
  - Test: form renders with API key input
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Create AIUsageConnectPage
  - File: `frontend/app/(dashboard)/ai-usage/connect/page.tsx`
  - Render form with input and submit button
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: validates API key format
  - Test: invalid key → error message
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add client-side validation
  - Regex: /^sk-ant-api\d+-[\w-]+$/
  - Show error message
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: calls API on submit
  - Test: valid key → POST /api/ai-usage/connect
  - Mock API with MSW
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement form submission
  - Use fetch or axios
  - Handle response
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: shows success message
  - Test: API success → "Connected successfully"
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add success state
  - Show success message
  - Redirect to dashboard (optional)
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Use React Hook Form
  - Improve UX with loading state
  - Run: `npm test` → PASSES ✓

### Feature: AIUsagePage (Dashboard) (TDD)
- [ ] 🔴 Write test: shows loading spinner
  - File: `frontend/tests/app/(dashboard)/ai-usage/page.test.tsx`
  - Test: loading state → spinner visible
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Create AIUsagePage with loading state
  - File: `frontend/app/(dashboard)/ai-usage/page.tsx`
  - Use React Query or useState
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: fetches and displays data
  - Test: API returns data → components render with data
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement data fetching
  - Call GET /api/ai-usage/dashboard
  - Pass data to components
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: shows error message on API failure
  - Test: API 500 → error message + retry button
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Add error handling
  - Catch errors
  - Show error UI with retry
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Extract data fetching to custom hook
  - Add refresh button
  - Run: `npm test` → PASSES ✓

### End of Day 5 Checklist
- [ ] Connect page tests pass
- [ ] Dashboard page tests pass
- [ ] Integration works end-to-end
- [ ] Commit: "feat(ai-usage): add connect and dashboard pages (TDD)"

---

## Day 6: LinkedIn Share ⏳ NOT STARTED

### Feature: Share Image Generation (Backend TDD)
- [ ] 🔴 Write test: generates image buffer
  - File: `services/badge-service/src/__tests__/services/share-image.service.test.ts`
  - Test: generateUsageImage(stats) → returns Buffer
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement ShareImageService
  - File: `services/badge-service/src/services/share-image.service.ts`
  - Use canvas or sharp library
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: image contains stats
  - Test: image includes total_interactions text
  - (Manual verification or OCR)
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Draw text on canvas
  - Add usage stats to image
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Apply design system colors
  - Add SkillSync branding
  - Run: `npm test` → PASSES ✓

### Feature: LinkedIn Share Button (Frontend TDD)
- [ ] 🔴 Write test: renders button
  - File: `frontend/tests/components/buttons/LinkedInShareButton.test.tsx`
  - Test: button renders
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Create LinkedInShareButton
  - File: `frontend/components/buttons/LinkedInShareButton.tsx`
  - Render button
  - Run: `npm test` → PASSES ✓

- [ ] 🔴 Write test: opens LinkedIn share dialog
  - Test: click → window.open with LinkedIn URL
  - Run: `npm test` → FAILS ✗

- [ ] 🟢 Implement onClick handler
  - Generate LinkedIn share URL
  - Call window.open()
  - Run: `npm test` → PASSES ✓

- [ ] 🔵 Refactor
  - Add loading state while generating image
  - Improve button styles
  - Run: `npm test` → PASSES ✓

### End of Day 6 Checklist
- [ ] Share image generation works
- [ ] LinkedIn share button works
- [ ] All tests pass
- [ ] Commit: "feat(ai-usage): add LinkedIn sharing (TDD)"

---

## Day 7: Polish & Bug Fixes ⏳ NOT STARTED

### Code Quality
- [ ] Run full test suite
  - Frontend: `cd frontend && npm test`
  - Backend: `cd services/ai-usage-service && npm test`
  - All pass ✓

- [ ] Check code coverage
  - Frontend: ≥80%
  - Backend: ≥85%
  - If below, add more tests

- [ ] Run linter
  - `npm run lint` → 0 errors

- [ ] TypeScript check
  - `npx tsc --noEmit` → 0 errors

### Edge Cases & Error Handling
- [ ] Test: Dashboard with no data (empty state)
- [ ] Test: API timeout handling
- [ ] Test: Network offline scenario
- [ ] Test: Invalid API responses
- [ ] Test: Large numbers (millions)

### Refactoring
- [ ] Extract repeated code into utilities
- [ ] Improve component prop types
- [ ] Add JSDoc comments
- [ ] Optimize performance (memo, useMemo)

### Documentation
- [ ] Update TESTING_GUIDE.md with new examples
- [ ] Add inline code comments for complex logic
- [ ] Create CHANGELOG.md entry

### Final Commits
- [ ] Commit: "refactor(ai-usage): improve code quality"
- [ ] Commit: "docs(ai-usage): update documentation"
- [ ] Create PR for code review

---

## Sprint 2 Completion Checklist

### Functionality
- [ ] Users can connect AI tools via API key
- [ ] Dashboard displays usage statistics
- [ ] Bar chart shows tool breakdown
- [ ] Heatmap shows activity over 90 days
- [ ] Users can share on LinkedIn

### Tests
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Coverage ≥80% frontend, ≥85% backend
- [ ] No flaky tests

### Code Quality
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Formatted with Prettier
- [ ] No console.log or debugger

### Performance
- [ ] Dashboard loads in <1 second (mock data)
- [ ] Charts render smoothly
- [ ] No memory leaks

### Ready for Sprint 3
- [ ] Sprint 2 complete
- [ ] Code merged to main
- [ ] Documentation updated
- [ ] Team ready for Challenge System

---

## Quick Commands

```bash
# Run tests
cd frontend && npm test
cd services/ai-usage-service && npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Single file
npm test UsageSummaryCard.test.tsx
```
