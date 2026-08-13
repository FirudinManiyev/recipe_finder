import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Home, RefreshCw, TriangleAlert } from 'lucide-react'

type Props = { children: ReactNode; resetKey?: string }
type State = { hasError: boolean }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Render error caught by AppErrorBoundary', error, info)
  }

  componentDidUpdate(previousProps: Props) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-50 via-emerald-50 to-orange-50 px-4 py-12">
        <section className="w-full max-w-lg rounded-4xl border border-white bg-white/90 p-8 text-center shadow-2xl shadow-emerald-100 backdrop-blur sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600">
            <TriangleAlert aria-hidden="true" size={32} />
          </span>
          <h1 className="mt-6 text-3xl font-black text-slate-900">Nəsə düzgün işləmədi</h1>
          <p className="mt-3 leading-7 text-slate-600">
            Səhifənin bir hissəsində gözlənilməz xəta yarandı. Məlumatlarınız qorunur; səhifəni yeniləyib davam edə bilərsiniz.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <RefreshCw size={18} /> Yenidən yüklə
            </button>
            <a
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <Home size={18} /> Ana səhifə
            </a>
          </div>
        </section>
      </main>
    )
  }
}
