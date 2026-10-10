import { Container } from '@/components/common/Container'
import { VehicleCard } from '@/components/cards/VehicleCard'
import { routes } from '@/constants/routes'
import { getSimilarVehicles } from '@/services/vehicleCatalog'

export function SimilarVehicles({ vehicle }) {
  const vehicles = getSimilarVehicles(vehicle)

  return (
    <section className="py-12 sm:py-16" aria-labelledby="similar-vehicles-heading">
      <Container>
        <h2 id="similar-vehicles-heading" className="text-h2 text-foreground">
          Similar Vehicles
        </h2>
        {vehicles.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((item) => (
              <VehicleCard key={item.id} vehicle={item} bookTo={routes.login} />
            ))}
          </div>
        ) : (
          <p className="mt-4 max-w-xl text-body text-muted">
            No other {vehicle.category.toLowerCase()} vehicles are listed right now.
          </p>
        )}
      </Container>
    </section>
  )
}
