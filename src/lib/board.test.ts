import { describe, expect, it } from 'vitest'
import type { Job } from '../types'
import { moveJobStatus } from './board'

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: 'j1',
    company: '字节跳动',
    title: '后端实习',
    techTags: ['Go'],
    requirements: '熟悉 Go',
    rawJD: 'JD 原文',
    status: 'applied',
    createdAt: '2026-11-28',
    ...overrides,
  }
}

describe('moveJobStatus', () => {
  it('只改目标卡片的状态，其余原样', () => {
    const jobs = [makeJob(), makeJob({ id: 'j2', status: 'todo' })]
    const next = moveJobStatus(jobs, 'j1', 'interview')
    expect(next[0].status).toBe('interview')
    expect(next[1]).toEqual(jobs[1])
    expect(next[0].company).toBe('字节跳动')
  })

  it('不修改原数组与原卡片', () => {
    const jobs = [makeJob()]
    const snapshot = JSON.parse(JSON.stringify(jobs))
    moveJobStatus(jobs, 'j1', 'closed')
    expect(jobs).toEqual(snapshot)
  })

  it('未知 id 返回内容不变', () => {
    const jobs = [makeJob()]
    expect(moveJobStatus(jobs, 'nope', 'offer')).toEqual(jobs)
  })

  it('拖回同列内容不变', () => {
    const jobs = [makeJob()]
    expect(moveJobStatus(jobs, 'j1', 'applied')).toEqual(jobs)
  })

  it('离开面试列保留 interviewStage', () => {
    const jobs = [makeJob({ status: 'interview', interviewStage: 'hr' })]
    const next = moveJobStatus(jobs, 'j1', 'closed')
    expect(next[0].status).toBe('closed')
    expect(next[0].interviewStage).toBe('hr')
  })
})