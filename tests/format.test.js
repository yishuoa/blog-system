import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/format'

describe('formatDate', () => {
  it('formats ISO date to Chinese locale', () => {
    const result = formatDate('2026-05-01T08:00:00.000Z')
    expect(result).toContain('2026')
    expect(result).toContain('5')
  })

  it('returns empty string for falsy input', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate('')).toBe('')
  })
})
