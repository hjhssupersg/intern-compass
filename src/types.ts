export type Status = 'todo' | 'applied' | 'written' | 'interview' | 'offer' | 'closed'

export const STATUS_ORDER: Status[] = ['todo', 'applied', 'written', 'interview', 'offer', 'closed']

export const STATUS_LABELS: Record<Status, string> = {
  todo: '待投递',
  applied: '已投递',
  written: '笔试',
  interview: '面试',
  offer: 'Offer',
  closed: '已结束',
}

export interface Job {
  id: string
  company: string
  title: string
  location?: string
  /** 本地日期 'YYYY-MM-DD'，不带时区 */
  deadline?: string
  techTags: string[]
  requirements: string
  rawJD: string
  status: Status
  note?: string
  createdAt: string
  isSample?: boolean
}

export interface SkillState {
  mastered: string[]
}