interface SampleBannerProps {
  mode: 'sample' | 'cleared'
  onClear: () => void
  onUndo: () => void
}

export function SampleBanner({ mode, onClear, onUndo }: SampleBannerProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm text-indigo-700 ring-1 ring-indigo-100">
      <p className="min-w-0 flex-1">
        {mode === 'sample'
          ? '当前展示的是示例数据，帮你快速了解产品；清空后不会再自动载入。'
          : '已清空示例数据。'}
      </p>
      <button
        type="button"
        onClick={mode === 'sample' ? onClear : onUndo}
        className="min-h-[40px] shrink-0 rounded-lg bg-white px-3 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200 transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        {mode === 'sample' ? '清空示例' : '撤销'}
      </button>
    </div>
  )
}