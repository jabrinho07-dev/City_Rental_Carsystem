import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { carCategories } from '@/constants/mockData'

export function CarCategories() {
  return (
    <section className="bg-surface py-16 sm:py-20" aria-labelledby="categories-heading">
      <Container>
        <SectionHeading id="categories-heading" title="Find the Right Car for Your Journey" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {carCategories.map((category) => (
            <Link
              key={category.name}
              to={`/cars?category=${encodeURIComponent(category.name)}`}
              className="group overflow-hidden rounded-lg border border-border bg-canvas shadow-card transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5 hover:shadow-float"
            >
              <div className="overflow-hidden">
                <img
                  src={category.image}
                  alt={category.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-h3 text-foreground">{category.name}</h3>
                <p className="mt-2 text-small text-muted">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-small font-semibold text-primary">
                  Explore
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
