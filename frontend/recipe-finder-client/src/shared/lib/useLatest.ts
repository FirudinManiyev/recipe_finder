import { useEffect, useRef } from 'react'

export function useLatest<T>(value: T) {
  const reference = useRef(value)
  useEffect(() => {
    reference.current = value
  }, [value])
  return reference
}
