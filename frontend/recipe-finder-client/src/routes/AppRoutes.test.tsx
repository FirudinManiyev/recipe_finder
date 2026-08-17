import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../features/auth/authContext'
import type { AuthContextValue } from '../features/auth/authTypes'
import AppRoutes from './AppRoutes'

vi.mock('../components/layout/Layout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('../pages/LoginPage', () => ({
  default: () => <div>Login page</div>,
}))

vi.mock('../pages/NotFoundPage', () => ({
  default: () => <div>Not found page</div>,
}))

function renderRoutes(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/account']}>
        <AppRoutes />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('application route protection', () => {
  it('redirects an anonymous visitor from the real account route to login', async () => {
    renderRoutes({
      status: 'anonymous',
      user: null,
      login: async () => ({ username: 'firudin', role: 'User' }),
      logout: async () => undefined,
    })

    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Not found page')).not.toBeInTheDocument()
  })

  it('renders the account page for an authenticated regular user', async () => {
    renderRoutes({
      status: 'authenticated',
      user: { username: 'firudin', role: 'User' },
      login: async () => ({ username: 'firudin', role: 'User' }),
      logout: async () => undefined,
    })

    expect(await screen.findByRole('heading', { name: 'Hesabım' })).toBeInTheDocument()
    expect(screen.getByText('firudin')).toBeInTheDocument()
  })
})
