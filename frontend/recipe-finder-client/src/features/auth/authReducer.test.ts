import { describe, expect, it } from 'vitest'
import { authReducer, initialAuthState } from './authReducer'

describe('authReducer', () => {
  it('moves from checking to authenticated with server user data', () => {
    const user = { username: 'firudin', role: 'Admin' as const }

    const result = authReducer(initialAuthState, { type: 'AUTHENTICATED', user })

    expect(result).toEqual({ status: 'authenticated', user })
  })

  it('clears all sensitive identity state when session becomes anonymous', () => {
    const authenticated = {
      status: 'authenticated' as const,
      user: { username: 'firudin', role: 'Admin' as const },
    }

    const result = authReducer(authenticated, { type: 'ANONYMOUS' })

    expect(result).toEqual({ status: 'anonymous', user: null })
  })
})
