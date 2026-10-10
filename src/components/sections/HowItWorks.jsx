import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { rentalSteps } from '@/constants/mockData'

export function HowItWorks() {
  return (
    <section className="bg-surface py-16 sm:py-20" aria-labelledby="steps-heading">
      <Container>
        <SectionHeading
          id="steps-heading"
          title="How It Works"
          subtitle="Rent your car in a few simple steps."
        />
        <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
          {rentalSteps.map((step, index) => (
            <li key={step.number} className="relative md:pt-2">
              {index < rentalSteps.length - 1 ? (
                <span
                  className="absolute top-5 left-5 hidden h-px w-full bg-border md:block"
                  aria-hidden="true"
                />
              ) : null}
              {index < rentalSteps.length - 1 ? (
                <span
                  className="absolute top-10 left-5 h-[calc(100%+0.5rem)] w-px bg-border md:hidden"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex gap-4 md:block">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-small font-semibold text-white">
                  {step.number}
                </span>
                <div className="md:mt-4">
                  <h3 className="text-h3 text-foreground">{step.title}</h3>
                  <p className="mt-2 text-small leading-6 text-muted">{step.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
