import { VehicleCard } from '@/components/cards/VehicleCard'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { mockVehicles } from '@/mocks/vehicles'

const featuredIds = [
  'toyota-land-cruiser',
  'toyota-prado',
  'toyota-corolla',
  'hyundai-tucson',
  'mercedes-e-class',
  'range-rover',
]

export function FeaturedCars() {
  const vehicles = featuredIds
    .map((id) => mockVehicles.find((vehicle) => vehicle.id === id))
    .filter(Boolean)

  return (
    <section className="py-16 sm:py-20" aria-labelledby="featured-heading">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="featured-heading"
            title="Featured Vehicles"
            subtitle="Choose from our carefully selected collection of reliable and premium vehicles."
          />
          <Button to={routes.cars} variant="outline">
            View All Cars
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </Container>
    </section>
  )
}
