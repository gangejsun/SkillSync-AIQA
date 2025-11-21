# Feature 1: AI Usage Dashboard - Task List

## Sprint 2: AI Usage Dashboard Completion

### Phase 1: Setup & Dependencies ⏱️ 1 day

- [ ] Install backend dependencies
  ```bash
  cd services/ai-usage-service
  npm install @anthropic-ai/sdk @octokit/rest crypto-js node-cron axios
  ```

- [ ] Install frontend dependencies
  ```bash
  cd frontend
  npm install zustand @supabase/supabase-js
  ```

- [ ] Configure environment variables
  - [ ] Add `ENCRYPTION_KEY` to `.env`
  - [ ] Add `ANTHROPIC_API_KEY` (for testing)
  - [ ] Add `GITHUB_TOKEN` (for testing)

---

### Phase 2: Security & Encryption ⏱️ 1 day

- [ ] Create encryption utilities (`utils/encryption.ts`)
  - [ ] `encryptAPIKey(apiKey: string): string`
  - [ ] `decryptAPIKey(encrypted: string): string`
  - [ ] Add unit tests for encryption

- [ ] Update environment configuration
  - [ ] Generate secure 32-character encryption key
  - [ ] Document key rotation process

---

### Phase 3: Claude Code Integration ⏱️ 2 days

- [ ] Create `ClaudeCodeService` (`services/claude-code.service.ts`)
  - [ ] `syncUsageData(userId, apiKey)` method
  - [ ] Handle API pagination
  - [ ] Transform analytics data to database schema
  - [ ] Error handling for invalid API keys

- [ ] Test Claude Code API
  - [ ] Test with valid API key
  - [ ] Test with invalid API key
  - [ ] Test with rate limiting
  - [ ] Verify data transformation

- [ ] Add Claude Code mock data fallback
  - [ ] Update `mock/ai_usage_data.txt`
  - [ ] Add mock mode toggle

---

### Phase 4: GitHub Copilot Integration ⏱️ 2 days

- [ ] Create `GitHubCopilotService` (`services/github-copilot.service.ts`)
  - [ ] `syncUsageData(userId, token)` method
  - [ ] Fetch Copilot metrics from GitHub API
  - [ ] Calculate acceptance rate
  - [ ] Transform to database schema

- [ ] Test GitHub API integration
  - [ ] Test with personal access token
  - [ ] Verify permissions (read:user, read:org)
  - [ ] Handle API errors

- [ ] Add Cursor AI placeholder
  - [ ] Document Cursor API (when available)
  - [ ] Add stub for future implementation

---

### Phase 5: Backend Controllers ⏱️ 2 days

- [ ] Implement `UsageController.connectProvider`
  - [ ] Validate request body
  - [ ] Encrypt API key
  - [ ] Save to database
  - [ ] Trigger initial sync
  - [ ] Return integration ID

- [ ] Implement `UsageController.getDashboardData`
  - [ ] Fetch metrics from database
  - [ ] Aggregate by tool
  - [ ] Calculate statistics
  - [ ] Generate heatmap data
  - [ ] Return formatted response

- [ ] Implement `UsageController.syncNow`
  - [ ] Manual sync trigger
  - [ ] Check rate limits
  - [ ] Update last_synced_at

- [ ] Add request validation
  - [ ] Install `zod` for schema validation
  - [ ] Create validation schemas
  - [ ] Add validation middleware

---

### Phase 6: Data Sync Scheduler ⏱️ 1 day

- [ ] Create `SyncScheduler` (`services/sync-scheduler.ts`)
  - [ ] Configure cron job (daily at 2 AM)
  - [ ] Fetch active integrations
  - [ ] Decrypt API keys
  - [ ] Sync each tool
  - [ ] Update sync timestamps
  - [ ] Log errors

- [ ] Test scheduler
  - [ ] Test manual trigger
  - [ ] Verify cron timing
  - [ ] Check error handling

- [ ] Add health monitoring
  - [ ] Track sync success/failure
  - [ ] Alert on repeated failures

---

### Phase 7: Frontend Integration ⏱️ 1 day

- [ ] Create API client (`lib/api/ai-usage.ts`)
  - [ ] `connectAITool(provider, apiKey)`
  - [ ] `getDashboardData(days)`
  - [ ] `triggerSync(integrationId)`
  - [ ] Add error handling

- [ ] Update connect page
  - [ ] Replace mock calls with real API
  - [ ] Add loading states
  - [ ] Add error messages
  - [ ] Add success feedback

- [ ] Update dashboard page
  - [ ] Fetch real data on mount
  - [ ] Add loading skeleton
  - [ ] Add error boundaries
  - [ ] Add refresh button

- [ ] Add Zustand store
  - [ ] Create `useAIUsageStore`
  - [ ] Manage loading/error states
  - [ ] Cache dashboard data

---

### Phase 8: Advanced Features ⏱️ 1 day

- [ ] Export functionality
  - [ ] Export to CSV
  - [ ] Export to PDF (with charts)
  - [ ] Download button in dashboard

- [ ] LinkedIn sharing
  - [ ] Generate share image
  - [ ] Create share URL
  - [ ] Add share modal

- [ ] Historical comparison
  - [ ] Compare current vs previous period
  - [ ] Show growth percentages
  - [ ] Highlight trends

---

### Phase 9: Testing ⏱️ 2 days

- [ ] Unit tests
  - [ ] Encryption utilities
  - [ ] Service methods
  - [ ] Controllers
  - [ ] API clients

- [ ] Integration tests
  - [ ] Connect endpoint
  - [ ] Dashboard endpoint
  - [ ] Sync endpoint
  - [ ] Full flow test

- [ ] E2E tests (optional)
  - [ ] User connects Claude Code
  - [ ] User views dashboard
  - [ ] User triggers sync

- [ ] Performance testing
  - [ ] Test with 90 days of data
  - [ ] Test with multiple tools
  - [ ] Optimize queries if needed

---

### Phase 10: Polish & Documentation ⏱️ 1 day

- [ ] Code review
  - [ ] Security review (API keys)
  - [ ] Error handling review
  - [ ] Performance review

- [ ] Documentation
  - [ ] API endpoint documentation
  - [ ] Setup guide
  - [ ] Troubleshooting guide

- [ ] UI polish
  - [ ] Loading states
  - [ ] Empty states
  - [ ] Error messages
  - [ ] Responsive design

---

## Dependencies Between Tasks

```
Setup → Security → Integrations → Controllers → Scheduler → Frontend → Features → Testing → Polish
  └──────────────────────────────────┴──────────────────────────────────────┘
                    (can be parallel after controllers)
```

---

## Acceptance Criteria

- ✅ Users can connect AI tools with API keys
- ✅ API keys are encrypted in database
- ✅ Dashboard shows real usage data
- ✅ Data syncs automatically daily
- ✅ Manual sync works on demand
- ✅ Charts display accurate metrics
- ✅ Export to CSV/PDF works
- ✅ LinkedIn sharing works
- ✅ Error handling is comprehensive
- ✅ Tests pass with >80% coverage

---

## Rollout Plan

### Dev Environment
1. Test with personal API keys
2. Verify data sync
3. Test all features

### Staging Environment
1. Deploy services to staging
2. Test with sample users
3. Monitor for errors

### Production Environment
1. Deploy in phases:
   - Day 1: Backend services only
   - Day 2: Frontend connection page
   - Day 3: Full dashboard
2. Monitor error rates
3. Collect user feedback

---

## Monitoring & Alerts

- [ ] Setup application logging
- [ ] Track API call success rates
- [ ] Monitor sync job completion
- [ ] Alert on repeated sync failures
- [ ] Track dashboard load times

---

## Future Enhancements

- [ ] Support for more AI tools (Cody, Tabnine, etc.)
- [ ] Team-level analytics
- [ ] Benchmark against peers
- [ ] AI usage recommendations
- [ ] Cost tracking
- [ ] Chrome extension for automatic tracking
