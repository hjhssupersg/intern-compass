import { useDroppable } from '@dnd-kit/core'
import type { Status } from '../../types'
import { STATUS_LABELS } from '../../types'
import { CHIP_ACTIVE_STYLES, CHIP_IDLE_STYLES, DROP_OVER_STYLE } from './columnStyles'

export function StatusChip({
  status,
  count,
  active,
  onSelect,
}: {
  status: Status
  count: number
  active: boolean
  onSelect: (status: Status) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `chip-${status}`, data: { status } })

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(status)}
      className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-full px-1.5 text-xs font-semibold transition ${
        active ? CHIP_ACTIVE_STYLES[status] : CHIP_IDLE_STYLES[status]
      } ${isOver ? DROP_OVER_STYLE : ''}`}
    >
      {STATUS_LABELS[status]} {count}
    </button>
  )
}