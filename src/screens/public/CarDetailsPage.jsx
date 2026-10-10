import { CarFront } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useParams } from '@/lib/router'
import { Container } from '@/components/common/Container'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { SimilarVehicles } from '@/components/vehicle/SimilarVehicles'
import { VehicleBookingCard } from '@/components/vehicle/VehicleBookingCard'
import { VehicleDescription } from '@/components/vehicle/VehicleDescription'
import { VehicleFeatures } from '@/components/vehicle/VehicleFeatures'
import { VehicleGallery } from '@/components/vehicle/VehicleGallery'
import { RentalRequirements } from '@/components/vehicle/RentalRequirements'
import { VehicleSpecifications } from '@/components/vehicle/VehicleSpecifications'
import { VehicleSummary } from '@/components/vehicle/VehicleSummary'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { getVehicleById } from '@/services/vehicleCatalog'

function scrollToBooking() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  document.getElementById('vehicle-booking')?.scrollIntoView({ behavior, block: 'start' })
}

function VehicleNotFound() {
  return (
    <Container className="py-16 sm:py-20">
      <Card className="mx-auto max-w-xl text-center">
        <CarFront className="mx-auto text-accent" size={28} aria-hidden="true" />
        <h1 className="text-h2 mt-4 text-foreground">Vehicle Not Found</h1>
        <p className="mt-3 text-body text-muted">
          The vehicle you're looking for is unavailable or may have been removed.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to={routes.cars}>Browse All Cars</Button>
          <Button to={routes.home} variant="outline">
            Go Home
          </Button>
        </div>
      </Card>
    </Container>
  )
}

export default function CarDetailsPage() {
  const { id } = useParams()
  const vehicle = useMemo(() => getVehicleById(id), [id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!vehicle) return <VehicleNotFound />

  const name = `${vehicle.brand} ${vehicle.model}`

  return (
    <>
      <Container className="py-6 sm:py-8 lg:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', to: routes.home },
            { label: 'Cars', to: routes.cars },
            { label: name },
          ]}
        />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0 space-y-8 lg:col-start-1">
            <VehicleGallery images={vehicle.images} name={name} />
            <VehicleSummary vehicle={vehicle} onBook={scrollToBooking} />
            <VehicleSpecifications vehicle={vehicle} />
          </div>
          <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <VehicleBookingCard key={vehicle.id} vehicle={vehicle} />
            </div>
          </div>
          <div className="min-w-0 space-y-8 lg:col-start-1">
            <VehicleFeatures features={vehicle.features} />
            <VehicleDescription vehicle={vehicle} />
            <RentalRequirements />
          </div>
        </div>
      </Container>
      <SimilarVehicles vehicle={vehicle} />
      <FinalCTA />
      {vehicle.availability === 'available' ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface p-3 shadow-nav lg:hidden">
          <Button type="button" className="w-full" onClick={scrollToBooking}>
            Book This Car
          </Button>
        </div>
      ) : null}
    </>
  )
}
