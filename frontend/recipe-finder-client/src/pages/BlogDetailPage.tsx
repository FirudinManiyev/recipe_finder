import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays } from "lucide-react";
import api from "../api/axios";
import type { Blog } from "../types/blog";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarix bilinmir";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch {
        setError("Blog yüklənmədi. Zəhmət olmasa bir az sonra yenidən cəhd edin.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-10 w-28 rounded-xl bg-gray-200" />
          <div className="h-72 rounded-3xl bg-gray-200" />
          <div className="h-10 w-2/3 rounded-xl bg-gray-200" />
          <div className="h-5 w-1/3 rounded-xl bg-gray-200" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-[92%] rounded bg-gray-200" />
            <div className="h-4 w-[88%] rounded bg-gray-200" />
            <div className="h-4 w-[94%] rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 shadow-sm">
          Blog tapılmadı
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-amber-50 via-emerald-50 to-white px-4 py-10 md:px-6 md:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-5xl space-y-6"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/85 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <ArrowLeft size={16} />
          Bloglara qayıt
        </Link>

        <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white/85 shadow-xl backdrop-blur">
          <div className="relative h-72 overflow-hidden md:h-96">
            <img
              src={`/${blog.imageUrl}`}
              alt={blog.title}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur">
              Blog məqaləsi
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-10">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-500">
              <CalendarDays size={16} />
              {formatDate(blog.createdAt)}
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-gray-900 md:text-5xl">
              {blog.title}
            </h1>

            <div className="h-px w-full bg-linear-to-r from-emerald-200 via-orange-200 to-transparent" />

            <div className="prose prose-gray max-w-none leading-8 text-gray-700">
              {blog.content
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, index) => (
                  <p key={index} className="mb-4 text-base md:text-lg">
                    {line}
                  </p>
                ))}
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
}
