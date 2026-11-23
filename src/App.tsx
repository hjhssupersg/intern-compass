import { useState } from 'react'
import { CompassLogo } from './components/CompassLogo'
import { TabBar, type TabId } from './components/TabBar'
import { BoardPage } from './features/board/BoardPage'
import { SkillsPage } from './features/skills/SkillsPage'
import { GapPage } from './features/gap/GapPage'

export default function App() {
  const [tab, setTab] = useState<TabId>('board')

  return (
    <div className="flex min-h-screen flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-indigo-100/80 via-indigo-50/40 to-transparent"
      />

      <header className="sticky top-0 z-10 border-b border-indigo-100/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <CompassLogo />
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-slate-900">实习罗盘</h1>
            <p className="hidden text-xs text-slate-500 sm:block">粘贴 JD · 跟踪投递 · 看清差距</p>
          </div>
          <button
            type="button"
            disabled
            title="JD 粘贴与解析功能即将开放"
            className="ml-auto min-h-[40px] shrink-0 rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white shadow-card transition enabled:hover:bg-indigo-500 enabled:active:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
          >
            ＋ 粘贴 JD
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <TabBar active={tab} onChange={setTab} />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div key={tab} className="animate-fade-up">
          {tab === 'board' && <BoardPage />}
          {tab === 'skills' && <SkillsPage />}
          {tab === 'gap' && <GapPage />}
        </div>
      </main>

      <footer className="border-t border-indigo-100/60 py-4 text-center text-xs text-slate-400">
        所有数据仅保存在本机浏览器，不会上传
      </footer>
    </div>
  )
}