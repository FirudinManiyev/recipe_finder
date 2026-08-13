import { useEffect, useState } from 'react'
import { Mail, MessageSquareText, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../shared/api/client'
import { removeOptimistically, restoreAtIndex } from '../../shared/lib/optimisticList'
import { toApiProblem } from '../../shared/api/errors'

type Feedback = { fullName: string; email: string; message: string; id: number }

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const controller = new AbortController()
    api.get<Feedback[]>('/feedback', { signal: controller.signal })
      .then((response) => setFeedbacks(response.data))
      .catch((requestError: unknown) => { if (!controller.signal.aborted) setError(toApiProblem(requestError).message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Feedback mesajını silmək istəyirsiniz?') || pendingIds.has(id)) return
    const snapshot = removeOptimistically(feedbacks, id)
    if (!snapshot.removed) return
    setFeedbacks(snapshot.next)
    setPendingIds((current) => new Set(current).add(id))
    try {
      await api.delete(`/feedback/${id}`)
      toast.success('Feedback silindi')
    } catch (requestError: unknown) {
      setFeedbacks((current) => restoreAtIndex(current, snapshot.removed!, snapshot.index))
      toast.error(toApiProblem(requestError).message)
    } finally {
      setPendingIds((current) => { const next = new Set(current); next.delete(id); return next })
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8"><p className="text-sm font-bold uppercase tracking-widest text-violet-600">İstifadəçi rəyləri</p><h1 className="mt-1 text-3xl font-black text-slate-900">Feedback mesajları</h1></div>
      {loading && <div role="status" aria-label="Feedbacklər yüklənir" className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-slate-200" />)}</div>}
      {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>}
      {!loading && !error && feedbacks.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Yeni feedback yoxdur.</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {feedbacks.map((feedback) => (
          <article key={feedback.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-lg font-bold text-slate-900">{feedback.fullName}</h2><p className="mt-1 flex items-center gap-1.5 break-all text-sm text-slate-500"><Mail size={14} className="shrink-0" /> {feedback.email}</p></div><MessageSquareText className="shrink-0 text-violet-500" /></div>
            <p className="mt-4 flex-1 whitespace-pre-wrap break-words leading-7 text-slate-700">{feedback.message}</p>
            <button type="button" disabled={pendingIds.has(feedback.id)} onClick={() => void handleDelete(feedback.id)} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-xl bg-red-50 px-4 font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 size={16} /> Sil</button>
          </article>
        ))}
      </div>
    </section>
  )
}
