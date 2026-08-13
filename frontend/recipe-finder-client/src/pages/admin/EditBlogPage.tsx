import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../shared/api/client'
import { toApiProblem } from '../../shared/api/errors'
import { BlogForm, type BlogFormValues } from '../../features/blogs/BlogForm'
import type { Blog } from '../../types/blog'

export default function EditBlogPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState<BlogFormValues | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { const controller = new AbortController(); api.get<Blog>(`/blogs/${id}`, { signal: controller.signal }).then(({ data }) => setValues({ title: data.title, content: data.content, imageUrl: data.imageUrl })).catch((requestError: unknown) => { if (!controller.signal.aborted) setError(toApiProblem(requestError).message) }); return () => controller.abort() }, [id])
  const updateBlog = async (form: BlogFormValues) => { await api.put(`/blogs/${id}`, form); toast.success('Blog yeniləndi'); navigate('/admin/blogs', { replace: true }) }
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-emerald-100/60 sm:p-8"><h1 className="mb-7 text-3xl font-black text-slate-900">Blogu redaktə et</h1>{error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}{!error && !values && <div role="status" aria-label="Blog yüklənir" className="h-96 animate-pulse rounded-2xl bg-slate-200" />}{values && <BlogForm initialValues={values} submitLabel="Dəyişiklikləri saxla" onSubmit={updateBlog} />}</div></section>
}
