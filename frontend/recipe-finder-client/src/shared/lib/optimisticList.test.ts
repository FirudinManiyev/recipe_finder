import { describe, expect, it } from 'vitest'
import { removeOptimistically, restoreAtIndex } from './optimisticList'

const items = [{ id: 1 }, { id: 2 }, { id: 3 }]

describe('optimistic list helpers', () => {
  it('removes immediately while retaining rollback data', () => {
    expect(removeOptimistically(items, 2)).toEqual({
      next: [{ id: 1 }, { id: 3 }],
      removed: { id: 2 },
      index: 1,
    })
  })

  it('restores a failed deletion at the exact original index', () => {
    expect(restoreAtIndex([{ id: 1 }, { id: 3 }], { id: 2 }, 1)).toEqual(items)
  })
})
