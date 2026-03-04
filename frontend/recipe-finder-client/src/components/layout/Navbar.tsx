import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-green-600">
                    RecipeFinder
                </Link>

                <div className="space-x-6 font-medium">
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
                </div>
            </div>
        </nav>
    );
}