import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'

export function PublicPage({ children }) {
  return (
    <div className="py-10 sm:py-14">
      <Container>{children}</Container>
    </div>
  )
}

export function PlaceholderPage({ eyebrow, title, description, children }) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="rounded-2xl border border-dashed border-line bg-paper p-6 sm:p-8">
        <p className="text-sm font-semibold text-ink">Ready for the next module</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          This screen is routed and styled. It does not load records or save changes yet.
        </p>
        {children ? <div className="mt-5 flex flex-wrap gap-3">{children}</div> : null}
      </section>
    </div>
  )
}
