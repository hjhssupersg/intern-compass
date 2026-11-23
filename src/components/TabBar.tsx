export type TabId = 'board' | 'skills' | 'gap'

const TABS: { id: TabId; label: string }[] = [
  { id: 'board', label: '看板' },
  { id: 'skills', label: '我的技能' },
  { id: 'gap', label: '差距分析' },
]

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label="页面切换"
      className="inline-flex rounded-full bg-indigo-100/70 p-1 ring-1 ring-indigo-200/60"
    >
      {TABS.map(({ id, label }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`min-h-[40px] rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:px-5 ${
              isActive
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-indigo-700'
            }`}
          >
            {label}
          </button>
        )
      })}
    </nav>
  )
}