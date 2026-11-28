import type { Job, Status } from '../types'

export function moveJobStatus(jobs: Job[], jobId: string, status: Status): Job[] {
  return jobs.map((job) => (job.id === jobId ? { ...job, status } : job))
}