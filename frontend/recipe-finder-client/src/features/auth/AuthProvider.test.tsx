import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'

const authApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

const interceptorHooks = vi.hoisted(() => ({
  unauthorizedHandler: null as (() => void) | null,
  reset: vi.fn(),
  resetCsrf: vi.fn(),
}))

vi.mock('../../shared/api/client', () => ({
  default: authApi,
  resetUnauthorizedLatch: interceptorHooks.reset,
  resetCsrfToken: interceptorHooks.resetCsrf,
  setUnauthorizedHandler: (handler: (() => void) | null) => {
    interceptorHooks.unauthorizedHandler = handler
  },
}))

function SessionView() {
  const { status, user, login, logout } = useAuth()
  return (
    <div>
      <span>{status}</span>
      <span>{user?.username}</span>
      <button type="button" onClick={() => void login({ username: 'firudin', password: 'StrongPass123!' })}>Daxil ol</button>
      <button type="button" onClick={() => void logout()}>Çıxış</button>
    </div>
  )
}

function renderSession() {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <AuthProvider>
        <Routes>
          <Route path="/private" element={<SessionView />} />
          <Route path="/login" element={<div>Login səhifəsi</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('AuthProvider session lifecycle', () => {
  beforeEach(() => {
    authApi.get.mockReset()
    authApi.post.mockReset()
    interceptorHooks.reset.mockReset()
    interceptorHooks.resetCsrf.mockReset()
    interceptorHooks.unauthorizedHandler = null
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('restores an authenticated session from the HttpOnly cookie on refresh', async () => {
    authApi.get.mockResolvedValue({ data: { username: 'firudin', role: 'Admin' } })

    renderSession()

    expect(await screen.findByText('firudin')).toBeInTheDocument()
    expect(screen.getByText('authenticated')).toBeInTheDocument()
    expect(authApi.get).toHaveBeenCalledWith('/auth/me', expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it('clears legacy sensitive state and replaces the protected route on logout', async () => {
    authApi.get.mockResolvedValue({ data: { username: 'firudin', role: 'Admin' } })
    authApi.post.mockResolvedValue({})
    window.localStorage.setItem('token', 'legacy-token')
    window.sessionStorage.setItem('username', 'firudin')

    renderSession()
    await screen.findByText('firudin')
    fireEvent.click(screen.getByRole('button', { name: 'Çıxış' }))

    expect(await screen.findByText('Login səhifəsi')).toBeInTheDocument()
    expect(window.localStorage.getItem('token')).toBeNull()
    expect(window.sessionStorage.getItem('username')).toBeNull()
    expect(authApi.post).toHaveBeenCalledWith('/auth/logout')
    expect(interceptorHooks.resetCsrf).toHaveBeenCalledTimes(1)
  })

  it('rotates the cached CSRF token after a different user logs in', async () => {
    authApi.get.mockRejectedValue(new Error('anonymous'))
    authApi.post.mockResolvedValue({ data: { username: 'firudin', role: 'Admin' } })

    renderSession()
    await screen.findByText('anonymous')
    fireEvent.click(screen.getByRole('button', { name: 'Daxil ol' }))

    expect(await screen.findByText('firudin')).toBeInTheDocument()
    expect(interceptorHooks.resetCsrf).toHaveBeenCalledTimes(1)
  })

  it('handles an expired session once without calling logout recursively', async () => {
    authApi.get.mockResolvedValue({ data: { username: 'firudin', role: 'Admin' } })

    renderSession()
    await screen.findByText('firudin')

    await act(async () => {
      interceptorHooks.unauthorizedHandler?.()
      interceptorHooks.unauthorizedHandler?.()
    })

    await waitFor(() => expect(screen.getByText('Login səhifəsi')).toBeInTheDocument())
    expect(authApi.post).not.toHaveBeenCalled()
  })
})
