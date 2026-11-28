import type { Status } from '../../types'

export const COLUMN_STYLES: Record<Status, string> = {
  todo: 'bg-slate-50 ring-1 ring-slate-200/60',
  applied: 'bg-indigo-100/80 ring-2 ring-indigo-300',
  written: 'bg-sky-100/80 ring-2 ring-sky-300',
  interview: 'bg-violet-100/80 ring-2 ring-violet-300',
  offer: 'bg-emerald-50/60 ring-1 ring-emerald-100',
  closed: 'bg-stone-100/70 ring-1 ring-stone-200/70',
}

export const COLUMN_HEADER_STYLES: Record<Status, string> = {
  todo: 'font-semibold text-slate-500',
  applied: 'font-bold text-indigo-700',
  written: 'font-bold text-sky-700',
  interview: 'font-bold text-violet-700',
  offer: 'font-semibold text-slate-500',
  closed: 'font-semibold text-slate-500',
}

export const COLUMN_COUNT_STYLES: Record<Status, string> = {
  todo: 'bg-white/80 text-slate-500',
  applied: 'bg-indigo-600 text-white',
  written: 'bg-sky-600 text-white',
  interview: 'bg-violet-600 text-white',
  offer: 'bg-white/80 text-slate-500',
  closed: 'bg-white/80 text-slate-500',
}

export const CHIP_ACTIVE_STYLES: Record<Status, string> = {
  todo: 'bg-slate-600 text-white',
  applied: 'bg-indigo-600 text-white',
  written: 'bg-sky-600 text-white',
  interview: 'bg-violet-600 text-white',
  offer: 'bg-emerald-600 text-white',
  closed: 'bg-stone-500 text-white',
}

export const CHIP_IDLE_STYLES: Record<Status, string> = {
  todo: 'bg-white text-slate-600 ring-1 ring-slate-200',
  applied: 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300',
  written: 'bg-sky-100 text-sky-700 ring-2 ring-sky-300',
  interview: 'bg-violet-100 text-violet-700 ring-2 ring-violet-300',
  offer: 'bg-white text-slate-600 ring-1 ring-slate-200',
  closed: 'bg-white text-slate-600 ring-1 ring-slate-200',
}