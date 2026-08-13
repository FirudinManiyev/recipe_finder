import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { resetCsrfToken, resetUnauthorizedLatch, setUnauthorizedHandler } from '../../shared/api/client'
import { authReducer, initialAuthState } from './authReducer'
import { AuthContext } from './authContext'
import type { AuthUser, LoginInput } from './authTypes'

function clearLegacyAuthStorage() {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    storage.removeItem('token')
    storage.removeItem('role')
    storage.removeItem('username')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  const navigate = useNavigate()

  const logout = useCallback(async (reason: 'manual' | 'expired' = 'manual') => {
    try {
      if (reason === 'manual') await api.post('/auth/logout')
    } finally {
      resetCsrfToken()
      clearLegacyAuthStorage()
      dispatch({ type: 'ANONYMOUS' })
      navigate('/login', { replace: true, state: reason === 'expired' ? { sessionExpired: true } : undefined })
    }
  }, [navigate])

  useEffect(() => {
    setUnauthorizedHandler(() => void logout('expired'))
    return () => setUnauthorizedHandler(null)
  }, [logout])

  useEffect(() => {
    const controller = new AbortController()
    api.get<AuthUser>('/auth/me', { signal: controller.signal })
      .then((response) => dispatch({ type: 'AUTHENTICATED', user: response.data }))
      .catch(() => {
        if (controller.signal.aborted) return
        clearLegacyAuthStorage()
        dispatch({ type: 'ANONYMOUS' })
      })
    return () => controller.abort()
  }, [])

  const login = useCallback(async (credentials: LoginInput) => {
    const response = await api.post<AuthUser>('/auth/login', credentials)
    resetCsrfToken()
    resetUnauthorizedLatch()
    clearLegacyAuthStorage()
    dispatch({ type: 'AUTHENTICATED', user: response.data })
    return response.data
  }, [])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
