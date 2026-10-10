export function VehicleDescription({ vehicle }) {
  return (
    <section aria-labelledby="vehicle-description-heading" className="space-y-6">
      <div>
        <h2 id="vehicle-description-heading" className="text-h2 text-foreground">
          About This Vehicle
        </h2>
        <p className="mt-3 max-w-2xl text-body text-muted">{vehicle.description}</p>
      </div>
      <div>
        <h3 className="text-h3 text-foreground">Why You'll Love It</h3>
        <p className="mt-3 max-w-2xl text-body text-muted">
          This {vehicle.year} {vehicle.category} is set up for a comfortable trip, with {vehicle.transmission.toLowerCase()} transmission, {vehicle.fuel.toLowerCase()} power, and seating for {vehicle.seats}.
        </p>
      </div>
    </section>
  )
}
