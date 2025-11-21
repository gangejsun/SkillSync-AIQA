# Feature 1: AI Usage Dashboard - Implementation Plan

## Feature Overview

Track AI tool usage (Claude Code, GitHub Copilot, Cursor) and visualize analytics through a comprehensive dashboard.

**PRD Reference:** Section "Feature 1: AI Usage Analytics Dashboard" (Lines 400-816)

**Current Completion:** 60%

---

## What Exists

### Frontend ✅
- `/app/(dashboard)/ai-usage/page.tsx` - Full dashboard with charts
- `/app/(dashboard)/ai-usage/connect/page.tsx` - Tool connection UI
- Components: ActivityHeatmap, TimeSeriesChart, UsageBarChart, UsageSummaryCard
- Mock data system

### Backend ⚠️
- Service structure (Port 3001)
- Routes defined
- Controllers stubbed
- Database tables created

### Database ✅
- `ai_tool_integrations` table
- `ai_usage_metrics` table
- Proper indexing

---

## What's Missing

### High Priority
1. **API Integration**
   - Claude Code Analytics API client
   - GitHub Copilot Metrics API client
   - Cursor API integration

2. **Security**
   - API key encryption/decryption
   - Secure storage

3. **Backend Logic**
   - Connect endpoint implementation
   - Data sync service
   - Usage aggregation

### Medium Priority
4. **Data Sync**
   - Cron job scheduler
   - Real-time updates
   - Error retry logic

5. **Features**
   - Export to CSV/PDF
   - LinkedIn sharing
   - Historical data analysis

---

## Implementation Steps

### Step 1: Setup Dependencies
```bash
cd services/ai-usage-service
npm install @anthropic-ai/sdk @octokit/rest crypto-js node-cron
```

### Step 2: Create Encryption Utilities
**File:** `services/ai-usage-service/src/utils/encryption.ts`

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here';
const IV_LENGTH = 16;

export function encryptAPIKey(apiKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

export function decryptAPIKey(encryptedKey: string): string {
  const parts = encryptedKey.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### Step 3: Implement Claude Code Service
**File:** `services/ai-usage-service/src/services/claude-code.service.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase';

export class ClaudeCodeService {
  private static readonly ANALYTICS_API = 'https://api.anthropic.com/v1/organizations/usage_report/claude_code';

  static async syncUsageData(userId: string, apiKey: string) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 90);

    try {
      // Call Claude Code Analytics API
      const response = await fetch(this.ANALYTICS_API, {
        headers: {
          'anthropic-version': '2023-06-01',
          'x-api-key': apiKey,
          'content-type': 'application/json'
        },
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0]
        }
      });

      const analyticsData = await response.json();

      // Transform and save to database
      const metrics = analyticsData.data.map((dayData: any) => ({
        user_id: userId,
        tool_name: 'claude_code',
        metric_date: dayData.date,
        request_count: dayData.core_metrics?.num_sessions || 0,
        token_count: (dayData.model_breakdown?.[0]?.tokens?.input || 0) +
                     (dayData.model_breakdown?.[0]?.tokens?.output || 0),
        lines_of_code: dayData.core_metrics?.lines_of_code?.added || 0,
        acceptance_rate: null
      }));

      // Bulk insert
      const { error } = await supabase
        .from('ai_usage_metrics')
        .upsert(metrics, {
          onConflict: 'user_id,tool_name,metric_date'
        });

      if (error) throw error;

      return { success: true, recordsCount: metrics.length };

    } catch (error) {
      console.error('Claude Code sync error:', error);
      throw new Error(`Failed to sync: ${error.message}`);
    }
  }
}
```

### Step 4: Implement Controller
**File:** `services/ai-usage-service/src/controllers/usage.controller.ts`

```typescript
import { Request, Response } from 'express';
import { encryptAPIKey } from '../utils/encryption';
import { ClaudeCodeService } from '../services/claude-code.service';
import { GitHubCopilotService } from '../services/github-copilot.service';
import { supabase } from '../lib/supabase';

export class UsageController {
  async connectProvider(req: Request, res: Response) {
    const { provider, api_key } = req.body;
    const userId = req.user.id;

    try {
      // Encrypt API key
      const encryptedKey = encryptAPIKey(api_key);

      // Save to database
      const { data, error } = await supabase
        .from('ai_tool_integrations')
        .insert({
          user_id: userId,
          tool_name: provider,
          integration_method: 'api',
          encrypted_api_key: encryptedKey,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Trigger initial sync
      try {
        if (provider === 'claude_code') {
          await ClaudeCodeService.syncUsageData(userId, api_key);
        } else if (provider === 'github_copilot') {
          await GitHubCopilotService.syncUsageData(userId, api_key);
        }
      } catch (syncError) {
        console.error('Initial sync failed:', syncError);
      }

      return res.json({
        success: true,
        integration_id: data.integration_id,
        last_synced_at: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getDashboardData(req: Request, res: Response) {
    const userId = req.user.id;
    const days = parseInt(req.query.days as string) || 90;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch metrics
      const { data: metrics, error } = await supabase
        .from('ai_usage_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });

      if (error) throw error;

      // Aggregate data
      const totalInteractions = metrics.reduce((sum, m) => sum + m.request_count, 0);
      const activeDays = new Set(metrics.map(m => m.metric_date)).size;

      // Group by tool
      const toolsMap = new Map();
      metrics.forEach(metric => {
        if (!toolsMap.has(metric.tool_name)) {
          toolsMap.set(metric.tool_name, {
            name: metric.tool_name,
            requests: 0,
            tokens: 0
          });
        }
        const tool = toolsMap.get(metric.tool_name);
        tool.requests += metric.request_count;
        tool.tokens += metric.token_count || 0;
      });

      const tools = Array.from(toolsMap.values());
      const topTool = tools.sort((a, b) => b.requests - a.requests)[0];

      // Create heatmap data
      const heatmapData = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayMetrics = metrics.filter(m => m.metric_date === dateStr);
        const count = dayMetrics.reduce((sum, m) => sum + m.request_count, 0);
        heatmapData.push({ date: dateStr, count });
      }

      return res.json({
        totalInteractions,
        activeDays,
        topTool,
        tools,
        heatmapData,
        lastSynced: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
```

### Step 5: Add Cron Job for Auto-Sync
**File:** `services/ai-usage-service/src/services/sync-scheduler.ts`

```typescript
import cron from 'node-cron';
import { supabase } from '../lib/supabase';
import { decryptAPIKey } from '../utils/encryption';
import { ClaudeCodeService } from './claude-code.service';

export function startSyncScheduler() {
  // Run every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('Starting daily AI usage sync...');

    try {
      // Get all active integrations
      const { data: integrations, error } = await supabase
        .from('ai_tool_integrations')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Sync each integration
      for (const integration of integrations) {
        try {
          const apiKey = decryptAPIKey(integration.encrypted_api_key);

          if (integration.tool_name === 'claude_code') {
            await ClaudeCodeService.syncUsageData(integration.user_id, apiKey);
          }
          // Add other tools...

          // Update last_synced_at
          await supabase
            .from('ai_tool_integrations')
            .update({ last_synced_at: new Date().toISOString() })
            .eq('integration_id', integration.integration_id);

        } catch (syncError) {
          console.error(`Sync failed for integration ${integration.integration_id}:`, syncError);
        }
      }

      console.log('Daily sync completed');
    } catch (error) {
      console.error('Sync scheduler error:', error);
    }
  });
}
```

### Step 6: Update Frontend API Client
**File:** `frontend/src/lib/api/ai-usage.ts`

```typescript
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:4000';

export async function connectAITool(provider: string, apiKey: string) {
  const response = await axios.post(`${API_BASE}/api/ai-usage/connect`, {
    provider,
    api_key: apiKey
  });
  return response.data;
}

export async function getDashboardData(days: number = 90) {
  const response = await axios.get(`${API_BASE}/api/ai-usage/dashboard`, {
    params: { days }
  });
  return response.data;
}

export async function triggerSync(integrationId: string) {
  const response = await axios.post(`${API_BASE}/api/ai-usage/sync`, {
    integration_id: integrationId
  });
  return response.data;
}
```

---

## Testing Checklist

- [ ] API key encryption/decryption works correctly
- [ ] Claude Code API integration returns data
- [ ] GitHub Copilot API integration works
- [ ] Data saves to Supabase correctly
- [ ] Dashboard displays real data
- [ ] Cron job runs daily sync
- [ ] Error handling for invalid API keys
- [ ] Rate limiting works
- [ ] Export functionality works

---

## Success Criteria

1. Users can connect Claude Code/Copilot with API keys
2. Usage data syncs automatically daily
3. Dashboard shows real-time analytics
4. Charts display accurate data
5. LinkedIn sharing works
6. Export to CSV/PDF works

---

## Estimated Timeline

- **Setup & Dependencies:** 1 day
- **Encryption & Security:** 1 day
- **Claude Code Integration:** 2 days
- **GitHub Copilot Integration:** 2 days
- **Dashboard Backend:** 2 days
- **Cron Job & Sync:** 1 day
- **Testing & Polish:** 2 days

**Total:** 11 days (2.2 weeks)
