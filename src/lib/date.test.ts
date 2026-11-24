import { describe, expect, it } from 'vitest'
import { addDays, daysUntil, todayLocal } from './date'

describe('todayLocal', () => {
  it('返回本地 YYYY-MM-DD，与本机日期一致', () => {
    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')}`
    expect(todayLocal()).toBe(expected)
    expect(todayLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('addDays', () => {
  it('普通加天', () => {
    expect(addDays('2026-11-24', 2)).toBe('2026-11-26')
  })

  it('跨月', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
  })

  it('跨年', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('闰年二月', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
  })

  it('负数回退跨月', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('加零不变', () => {
    expect(addDays('2026-11-24', 0)).toBe('2026-11-24')
  })
})

describe('daysUntil', () => {
  it('未来为正', () => {
    expect(daysUntil('2026-11-26', '2026-11-24')).toBe(2)
  })

  it('当天为零', () => {
    expect(daysUntil('2026-11-24', '2026-11-24')).toBe(0)
  })

  it('过去为负', () => {
    expect(daysUntil('2026-11-20', '2026-11-24')).toBe(-4)
  })

  it('跨月差值正确', () => {
    expect(daysUntil('2026-12-01', '2026-11-24')).toBe(7)
  })
})