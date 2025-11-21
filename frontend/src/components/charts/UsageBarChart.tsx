'use client'

import React from 'react'

export interface UsageBarChartProps {
  data: Array<{
    name: string
    requests: number
    color: string
  }>
  totalInteractions: number
}

export function UsageBarChart({ data, totalInteractions }: UsageBarChartProps) {
  // Sort by requests descending
  const sortedData = [...data].sort((a, b) => b.requests - a.requests)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Usage by AI Tool
      </h3>

      <div className="space-y-6">
        {sortedData.map((tool) => {
          const percentage = (tool.requests / totalInteractions) * 100

          return (
            <div key={tool.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{tool.name}</span>
                <span className="text-gray-600">
                  {tool.requests.toLocaleString()} requests
                </span>
              </div>

              <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-3"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: tool.color,
                  }}
                >
                  {percentage > 10 && (
                    <span className="text-sm font-semibold text-white">
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
                {percentage <= 10 && (
                  <span
                    className="absolute text-sm font-semibold text-gray-700"
                    style={{ left: `${percentage + 2}%`, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Total Interactions</span>
          <span className="text-xl font-bold text-gray-900">
            {totalInteractions.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
