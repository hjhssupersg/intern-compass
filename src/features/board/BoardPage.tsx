import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { EmptyState } from '../../components/EmptyState'
import type { InterviewStage, Job, Status } from '../../types'
import { STATUS_LABELS, STATUS_ORDER } from '../../types'
import { BoardColumn } from './BoardColumn'
import { JobCard } from './JobCard'
import { StatusChip } from './StatusChip'

function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8" aria-hidden="true">
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="11" rx="1.5" />
      <rect x="17" y="4" width="5" height="7" rx="1.5" />
    </svg>
  )
}

export function BoardPage({
  jobs,
  onStageChange,
  onStatusChange,
}: {
  jobs: Job[]
  onStageChange: (jobId: string, stage: InterviewStage) => void
  onStatusChange: (jobId: string, status: Status) => void
}) {
  const [mobileStatus, setMobileStatus] = useState<Status>(
    () => STATUS_ORDER.find((status) => jobs.some((job) => job.status === status)) ?? 'todo',
  )
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveJob(jobs.find((job) => job.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveJob(null)
    const target = event.over?.data.current?.status as Status | undefined
    const job = jobs.find((item) => item.id === event.active.id)
    if (target && job && job.status !== target) onStatusChange(job.id, target)
  }

  if (jobs.length === 0) {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveJob(null)}
    >
      <section>
        <p className="mb-2 text-sm text-slate-500">共 {jobs.length} 个岗位 · 拖动卡片到目标列改状态</p>
        <p className="mb-2 text-xs text-slate-400 md:hidden">长按卡片拖到下方状态标签即可改状态</p>
        <div className="mb-3 flex flex-wrap gap-1.5 md:hidden">
          {STATUS_ORDER.map((status) => (
            <StatusChip
              key={status}
              status={status}
              count={jobs.filter((job) => job.status === status).length}
              active={mobileStatus === status}
              onSelect={setMobileStatus}
            />
          ))}
        </div>
        <div className="md:flex md:items-stretch md:gap-3 md:overflow-x-auto md:pb-3 xl:grid xl:grid-cols-6 xl:overflow-visible">
          {STATUS_ORDER.map((status) => (
            <div
              key={status}
              className={`${mobileStatus === status ? '' : 'hidden'} md:block md:w-60 md:shrink-0 xl:w-auto`}
            >
              <BoardColumn
                status={status}
                jobs={jobs.filter((job) => job.status === status)}
                onStageChange={onStageChange}
              />
            </div>
          ))}
        </div>
      </section>
      <DragOverlay>
        {activeJob && (
          <div className="rotate-2 drop-shadow-xl">
            <JobCard job={activeJob} onStageChange={() => undefined} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}