import { cloneElement, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LoaderCircle, Save } from 'lucide-react'
import { safeImageUrl, IMAGE_PLACEHOLDER } from '../../shared/lib/safeImageUrl'
import { toApiProblem } from '../../shared/api/errors'
import { normalizeIngredients, validateIngredients } from './validation'

export type RecipeFormValues = {
  title: string
  description: string
  instructions: string
  cookingTime: number
  difficulty: string
  imageUrl: string
  ingredients: string
}

export type RecipePayload = Omit<RecipeFormValues, 'ingredients'> & { ingredients: string[] }

const emptyValues: RecipeFormValues = { title: '', description: '', instructions: '', cookingTime: 30, difficulty: 'Asan', imageUrl: '', ingredients: '' }

export function RecipeForm({ initialValues, submitLabel, onSubmit }: { initialValues?: RecipeFormValues; submitLabel: string; onSubmit: (payload: RecipePayload) => Promise<void> }) {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<RecipeFormValues>({ defaultValues: initialValues ?? emptyValues, mode: 'onBlur' })

  useEffect(() => { if (initialValues) reset(initialValues) }, [initialValues, reset])

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit({ ...values, title: values.title.trim(), description: values.description.trim(), instructions: values.instructions.trim(), imageUrl: values.imageUrl.trim(), ingredients: normalizeIngredients(values.ingredients) })
    } catch (error: unknown) {
      setError('root', { message: toApiProblem(error).message })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <Field label="Başlıq" error={errors.title?.message}><input {...register('title', { required: 'Başlıq tələb olunur', minLength: { value: 3, message: 'Ən azı 3 simvol daxil edin' }, maxLength: { value: 150, message: 'Ən çox 150 simvol daxil edin' } })} /></Field>
      <Field label="Təsvir" error={errors.description?.message}><textarea rows={4} {...register('description', { required: 'Təsvir tələb olunur', minLength: { value: 10, message: 'Ən azı 10 simvol daxil edin' }, maxLength: { value: 1000, message: 'Ən çox 1000 simvol daxil edin' } })} /></Field>
      <Field label="Hazırlanma qaydası" error={errors.instructions?.message}><textarea rows={7} {...register('instructions', { required: 'Hazırlanma qaydası tələb olunur', minLength: { value: 10, message: 'Ən azı 10 simvol daxil edin' }, maxLength: { value: 10000, message: 'Mətn çox uzundur' } })} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Bişmə vaxtı (dəqiqə)" error={errors.cookingTime?.message}><input type="number" min="1" max="1000" {...register('cookingTime', { valueAsNumber: true, required: 'Vaxt tələb olunur', min: { value: 1, message: 'Minimum 1 dəqiqə' }, max: { value: 1000, message: 'Maksimum 1000 dəqiqə' } })} /></Field>
        <Field label="Çətinlik" error={errors.difficulty?.message}><select {...register('difficulty', { required: true })}><option>Çox asan</option><option>Asan</option><option>Orta</option><option>Çətin</option><option>Çox çətin</option></select></Field>
      </div>
      <Field label="Şəkil ünvanı" error={errors.imageUrl?.message}><input placeholder="/images/resept.jpg və ya https://..." {...register('imageUrl', { required: 'Şəkil ünvanı tələb olunur', maxLength: { value: 500, message: 'Ünvan çox uzundur' }, validate: (value) => safeImageUrl(value) !== IMAGE_PLACEHOLDER || value === IMAGE_PLACEHOLDER || 'Təhlükəsiz lokal və ya HTTPS ünvan daxil edin' })} /></Field>
      <Field label="Ərzaqlar" hint="Vergüllə ayırın" error={errors.ingredients?.message}><input placeholder="Pomidor, soğan, zeytun yağı" {...register('ingredients', { validate: validateIngredients })} /></Field>
      {errors.root?.message && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errors.root.message}</div>}
      <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 font-bold text-white shadow-lg shadow-emerald-200 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle className="animate-spin" size={19} /> : <Save size={19} />}{isSubmitting ? 'Yadda saxlanılır...' : submitLabel}</button>
    </form>
  )
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactElement<{ className?: string; 'aria-invalid'?: boolean }>; }) {
  const control = cloneElement(children, { 'aria-invalid': Boolean(error), className: `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 ${error ? 'border-red-400' : 'border-slate-300'} ${children.props.className ?? ''}` })
  return <label className="block text-sm font-bold text-slate-700">{label}{hint && <span className="ml-2 font-normal text-slate-400">({hint})</span>}{control}{error && <span className="mt-1.5 block text-sm font-medium text-red-600">{error}</span>}</label>
}
