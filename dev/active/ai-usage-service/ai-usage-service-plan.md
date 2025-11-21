# AI Usage Service - Implementation Plan

## Executive Summary

**Service:** AI Usage Service (Port 3001)
**Purpose:** Track and analyze AI tool usage data from Claude Code, Cursor AI, and GitHub Copilot
**Timeline:** Sprint 2 (Week 3-4), 5-7 days
**Current Status:** Sprint 1 - Infrastructure complete, mock data pending

## Service Overview

The AI Usage Service is responsible for:
1. Storing encrypted API keys for AI tools
2. Fetching usage data from external APIs (Claude, GitHub, Cursor)
3. Aggregating metrics (requests, tokens, active days)
4. Providing visualization-ready data to frontend
5. Generating usage reports

## Current State

**Sprint 1 Complete:**
- ✅ Express server running on port 3001
- ✅ TypeScript configured
- ✅ Basic health check endpoint
- ✅ Project structure created

**Sprint 1 Pending:**
- [ ] Mock data file creation
- [ ] Mock data loading logic
- [ ] Basic API endpoints

## Implementation Phases

### Phase 1: Mock Data & Basic Endpoints (Sprint 1)

#### 1.1 Create Mock Data File
**Task:** Create comprehensive mock usage data

**File:** `services/ai-usage-service/src/mock/ai_usage_data.txt`

**Content Structure:**
```json
{
  "user_id": "mock-user-123",
  "tools": [
    {
      "tool_name": "claude_code",
      "last_90_days": {
        "total_requests": 1842,
        "total_tokens": 1250000,
        "active_days": 67,
        "daily_breakdown": [...],
        "top_projects": [...]
      }
    },
    {
      "tool_name": "cursor_ai",
      "last_90_days": {...}
    },
    {
      "tool_name": "github_copilot",
      "last_90_days": {...}
    }
  ]
}
```

**Acceptance:**
- Valid JSON format
- 90 days of daily breakdown data
- Multiple AI tools represented
- Realistic numbers

#### 1.2 Create Mock Data Loader
**Task:** Implement function to load and parse mock data

**File:** `services/ai-usage-service/src/services/mock-data.service.ts`

```typescript
export class MockDataService {
  async getUserUsageData(userId: string) {
    // Read mock file
    // Parse JSON
    // Return data
  }
}
```

**Acceptance:**
- Reads file from filesystem
- Handles JSON parsing errors
- Returns typed data

#### 1.3 Implement Dashboard Endpoint
**Task:** Create endpoint to return dashboard data

**File:** `services/ai-usage-service/src/routes/usage.routes.ts`
**Controller:** `services/ai-usage-service/src/controllers/usage.controller.ts`

**Endpoint:**
```
GET /api/ai-usage/dashboard?days=90
```

**Response:**
```json
{
  "total_interactions": 4208,
  "active_days": 67,
  "top_tool": {
    "name": "Claude Code",
    "requests": 1842
  },
  "tools": [...],
  "heatmap_data": [...]
}
```

**Acceptance:**
- Returns mock data when USE_MOCK_DATA=true
- Query parameter for date range
- Aggregated statistics calculated

---

### Phase 2: API Key Management (Sprint 2)

#### 2.1 Create Integration Schema
**Task:** Define data model for tool integrations

**Database Table:** `ai_tool_integrations`
```sql
CREATE TABLE ai_tool_integrations (
  integration_id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(user_id),
  tool_name VARCHAR(50),  -- 'claude_code', 'cursor', 'copilot'
  encrypted_api_key TEXT,
  last_synced_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

**Acceptance:**
- Table created in Supabase
- RLS policies applied
- Indexes on user_id and tool_name

#### 2.2 Implement Encryption Utilities
**Task:** Create utilities for encrypting/decrypting API keys

**File:** `services/ai-usage-service/src/utils/crypto.ts`

```typescript
export function encrypt(text: string): string {
  // Use crypto.createCipher
  // Return encrypted string
}

export function decrypt(encrypted: string): string {
  // Decrypt and return
}
```

**Acceptance:**
- Uses AES-256-CBC encryption
- Environment variable for encryption key
- Handles errors gracefully

#### 2.3 Create Connect Endpoint
**Task:** Endpoint to store encrypted API key

**Endpoint:**
```
POST /api/ai-usage/connect
Body: {
  "provider": "claude_code",
  "api_key": "sk-ant-api..."
}
```

**Flow:**
1. Validate API key format
2. Encrypt API key
3. Store in database
4. Trigger initial sync (async)
5. Return success

**Acceptance:**
- API key encrypted before storage
- Invalid keys rejected
- Returns integration_id

---

### Phase 3: External API Integration (Sprint 2)

#### 3.1 Claude Code Analytics API
**Task:** Integrate with Anthropic's usage reporting API

**File:** `services/ai-usage-service/src/services/claude-code.service.ts`

**API Endpoint:**
```
GET https://api.anthropic.com/v1/organizations/usage_report/claude_code
```

**Headers:**
```
anthropic-version: 2023-06-01
x-api-key: <user's key>
```

**Query Params:**
```
start_date: YYYY-MM-DD
end_date: YYYY-MM-DD
```

**Acceptance:**
- Successfully fetches data
- Handles rate limits
- Stores data in ai_usage_metrics table
- Error handling for invalid keys

#### 3.2 GitHub Copilot API
**Task:** Integrate with GitHub Copilot metrics

**File:** `services/ai-usage-service/src/services/github-copilot.service.ts`

**API Endpoint:**
```
GET https://api.github.com/copilot/usage
```

**Note:** Copilot API access may require organization-level token

**Acceptance:**
- Fetches suggestion/acceptance data
- Calculates acceptance rate
- Stores metrics

#### 3.3 Cursor AI Integration
**Task:** Integrate with Cursor (if API available)

**Note:** Cursor may not have public API. Alternatives:
- CSV export import
- Screenshot analysis (future)
- Manual input

**Acceptance:**
- Best-effort integration
- Fallback to manual data entry

---

### Phase 4: Data Aggregation & Visualization (Sprint 2)

#### 4.1 Metrics Calculation
**Task:** Aggregate raw data into visualization-ready format

**File:** `services/ai-usage-service/src/services/metrics.service.ts`

**Functions:**
```typescript
calculateTotalInteractions(metrics[])
calculateActiveDays(metrics[])
generateHeatmapData(metrics[])
identifyTopTool(metrics[])
```

**Acceptance:**
- Efficient aggregation queries
- Cached results (future)
- Accurate calculations

#### 4.2 Heatmap Data Generation
**Task:** Generate activity heatmap data

**Output Format:**
```json
[
  {"date": "2025-11-01", "count": 25},
  {"date": "2025-11-02", "count": 0},
  ...
]
```

**Requirements:**
- 90 days of data
- Fill missing dates with 0
- Sort by date

**Acceptance:**
- Always returns 90 entries
- Dates are consecutive
- Correct counts

---

### Phase 5: Sync & Scheduling (Sprint 2+)

#### 5.1 Manual Sync Endpoint
**Task:** Allow users to trigger sync manually

**Endpoint:**
```
POST /api/ai-usage/sync
Body: {
  "integration_id": "uuid"
}
```

**Flow:**
1. Fetch integration from database
2. Decrypt API key
3. Call external API
4. Store new metrics
5. Update last_synced_at

**Acceptance:**
- Syncs successfully
- Updates database
- Returns sync status

#### 5.2 Automatic Background Sync (Future)
**Task:** Implement scheduled sync every 24 hours

**Technology Options:**
- Node-cron
- Bull (Redis-based queue)
- Supabase Edge Functions

**Acceptance:**
- Runs daily at midnight
- Syncs all active integrations
- Handles failures gracefully

---

## API Endpoints Summary

### Sprint 1 (Mock Data)
- `GET /health` - Health check
- `GET /api/ai-usage/dashboard` - Dashboard data (mock)

### Sprint 2 (Real Integration)
- `POST /api/ai-usage/connect` - Connect AI tool
- `POST /api/ai-usage/sync` - Manual sync
- `GET /api/ai-usage/integrations` - List user's integrations
- `DELETE /api/ai-usage/integrations/:id` - Remove integration

---

## Data Models

### ai_tool_integrations
```typescript
interface AIToolIntegration {
  integration_id: string;
  user_id: string;
  tool_name: 'claude_code' | 'cursor' | 'github_copilot';
  encrypted_api_key: string;
  integration_method: 'api' | 'csv' | 'screenshot';
  last_synced_at: Date;
  is_active: boolean;
  created_at: Date;
}
```

### ai_usage_metrics
```typescript
interface AIUsageMetric {
  metric_id: string;
  integration_id: string;
  metric_date: Date;
  request_count: number;
  token_count: number;
  lines_of_code: number;
  acceptance_rate?: number;
  created_at: Date;
}
```

---

## External Dependencies

### APIs
- **Anthropic Claude API** - Usage reporting
- **GitHub API** - Copilot metrics
- **Cursor API** - (if available)

### Libraries
- `axios` - HTTP requests
- `crypto` - Encryption
- `@supabase/supabase-js` - Database client

---

## Security Considerations

### API Key Storage
- **NEVER** store plain-text API keys
- Use AES-256-CBC encryption
- Store encryption key in environment variable
- Rotate encryption keys periodically (future)

### RLS Policies
```sql
-- Users can only see their own integrations
CREATE POLICY "Users view own integrations"
  ON ai_tool_integrations FOR SELECT
  USING (auth.uid() = user_id);
```

### Rate Limiting (Future)
- Limit sync requests to 1 per minute per user
- Prevent abuse of external APIs

---

## Error Handling

### External API Failures
```typescript
try {
  const data = await claudeAPI.fetchUsage();
} catch (error) {
  if (error.status === 401) {
    // Invalid API key - mark integration as inactive
    await markIntegrationInactive(integrationId);
  } else if (error.status === 429) {
    // Rate limited - retry later
    await scheduleRetry(integrationId);
  } else {
    // Unknown error - log and alert
    logger.error('Claude API error', error);
  }
}
```

---

## Testing Strategy

### Unit Tests
- Test encryption/decryption
- Test metrics calculations
- Test data aggregation

### Integration Tests
- Test mock data loading
- Test API endpoints
- Test database operations

### Manual Testing
- Connect real Claude Code API key
- Verify data syncs correctly
- Check dashboard visualization

---

## Performance Considerations

### Caching (Future)
- Cache dashboard data for 5 minutes
- Invalidate cache on sync

### Database Indexes
```sql
CREATE INDEX idx_metrics_integration_date
  ON ai_usage_metrics(integration_id, metric_date);
```

---

## Success Metrics

- [ ] Mock data loads successfully
- [ ] Dashboard endpoint returns valid data
- [ ] API keys encrypted and stored securely
- [ ] External APIs integrate successfully
- [ ] Sync completes in < 10 seconds
- [ ] Dashboard loads in < 1 second

---

## Timeline

| Phase | Duration | Sprint |
|-------|----------|--------|
| Phase 1: Mock Data | 1 day | Sprint 1 |
| Phase 2: API Key Mgmt | 1 day | Sprint 2 |
| Phase 3: External APIs | 2 days | Sprint 2 |
| Phase 4: Aggregation | 1 day | Sprint 2 |
| Phase 5: Sync | 1 day | Sprint 2 |
| **Total** | **6 days** | **Sprints 1-2** |

---

## Future Enhancements

- [ ] Support for more AI tools (ChatGPT, Bard, etc.)
- [ ] CSV import for tools without APIs
- [ ] Screenshot analysis using Vision API
- [ ] Comparison with other users (anonymized)
- [ ] AI usage predictions
- [ ] Usage alerts (e.g., "You used 50% less this week")

---

## References

- **PRD Section:** "Feature 1: AI Usage Analytics Dashboard"
- **Anthropic API Docs:** https://docs.anthropic.com/claude/reference/usage-reporting
- **GitHub API Docs:** https://docs.github.com/en/rest/copilot
- **Encryption Best Practices:** OWASP guidelines
