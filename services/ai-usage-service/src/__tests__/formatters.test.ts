import { formatNumber, calculatePercentage, formatDate } from '../utils/formatters'

describe('formatNumber', () => {
  it('formats integer with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('handles negative numbers', () => {
    expect(formatNumber(-1234567)).toBe('-1,234,567')
  })

  it('formats decimal numbers', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56')
  })

  it('handles small numbers without commas', () => {
    expect(formatNumber(100)).toBe('100')
  })
})

describe('calculatePercentage', () => {
  it('calculates percentage correctly', () => {
    expect(calculatePercentage(50, 200)).toBe(25)
  })

  it('returns 0 when total is 0', () => {
    expect(calculatePercentage(50, 0)).toBe(0)
  })

  it('handles 100 percent', () => {
    expect(calculatePercentage(100, 100)).toBe(100)
  })

  it('rounds to 2 decimal places', () => {
    expect(calculatePercentage(1, 3)).toBe(33.33)
  })

  it('handles zero part', () => {
    expect(calculatePercentage(0, 100)).toBe(0)
  })

  it('handles decimals correctly', () => {
    expect(calculatePercentage(45.5, 100)).toBe(45.5)
  })
})

describe('formatDate', () => {
  it('formats date to YYYY-MM-DD', () => {
    const date = new Date('2025-11-21')
    expect(formatDate(date)).toBe('2025-11-21')
  })

  it('pads single digit month', () => {
    const date = new Date('2025-01-15')
    expect(formatDate(date)).toBe('2025-01-15')
  })

  it('pads single digit day', () => {
    const date = new Date('2025-11-05')
    expect(formatDate(date)).toBe('2025-11-05')
  })

  it('handles end of year', () => {
    const date = new Date('2025-12-31')
    expect(formatDate(date)).toBe('2025-12-31')
  })

  it('handles beginning of year', () => {
    const date = new Date('2025-01-01')
    expect(formatDate(date)).toBe('2025-01-01')
  })
})
