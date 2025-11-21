# Feature 1: AI Usage Dashboard - Context

## Feature Purpose

The AI Usage Dashboard is a core differentiator for SkillSync. Unlike traditional coding assessment platforms, SkillSync evaluates **how effectively users leverage AI tools**, not just their raw coding ability.

This dashboard provides:
1. **Quantitative proof** of AI tool proficiency
2. **Visual analytics** to track improvement over time
3. **Data-driven insights** for both users and employers

---

## Business Value

### For Job Seekers
- **Differentiation:** Stand out with verified AI usage metrics
- **Self-improvement:** Track AI tool adoption and effectiveness
- **Credibility:** Show real data, not just claims

### For Employers
- **Better screening:** Identify candidates who leverage AI effectively
- **Skills validation:** See actual tool usage patterns
- **Future-ready hiring:** Hire for the AI-augmented workplace

---

## Technical Architecture

### Data Flow

```
User
  ↓
Connect Page (API Key Input)
  ↓
Frontend API Client
  ↓
API Gateway (Port 4000)
  ↓
AI Usage Service (Port 3001)
  ↓
  ├─→ Claude Code API (External)
  ├─→ GitHub Copilot API (External)
  └─→ Cursor API (External)
  ↓
Transform & Store
  ↓
Supabase (PostgreSQL)
  ↓
Dashboard Query
  ↓
Charts & Analytics
  ↓
User
```

### Database Schema

**ai_tool_integrations**
```sql
integration_id UUID PRIMARY KEY
user_id UUID REFERENCES auth.users
tool_name VARCHAR(50)  -- 'claude_code', 'github_copilot', 'cursor'
integration_method VARCHAR(20)  -- 'api', 'csv', 'screenshot'
encrypted_api_key TEXT  -- AES-256-CBC encrypted
last_synced_at TIMESTAMP
is_active BOOLEAN
created_at TIMESTAMP
```

**ai_usage_metrics**
```sql
metric_id UUID PRIMARY KEY
integration_id UUID REFERENCES ai_tool_integrations
metric_date DATE
request_count INTEGER  -- Number of requests/completions
token_count INTEGER  -- Total tokens used (Claude Code)
lines_of_code INTEGER  -- Lines generated
acceptance_rate FLOAT  -- % of suggestions accepted (Copilot)
created_at TIMESTAMP
UNIQUE(integration_id, metric_date)
```

---

## Security Considerations

### API Key Storage
- **Never store in plaintext**
- Use AES-256-CBC encryption
- Store encryption key in secure environment variable
- Rotate encryption keys periodically

### API Key Transmission
- Always use HTTPS
- Never log API keys
- Clear from memory after use

### Access Control
- Users can only see their own data
- RLS policies enforce user isolation
- Supabase handles authentication

---

## External API Integration

### Claude Code Analytics API

**Endpoint:** `https://api.anthropic.com/v1/organizations/usage_report/claude_code`

**Authentication:**
```
anthropic-version: 2023-06-01
x-api-key: {user_api_key}
```

**Request:**
```json
{
  "start_date": "2025-08-22",
  "end_date": "2025-11-20"
}
```

**Response:**
```json
{
  "data": [
    {
      "date": "2025-11-20",
      "core_metrics": {
        "num_sessions": 25,
        "lines_of_code": {
          "added": 450,
          "deleted": 120
        }
      },
      "model_breakdown": [
        {
          "model": "claude-3-sonnet",
          "tokens": {
            "input": 12000,
            "output": 6500
          }
        }
      ]
    }
  ]
}
```

### GitHub Copilot API

**Endpoint:** `https://api.github.com/copilot/usage`

**Authentication:**
```
Authorization: token {personal_access_token}
```

**Required Scopes:** `read:user`, `read:org`

**Response:**
```json
{
  "total_suggestions": 3421,
  "total_acceptances": 2156,
  "acceptance_rate": 0.63,
  "languages": {
    "javascript": 1200,
    "python": 980,
    "typescript": 756
  }
}
```

### Cursor AI

**Status:** No public API available yet

**Workarounds:**
1. Manual CSV upload
2. Screenshot verification
3. Wait for official API

---

## Frontend Components

### Page Structure

```
/ai-usage
├── /connect (Tool selection & API key input)
└── /page (Dashboard with analytics)
```

### Key Components

**UsageSummaryCard**
- Displays single metric (interactions, days, tools)
- Icon + number + trend
- Click to filter

**TimeSeriesChart**
- Line chart showing daily usage
- Recharts library
- Hover tooltips

**UsageBarChart**
- Compare tools side-by-side
- Horizontal bars
- Percentage breakdown

**ActivityHeatmap**
- GitHub-style contribution graph
- 13 weeks × 7 days
- Color intensity = usage

**DashboardFilters**
- Date range selector
- Tool filter
- Comparison toggle

---

## Mock Data for Development

Location: `services/ai-usage-service/src/mock/ai_usage_data.txt`

**Structure:**
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
        "daily_breakdown": [
          {"date": "2025-11-20", "requests": 25, "tokens": 18500}
        ]
      }
    }
  ]
}
```

**Usage:**
```typescript
if (process.env.USE_MOCK_DATA === 'true') {
  return await loadMockData('ai_usage_data.txt');
}
```

---

## Performance Optimization

### Database Queries
- Index on `(user_id, metric_date)`
- Index on `(integration_id, metric_date)`
- Use `.select('*')` carefully - only fetch needed columns

### Caching
- Cache dashboard data for 5 minutes
- Invalidate on manual sync
- Use Redis for production

### API Rate Limits
- Claude: 100 requests/minute
- GitHub: 5000 requests/hour
- Implement exponential backoff

---

## Error Handling

### Common Errors

**Invalid API Key**
```json
{
  "error": "Invalid API key",
  "message": "Please check your Claude Code API key",
  "action": "reconnect"
}
```

**Rate Limit Exceeded**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many sync requests. Please try again in 10 minutes",
  "retry_after": 600
}
```

**Network Error**
```json
{
  "error": "Network error",
  "message": "Failed to connect to Claude API",
  "action": "retry"
}
```

### User-Facing Messages
- Be specific about what went wrong
- Provide actionable next steps
- Link to help documentation

---

## Testing Strategy

### Unit Tests
- Encryption/decryption functions
- Data transformation logic
- Aggregation calculations

### Integration Tests
- Connect endpoint with mock APIs
- Dashboard data fetching
- Sync scheduler

### E2E Tests (Cypress)
- User connects Claude Code
- Dashboard loads correctly
- Manual sync works
- Export functionality

---

## Known Limitations

1. **API Availability:** Not all tools have public APIs
2. **Historical Data:** Can only fetch last 90 days (API limit)
3. **Real-time Updates:** Daily sync only (not real-time)
4. **Cursor Support:** Waiting for official API
5. **Team Analytics:** Individual users only (v1)

---

## Future Roadmap

### Phase 2 (Q2 2025)
- [ ] Team-level analytics
- [ ] Benchmark against peers
- [ ] AI usage recommendations
- [ ] Cost tracking

### Phase 3 (Q3 2025)
- [ ] Chrome extension for automatic tracking
- [ ] Support for more tools (Cody, Tabnine, AWS CodeWhisperer)
- [ ] Real-time usage streaming

### Phase 4 (Q4 2025)
- [ ] AI coaching based on usage patterns
- [ ] Predictive analytics
- [ ] Custom reporting

---

## Related PRD Sections

- **Section 1.1:** API Key Input Screen (Lines 402-473)
- **Section 1.2:** Usage Dashboard Screen (Lines 586-728)
- **Section 1.3:** Claude Code Data Fetching (Lines 730-800)
- **Design System:** Colors & Typography (Lines 288-365)

---

## Glossary

**API Key:** Secret token for authentication with external APIs
**Integration:** Connection between user and AI tool
**Metric:** Single data point (e.g., requests on a specific date)
**Sync:** Process of fetching data from external APIs
**Heatmap:** Visual representation of activity intensity
**Acceptance Rate:** % of AI suggestions accepted by user
