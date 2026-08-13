export const IMAGE_PLACEHOLDER = '/images/placeholder.svg'

export function safeImageUrl(value: string | null | undefined) {
  const source = value?.trim()
  if (!source || source.startsWith('//') || source.includes('\\') || source.includes('..')) {
    return IMAGE_PLACEHOLDER
  }

  if (source.startsWith('/')) return source
  if (!source.includes(':')) return `/${source.replace(/^\/+/, '')}`

  try {
    const url = new URL(source)
    return url.protocol === 'https:' ? url.toString() : IMAGE_PLACEHOLDER
  } catch {
    return IMAGE_PLACEHOLDER
  }
}
