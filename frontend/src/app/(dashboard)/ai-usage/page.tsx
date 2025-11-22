'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { UsageSummaryCard } from '@/components/cards/UsageSummaryCard'
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap'
import { UsageBarChart } from '@/components/charts/UsageBarChart'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { DashboardFilters, FilterState } from '@/components/filters/DashboardFilters'
import { LinkedInShareButton } from '@/components/buttons/LinkedInShareButton'
import { mockDashboardData } from '@/lib/mockData'
import { getDashboardData, DashboardData, isMockMode } from '@/lib/api/ai-usage-api'

export default function AIUsagePage() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '90',
    tools: [],
  })
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchData = async () => {
      // Use mock data if in mock mode
      if (isMockMode()) {
        setDashboardData(mockDashboardData)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getDashboardData(parseInt(filters.dateRange))
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
        // Fallback to mock data on error
        setDashboardData(mockDashboardData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters.dateRange])

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = { ...dashboardData }

    // Filter by date range
    const daysToShow = filters.dateRange === 'all' ? data.heatmap_data.length : parseInt(filters.dateRange)
    data.heatmap_data = data.heatmap_data.slice(-daysToShow)

    // Filter by tools
    if (filters.tools.length > 0) {
      data.tools = data.tools.filter((tool) => filters.tools.includes(tool.name))
      data.total_interactions = data.tools.reduce((sum, tool) => sum + tool.requests, 0)

      // Recalculate percentages
      data.tools = data.tools.map((tool) => ({
        ...tool,
        percentage: (tool.requests / data.total_interactions) * 100,
      }))

      // Update top tool
      if (data.tools.length > 0) {
        const topTool = data.tools.reduce((max, tool) =>
          tool.requests > max.requests ? tool : max
          , data.tools[0])
        data.top_tool = topTool
      } else {
        data.top_tool = null; // No tools, so no top tool
      }
    } else {
      // If no tools are selected in the filter, reset to original dashboardData's tools
      // and recalculate top_tool based on the original (or fetched) data
      data.tools = dashboardData.tools;
      data.total_interactions = dashboardData.total_interactions;
      data.top_tool = dashboardData.top_tool;
    }


    // Recalculate active days
    data.active_days = data.heatmap_data.filter((d) => d.count > 0).length

    return data
  }, [filters, dashboardData]) // Added dashboardData to dependencies

  const data = filteredData

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Usage Dashboard
            </h1>
            <p className="text-gray-600">
              Track your AI tool usage and productivity metrics
              {isMockMode() && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Mock Mode</span>}
            </p>
          </div>
          <LinkedInShareButton
            stats={{
              total_interactions: data.total_interactions,
              active_days: data.active_days,
              top_tool: data.top_tool?.name || 'N/A',
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <p className="text-sm text-red-600 mt-1">Showing mock data instead.</p>
          </div>
        )}

        {/* Filters */}
        <DashboardFilters
          filters={filters}
          onFilterChange={setFilters}
          availableTools={dashboardData.tools.map((t) => t.name)}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <UsageSummaryCard
                title="Total Interactions"
                value={data.total_interactions}
                subtitle="Across all AI tools"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
                trend={{ value: 12.5, isPositive: true }}
              />

              <UsageSummaryCard
                title="Active Days"
                value={data.active_days}
                subtitle="Out of last 90 days"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                trend={{ value: 8.2, isPositive: true }}
              />

              <UsageSummaryCard
                title="Top Tool"
                value={data.top_tool?.name || 'N/A'}
                subtitle={data.top_tool ? `${data.top_tool.requests.toLocaleString()} requests` : 'No data'}
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                }
              />
            </div>

            {/* Time Series Chart */}
            <div className="mb-8">
              <TimeSeriesChart data={data.heatmap_data} title="Usage Over Time" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <UsageBarChart
                data={data.tools}
                totalInteractions={data.total_interactions}
              />

              <ActivityHeatmap data={data.heatmap_data} />
            </div>

            {/* Connect Tools Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Connect Your AI Tools
              </h3>
              <p className="text-gray-600 mb-4">
                Connect your AI development tools to track usage and get insights
              </p>
              <div className="flex gap-4">
                <Link href="/ai-usage/connect">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    + Connect Tool
                  </button>
                </Link>
                <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  View Connected Tools
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
