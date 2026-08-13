import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from './authContext'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'
import type { AuthContextValue, AuthState } from './authTypes'

function renderGuard(state: AuthState, element: React.ReactNode) {
  const value: AuthContextValue = {
    ...state,
    login: async () => ({ username: 'firudin', role: 'User' }),
    logout: async () => undefined,
  }

  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={element} />
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/forbidden" element={<div>Forbidden page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('route guards', () => {
  it('shows bootstrap loader while session is being checked', () => {
    renderGuard({ status: 'checking', user: null }, <ProtectedRoute><div>Private</div></ProtectedRoute>)
    expect(screen.getByRole('status', { name: /recipe finder yüklənir/i })).toBeInTheDocument()
  })

  it('redirects an anonymous visitor to login without showing protected content', () => {
    renderGuard({ status: 'anonymous', user: null }, <ProtectedRoute><div>Private</div></ProtectedRoute>)
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Private')).not.toBeInTheDocument()
  })

  it('redirects an authenticated non-admin user to forbidden', () => {
    renderGuard(
      { status: 'authenticated', user: { username: 'user', role: 'User' } },
      <AdminRoute><div>Admin content</div></AdminRoute>,
    )
    expect(screen.getByText('Forbidden page')).toBeInTheDocument()
  })
})
