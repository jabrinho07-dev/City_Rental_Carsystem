'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams as useNextSearchParams, useParams as useNextParams } from 'next/navigation'
import { createContext, useContext } from 'react'

const STATE_KEY = 'city-rental-car.nav-state'
const OutletContext = createContext(null)

export function OutletProvider({ outlet, children }) {
  return <OutletContext.Provider value={outlet}>{children}</OutletContext.Provider>
}

export function Outlet() {
  return useContext(OutletContext)
}

function readState(pathname) {
  if (typeof window === 'undefined') return null
  try {
    const saved = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null')
    if (saved?.path === pathname) return saved.state
  } catch {
    return null
  }
  return null
}

export function useNavigate() {
  const router = useRouter()
  return (to, options = {}) => {
    if (typeof to === 'number') {
      if (to < 0) router.back()
      return
    }
    const href = typeof to === 'string' ? to : `${to.pathname || ''}${to.search || ''}${to.hash || ''}`
    const path = href.split('?')[0].split('#')[0]
    if (options.state) {
      sessionStorage.setItem(STATE_KEY, JSON.stringify({ path, state: options.state }))
    }
    if (options.replace) router.replace(href)
    else router.push(href)
  }
}

export function useLocation() {
  const pathname = usePathname() || '/'
  const params = useNextSearchParams()
  const search = params?.toString() ? `?${params.toString()}` : ''
  const [hash, setHash] = useState('')
  const [state, setState] = useState(null)

  useEffect(() => {
    const readHash = () => setHash(window.location.hash || '')
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [pathname])

  useEffect(() => {
    setState(readState(pathname))
  }, [pathname])

  return { pathname, search, hash, state, key: pathname }
}

export function useParams() {
  return useNextParams() || {}
}

export function useSearchParams() {
  const params = useNextSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const setParams = (next, options = {}) => {
    const value = next instanceof URLSearchParams ? next : new URLSearchParams(next || '')
    const query = value.toString()
    const href = query ? `${pathname}?${query}` : pathname
    if (options.replace) router.replace(href)
    else router.push(href)
  }
  return [params, setParams]
}

export function Navigate({ to, replace = false }) {
  const router = useRouter()
  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [replace, router, to])
  return null
}

export function Link({ to, href, children, ...props }) {
  return (
    <NextLink href={href || to || '/'} {...props}>
      {children}
    </NextLink>
  )
}

export function NavLink({ to, end = false, className, children, onClick }) {
  const pathname = usePathname() || '/'
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  const classes = typeof className === 'function' ? className({ isActive }) : className
  return (
    <NextLink href={to} className={classes} onClick={onClick}>
      {children}
    </NextLink>
  )
}
