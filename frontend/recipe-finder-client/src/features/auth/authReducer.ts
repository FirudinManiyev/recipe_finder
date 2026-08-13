import type { AuthAction, AuthState } from './authTypes'

export const initialAuthState: AuthState = { status: 'checking', user: null }

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'CHECKING':
      return { status: 'checking', user: null }
    case 'AUTHENTICATED':
      return { status: 'authenticated', user: action.user }
    case 'ANONYMOUS':
      return { status: 'anonymous', user: null }
    default:
      return state
  }
}
