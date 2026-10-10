import { ArrowRight } from 'lucide-react'
import heroImage from '@/assets/hero-sedan.jpg'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary text-white" aria-labelledby="hero-heading">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 20%, rgb(212 160 23 / 0.22), transparent 32%), radial-gradient(circle at 90% 0%, rgb(255 255 255 / 0.08), transparent 26%)',
        }}
      />
      <Container className="relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20 lg:pb-28">
        <div className="fade-up max-w-xl">
          <p className="text-caption font-semibold tracking-[0.2em] text-accent uppercase">Premium car rental</p>
          <h1 id="hero-heading" className="text-display mt-4 text-balance text-white">
            Drive Your Journey With Confidence
          </h1>
          <p className="text-body mt-5 max-w-lg text-white/75">
            Rent premium, reliable vehicles with a simple booking experience designed around you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to={routes.cars} variant="brass" size="lg" icon={ArrowRight} iconPosition="right">
              Explore Cars
            </Button>
            <Button to="/#booking-search" variant="light" size="lg">
              Book a Car
            </Button>
          </div>
        </div>

        <div className="fade-up">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-secondary shadow-float">
            <img
              src={heroImage}
              alt="Charcoal luxury sedan parked on a city street at dusk"
              className="aspect-video w-full object-cover motion-safe:transition motion-safe:duration-300 motion-safe:hover:scale-[1.02]"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
