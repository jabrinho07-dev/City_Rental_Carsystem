import { cn } from '@/utils/cn'

export function SectionHeading({ id, title, subtitle, align = 'left', className }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <h2 id={id} className="text-h2 text-foreground">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-body text-muted">{subtitle}</p> : null}
    </div>
  )
}
