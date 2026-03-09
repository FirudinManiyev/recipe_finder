import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Mobile sidebar toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-gray-900 text-white rounded-lg shadow-lg"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 space-y-6 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-40`}>

                <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
                    Admin Panel
                </h2>

                <nav className="space-y-3">
                    <Link to="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
                        Dashboard
                    </Link>
                    <Link to="/admin/recipes" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
                        Reseptlər
                    </Link>
                    <Link to="/admin/blogs" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
                        Bloglar
                    </Link>
                    <Link to="/admin/feedbacks" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
                        Feedback
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-300"
                >
                    Logout
                </button>

            </aside>

            {/* Main content */}
            <main className="flex-1 p-8 md:ml-64 transition-all duration-300">
                <Outlet />
            </main>

        </div>
    );
}