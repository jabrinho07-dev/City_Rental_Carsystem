import { FeatureCard } from '@/components/cards/FeatureCard'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { whyChooseUs } from '@/constants/mockData'

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="why-heading">
      <Container>
        <SectionHeading id="why-heading" title="Why Choose City Rental Car?" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
