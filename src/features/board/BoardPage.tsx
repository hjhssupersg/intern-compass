import { EmptyState } from '../../components/EmptyState'
import type { Job } from '../../types'
import { STATUS_LABELS, STATUS_ORDER } from '../../types'
import { BoardColumn } from './BoardColumn'

function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8" aria-hidden="true">
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="11" rx="1.5" />
      <rect x="17" y="4" width="5" height="7" rx="1.5" />
    </svg>
  )
}

export function BoardPage({ jobs }: { jobs: Job[] }) {
  if (jobs.length > 0) {
    return (
      <section>
        <p className="mb-4 text-sm text-slate-500">共 {jobs.length} 个岗位 · 拖拽改状态即将开放</p>
        <div className="flex items-stretch gap-3 overflow-x-auto pb-3 xl:grid xl:grid-cols-6 xl:overflow-visible">
          {STATUS_ORDER.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              jobs={jobs.filter((job) => job.status === status)}
            />
          ))}
        </div>
      </section>
    )
  }
  return (
    <EmptyState
      icon={<BoardIcon />}
      title="看板还是空的"
      description="粘贴你的第一条 JD，解析确认后就会出现在这里。六个状态列之间可以自由拖拽，临近截止的岗位会标红提醒。"
    >
      <div className="mt-8 w-full rounded-2xl bg-white/70 p-4 shadow-card ring-1 ring-indigo-100/80">
        <p className="text-xs font-medium text-slate-400">投递状态一览</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
          {STATUS_ORDER.map((status, index) => (
            <span key={status} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-xs text-indigo-300" aria-hidden="true">
                  →
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  status === 'closed'
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                {STATUS_LABELS[status]}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">实际投递不一定线性，任意两列之间都能拖动</p>
      </div>
    </EmptyState>
  )
}