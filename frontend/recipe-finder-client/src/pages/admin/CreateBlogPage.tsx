import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../shared/api/client'
import { BlogForm, type BlogFormValues } from '../../features/blogs/BlogForm'

export default function CreateBlogPage() {
  const navigate = useNavigate()
  const createBlog = async (values: BlogFormValues) => { await api.post('/blogs', values); toast.success('Blog yaradıldı'); navigate('/admin/blogs', { replace: true }) }
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-emerald-100/60 sm:p-8"><h1 className="mb-7 text-3xl font-black text-slate-900">Yeni blog yazısı</h1><BlogForm submitLabel="Blogu yarat" onSubmit={createBlog} /></div></section>
}
