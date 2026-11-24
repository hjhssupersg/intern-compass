import { EmptyState } from '../../components/EmptyState'
import type { SkillState } from '../../types'

function SkillsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8" aria-hidden="true">
      <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  )
}

export function SkillsPage({ skills }: { skills: SkillState }) {
  if (skills.mastered.length > 0) {
    return (
      <section className="rounded-2xl bg-white/70 p-6 shadow-card ring-1 ring-indigo-100/80">
        <h2 className="text-sm font-semibold text-slate-900">已掌握的技术</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.mastered.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">技能勾选与编辑功能即将开放，届时差距分析会据此计算。</p>
      </section>
    )
  }
  return (
    <EmptyState
      icon={<SkillsIcon />}
      title="还没有勾选技能"
      description="这里会汇总岗位中出现的技术标签，比如 Redis、Docker、Spring Boot。勾选你已掌握的技术，差距分析才能算出你还差什么。"
    />
  )
}