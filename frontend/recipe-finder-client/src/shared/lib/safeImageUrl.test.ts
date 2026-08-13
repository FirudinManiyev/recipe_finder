import { describe, expect, it } from 'vitest'
import { IMAGE_PLACEHOLDER, safeImageUrl } from './safeImageUrl'

describe('safeImageUrl', () => {
  it.each(['javascript:alert(1)', 'data:text/html;base64,abc', '//attacker.example/a.jpg', '../secret'])('rejects unsafe source %s', (source) => {
    expect(safeImageUrl(source)).toBe(IMAGE_PLACEHOLDER)
  })

  it.each([
    ['/images/meal.jpg', '/images/meal.jpg'],
    ['images/meal.jpg', '/images/meal.jpg'],
    ['https://cdn.example.com/meal.jpg', 'https://cdn.example.com/meal.jpg'],
  ])('accepts safe source %s', (source, expected) => {
    expect(safeImageUrl(source)).toBe(expected)
  })
})
