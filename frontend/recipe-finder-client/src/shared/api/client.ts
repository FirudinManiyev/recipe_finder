import axios, { type InternalAxiosRequestConfig } from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'
let unauthorizedHandler: (() => void) | null = null
let unauthorizedHandled = false
let csrfToken: string | null = null
let csrfPromise: Promise<string> | null = null

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

export function notifyUnauthorized() {
  if (unauthorizedHandled) return
  unauthorizedHandled = true
  unauthorizedHandler?.()
}

export function resetUnauthorizedLatch() {
  unauthorizedHandled = false
}

export function resetCsrfToken() {
  csrfToken = null
  csrfPromise = null
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken
  if (!csrfPromise) {
    csrfPromise = api
      .get<{ token: string }>('/auth/csrf')
      .then((response) => {
        csrfToken = response.data.token
        return csrfToken
      })
      .finally(() => {
        csrfPromise = null
      })
  }
  return csrfPromise
}

function isMutation(config: InternalAxiosRequestConfig) {
  return ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() ?? '')
}

api.interceptors.request.use(async (config) => {
  const publicMutation = ['/auth/login', '/auth/register', '/feedback'].includes(config.url ?? '')
  if (isMutation(config) && !publicMutation) {
    config.headers.set('X-CSRF-TOKEN', await getCsrfToken())
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const expectedAnonymous = ['/auth/login', '/auth/me'].includes(url)
      if (!expectedAnonymous) notifyUnauthorized()
    }
    return Promise.reject(error)
  },
)

export default api
