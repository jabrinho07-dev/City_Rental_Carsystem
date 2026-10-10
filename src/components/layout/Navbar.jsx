import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from '@/lib/router'
import { UserMenu } from '@/components/auth/UserMenu'
import { BrandMark } from '@/components/common/BrandMark'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/Button'
import { accountNav, publicNav } from '@/constants/navigation'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useDisclosure } from '@/hooks/useDisclosure'
import { cn } from '@/utils/cn'

function scrollToBooking() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('booking-search')?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

function navClass({ isActive }) {
  return cn(
    'rounded-md px-2 py-2 text-small font-medium transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    isActive ? 'text-primary' : 'text-muted hover:text-foreground',
  )
}

export function Navbar() {
  const { isOpen, toggle, close } = useDisclosure()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const accountLinks = isAuthenticated ? accountNav(user.role) : []

  async function onLogout() {
    close()
    await logout()
    navigate(routes.login)
  }

  function onBookNow(event) {
    close()
    if (location.pathname !== routes.home) return
    event.preventDefault()
    scrollToBooking()
  }

  useEffect(() => {
    close()
  }, [location.pathname, close])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (media.matches) close()
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [close])

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur transition-shadow duration-200',
        scrolled && 'bg-surface shadow-float',
      )}
    >
      <Container className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3">
        <BrandMark />
        <nav className="hidden items-center justify-center gap-1 md:flex lg:gap-2" aria-label="Primary">
          {publicNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button to={routes.login} variant="ghost" size="sm">
                  Login
                </Button>
                <Button to="/#booking-search" size="sm" onClick={onBookNow}>
                  Book Now
                </Button>
              </>
            )}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md text-foreground transition hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={toggle}
          >
            {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-[var(--ease-standard)] motion-reduce:transition-none md:hidden',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden" inert={isOpen ? undefined : true}>
          <nav className="border-t border-border bg-surface" aria-label="Mobile" aria-hidden={isOpen ? undefined : true}>
            <Container className="flex flex-col gap-1 py-3">
              {publicNav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClass} onClick={close}>
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-3 grid gap-2">
                {isAuthenticated ? (
                  <>
                    {accountLinks.map((item) => (
                      <Button key={item.label} to={item.to} variant="outline" onClick={close}>
                        {item.label}
                      </Button>
                    ))}
                    <Button type="button" onClick={onLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button to={routes.login} variant="outline" onClick={close}>
                      Login
                    </Button>
                    <Button to="/#booking-search" onClick={onBookNow}>
                      Book Now
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </nav>
        </div>
      </div>
    </header>
  )
}
