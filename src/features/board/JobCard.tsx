import { daysUntil } from '../../lib/date'
import type { Job } from '../../types'
import { STATUS_LABELS } from '../../types'

export function JobCard({ job }: { job: Job }) {
  const closed = job.status === 'closed'
  let deadlineText: string | null = null
  let urgent = false
  if (closed) {
    deadlineText = '已结束'
  } else if (job.deadline) {
    const days = daysUntil(job.deadline)
    urgent = days <= 3
    deadlineText = days < 0 ? '已过期' : days === 0 ? '今天截止' : `${days} 天后截止`
  }

  return (
    <article
      className={`rounded-2xl p-4 shadow-card ring-1 ring-indigo-100/80 ${
        closed ? 'bg-slate-50 opacity-70' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            {job.company}
            {job.location ? ` · ${job.location}` : ''}
          </p>
          <h3 className="mt-0.5 truncate text-sm font-semibold text-slate-900">{job.title}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            closed ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {STATUS_LABELS[job.status]}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.techTags.map((tag) => (
          <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      {deadlineText && (
        <p
          className={`mt-3 text-xs font-medium ${
            closed ? 'text-slate-400' : urgent ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          {job.deadline && !closed ? `${job.deadline} · ` : ''}
          {deadlineText}
        </p>
      )}
    </article>
  )
}