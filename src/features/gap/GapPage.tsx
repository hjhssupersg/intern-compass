import { EmptyState } from '../../components/EmptyState'

function GapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8" aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" strokeLinecap="round" />
      <path d="M16 8l3-3m0 0h-2.5M19 5v2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GapPage() {
  return (
    <EmptyState
      icon={<GapIcon />}
      title="暂无差距分析"
      description="有了岗位数据后，这里会统计进行中岗位的高频技术要求，按出现次数排出你最该先补的技能清单。"
    />
  )
}