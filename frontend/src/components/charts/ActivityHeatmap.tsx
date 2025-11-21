'use client'

import React from 'react'

export interface ActivityHeatmapProps {
  data: Array<{
    date: string // YYYY-MM-DD
    count: number
  }>
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Group data by week
  const weeks: Array<Array<{ date: string; count: number }>> = []
  let currentWeek: Array<{ date: string; count: number }> = []

  data.forEach((day, index) => {
    currentWeek.push(day)
    if ((index + 1) % 7 === 0) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  // Determine color intensity based on count
  const getColorClass = (count: number): string => {
    if (count === 0) return 'bg-gray-100'
    if (count <= 5) return 'bg-indigo-200'
    if (count <= 15) return 'bg-indigo-400'
    return 'bg-indigo-600'
  }

  const getTooltipText = (date: string, count: number): string => {
    const dateObj = new Date(date)
    const formatted = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${formatted}: ${count} requests`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Activity Heatmap (Last 90 Days)
      </h3>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getColorClass(day.count)} hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all`}
                title={getTooltipText(day.date, day.count)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-indigo-200" />
          <div className="w-3 h-3 rounded-sm bg-indigo-400" />
          <div className="w-3 h-3 rounded-sm bg-indigo-600" />
        </div>
        <span>More</span>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Hover over squares to see details
      </p>
    </div>
  )
}
