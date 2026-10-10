import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '@/services/authService'
import { getStoredUser } from '@/utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    authService.getCurrentUser().then((stored) => {
      if (!active) return
      setUser(stored)
      setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      async login(credentials) {
        const next = await authService.login(credentials)
        setUser(next)
        return next
      },
      async register(values) {
        const next = await authService.register(values)
        setUser(next)
        return next
      },
      async logout() {
        sessionStorage.setItem('city-rental-car.logout', '1')
        await authService.logout()
        setUser(null)
      },
      async forgotPassword(email) {
        return authService.forgotPassword(email)
      },
      async resetPassword(values) {
        return authService.resetPassword(values)
      },
      async refreshUser() {
        const next = getStoredUser()
        setUser(next)
        return next
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
