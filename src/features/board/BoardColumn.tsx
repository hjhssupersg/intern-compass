import type { Job, Status } from '../../types'
import { STATUS_LABELS } from '../../types'
import { JobCard } from './JobCard'

const COLUMN_STYLES: Record<Status, string> = {
  todo: 'bg-slate-50 ring-slate-200/60',
  applied: 'bg-indigo-50/70 ring-indigo-100',
  written: 'bg-sky-50/70 ring-sky-100',
  interview: 'bg-violet-50/70 ring-violet-100',
  offer: 'bg-emerald-50/70 ring-emerald-100',
  closed: 'bg-stone-100/80 ring-stone-200/70',
}

export function BoardColumn({ status, jobs }: { status: Status; jobs: Job[] }) {
  return (
    <section
      aria-label={STATUS_LABELS[status]}
      className={`w-60 shrink-0 rounded-2xl p-2.5 ring-1 xl:w-auto ${COLUMN_STYLES[status]}`}
    >
      <header className="flex items-center justify-between px-1.5 pb-2 pt-1">
        <h2 className="text-xs font-semibold text-slate-600">{STATUS_LABELS[status]}</h2>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-500">
          {jobs.length}
        </span>
      </header>
      <div className="space-y-2.5">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
            暂无岗位
          </p>
        )}
      </div>
    </section>
  )
}