import { useEffect, useState } from 'react'
import { Clock3, Pencil, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../shared/api/client'
import { removeOptimistically, restoreAtIndex } from '../../shared/lib/optimisticList'
import { toApiProblem } from '../../shared/api/errors'
import type { Recipe } from '../../types/recipe'

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    api.get<Recipe[]>('/recipes?pageNumber=1&pageSize=100', { signal: controller.signal })
      .then((response) => setRecipes(response.data))
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(toApiProblem(requestError).message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Resepti silmək istəyirsiniz?') || pendingIds.has(id)) return
    const snapshot = removeOptimistically(recipes, id)
    if (!snapshot.removed) return

    setRecipes(snapshot.next)
    setPendingIds((current) => new Set(current).add(id))
    try {
      await api.delete(`/recipes/${id}`)
      toast.success('Resept silindi')
    } catch (requestError: unknown) {
      setRecipes((current) => restoreAtIndex(current, snapshot.removed!, snapshot.index))
      toast.error(toApiProblem(requestError).message)
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">İdarəetmə</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Reseptlər</h1>
        </div>
        <button type="button" onClick={() => navigate('/admin/recipes/create')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700">
          <Plus size={18} /> Yeni resept
        </button>
      </div>

      {loading && <AdminListSkeleton />}
      {error && <AdminError message={error} />}
      {!loading && !error && recipes.length === 0 && <AdminEmpty text="Hələ resept əlavə edilməyib." />}
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">{recipe.title}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Clock3 size={15} /> {recipe.cookingTime} dəqiqə · {recipe.difficulty}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => navigate(`/admin/recipes/edit/${recipe.id}`)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 font-semibold text-sky-700 transition hover:bg-sky-100 sm:flex-none"><Pencil size={16} /> Redaktə</button>
              <button type="button" disabled={pendingIds.has(recipe.id)} onClick={() => void handleDelete(recipe.id)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-50 sm:flex-none"><Trash2 size={16} /> Sil</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function AdminListSkeleton() {
  return <div role="status" aria-label="Məlumatlar yüklənir" className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}</div>
}

function AdminError({ message }: { message: string }) {
  return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{message}</div>
}

function AdminEmpty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">{text}</div>
}
