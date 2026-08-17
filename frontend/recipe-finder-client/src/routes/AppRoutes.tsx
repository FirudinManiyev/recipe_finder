import { lazy, Suspense } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AdminLayout from '../layouts/AdminLayout'
import AdminRoute from '../components/AdminRoute'
import ProtectedRoute from '../components/ProtectedRoute'
import { AppErrorBoundary } from '../app/errors/AppErrorBoundary'

const HomePage = lazy(() => import('../pages/HomePage'))
const RecipesPage = lazy(() => import('../pages/RecipesPage'))
const RecipeDetailPage = lazy(() => import('../pages/RecipeDetailPage'))
const BlogPage = lazy(() => import('../pages/BlogPage'))
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'))
const AccountPage = lazy(() => import('../pages/AccountPage'))
const AdminRecipesPage = lazy(() => import('../pages/admin/AdminRecipesPage'))
const AdminBlogsPage = lazy(() => import('../pages/admin/AdminBlogsPage'))
const AdminFeedbackPage = lazy(() => import('../pages/admin/AdminFeedbackPage'))
const CreateRecipePage = lazy(() => import('../pages/admin/CreateRecipePage'))
const EditRecipePage = lazy(() => import('../pages/admin/EditRecipePage'))
const CreateBlogPage = lazy(() => import('../pages/admin/CreateBlogPage'))
const EditBlogPage = lazy(() => import('../pages/admin/EditBlogPage'))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))

export default function AppRoutes() {
  const location = useLocation()

  return (
    <Layout>
      <AppErrorBoundary resetKey={`${location.pathname}${location.search}`}>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/forbidden" element={<UnauthorizedPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/error" element={<StatusPage />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="recipes" element={<AdminRecipesPage />} />
            <Route path="blogs" element={<AdminBlogsPage />} />
            <Route path="feedbacks" element={<AdminFeedbackPage />} />
            <Route path="recipes/create" element={<CreateRecipePage />} />
            <Route path="recipes/edit/:id" element={<EditRecipePage />} />
            <Route path="blogs/create" element={<CreateBlogPage />} />
            <Route path="blogs/edit/:id" element={<EditBlogPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </Layout>
  )
}

function RouteLoader() {
  return <div role="status" aria-label="Səhifə yüklənir" className="mx-auto min-h-[55vh] w-full max-w-7xl animate-pulse space-y-5 px-4 py-12"><div className="h-10 w-1/2 rounded-xl bg-slate-200" /><div className="h-64 rounded-3xl bg-slate-200" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-40 rounded-2xl bg-slate-200" />)}</div></div>
}

function StatusPage() {
  return <main className="grid min-h-[65vh] place-items-center px-4 py-12"><section className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl"><p className="text-6xl font-black text-emerald-600">500</p><h1 className="mt-4 text-3xl font-black text-slate-900">Xidmət müvəqqəti əlçatan deyil</h1><p className="mt-3 text-slate-600">Bir qədər sonra yenidən cəhd edin.</p><Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-emerald-600 px-5 font-bold text-white">Ana səhifəyə qayıt</Link></section></main>
}
