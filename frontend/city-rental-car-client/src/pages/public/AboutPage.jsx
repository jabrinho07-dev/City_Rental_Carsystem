import { Globe2, Handshake, MapPinned } from 'lucide-react'
import { FeatureCard } from '@/components/cards/FeatureCard'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'

const values = [
  {
    icon: Handshake,
    title: 'Plain agreements',
    text: 'Customers should understand the rental before they sign, including deposits and return conditions.',
  },
  {
    icon: MapPinned,
    title: 'Local presence',
    text: 'Pickup points are meant to feel orderly, whether the journey starts in the city or at the airport.',
  },
  {
    icon: Globe2,
    title: 'International tone',
    text: 'The service is written for visitors and residents alike, in clear language and a consistent standard.',
  },
]

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container className="space-y-10">
        <PageHeader
          eyebrow="About"
          title="A rental desk built to be trusted"
          description="City Rental Car is being prepared as a professional platform for browsing vehicles, managing bookings, and supporting customers from one place."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </div>
  )
}
