import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">

            <div className="text-center text-white animate-fadeIn">

                <div className="flex justify-center mb-6">
                    <div className="bg-red-500/20 p-6 rounded-full animate-bounce">
                        <Lock size={50} className="text-red-500" />
                    </div>
                </div>

                <h1 className="text-7xl font-extrabold mb-4 tracking-widest text-red-500">
                    403
                </h1>

                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                    Access Denied
                </h2>

                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    Bu səhifəyə giriş icazəniz yoxdur. Əgər bunun səhv olduğunu düşünürsünüzsə administrator ilə əlaqə saxlayın.
                </p>

                <Link
                    to="/"
                    className="inline-block bg-red-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-300"
                >
                    Ana səhifəyə qayıt
                </Link>

            </div>

        </div>
    );
}