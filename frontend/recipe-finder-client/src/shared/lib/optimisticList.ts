type Identifiable = { id: number }

export function removeOptimistically<T extends Identifiable>(items: T[], id: number) {
  const index = items.findIndex((item) => item.id === id)
  if (index < 0) return { next: items, removed: null, index: -1 }
  return {
    next: items.filter((item) => item.id !== id),
    removed: items[index],
    index,
  }
}

export function restoreAtIndex<T>(items: T[], removed: T, index: number) {
  const next = [...items]
  next.splice(Math.max(0, Math.min(index, next.length)), 0, removed)
  return next
}
