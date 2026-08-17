import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { resetCsrfToken, resetUnauthorizedLatch, setUnauthorizedHandler } from '../../shared/api/client'
import { authReducer, initialAuthState } from './authReducer'
import { AuthContext } from './authContext'
import type { AuthSession, LoginInput } from './authTypes'

const MAX_TIMEOUT_MS = 2_147_483_647

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
  const expirationTimerRef = useRef<number | null>(null)
  const endingSessionRef = useRef(false)

  const clearExpirationTimer = useCallback(() => {
    if (expirationTimerRef.current === null) return
    window.clearTimeout(expirationTimerRef.current)
    expirationTimerRef.current = null
  }, [])

  const logout = useCallback(async (reason: 'manual' | 'expired' = 'manual') => {
    if (endingSessionRef.current) return
    endingSessionRef.current = true
    clearExpirationTimer()
    try {
      if (reason === 'manual') await api.post('/auth/logout')
    } finally {
      resetCsrfToken()
      clearLegacyAuthStorage()
      dispatch({ type: 'ANONYMOUS' })
      navigate('/login', { replace: true, state: reason === 'expired' ? { sessionExpired: true } : undefined })
    }
  }, [clearExpirationTimer, navigate])

  const scheduleSessionExpiration = useCallback((expiresAtUtc: string) => {
    clearExpirationTimer()

    const armTimer = () => {
      const remainingMs = Date.parse(expiresAtUtc) - Date.now()
      if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
        expirationTimerRef.current = null
        void logout('expired')
        return
      }
      expirationTimerRef.current = window.setTimeout(armTimer, Math.min(remainingMs, MAX_TIMEOUT_MS))
    }

    armTimer()
  }, [clearExpirationTimer, logout])

  useEffect(() => {
    setUnauthorizedHandler(() => void logout('expired'))
    return () => setUnauthorizedHandler(null)
  }, [logout])

  useEffect(() => {
    const controller = new AbortController()
    api.get<AuthSession>('/auth/me', { signal: controller.signal })
      .then((response) => {
        endingSessionRef.current = false
        dispatch({ type: 'AUTHENTICATED', user: response.data })
        scheduleSessionExpiration(response.data.expiresAtUtc)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        clearExpirationTimer()
        endingSessionRef.current = false
        clearLegacyAuthStorage()
        dispatch({ type: 'ANONYMOUS' })
      })
    return () => {
      controller.abort()
      clearExpirationTimer()
    }
  }, [clearExpirationTimer, scheduleSessionExpiration])

  const login = useCallback(async (credentials: LoginInput) => {
    const response = await api.post<AuthSession>('/auth/login', credentials)
    resetCsrfToken()
    resetUnauthorizedLatch()
    clearLegacyAuthStorage()
    endingSessionRef.current = false
    dispatch({ type: 'AUTHENTICATED', user: response.data })
    scheduleSessionExpiration(response.data.expiresAtUtc)
    return response.data
  }, [scheduleSessionExpiration])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
