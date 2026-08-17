import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { NavLink, Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, ShieldCheck, LogOut, LayoutDashboard, UserRound } from "lucide-react"
import { useAuth } from "../../features/auth/useAuth"

export default function Navbar() {
    const location = useLocation()
    const { status, user, logout: endSession } = useAuth()
    const token = status === "authenticated"
    const role = user?.role
    const username = user?.username

    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const logout = () => {
        setDropdownOpen(false)
        setMenuOpen(false)
        void endSession()
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleOutside = (event: MouseEvent) => {
            if (!dropdownRef.current) return
            if (!dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleOutside)
        return () => document.removeEventListener("mousedown", handleOutside)
    }, [])

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setMenuOpen(false)
            setDropdownOpen(false)
        })
        return () => window.cancelAnimationFrame(frame)
    }, [location.pathname])

    useEffect(() => {
        if (!menuOpen) return
        const previousOverflow = document.body.style.overflow
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false)
        }
        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", closeOnEscape)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [menuOpen])

    const navItems = [
        { to: "/", label: "Anasəhifə" },
        { to: "/recipes", label: "Reseptlər" },
        { to: "/blog", label: "Blog" },
        { to: "/about", label: "Haqqımızda" },
        { to: "/contact", label: "Əlaqə" },
    ]


    return (
        <nav className="sticky top-0 z-70">
            <div className="w-full">
                <motion.div
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`border-b transition-all duration-300 ${scrolled
                        ? "border-white/80 bg-white/85 shadow-xl shadow-emerald-100/60 backdrop-blur-xl"
                        : "border-emerald-100/70 bg-white/75 shadow-md backdrop-blur"
                        }`}
                >
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-3 lg:px-8">
                        <Link to="/" className="group inline-flex items-center gap-3">
                            <img src="/cheffirudinlogo.png" alt="RecipeFinder" className="h-10 sm:h-11 transition-transform duration-300 group-hover:scale-105" />
                        </Link>

                        <div className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => (
                                <DesktopNavItem key={item.to} to={item.to} label={item.label} />
                            ))}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {!token && (
                                <>
                                    <NavLink to="/login" className="hidden rounded-xl border border-emerald-300/70 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow md:inline-flex">
                                        Login
                                    </NavLink>
                                    <NavLink to="/register" className="hidden rounded-xl bg-linear-to-r from-emerald-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl md:inline-flex">
                                        Register
                                    </NavLink>
                                </>
                            )}

                            {token && (
                                <div ref={dropdownRef} className="relative">
                                    <motion.button
                                        onClick={() => setDropdownOpen((prev) => !prev)}
                                        aria-expanded={dropdownOpen}
                                        aria-haspopup="menu"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-2.5 py-1.5 text-slate-700 shadow-sm transition hover:border-emerald-400"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-orange-500 text-sm font-bold text-white">
                                            {username?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                        <span className="hidden text-sm font-semibold sm:block">{username || "User"}</span>
                                        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute right-0 z-80 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                                            >
                                                <div className="mb-2 rounded-xl bg-linear-to-r from-emerald-50 to-orange-50 px-3 py-2 text-xs text-slate-600">
                                                    Hesab Menyusu
                                                </div>
                                                <Link to="/account" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                                    <UserRound size={16} />
                                                    Hesabım
                                                </Link>
                                                {role === "Admin" && (
                                                    <Link to="/admin/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                                        <LayoutDashboard size={16} />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={logout}
                                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                aria-expanded={menuOpen}
                                aria-controls="public-mobile-menu"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 md:hidden"
                                aria-label="Mobil menyu"
                            >
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                id="public-mobile-menu"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden border-t border-slate-200 md:hidden"
                            >
                                <div className="mx-auto w-full max-w-7xl space-y-2 px-4 py-3 sm:px-6">
                                    {navItems.map((item) => (
                                        <MobileItem key={item.to} to={item.to} label={item.label} />
                                    ))}

                                    {!token && (
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <NavLink to="/login" className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-700">
                                                Login
                                            </NavLink>
                                            <NavLink to="/register" className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-orange-500 px-3 py-2 text-sm font-semibold text-white">
                                                Register
                                            </NavLink>
                                        </div>
                                    )}

                                    {token && role === "Admin" && (
                                        <MobileItem to="/admin/dashboard" label="Admin Panel" />
                                    )}

                                    {token && (
                                        <MobileItem to="/account" label="Hesabım" />
                                    )}

                                    {token && (
                                        <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </nav>
    )
}



function DesktopNavItem({ to, label }: { to: string; label: string }) {

    return (

        <NavLink to={to} className="group relative rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-emerald-700">
            {({ isActive }) => (
                <>
                    <span>{label}</span>
                    <span className={`absolute bottom-1 left-3 h-0.5 rounded-full bg-linear-to-r from-emerald-500 to-orange-500 transition-all duration-300 ${isActive ? "w-[calc(100%-1.5rem)]" : "w-0 group-hover:w-[calc(100%-1.5rem)]"}`} />
                </>
            )}
        </NavLink>

    )
}



function MobileItem({ to, label }: { to: string; label: string }) {

    return (

        <NavLink to={to} className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-100"}`}>
            <ShieldCheck size={15} className="text-emerald-500" />
            {label}
        </NavLink>

    )
}
