import { Eye, Pencil, RefreshCw, Trash2 } from 'lucide-react'

const actions = [
  { key: 'view', label: 'View details', icon: Eye },
  { key: 'edit', label: 'Edit vehicle', icon: Pencil },
  { key: 'status', label: 'Change status', icon: RefreshCw },
  { key: 'delete', label: 'Delete vehicle', icon: Trash2 },
]

export function VehicleActions({ vehicle, onView, onEdit, onStatus, onDelete, layout = 'row' }) {
  const handlers = { view: onView, edit: onEdit, status: onStatus, delete: onDelete }
  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-1'}>
      {actions.map((action) => {
        const Icon = action.icon
        const danger = action.key === 'delete'
        return (
          <button
            key={action.key}
            type="button"
            title={action.label}
            aria-label={`${action.label} for ${vehicle.brand} ${vehicle.model}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              layout === 'grid' ? 'h-10 px-2 text-caption font-semibold' : 'size-9'
            } ${danger ? 'text-danger hover:bg-danger/10' : 'text-muted hover:bg-canvas hover:text-foreground'}`}
            onClick={() => handlers[action.key](vehicle)}
          >
            <Icon size={16} aria-hidden="true" />
            {layout === 'grid' ? action.label : null}
          </button>
        )
      })}
    </div>
  )
}
