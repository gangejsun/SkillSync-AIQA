import React from 'react'

export interface UsageSummaryCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function UsageSummaryCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: UsageSummaryCardProps) {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US')
    : value

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">{formattedValue}</h3>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
