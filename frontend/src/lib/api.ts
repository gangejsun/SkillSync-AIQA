// API Client for backend services

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface ConnectToolRequest {
  provider: 'claude_code' | 'cursor' | 'github_copilot'
  api_key: string
}

interface ConnectToolResponse {
  success: boolean
  integration_id: string
  last_synced_at: string
}

interface DashboardResponse {
  total_interactions: number
  active_days: number
  top_tool: {
    name: string
    requests: number
  }
  tools: Array<{
    name: string
    requests: number
    percentage: number
    color?: string
  }>
  heatmap_data: Array<{
    date: string
    count: number
  }>
}

class APIClient {
  private baseUrl: string
  private authToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'An error occurred',
      }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // AI Usage endpoints
  async connectTool(data: ConnectToolRequest): Promise<ConnectToolResponse> {
    return this.request<ConnectToolResponse>('/api/ai-usage/connect', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDashboard(days: number = 90): Promise<DashboardResponse> {
    return this.request<DashboardResponse>(
      `/api/ai-usage/dashboard?days=${days}`
    )
  }

  async syncUsage(integrationId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/ai-usage/sync', {
      method: 'POST',
      body: JSON.stringify({ integration_id: integrationId }),
    })
  }
}

export const apiClient = new APIClient(API_BASE_URL)

// Export types
export type { ConnectToolRequest, ConnectToolResponse, DashboardResponse }
