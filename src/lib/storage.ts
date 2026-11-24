import type { Job, SaveResult, SkillState, StorageError } from '../types'

export const STORAGE_KEYS = {
  jobs: 'intern-compass:v1:jobs',
  skills: 'intern-compass:v1:skills',
} as const

const BACKUP_PREFIX = 'intern-compass:v1:backup:'

let lastLoadError: StorageError | null = null

export function getLastLoadError(): StorageError | null {
  const error = lastLoadError
  lastLoadError = null
  return error
}

function isJobArray(value: unknown): value is Job[] {
  return Array.isArray(value)
}

function isSkillState(value: unknown): value is SkillState {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { mastered?: unknown }).mastered)
  )
}

function backupAndReset(key: string, raw: string): void {
  try {
    localStorage.setItem(`${BACKUP_PREFIX}${Date.now()}`, raw)
  } catch {
    console.warn(`损坏数据备份失败：${key}`)
  }
  try {
    localStorage.removeItem(key)
  } catch {
    console.warn(`损坏数据重置失败：${key}`)
  }
}

function load<T>(key: string, isValid: (value: unknown) => value is T, fallback: () => T): T {
  let raw: string | null
  try {
    raw = localStorage.getItem(key)
  } catch {
    lastLoadError = 'unavailable'
    return fallback()
  }
  if (raw === null) return fallback()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (isValid(parsed)) return parsed
    throw new Error('存储结构不符合预期')
  } catch {
    lastLoadError = 'corrupted'
    backupAndReset(key, raw)
    return fallback()
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

function save(key: string, value: Job[] | SkillState): SaveResult {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return { ok: true }
  } catch (error) {
    return { ok: false, error: isQuotaError(error) ? 'quota' : 'unavailable' }
  }
}

export function loadJobs(): Job[] {
  return load(STORAGE_KEYS.jobs, isJobArray, () => [])
}

export function saveJobs(jobs: Job[]): SaveResult {
  return save(STORAGE_KEYS.jobs, jobs)
}

export function loadSkills(): SkillState {
  return load(STORAGE_KEYS.skills, isSkillState, () => ({ mastered: [] }))
}

export function saveSkills(skills: SkillState): SaveResult {
  return save(STORAGE_KEYS.skills, skills)
}