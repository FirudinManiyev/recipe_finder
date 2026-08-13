import { useEffect, useState } from 'react'
import { BookOpenText, ChefHat, MessageSquareText } from 'lucide-react'
import api from '../../shared/api/client'
import { toApiProblem } from '../../shared/api/errors'

type Stats = { recipes: number; blogs: number; feedbacks: number }

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([api.get<number>('/recipes/count', { signal: controller.signal }), api.get<unknown[]>('/blogs', { signal: controller.signal }), api.get<unknown[]>('/feedback', { signal: controller.signal })])
      .then(([recipes, blogs, feedbacks]) => setStats({ recipes: recipes.data, blogs: blogs.data.length, feedbacks: feedbacks.data.length }))
      .catch((requestError: unknown) => { if (!controller.signal.aborted) setError(toApiProblem(requestError).message) })
    return () => controller.abort()
  }, [])

  const cards = stats ? [{ label: 'Reseptlər', value: stats.recipes, icon: ChefHat, color: 'from-emerald-500 to-teal-500' }, { label: 'Bloglar', value: stats.blogs, icon: BookOpenText, color: 'from-orange-500 to-amber-500' }, { label: 'Feedback', value: stats.feedbacks, icon: MessageSquareText, color: 'from-violet-500 to-fuchsia-500' }] : []
  return <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8"><div className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Ümumi baxış</p><h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">Admin Dashboard</h1></div>{error && <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</div>}{!stats && !error && <div role="status" aria-label="Statistika yüklənir" className="grid gap-5 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-3xl bg-slate-200" />)}</div>}<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cards.map(({ label, value, icon: Icon, color }) => <article key={label} className="overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-lg shadow-slate-200"><span className={`grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br text-white ${color}`}><Icon size={23} /></span><p className="mt-6 text-sm font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-4xl font-black text-slate-900">{value}</p></article>)}</div></section>
}
