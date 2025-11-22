// Mock data for AI Usage Dashboard

// Import types from API to ensure consistency
export interface UsageTool {
  name: string;
  displayName: string;
  requests: number;
  tokens?: number;
  active_days: number;
  acceptance_rate?: number;
  last_synced?: string;
  percentage?: number;
  color?: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface DashboardData {
  total_interactions: number;
  active_days: number;
  top_tool: UsageTool | null;
  tools: UsageTool[];
  heatmap_data: HeatmapData[];
  last_synced: string | null;
}

// Generate mock heatmap data for last 90 days
function generateHeatmapData(): Array<{ date: string; count: number }> {
  const data: Array<{ date: string; count: number }> = []
  const today = new Date()

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Random count with some days having 0 (inactive days)
    const isActive = Math.random() > 0.25 // 75% chance of being active
    const count = isActive ? Math.floor(Math.random() * 40) + 1 : 0

    data.push({
      date: date.toISOString().split('T')[0],
      count,
    })
  }

  return data
}

export const mockDashboardData: DashboardData = {
  total_interactions: 4208,
  active_days: 67,
  top_tool: {
    name: 'Claude Code',
    displayName: 'Claude Code',
    requests: 1842,
    active_days: 67,
    percentage: 43.78,
    color: '#6366F1',
  },
  tools: [
    {
      name: 'Claude Code',
      displayName: 'Claude Code',
      requests: 1842,
      active_days: 67,
      percentage: 43.78,
      color: '#6366F1', // Indigo
    },
    {
      name: 'GitHub Copilot',
      displayName: 'GitHub Copilot',
      requests: 1421,
      active_days: 58,
      percentage: 33.76,
      color: '#8B5CF6', // Purple
    },
    {
      name: 'Cursor AI',
      displayName: 'Cursor AI',
      requests: 945,
      active_days: 45,
      percentage: 22.46,
      color: '#10B981', // Green
    },
  ],
  heatmap_data: generateHeatmapData(),
  last_synced: new Date().toISOString(),
}
