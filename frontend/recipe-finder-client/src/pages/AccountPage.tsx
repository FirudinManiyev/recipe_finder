import { Link } from 'react-router-dom'
import { BookOpen, LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'

export default function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <main className="relative isolate min-h-[70vh] overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-orange-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

      <section className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-2xl shadow-emerald-100/70 backdrop-blur sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-linear-to-br from-emerald-500 to-orange-500 text-white shadow-lg shadow-emerald-200">
            <UserRound size={38} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Şəxsi bölmə</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">Hesabım</h1>
            <p className="mt-2 break-words text-lg font-semibold text-slate-700">{user?.username}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5">
            <ShieldCheck className="text-emerald-600" aria-hidden="true" />
            <h2 className="mt-4 font-bold text-slate-900">Qorunan sessiya</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Sessiya bitdikdə tətbiq sizi avtomatik və təhlükəsiz şəkildə giriş səhifəsinə yönləndirir.</p>
          </article>
          <article className="rounded-2xl border border-orange-100 bg-orange-50/80 p-5">
            <BookOpen className="text-orange-500" aria-hidden="true" />
            <h2 className="mt-4 font-bold text-slate-900">Reseptləri kəşf et</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Yeni yeməklər və addım-addım hazırlanma qaydaları ilə tanış olun.</p>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/recipes" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            Reseptlərə bax
          </Link>
          <button type="button" onClick={() => void logout()} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 font-bold text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
            <LogOut size={18} aria-hidden="true" /> Təhlükəsiz çıxış
          </button>
        </div>
      </section>
    </main>
  )
}
