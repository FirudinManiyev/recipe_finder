import { Link, Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function AdminLayout() {

    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <div className="flex min-h-screen">

            <aside className="w-60 bg-gray-900 text-white p-6 space-y-4">

                <h2 className="text-xl font-bold">
                    Admin Panel
                </h2>

                <nav className="space-y-2">
                    
                    <Link to="/admin/dashboard" className="block">Dashboard</Link>

                    <Link to="/admin/recipes" className="block">
                        Reseptlər
                    </Link>

                    <Link to="/admin/blogs" className="block">
                        Bloglar
                    </Link>

                    <Link to="/admin/feedbacks" className="block">
                        Feedback
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-3 py-2 rounded mt-6"
                    >
                        Logout
                    </button>

                </nav>

                

            </aside>

            

            <main className="flex-1 p-8 bg-gray-100">

                <Outlet />

            </main>

        </div>
    )
}