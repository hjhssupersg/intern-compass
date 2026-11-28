import { useDraggable } from '@dnd-kit/core'
import type { InterviewStage, Job } from '../../types'
import { JobCard } from './JobCard'

export function DraggableJobCard({
  job,
  onStageChange,
}: {
  job: Job
  onStageChange: (jobId: string, stage: InterviewStage) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: job.id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-manipulation cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-40' : ''}`}
    >
      <JobCard job={job} onStageChange={onStageChange} />
    </div>
  )
}