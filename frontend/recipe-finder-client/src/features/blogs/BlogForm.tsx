import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LoaderCircle, Save } from 'lucide-react'
import { IMAGE_PLACEHOLDER, safeImageUrl } from '../../shared/lib/safeImageUrl'
import { toApiProblem } from '../../shared/api/errors'

export type BlogFormValues = { title: string; content: string; imageUrl: string }
const emptyValues: BlogFormValues = { title: '', content: '', imageUrl: '' }

export function BlogForm({ initialValues, submitLabel, onSubmit }: { initialValues?: BlogFormValues; submitLabel: string; onSubmit: (values: BlogFormValues) => Promise<void> }) {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({ defaultValues: initialValues ?? emptyValues, mode: 'onBlur' })
  useEffect(() => { if (initialValues) reset(initialValues) }, [initialValues, reset])

  const submit = handleSubmit(async (values) => {
    try { await onSubmit({ title: values.title.trim(), content: values.content.trim(), imageUrl: values.imageUrl.trim() }) }
    catch (error: unknown) { setError('root', { message: toApiProblem(error).message }) }
  })

  const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 aria-invalid:border-red-400'
  return <form onSubmit={submit} noValidate className="grid gap-5">
    <label className="text-sm font-bold text-slate-700">Başlıq<input className={inputClass} aria-invalid={Boolean(errors.title)} {...register('title', { required: 'Başlıq tələb olunur', minLength: { value: 3, message: 'Ən azı 3 simvol daxil edin' }, maxLength: { value: 160, message: 'Ən çox 160 simvol daxil edin' } })} />{errors.title && <ErrorText>{errors.title.message}</ErrorText>}</label>
    <label className="text-sm font-bold text-slate-700">Məzmun<textarea rows={12} className={inputClass} aria-invalid={Boolean(errors.content)} {...register('content', { required: 'Məzmun tələb olunur', minLength: { value: 20, message: 'Ən azı 20 simvol daxil edin' }, maxLength: { value: 20000, message: 'Mətn çox uzundur' } })} />{errors.content && <ErrorText>{errors.content.message}</ErrorText>}</label>
    <label className="text-sm font-bold text-slate-700">Şəkil ünvanı<input className={inputClass} aria-invalid={Boolean(errors.imageUrl)} placeholder="/images/blog.jpg və ya https://..." {...register('imageUrl', { required: 'Şəkil ünvanı tələb olunur', validate: (value) => safeImageUrl(value) !== IMAGE_PLACEHOLDER || value === IMAGE_PLACEHOLDER || 'Təhlükəsiz lokal və ya HTTPS ünvan daxil edin' })} />{errors.imageUrl && <ErrorText>{errors.imageUrl.message}</ErrorText>}</label>
    {errors.root?.message && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errors.root.message}</div>}
    <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 font-bold text-white shadow-lg shadow-emerald-200 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle className="animate-spin" size={19} /> : <Save size={19} />}{isSubmitting ? 'Yadda saxlanılır...' : submitLabel}</button>
  </form>
}

function ErrorText({ children }: { children?: React.ReactNode }) { return <span className="mt-1.5 block text-sm font-medium text-red-600">{children}</span> }
