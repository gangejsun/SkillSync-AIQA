'use client'

import React from 'react'

export interface TimeSeriesDataPoint {
  date: string
  count: number
}

export interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[]
  title?: string
}

export function TimeSeriesChart({ data, title = 'Usage Over Time' }: TimeSeriesChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.count), 1)

  // Group by week for better visualization
  const weeklyData: TimeSeriesDataPoint[] = []
  for (let i = 0; i < data.length; i += 7) {
    const weekData = data.slice(i, i + 7)
    const totalCount = weekData.reduce((sum, d) => sum + d.count, 0)
    weeklyData.push({
      date: weekData[0].date,
      count: totalCount,
    })
  }

  const weeklyMax = Math.max(...weeklyData.map((d) => d.count), 1)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="space-y-6">
        {/* Weekly Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Activity</h4>
          <div className="flex items-end gap-1 h-40">
            {weeklyData.map((point, index) => {
              const height = (point.count / weeklyMax) * 100
              const date = new Date(point.date)
              const label = `${date.getMonth() + 1}/${date.getDate()}`

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="h-32 w-full flex items-end">
                    <div
                      className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all cursor-pointer relative"
                      style={{ height: `${height}%` }}
                      title={`Week of ${label}: ${point.count} requests`}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {point.count}
                      </div>
                    </div>
                  </div>
                  <div className="h-6 mt-2 w-full flex justify-center items-center">
                    {index % 2 === 0 && (
                      <span className="text-xs text-gray-500 font-medium animate-in fade-in duration-700 delay-500">
                        {label}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Daily Line Chart Visualization */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Trend (Last 30 Days)</h4>
          <div className="relative h-32">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((percent) => (
                <line
                  key={percent}
                  x1="0"
                  y1={100 - percent}
                  x2="100"
                  y2={100 - percent}
                  stroke="#E5E7EB"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Line path */}
              <polyline
                points={data
                  .slice(-30)
                  .map((point, index) => {
                    const x = (index / Math.max(data.slice(-30).length - 1, 1)) * 100
                    const y = 100 - (point.count / maxValue) * 100
                    return `${x},${y}`
                  })
                  .join(' ')}
                stroke="#6366F1"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />

              {/* Area fill */}
              <polygon
                points={`0,100 ${data
                  .slice(-30)
                  .map((point, index) => {
                    const x = (index / Math.max(data.slice(-30).length - 1, 1)) * 100
                    const y = 100 - (point.count / maxValue) * 100
                    return `${x},${y}`
                  })
                  .join(' ')} 100,100`}
                fill="#6366F1"
                opacity="0.1"
              />

              {/* Data points */}
              {data.slice(-30).map((point, index) => {
                const x = (index / Math.max(data.slice(-30).length - 1, 1)) * 100
                const y = 100 - (point.count / maxValue) * 100
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#6366F1"
                    className="hover:r-5 transition-all cursor-pointer"
                    vectorEffect="non-scaling-stroke"
                  >
                    <title>{`${point.date}: ${point.count} requests`}</title>
                  </circle>
                )
              })}
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{data.slice(-30)[0]?.date}</span>
            <span>{data.slice(-1)[0]?.date}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Average Daily</p>
            <p className="text-xl font-bold text-gray-900">
              {Math.round(data.reduce((sum, d) => sum + d.count, 0) / data.length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Peak Day</p>
            <p className="text-xl font-bold text-gray-900">{maxValue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Period</p>
            <p className="text-xl font-bold text-gray-900">
              {data.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
