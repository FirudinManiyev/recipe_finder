import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

      <div className="text-center text-white animate-fadeIn">

        <div className="flex justify-center mb-6">
          <div className="bg-blue-500/20 p-6 rounded-full animate-pulse">
            <SearchX size={48} className="text-blue-400" />
          </div>
        </div>

        <h1 className="text-8xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Səhifə Tapılmadı
        </h2>

        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Axtardığınız səhifə mövcud deyil, silinmiş ola bilər və ya link səhvdir.
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300"
        >
          Ana Səhifəyə Qayıt
        </Link>

      </div>

    </div>
  );
}

export default NotFoundPage;