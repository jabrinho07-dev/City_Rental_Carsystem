import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

export function FinalCTA() {
  return (
    <section className="pb-16 sm:pb-20" aria-labelledby="cta-heading">
      <Container>
        <div className="rounded-xl bg-primary px-6 py-12 text-white sm:px-10 lg:px-14">
          <div className="max-w-2xl">
            <h2 id="cta-heading" className="text-h2 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-body text-white/75">
              Find the right vehicle and enjoy a simple, reliable rental experience with City Rental Car.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to={routes.cars} variant="brass" size="lg">
                Browse Cars
              </Button>
              <Button to="/#booking-search" variant="light" size="lg">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
