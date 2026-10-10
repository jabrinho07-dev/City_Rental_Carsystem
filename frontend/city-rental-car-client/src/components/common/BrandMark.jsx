import { Link } from 'react-router-dom'
import { routes } from '@/constants/routes'
import { cn } from '@/utils/cn'

export function BrandMark({ tone = 'dark', compact = false }) {
  const onDark = tone === 'light'

  return (
    <Link to={routes.home} className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass">
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-lg',
          onDark ? 'bg-brass text-ink' : 'bg-ink text-brass',
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M4 15.5h16M6.2 15.5l1.4-3.6A1.8 1.8 0 0 1 9.3 10.6h5.4a1.8 1.8 0 0 1 1.7 1.3l1.4 3.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.2" cy="15.5" r="1.15" fill="currentColor" />
          <circle cx="15.8" cy="15.5" r="1.15" fill="currentColor" />
        </svg>
      </span>
      <span className={cn('leading-none', compact && 'max-[419px]:sr-only')}>
        <span className={cn('block text-[10px] font-semibold tracking-[0.22em]', onDark ? 'text-white/65' : 'text-muted')}>
          CITY
        </span>
        <span className={cn('mt-1 block text-sm font-semibold tracking-wide', onDark ? 'text-white' : 'text-ink')}>
          RENTAL CAR
        </span>
      </span>
    </Link>
  )
}
