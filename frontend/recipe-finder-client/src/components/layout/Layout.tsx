import Footer from "./Footer"
import Navbar from "./Navbar"
import FloatingActions from "./FloatingActions.tsx"

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <div className="relative flex min-h-screen flex-col bg-linear-to-b from-slate-50 via-white to-emerald-50/40">
            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
            <FloatingActions />
        </div>
    )
}