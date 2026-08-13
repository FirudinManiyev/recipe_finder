import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppLoader } from '../../shared/ui/AppLoader'
import { useAuth } from './useAuth'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'checking') return <AppLoader />
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  }
  if (user?.role !== 'Admin') return <Navigate to="/forbidden" replace />
  return children
}
