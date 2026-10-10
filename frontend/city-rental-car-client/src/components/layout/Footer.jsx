import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/common/BrandMark'
import { Container } from '@/components/common/Container'
import { contactDetails, footerColumns, socialLinks } from '@/constants/mockData'

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="min-w-0 sm:col-span-2 lg:col-span-4">
          <BrandMark tone="light" />
          <p className="mt-4 max-w-sm text-small leading-6 text-white/70">
            City Rental Car provides premium vehicles and a clear rental experience for city, airport, and longer journeys.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={`#${item.name.toLowerCase()}`}
                  aria-label={`${item.name}, placeholder link`}
                  onClick={(event) => event.preventDefault()}
                  className="grid h-10 min-w-10 place-items-center rounded-md border border-white/15 px-2 text-caption font-semibold text-white/80 transition hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.mark}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="min-w-0 lg:col-span-2">
            <p className="text-caption font-semibold tracking-[0.16em] text-accent uppercase">{column.title}</p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-small text-white/75 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="min-w-0 lg:col-span-2">
          <p className="text-caption font-semibold tracking-[0.16em] text-accent uppercase">Contact</p>
          <ul className="mt-4 space-y-4">
            {contactDetails.map((item) => (
              <li key={item.label} className="flex gap-3">
                <item.icon size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-small break-words text-white">{item.value}</p>
                  <p className="text-caption text-white/55">{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-4">
          <p className="text-caption text-white/55">© 2026 City Rental Car. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  )
}
