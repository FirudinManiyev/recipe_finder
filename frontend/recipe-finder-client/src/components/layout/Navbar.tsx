import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const username = sessionStorage.getItem("username");

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("username");

        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">

                <Link to="/" className="text-2xl font-bold text-green-600">
                    RecipeFinder
                </Link>

                <div className="space-x-6 font-medium flex items-center">

                    <Link to="/recipes" className="hover:text-green-600">
                        Reseptlər
                    </Link>

                    <Link to="/blog" className="hover:text-green-600">
                        Blog
                    </Link>

                    <Link to="/about" className="hover:text-green-600">
                        Haqqımızda
                    </Link>

                    <Link to="/contact" className="hover:text-green-600">
                        Əlaqə
                    </Link>

                    {!token && (
                        <>
                            <Link to="/login" className="hover:text-green-600">
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {token && (
                        <span className="text-gray-600">
                            Salam, {username}
                        </span>
                    )}

                    {token && role === "Admin" && (
                        <Link
                            to="/admin/dashboard"
                            className="hover:text-green-600"
                        >
                            Admin Panel
                        </Link>
                    )}

                    {token && (
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    )}

                </div>
            </div>
        </nav>
    );
}