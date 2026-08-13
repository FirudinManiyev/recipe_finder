import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLatest } from './useLatest'

describe('useLatest', () => {
  it('lets a previously registered callback observe the newest state', () => {
    const observed: number[] = []
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 0 },
    })
    const registeredCallback = () => observed.push(result.current.current)

    rerender({ value: 1 })
    act(() => registeredCallback())

    expect(observed).toEqual([1])
  })
})
