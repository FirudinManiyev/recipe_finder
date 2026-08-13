import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
  ChefHat,
  Clock3,
  Flame,
  Layers3,
  Sparkles,
  Soup,
  Users,
} from "lucide-react";
import api from "../api/axios";
import { getRecipes } from "../services/recipeService";
import type { Blog } from "../types/blog";
import type { Recipe } from "../types/recipe";
import ContactPage from "./ContactPage";

const imagePath = (value: string) => {
  if (!value) return "/images/placeholder.jpg";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `/${value.replace(/^\/+/, "")}`;
};

const difficultyClass = (difficulty: string) => {
  const normalized = difficulty
    .trim()
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");

  if (["cox asan", "very easy", "veryeasy"].includes(normalized)) return "bg-lime-100 text-lime-700";
  if (["asan", "easy"].includes(normalized)) return "bg-emerald-100 text-emerald-700";
  if (["orta", "medium"].includes(normalized)) return "bg-amber-100 text-amber-700";
  if (["cetin", "hard"].includes(normalized)) return "bg-orange-100 text-orange-700";
  if (["cox cetin", "very hard", "veryhard"].includes(normalized)) return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-700";
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarix bilinmir";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const excerpt = (text: string, max = 120) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [blogsRes, recipesRes] = await Promise.all([
          api.get("/blogs"),
          getRecipes(1, 6),
        ]);

        const latestBlogs = Array.isArray(blogsRes.data) ? blogsRes.data.slice(0, 3) : [];

        setBlogs(latestBlogs);
        setRecipes(recipesRes.slice(0, 6));
      } catch {
        setError("Məlumatlar yüklənmədi. Zəhmət olmasa bir az sonra yenidən cəhd edin.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredRecipe = useMemo(() => recipes[0], [recipes]);
  const uniqueIngredientsCount = useMemo(() => {
    const all = recipes.flatMap((item) => item.ingredients || []);
    return new Set(all.map((item) => item.trim().toLowerCase())).size;
  }, [recipes]);

  const avgCookingTime = useMemo(() => {
    if (recipes.length === 0) return 0;
    const total = recipes.reduce((sum, item) => sum + (item.cookingTime || 0), 0);
    return Math.round(total / recipes.length);
  }, [recipes]);

  const kitchenSteps = [
    {
      title: "1. Axtar və Filtrlə",
      desc: "Ingredient, vaxt və çətinliyə görə sənə uyğun resepti saniyələr içində tap.",
      icon: Layers3,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "2. Addım-addım Hazırla",
      desc: "Sadə izahlarla resepti rahat bişir, ingredient siyahısını bir yerdə gör.",
      icon: ChefHat,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "3. İlham Al və Paylaş",
      desc: "Blog bölməsində yeni ideyalar oxu və mətbəx təcrübəni inkişaf etdir.",
      icon: BookOpen,
      color: "from-sky-500 to-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-115 rounded-3xl bg-gray-200" />
          <div className="h-11 w-64 rounded-xl bg-gray-200" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-amber-50 via-emerald-50 to-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative isolate min-h-screen w-full overflow-hidden"
      >
        <img
          src="/chef_firudin.png"
          alt="Chef Firudin"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              <Sparkles size={14} />
              Chef Firudin ilə mətbəx ilhamı
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
              Dadlı reseptləri
              <span className="text-emerald-300"> sürətli tap</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
              RecipeFinder ilə gündəlik menyunu rahat planlaşdır, ingredientə görə axtar,
              blog məsləhətlərini oxu və mətbəxdə yeni dadlar kəşf et.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-emerald-200"
              >
                Reseptlərə keç
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/15 px-5 py-3 font-semibold text-white backdrop-blur transition hover:border-emerald-300 hover:text-emerald-200"
              >
                Son blogları oxu
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-10 pt-10 md:px-6 md:pb-14 md:pt-12">

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04 }}
          className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-lg backdrop-blur md:p-7"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">Statistika</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Son yenilənən göstəricilər
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50 to-white p-5 shadow-sm">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Users size={20} />
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900">{recipes.length > 0 ? recipes.length : "6+"}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">Son resept vitrini</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-linear-to-br from-orange-50 to-white p-5 shadow-sm">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-200/40 blur-2xl" />
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <Clock3 size={20} />
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900">{avgCookingTime > 0 ? `${avgCookingTime}` : "-"}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">Orta dəqiqə</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-linear-to-br from-sky-50 to-white p-5 shadow-sm">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-200/40 blur-2xl" />
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Soup size={20} />
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900">{uniqueIngredientsCount > 0 ? uniqueIngredientsCount : "30+"}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">Unikal ingredient</p>
            </div>
          </div>
        </motion.section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-gray-900 md:text-3xl">Necə İşləyir?</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">3 sadə addım</span>
          </div>

          <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-stretch">
            <AnimatePresence mode="popLayout">
              {kitchenSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.title}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: 0.03 * index }}
                    className="group rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-3 hidden justify-end md:flex">
                      {index < kitchenSteps.length - 1 ? (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <ChevronRight size={16} />
                        </span>
                      ) : (
                        <span className="h-8 w-8" />
                      )}
                    </div>
                    <div className={`inline-flex rounded-xl bg-linear-to-r p-3 text-white ${step.color}`}>
                      <Icon size={18} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>

                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={14} />
                      Smart mətbəx təcrübəsi
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!error && featuredRecipe && (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white/85 shadow-lg backdrop-blur"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative h-72 overflow-hidden md:h-80 lg:h-full">
                <img
                  src={imagePath(featuredRecipe.imageUrl)}
                  alt={featuredRecipe.title}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  Son əlavə edilən resept
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl font-black text-gray-900 md:text-3xl">{featuredRecipe.title}</h2>
                <p className="mt-3 text-gray-600">{excerpt(featuredRecipe.description, 180)}</p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                    <Clock3 size={14} />
                    {featuredRecipe.cookingTime} dəq
                  </span>
                  <span className={`rounded-xl px-3 py-1.5 font-semibold ${difficultyClass(featuredRecipe.difficulty)}`}>
                    {featuredRecipe.difficulty}
                  </span>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/recipes/${featuredRecipe.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    Ətraflı bax
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {!error && recipes.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-gray-900 md:text-3xl">Son Reseptlər</h2>
              <Link to="/recipes" className="text-sm font-bold text-emerald-700 hover:underline">
                Hamısına bax
              </Link>
            </div>

            <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {recipes.map((recipe, index) => (
                  <motion.article
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: 0.03 * index }}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={imagePath(recipe.imageUrl)}
                        alt={recipe.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-85" />
                    </div>

                    <div className="space-y-3 p-5">
                      <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition group-hover:text-emerald-700">
                        {recipe.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                          <Clock3 size={13} />
                          {recipe.cookingTime} dəq
                        </span>
                        <span className={`rounded-lg px-2.5 py-1 font-semibold ${difficultyClass(recipe.difficulty)}`}>
                          <span className="inline-flex items-center gap-1">
                            <Flame size={13} /> {recipe.difficulty}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                          <Soup size={13} />
                          {recipe.ingredients.length} ingredient
                        </span>
                      </div>

                      <Link to={`/recipes/${recipe.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3">
                        Ətraflı
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        {!error && blogs.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-gray-900 md:text-3xl">Son Bloglar</h2>
              <Link to="/blog" className="text-sm font-bold text-emerald-700 hover:underline">
                Hamısına bax
              </Link>
            </div>

            <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: 0.03 * index }}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={imagePath(blog.imageUrl)}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-85" />
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                        <CalendarDays size={13} />
                        {formatDate(blog.createdAt)}
                      </div>

                      <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition group-hover:text-emerald-700">
                        {blog.title}
                      </h3>

                      <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {excerpt(blog.content, 110)}
                      </p>

                      <Link to={`/blog/${blog.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3">
                        Oxu
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}
      </div>

      <section>
        <ContactPage />
      </section>
    </div>
  );
}