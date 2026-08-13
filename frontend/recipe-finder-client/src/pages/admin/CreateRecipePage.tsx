import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../shared/api/client'
import { RecipeForm, type RecipePayload } from '../../features/recipes/RecipeForm'

export default function CreateRecipePage() {
  const navigate = useNavigate()
  const createRecipe = async (payload: RecipePayload) => {
    await api.post('/recipes', payload)
    toast.success('Resept yaradıldı')
    navigate('/admin/recipes', { replace: true })
  }
  return <Page title="Yeni resept"><RecipeForm submitLabel="Resepti yarat" onSubmit={createRecipe} /></Page>
}

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-emerald-100/60 backdrop-blur sm:p-8"><h1 className="mb-7 text-3xl font-black text-slate-900">{title}</h1>{children}</div></section>
}
