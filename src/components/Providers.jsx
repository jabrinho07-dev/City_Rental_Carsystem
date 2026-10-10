'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { queryClient } from '@/lib/queryClient'

function AuthGate({ children }) {
  const { isLoading } = useAuth()
  if (isLoading) return <AuthLoading />
  return children
}

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate>{children}</AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  )
}
