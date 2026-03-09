import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import BlogPage from "../pages/BlogPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import Layout from "../components/layout/Layout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRecipesPage from "../pages/admin/AdminRecipesPage";
import AdminBlogsPage from "../pages/admin/AdminBlogsPage";
import AdminFeedbackPage from "../pages/admin/AdminFeedbackPage";
import LoginPage from "../pages/LoginPage";
import CreateRecipePage from "../pages/admin/CreateRecipePage";
import EditRecipePage from "../pages/admin/EditRecipePage";
import CreateBlogPage from "../pages/admin/CreateBlogPage";
import EditBlogPage from "../pages/admin/EditBlogPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminRoute from "../components/AdminRoute";
import RegisterPage from "../pages/RegisterPage";


export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="recipes" element={<AdminRecipesPage />} />
          <Route path="blogs" element={<AdminBlogsPage />} />
          <Route path="feedbacks" element={<AdminFeedbackPage />} />
          <Route path="recipes/create" element={<CreateRecipePage />} />
          <Route path="recipes/edit/:id" element={<EditRecipePage />} />
          <Route path="blogs/create" element={<CreateBlogPage />} />
          <Route path="blogs/edit/:id" element={<EditBlogPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}