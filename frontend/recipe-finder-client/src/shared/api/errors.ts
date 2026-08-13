import axios from 'axios'

export type ApiProblem = {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

export function toApiProblem(error: unknown): ApiProblem {
  if (!axios.isAxiosError(error)) {
    return { message: 'Gözlənilməz xəta baş verdi.' }
  }

  if (!error.response) {
    return { message: 'Serverlə əlaqə yaratmaq mümkün olmadı. İnternet bağlantısını yoxlayın.' }
  }

  const data = error.response.data as { message?: string; title?: string; errors?: Record<string, string[]> } | undefined
  return {
    status: error.response.status,
    message: data?.message ?? data?.title ?? 'Sorğu yerinə yetirilə bilmədi.',
    errors: data?.errors,
  }
}
