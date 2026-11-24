const DAY_MS = 86_400_000

function parseLocal(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayLocal(): string {
  return formatLocal(new Date())
}

export function addDays(date: string, days: number): string {
  const local = parseLocal(date)
  local.setDate(local.getDate() + days)
  return formatLocal(local)
}

export function daysUntil(deadline: string, today: string = todayLocal()): number {
  // 用 round 抵消个别时区夏令时造成的 ±1 小时偏移
  return Math.round((parseLocal(deadline).getTime() - parseLocal(today).getTime()) / DAY_MS)
}