import { useDroppable } from '@dnd-kit/core'
import type { InterviewStage, Job, Status } from '../../types'
import { STATUS_LABELS } from '../../types'
import { COLUMN_COUNT_STYLES, COLUMN_HEADER_STYLES, COLUMN_STYLES, DROP_OVER_STYLE } from './columnStyles'
import { DraggableJobCard } from './DraggableJobCard'

export function BoardColumn({
  status,
  jobs,
  onStageChange,
}: {
  status: Status
  jobs: Job[]
  onStageChange: (jobId: string, stage: InterviewStage) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}`, data: { status } })

  return (
    <section
      ref={setNodeRef}
      aria-label={STATUS_LABELS[status]}
      className={`rounded-2xl p-2.5 ${COLUMN_STYLES[status]} ${isOver ? DROP_OVER_STYLE : ''}`}
    >
      <header className="flex items-center justify-between px-1.5 pb-2 pt-1">
        <h2 className={`text-xs ${COLUMN_HEADER_STYLES[status]}`}>{STATUS_LABELS[status]}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLUMN_COUNT_STYLES[status]}`}>
          {jobs.length}
        </span>
      </header>
      <div className="space-y-2.5">
        {jobs.map((job) => (
          <DraggableJobCard key={job.id} job={job} onStageChange={onStageChange} />
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