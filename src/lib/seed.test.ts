import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STATUS_ORDER } from '../types'
import { addDays } from './date'
import { createSampleJobs, ensureSeed, removeSamples, SAMPLE_SKILLS } from './seed'
import { hasSeeded, loadJobs, saveJobs, saveSkills, STORAGE_KEYS } from './storage'

function createStorageStub() {
  const map = new Map<string, string>()
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, String(value))
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
    clear: () => map.clear(),
    key: (index: number) => [...map.keys()][index] ?? null,
    get length() {
      return map.size
    },
  }
}

let stub: ReturnType<typeof createStorageStub>

beforeEach(() => {
  stub = createStorageStub()
  vi.stubGlobal('localStorage', stub)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createSampleJobs', () => {
  it('6 条示例覆盖全部状态且都带 isSample', () => {
    const jobs = createSampleJobs('2026-11-24')
    expect(jobs).toHaveLength(6)
    expect(jobs.every((job) => job.isSample)).toBe(true)
    expect(jobs.map((job) => job.status).sort()).toEqual([...STATUS_ORDER].sort())
    expect(new Set(jobs.map((job) => job.id)).size).toBe(6)
  })

  it('截止日相对传入日期生成', () => {
    const jobs = createSampleJobs('2026-11-24')
    expect(jobs[0].deadline).toBe(addDays('2026-11-24', 2))
    expect(jobs[5].deadline).toBe(addDays('2026-11-24', -1))
    expect(jobs[4].deadline).toBeUndefined()
  })
})

describe('ensureSeed', () => {
  it('首次打开载入示例并写 seeded 标记', () => {
    const result = ensureSeed()
    expect(result.didSeed).toBe(true)
    expect(result.saveError).toBeUndefined()
    expect(result.jobs).toHaveLength(6)
    expect(result.skills).toEqual(SAMPLE_SKILLS)
    expect(hasSeeded()).toBe(true)
    expect(loadJobs()).toHaveLength(6)
  })

  it('已标记时不再重塞，原样返回存储数据', () => {
    ensureSeed()
    const second = ensureSeed()
    expect(second.didSeed).toBe(false)
    expect(second.jobs).toHaveLength(6)
  })

  it('清空示例后刷新不再重塞', () => {
    ensureSeed()
    saveJobs([])
    saveSkills({ mastered: [] })
    const result = ensureSeed()
    expect(result.didSeed).toBe(false)
    expect(result.jobs).toEqual([])
    expect(result.skills).toEqual({ mastered: [] })
  })

  it('保存失败时不写标记，内存仍返回示例', () => {
    stub.setItem = () => {
      throw new DOMException('quota', 'QuotaExceededError')
    }
    const result = ensureSeed()
    expect(result.didSeed).toBe(true)
    expect(result.saveError).toBe('quota')
    expect(result.jobs).toHaveLength(6)
    expect(hasSeeded()).toBe(false)
    expect(stub.map.has(STORAGE_KEYS.jobs)).toBe(false)
  })
})

describe('removeSamples', () => {
  it('只删示例岗位与示例带入的标签，保留用户数据', () => {
    const sample = createSampleJobs('2026-11-24')
    const userJob = { ...sample[0], id: 'user-1', isSample: false, company: '用户公司' }
    const jobs = [...sample, userJob]
    const skills = { mastered: ['Java', 'Go', 'React'] }
    const next = removeSamples(jobs, skills)
    expect(next.jobs).toEqual([userJob])
    expect(next.skills).toEqual({ mastered: ['Go'] })
  })
})