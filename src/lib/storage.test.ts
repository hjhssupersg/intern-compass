import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Job } from '../types'
import {
  getLastLoadError,
  hasSeeded,
  loadJobs,
  loadSkills,
  markSeeded,
  saveJobs,
  saveSkills,
  STORAGE_KEYS,
} from './storage'

const BACKUP_PREFIX = 'intern-compass:v1:backup:'

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

type StorageStub = ReturnType<typeof createStorageStub>

let stub: StorageStub

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: 'j1',
    company: '字节跳动',
    title: '后端开发实习生',
    techTags: ['Java', 'Redis'],
    requirements: '熟悉 Java 与常用中间件',
    rawJD: '岗位描述原文……',
    status: 'todo',
    createdAt: '2026-11-24T10:00:00.000Z',
    ...overrides,
  }
}

function backupEntries(): [string, string][] {
  return [...stub.map.entries()].filter(([key]) => key.startsWith(BACKUP_PREFIX))
}

beforeEach(() => {
  stub = createStorageStub()
  vi.stubGlobal('localStorage', stub)
})

afterEach(() => {
  vi.unstubAllGlobals()
  getLastLoadError()
})

describe('正常读写', () => {
  it('空存储返回默认值且无错误', () => {
    expect(loadJobs()).toEqual([])
    expect(loadSkills()).toEqual({ mastered: [] })
    expect(getLastLoadError()).toBeNull()
  })

  it('jobs 保存后能原样读回', () => {
    const jobs = [makeJob(), makeJob({ id: 'j2', status: 'applied', isSample: true })]
    expect(saveJobs(jobs)).toEqual({ ok: true })
    expect(loadJobs()).toEqual(jobs)
    expect(getLastLoadError()).toBeNull()
  })

  it('skills 保存后能原样读回', () => {
    const skills = { mastered: ['Java', 'Redis'] }
    expect(saveSkills(skills)).toEqual({ ok: true })
    expect(loadSkills()).toEqual(skills)
    expect(getLastLoadError()).toBeNull()
  })

  it('保存空数组覆盖旧数据', () => {
    saveJobs([makeJob()])
    saveJobs([])
    expect(loadJobs()).toEqual([])
  })
})

describe('localStorage 不可用', () => {
  it('读取抛错时返回默认值并记录 unavailable', () => {
    stub.getItem = () => {
      throw new Error('SecurityError')
    }
    expect(loadJobs()).toEqual([])
    expect(getLastLoadError()).toBe('unavailable')
    expect(loadSkills()).toEqual({ mastered: [] })
    expect(getLastLoadError()).toBe('unavailable')
  })

  it('写入抛普通错误时返回 unavailable', () => {
    stub.setItem = () => {
      throw new Error('SecurityError')
    }
    expect(saveJobs([makeJob()])).toEqual({ ok: false, error: 'unavailable' })
    expect(saveSkills({ mastered: [] })).toEqual({ ok: false, error: 'unavailable' })
  })
})

describe('存储写满', () => {
  it('QuotaExceededError 返回 quota', () => {
    stub.setItem = () => {
      throw new DOMException('quota', 'QuotaExceededError')
    }
    expect(saveJobs([makeJob()])).toEqual({ ok: false, error: 'quota' })
  })

  it('Firefox 的 NS_ERROR_DOM_QUOTA_REACHED 也返回 quota', () => {
    stub.setItem = () => {
      throw new DOMException('quota', 'NS_ERROR_DOM_QUOTA_REACHED')
    }
    expect(saveSkills({ mastered: ['Java'] })).toEqual({ ok: false, error: 'quota' })
  })
})

describe('数据损坏', () => {
  it('损坏 JSON：备份原文、重置 key、返回默认值', () => {
    const raw = '{"broken": '
    stub.map.set(STORAGE_KEYS.jobs, raw)
    expect(loadJobs()).toEqual([])
    expect(getLastLoadError()).toBe('corrupted')
    expect(stub.map.has(STORAGE_KEYS.jobs)).toBe(false)
    const backups = backupEntries()
    expect(backups).toHaveLength(1)
    expect(backups[0][1]).toBe(raw)
  })

  it('jobs 顶层不是数组视为损坏', () => {
    stub.map.set(STORAGE_KEYS.jobs, '{"a":1}')
    expect(loadJobs()).toEqual([])
    expect(getLastLoadError()).toBe('corrupted')
    expect(backupEntries()).toHaveLength(1)
  })

  it('skills.mastered 不是数组视为损坏', () => {
    stub.map.set(STORAGE_KEYS.skills, '{"mastered":"Java"}')
    expect(loadSkills()).toEqual({ mastered: [] })
    expect(getLastLoadError()).toBe('corrupted')
    expect(backupEntries()).toHaveLength(1)
  })

  it('备份失败（写满）时仍重置并返回默认值', () => {
    stub.map.set(STORAGE_KEYS.jobs, 'not json')
    stub.setItem = () => {
      throw new DOMException('quota', 'QuotaExceededError')
    }
    expect(loadJobs()).toEqual([])
    expect(getLastLoadError()).toBe('corrupted')
    expect(stub.map.has(STORAGE_KEYS.jobs)).toBe(false)
  })
})

describe('getLastLoadError', () => {
  it('读取一次后清除', () => {
    stub.getItem = () => {
      throw new Error('SecurityError')
    }
    loadJobs()
    expect(getLastLoadError()).toBe('unavailable')
    expect(getLastLoadError()).toBeNull()
  })
})

describe('seeded 标记', () => {
  it('默认未标记', () => {
    expect(hasSeeded()).toBe(false)
  })

  it('标记后读回 true', () => {
    expect(markSeeded()).toEqual({ ok: true })
    expect(hasSeeded()).toBe(true)
    expect(stub.map.get(STORAGE_KEYS.seeded)).toBe('1')
  })

  it('读取抛错时视为未标记', () => {
    stub.getItem = () => {
      throw new Error('SecurityError')
    }
    expect(hasSeeded()).toBe(false)
  })

  it('写满时标记失败返回 quota', () => {
    stub.setItem = () => {
      throw new DOMException('quota', 'QuotaExceededError')
    }
    expect(markSeeded()).toEqual({ ok: false, error: 'quota' })
    expect(hasSeeded()).toBe(false)
  })
})