export type AuthRole = 'Admin' | 'User'

export type AuthUser = {
  username: string
  role: AuthRole
}

export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

export type AuthState = {
  status: AuthStatus
  user: AuthUser | null
}

export type LoginInput = {
  username: string
  password: string
}

export type AuthAction =
  | { type: 'CHECKING' }
  | { type: 'AUTHENTICATED'; user: AuthUser }
  | { type: 'ANONYMOUS' }

export type AuthContextValue = AuthState & {
  login: (credentials: LoginInput) => Promise<AuthUser>
  logout: (reason?: 'manual' | 'expired') => Promise<void>
}
