import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";
import type { Blog } from "../types/blog";

const PAGE_SIZE = 6;

const sortOptions: Array<{ value: "newest" | "oldest" | "title"; label: string }> = [
  { value: "newest", label: "Ən yeni" },
  { value: "oldest", label: "Ən köhnə" },
  { value: "title", label: "Başlığa görə (A-Z)" },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarix bilinmir";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const excerpt = (text: string, max = 140) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/blogs");
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Bloglar yüklənmədi. Zəhmət olmasa bir az sonra yenidən cəhd edin.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = blogs.filter((blog) => {
      if (!query) return true;
      return (
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "az");
      }

      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      if (sortBy === "oldest") return aTime - bTime;
      return bTime - aTime;
    });

    return sorted;
  }, [blogs, search, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filteredAndSorted.slice(start, start + PAGE_SIZE);
  const featured = filteredAndSorted[0];

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-12 md:px-6">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-12 w-2/3 rounded-xl bg-gray-200 md:w-1/2" />
          <div className="h-40 rounded-3xl bg-gray-200" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-amber-50 via-emerald-50 to-white px-4 py-12 md:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-14 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
            <Sparkles size={16} />
            Dadlı hekayələr və mətbəx ilhamı
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                Blog Dünyası
              </h1>
              <p className="mt-3 max-w-2xl text-base text-gray-600 md:text-lg">
                Resept sirrləri, mətbəx məsləhətləri və ilham verən yazılar bir yerdə.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur">
              Cəmi blog: {filteredAndSorted.length}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative z-40 grid gap-4 overflow-visible rounded-3xl border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur md:grid-cols-[1fr_220px] md:p-5"
        >
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Başlığa və ya məzmuna görə axtar..."
              className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>

          <div ref={sortRef} className="relative z-50">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSortOpen((prev) => !prev)}
              className="group flex h-12 w-full items-center rounded-xl border border-gray-300 bg-white/95 px-3 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <ArrowDownWideNarrow className="text-gray-500 transition group-hover:text-emerald-600" size={16} />
              <span className="ml-2 flex-1 text-left text-sm font-semibold text-gray-800">
                {sortOptions.find((item) => item.value === sortBy)?.label}
              </span>
              <ChevronRight
                className={`text-gray-400 transition duration-200 group-hover:text-emerald-600 ${sortOpen ? "rotate-90" : "-rotate-90"}`}
                size={16}
              />
            </motion.button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-120 mt-2 w-full overflow-hidden rounded-xl border border-emerald-100 bg-white/95 shadow-xl backdrop-blur"
                >
                  {sortOptions.map((option) => {
                    const active = option.value === sortBy;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setPage(1);
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition ${active
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                          }`}
                      >
                        <span>{option.label}</span>
                        {active && <span className="text-xs">Aktiv</span>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!error && featured && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white/85 shadow-xl backdrop-blur"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative h-72 overflow-hidden md:h-80 lg:h-full">
                <img
                  src={`/${featured.imageUrl}`}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  Seçilmiş blog
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <div className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={16} />
                  {formatDate(featured.createdAt)}
                </div>

                <h2 className="text-2xl font-black leading-tight text-gray-900 md:text-3xl">
                  {featured.title}
                </h2>

                <p className="mt-4 text-gray-600">{excerpt(featured.content, 220)}</p>

                <div className="mt-6">
                  <Link
                    to={`/blog/${featured.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-emerald-200"
                  >
                    Tam oxu
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {!error && filteredAndSorted.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white/85 p-8 text-center shadow-lg">
            <p className="text-lg font-semibold text-gray-800">Axtarışa uyğun blog tapılmadı</p>
            <p className="mt-2 text-gray-600">Axtarış sözünü dəyiş və ya filtrləri yenilə.</p>
          </div>
        )}

        {!error && pageItems.length > 0 && (
          <section className="space-y-6">
            <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {pageItems.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: 0.035 * index }}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={`/${blog.imageUrl}`}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
                        <CalendarDays size={14} />
                        {formatDate(blog.createdAt)}
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition group-hover:text-emerald-700">
                        {blog.title}
                      </h3>

                      <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {excerpt(blog.content, 120)}
                      </p>

                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3"
                      >
                        Oxu
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {pageCount > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Geri
                </button>

                <span className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                  Səhifə {page} / {pageCount}
                </span>

                <button
                  onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                  disabled={page === pageCount}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  İrəli
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}