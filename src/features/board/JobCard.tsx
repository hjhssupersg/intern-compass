import { daysUntil } from '../../lib/date'
import type { InterviewStage, Job } from '../../types'
import { INTERVIEW_STAGE_LABELS, INTERVIEW_STAGES } from '../../types'

export function JobCard({
  job,
  onStageChange,
}: {
  job: Job
  onStageChange: (jobId: string, stage: InterviewStage) => void
}) {
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
      className={`rounded-xl p-3 shadow-card ring-1 ring-indigo-100/80 ${
        closed ? 'bg-slate-50 opacity-70' : 'bg-white'
      }`}
    >
      <p className="truncate text-xs font-medium text-slate-400" title={job.company}>
        {job.company}
        {job.location ? ` · ${job.location}` : ''}
      </p>
      <h3 className="mt-0.5 truncate text-sm font-semibold text-slate-900" title={job.title}>
        {job.title}
      </h3>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {job.techTags.map((tag) => (
          <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {tag}
          </span>
        ))}
      </div>
      {job.status === 'interview' && (
        <div className="mt-2.5 flex flex-wrap gap-1" role="group" aria-label="面试轮次">
          {INTERVIEW_STAGES.map((stage) => (
            <button
              key={stage}
              type="button"
              aria-pressed={job.interviewStage === stage}
              onClick={() => onStageChange(job.id, stage)}
              className={`min-h-[40px] rounded-full px-2.5 text-xs font-medium transition ${
                job.interviewStage === stage
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-violet-700 ring-1 ring-violet-200'
              }`}
            >
              {INTERVIEW_STAGE_LABELS[stage]}
            </button>
          ))}
        </div>
      )}
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