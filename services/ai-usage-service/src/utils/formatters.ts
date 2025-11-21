/**
 * Format number with commas (e.g., 1234567 -> "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * Calculate percentage with 2 decimal places
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100 * 100) / 100
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
