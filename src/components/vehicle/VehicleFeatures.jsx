import {
  Armchair,
  Bluetooth,
  Camera,
  Gauge,
  Navigation,
  Radar,
  Smartphone,
  Snowflake,
  TabletSmartphone,
  Usb,
} from 'lucide-react'

const icons = {
  'air-conditioning': Snowflake,
  bluetooth: Bluetooth,
  usb: Usb,
  gps: Navigation,
  camera: Camera,
  sensors: Radar,
  cruise: Gauge,
  leather: Armchair,
  carplay: Smartphone,
  'android-auto': TabletSmartphone,
}

export function VehicleFeatures({ features }) {
  return (
    <section aria-labelledby="vehicle-features-heading">
      <h2 id="vehicle-features-heading" className="text-h2 text-foreground">
        Features
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = icons[feature.id] || Gauge
          return (
            <li key={feature.id} className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-small text-foreground shadow-card">
              <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
              <span className="break-words">{feature.label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
