import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BookOpenText, ChefHat, LayoutDashboard, LogOut, Menu, MessageSquareText, X } from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/recipes', label: 'Reseptlər', icon: ChefHat },
  { to: '/admin/blogs', label: 'Bloglar', icon: BookOpenText },
  { to: '/admin/feedbacks', label: 'Feedback', icon: MessageSquareText },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!sidebarOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSidebarOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="relative min-h-[75vh] bg-slate-100">
      <button type="button" aria-label="Admin menyusunu aç" aria-expanded={sidebarOpen} aria-controls="admin-sidebar" onClick={() => setSidebarOpen(true)} className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-xl md:hidden"><Menu size={23} /></button>
      {sidebarOpen && <button type="button" aria-label="Admin menyusunu bağla" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden" />}
      <aside id="admin-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-300 md:top-auto md:z-20 md:min-h-[75vh] md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-400">Recipe Finder</p><h2 className="mt-1 text-2xl font-black">Admin panel</h2></div><button type="button" aria-label="Menyunu bağla" onClick={() => setSidebarOpen(false)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10 md:hidden"><X /></button></div>
        <nav aria-label="Admin naviqasiyası" className="mt-6 space-y-2">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 font-semibold transition ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={19} />{label}</NavLink>)}</nav>
        <div className="mt-auto border-t border-white/10 pt-5"><p className="truncate px-2 text-sm font-semibold text-slate-300">{user?.username}</p><button type="button" onClick={() => void logout()} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-500/15 font-bold text-red-300 transition hover:bg-red-500 hover:text-white"><LogOut size={18} /> Təhlükəsiz çıxış</button></div>
      </aside>
      <main className="min-w-0 md:pl-72"><Outlet /></main>
    </div>
  )
}
