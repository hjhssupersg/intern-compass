import { EmptyState } from '../../components/EmptyState'

function SkillsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8" aria-hidden="true">
      <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  )
}

export function SkillsPage() {
  return (
    <EmptyState
      icon={<SkillsIcon />}
      title="还没有勾选技能"
      description="这里会汇总岗位中出现的技术标签，比如 Redis、Docker、Spring Boot。勾选你已掌握的技术，差距分析才能算出你还差什么。"
    />
  )
}