import { create } from 'zustand';

// Types
export interface AITool {
  tool_id: string;
  tool_name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  connected_at: string;
  last_synced_at: string | null;
  api_key?: string;
}

export interface UsageMetrics {
  date: string;
  tool_name: string;
  requests: number;
  tokens_used: number;
  cost_usd: number;
}

export interface DashboardStats {
  total_tools: number;
  active_tools: number;
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  weekly_usage: UsageMetrics[];
  monthly_usage: UsageMetrics[];
}

interface AIUsageState {
  // State
  tools: AITool[];
  dashboardStats: DashboardStats | null;
  selectedTool: AITool | null;
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;

  // Actions
  setMockMode: (enabled: boolean) => void;
  fetchTools: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  connectTool: (toolName: string, provider: string, apiKey: string) => Promise<void>;
  disconnectTool: (toolId: string) => Promise<void>;
  syncTool: (toolId: string) => Promise<void>;
  selectTool: (tool: AITool | null) => void;
  clearError: () => void;
}

// Mock data generator
const generateMockTools = (): AITool[] => [
  {
    tool_id: 'tool-1',
    tool_name: 'Claude Code',
    provider: 'Anthropic',
    status: 'connected',
    connected_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_synced_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    tool_id: 'tool-2',
    tool_name: 'GitHub Copilot',
    provider: 'GitHub',
    status: 'connected',
    connected_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_synced_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    tool_id: 'tool-3',
    tool_name: 'ChatGPT',
    provider: 'OpenAI',
    status: 'disconnected',
    connected_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    last_synced_at: null,
  },
];

const generateMockDashboardStats = (): DashboardStats => {
  const weeklyUsage: UsageMetrics[] = [];
  const monthlyUsage: UsageMetrics[] = [];

  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    weeklyUsage.push({
      date: date.toISOString().split('T')[0],
      tool_name: 'Claude Code',
      requests: Math.floor(Math.random() * 50) + 10,
      tokens_used: Math.floor(Math.random() * 10000) + 1000,
      cost_usd: Math.random() * 5 + 0.5,
    });
  }

  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    monthlyUsage.push({
      date: date.toISOString().split('T')[0],
      tool_name: 'Claude Code',
      requests: Math.floor(Math.random() * 50) + 10,
      tokens_used: Math.floor(Math.random() * 10000) + 1000,
      cost_usd: Math.random() * 5 + 0.5,
    });
  }

  const totalRequests = weeklyUsage.reduce((sum, item) => sum + item.requests, 0);
  const totalTokens = weeklyUsage.reduce((sum, item) => sum + item.tokens_used, 0);
  const totalCost = weeklyUsage.reduce((sum, item) => sum + item.cost_usd, 0);

  return {
    total_tools: 3,
    active_tools: 2,
    total_requests: totalRequests,
    total_tokens: totalTokens,
    total_cost: parseFloat(totalCost.toFixed(2)),
    weekly_usage: weeklyUsage,
    monthly_usage: monthlyUsage,
  };
};

// Create store
export const useAIUsageStore = create<AIUsageState>((set, get) => ({
  // Initial state
  tools: [],
  dashboardStats: null,
  selectedTool: null,
  isLoading: false,
  error: null,
  isMockMode: true, // Default to mock mode

  // Actions
  setMockMode: (enabled: boolean) => {
    set({ isMockMode: enabled });
    // Re-fetch data when mode changes
    get().fetchTools();
    get().fetchDashboardStats();
  },

  fetchTools: async () => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Use local data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        set({ tools: generateMockTools(), isLoading: false });
      } else {
        // Real mode: Fetch from API
        const response = await fetch('/api/ai-usage/tools');
        if (!response.ok) throw new Error('Failed to fetch tools');
        const data = await response.json();
        set({ tools: data.tools, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Use local data
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ dashboardStats: generateMockDashboardStats(), isLoading: false });
      } else {
        // Real mode: Fetch from API
        const response = await fetch('/api/ai-usage/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        set({ dashboardStats: data, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  connectTool: async (toolName: string, provider: string, apiKey: string) => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Simulate connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newTool: AITool = {
          tool_id: `tool-${Date.now()}`,
          tool_name: toolName,
          provider,
          status: 'connected',
          connected_at: new Date().toISOString(),
          last_synced_at: new Date().toISOString(),
        };
        set(state => ({
          tools: [...state.tools, newTool],
          isLoading: false,
        }));
      } else {
        // Real mode: API call
        const response = await fetch('/api/ai-usage/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool_name: toolName, provider, api_key: apiKey }),
        });
        if (!response.ok) throw new Error('Failed to connect tool');
        const data = await response.json();
        set(state => ({
          tools: [...state.tools, data.tool],
          isLoading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  disconnectTool: async (toolId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Remove from list
        await new Promise(resolve => setTimeout(resolve, 500));
        set(state => ({
          tools: state.tools.filter(t => t.tool_id !== toolId),
          isLoading: false,
        }));
      } else {
        // Real mode: API call
        const response = await fetch(`/api/ai-usage/disconnect/${toolId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to disconnect tool');
        set(state => ({
          tools: state.tools.filter(t => t.tool_id !== toolId),
          isLoading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  syncTool: async (toolId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Update last_synced_at
        await new Promise(resolve => setTimeout(resolve, 1500));
        set(state => ({
          tools: state.tools.map(t =>
            t.tool_id === toolId
              ? { ...t, last_synced_at: new Date().toISOString() }
              : t
          ),
          isLoading: false,
        }));
      } else {
        // Real mode: API call
        const response = await fetch(`/api/ai-usage/sync/${toolId}`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to sync tool');
        const data = await response.json();
        set(state => ({
          tools: state.tools.map(t =>
            t.tool_id === toolId ? data.tool : t
          ),
          isLoading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  selectTool: (tool: AITool | null) => {
    set({ selectedTool: tool });
  },

  clearError: () => {
    set({ error: null });
  },
}));
