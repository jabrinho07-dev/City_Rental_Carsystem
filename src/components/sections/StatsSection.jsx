import { StatCard } from '@/components/cards/StatCard'
import { Container } from '@/components/common/Container'
import { homepageStats } from '@/constants/mockData'

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="stats-heading">
      <Container>
        <h2 id="stats-heading" className="sr-only">
          City Rental Car at a glance
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homepageStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </Container>
    </section>
  )
}
