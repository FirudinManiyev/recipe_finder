import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../shared/api/client'
import { toApiProblem } from '../../shared/api/errors'
import { RecipeForm, type RecipeFormValues, type RecipePayload } from '../../features/recipes/RecipeForm'
import type { Recipe } from '../../types/recipe'

export default function EditRecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState<RecipeFormValues | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    api.get<Recipe>(`/recipes/${id}`, { signal: controller.signal }).then(({ data }) => setValues({ title: data.title, description: data.description, instructions: data.instructions ?? '', cookingTime: data.cookingTime, difficulty: data.difficulty, imageUrl: data.imageUrl, ingredients: data.ingredients.join(', ') })).catch((requestError: unknown) => { if (!controller.signal.aborted) setError(toApiProblem(requestError).message) })
    return () => controller.abort()
  }, [id])

  const updateRecipe = async (payload: RecipePayload) => { await api.put(`/recipes/${id}`, payload); toast.success('Resept yeniləndi'); navigate('/admin/recipes', { replace: true }) }

  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-emerald-100/60 sm:p-8"><h1 className="mb-7 text-3xl font-black text-slate-900">Resepti redaktə et</h1>{error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}{!error && !values && <div role="status" aria-label="Resept yüklənir" className="h-96 animate-pulse rounded-2xl bg-slate-200" />}{values && <RecipeForm initialValues={values} submitLabel="Dəyişiklikləri saxla" onSubmit={updateRecipe} />}</div></section>
}
