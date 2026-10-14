const items = [
  ['general', 'General'],
  ['localization', 'Localization'],
  ['rental', 'Rental policies'],
  ['booking', 'Booking'],
  ['payments', 'Payments'],
  ['notifications', 'Notifications'],
  ['admin', 'Admin'],
]

export function SettingsNavigation({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Settings sections">
      {items.map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          className={`shrink-0 rounded-md px-3 py-2 text-left text-small font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active === id ? 'bg-primary text-white' : 'bg-surface text-foreground border border-border'}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
