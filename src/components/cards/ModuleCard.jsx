import { ArrowUpRight } from 'lucide-react'
import { Link } from '@/lib/router'

export function ModuleCard({ to, icon: Icon, title, text }) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 transition hover:border-ink/20"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-sand text-ink">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="mt-4 flex items-center gap-1 text-base font-semibold text-ink">
        {title}
        <ArrowUpRight size={16} className="text-muted transition group-hover:text-ink" aria-hidden="true" />
      </span>
      <span className="mt-1 text-sm leading-6 text-muted">{text}</span>
    </Link>
  )
}
