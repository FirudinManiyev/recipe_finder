import { describe, expect, it } from 'vitest'
import { normalizeIngredients, validateIngredients } from './validation'

describe('recipe form validation', () => {
  it('trims and removes duplicate ingredients case-insensitively', () => {
    expect(normalizeIngredients(' Pomidor, pomidor, Soğan ')).toEqual(['Pomidor', 'Soğan'])
  })

  it('rejects an ingredient list with only separators and whitespace', () => {
    expect(validateIngredients(' , , ')).toBe('Ən azı bir ərzaq daxil edin')
  })
})
