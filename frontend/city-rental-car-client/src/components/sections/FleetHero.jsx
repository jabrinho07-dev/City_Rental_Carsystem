import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '@/assets/hero-sedan.jpg'
import { Container } from '@/components/common/Container'
import { routes } from '@/constants/routes'

export function FleetHero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white" aria-labelledby="fleet-heading">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-primary/75" aria-hidden="true" />
      <Container className="relative py-10 sm:py-12 lg:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-caption text-white/70">
            <li>
              <Link to={routes.home} className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page" className="text-white">
              Cars
            </li>
          </ol>
        </nav>
        <h1 id="fleet-heading" className="text-h1 mt-4 max-w-2xl text-balance text-white">
          Find the Perfect Car for Your Journey
        </h1>
        <p className="mt-3 max-w-xl text-small leading-6 text-white/75 sm:text-body">
          Choose from our wide range of reliable, comfortable, and premium vehicles.
        </p>
      </Container>
    </section>
  )
}
