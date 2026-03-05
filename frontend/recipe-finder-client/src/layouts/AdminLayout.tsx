import { Link, Outlet } from "react-router-dom"

export default function AdminLayout() {

    return (
        <div className="flex min-h-screen">

            <aside className="w-60 bg-gray-900 text-white p-6 space-y-4">

                <h2 className="text-xl font-bold">
                    Admin Panel
                </h2>

                <nav className="space-y-2">

                    <Link to="/admin/recipes" className="block">
                        Reseptlər
                    </Link>

                    <Link to="/admin/blogs" className="block">
                        Bloglar
                    </Link>

                    <Link to="/admin/feedbacks" className="block">
                        Feedback
                    </Link>

                </nav>

            </aside>

            <main className="flex-1 p-8 bg-gray-100">

                <Outlet />

            </main>

        </div>
    )
}