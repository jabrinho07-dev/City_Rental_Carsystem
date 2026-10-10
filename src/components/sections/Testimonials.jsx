import { TestimonialCard } from '@/components/cards/TestimonialCard'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { testimonials } from '@/constants/mockData'

export function Testimonials() {
  return (
    <section className="bg-surface py-16 sm:py-20" aria-labelledby="testimonials-heading">
      <Container>
        <SectionHeading id="testimonials-heading" title="What Our Customers Say" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
