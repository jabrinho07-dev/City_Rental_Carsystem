import { Eye, Ban, RefreshCw } from 'lucide-react'
import { allowedTransitions } from '@/services/bookingService'

export function BookingActions({ booking, onView, onStatus, onCancel, layout = 'row' }) {
  const canCancel = allowedTransitions(booking.status).includes('Cancelled')
  const canUpdate = allowedTransitions(booking.status).some((status) => status !== 'Cancelled')
  const buttons = [
    { key: 'view', label: 'View details', icon: Eye, onClick: () => onView(booking) },
    canUpdate ? { key: 'status', label: 'Update status', icon: RefreshCw, onClick: () => onStatus(booking) } : null,
    canCancel ? { key: 'cancel', label: 'Cancel booking', icon: Ban, onClick: () => onCancel(booking), danger: true } : null,
  ].filter(Boolean)

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-1'}>
      {buttons.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.key}
            type="button"
            title={action.label}
            aria-label={`${action.label} for ${booking.bookingReference}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              layout === 'grid' ? 'h-10 px-2 text-caption font-semibold' : 'size-9'
            } ${action.danger ? 'text-danger hover:bg-danger/10' : 'text-muted hover:bg-canvas hover:text-foreground'}`}
            onClick={action.onClick}
          >
            <Icon size={16} aria-hidden="true" />
            {layout === 'grid' ? action.label : null}
          </button>
        )
      })}
    </div>
  )
}
