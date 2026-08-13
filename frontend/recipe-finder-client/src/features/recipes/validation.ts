export function normalizeIngredients(value: string) {
  const seen = new Set<string>()
  return value.split(',').map((item) => item.trim()).filter((item) => {
    if (!item) return false
    const key = item.toLocaleLowerCase('az')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function validateIngredients(value: string) {
  const ingredients = normalizeIngredients(value)
  if (ingredients.length === 0) return 'Ən azı bir ərzaq daxil edin'
  if (ingredients.length > 50) return 'Ən çox 50 ərzaq daxil edilə bilər'
  if (ingredients.some((item) => item.length > 100)) return 'Ərzaq adı 100 simvoldan uzun ola bilməz'
  return true
}
