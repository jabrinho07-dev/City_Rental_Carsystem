import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Container } from '@/components/common/Container'
import { SectionHeading } from '@/components/common/SectionHeading'
import { faqs } from '@/constants/mockData'
import { cn } from '@/utils/cn'

export function FAQ() {
  const [openId, setOpenId] = useState(null)

  function toggle(id) {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="faq-heading">
      <Container>
        <SectionHeading id="faq-heading" title="Frequently Asked Questions" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-lg border border-border bg-surface">
          {faqs.map((item) => {
            const open = openId === item.id
            const panelId = `faq-panel-${item.id}`
            const buttonId = `faq-button-${item.id}`

            return (
              <div key={item.id}>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-small font-semibold text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  {item.question}
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={cn('shrink-0 text-muted transition duration-200 motion-reduce:transition-none', open && 'rotate-180')}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200 ease-[var(--ease-standard)] motion-reduce:transition-none',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-small leading-6 text-muted">{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
