'use client'

import React from 'react'

export interface FilterState {
  dateRange: '7' | '30' | '90' | 'all'
  tools: string[]
}

export interface DashboardFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableTools: string[]
}

export function DashboardFilters({
  filters,
  onFilterChange,
  availableTools,
}: DashboardFiltersProps) {
  const dateRangeOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
  ]

  const toggleTool = (tool: string) => {
    const newTools = filters.tools.includes(tool)
      ? filters.tools.filter((t) => t !== tool)
      : [...filters.tools, tool]

    onFilterChange({
      ...filters,
      tools: newTools,
    })
  }

  const getToolColor = (tool: string): string => {
    const colors: Record<string, string> = {
      'Claude Code': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'GitHub Copilot': 'bg-purple-100 text-purple-700 border-purple-300',
      'Cursor AI': 'bg-green-100 text-green-700 border-green-300',
    }
    return colors[tool] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Date Range Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <div className="flex gap-2">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    dateRange: option.value as FilterState['dateRange'],
                  })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.dateRange === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Tools
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTools.map((tool) => {
              const isSelected = filters.tools.includes(tool)
              return (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    isSelected
                      ? getToolColor(tool)
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isSelected && '✓ '}
                  {tool}
                </button>
              )
            })}
            {filters.tools.length > 0 && (
              <button
                onClick={() => onFilterChange({ ...filters, tools: [] })}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.dateRange !== '90' || filters.tools.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Active filters:</span>
          {filters.dateRange !== '90' && (
            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
              {dateRangeOptions.find((o) => o.value === filters.dateRange)?.label}
            </span>
          )}
          {filters.tools.length > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {filters.tools.length} tool{filters.tools.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
