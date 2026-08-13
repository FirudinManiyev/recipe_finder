import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Recipe } from "../types/recipe";
import { Link } from "react-router-dom";
import {
    Clock3,
    Search,
    Sparkles,
    SlidersHorizontal,
    X,
    ChevronLeft,
    ChevronRight,
    Soup,
    Filter,
    ArrowRight,
} from "lucide-react";
import {
    getRecipeCount,
    getRecipes,
    getRandomRecipe,
    searchRecipes,
} from "../services/recipeService";

const PAGE_SIZE = 6;

const sortOptions: Array<{ value: "mostmatched" | "newest" | "az"; label: string }> = [
    { value: "mostmatched", label: "Ən uyğun" },
    { value: "newest", label: "Ən yeni" },
    { value: "az", label: "A-Z" },
];

const difficultyOptions = ["Çox asan", "Asan", "Orta", "Çətin", "Çox çətin"];

const quickIngredients = [
    "Toyuq",
    "Pomidor",
    "Düyü",
    "Pendir",
    "Kartof",
    "Yumurta",
    "Soğan",
    "Sarımsaq",
    "Kərə yağı",
    "Zeytun yağı",
    "Göbələk",
    "Qaymaq",
    "Mal əti",
    "Balıq",
    "Bibər",
    "Kök",
];

const normalize = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/ə/g, "e")
        .replace(/ç/g, "c")
        .replace(/ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ü/g, "u");

const getDifficultyKey = (value: string) => {
    const normalized = normalize(value);

    if (["cox asan", "coxasan", "very easy", "veryeasy"].includes(normalized)) return "very-easy";
    if (["asan", "easy"].includes(normalized)) return "easy";
    if (["orta", "medium"].includes(normalized)) return "medium";
    if (["cetin", "cetin", "hard"].includes(normalized)) return "hard";
    if (["cox cetin", "coxcetin", "very hard", "veryhard"].includes(normalized)) return "very-hard";

    return normalized;
};

const imagePath = (value: string) => {
    if (!value) return "/images/placeholder.jpg";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `/${value.replace(/^\/+/, "")}`;
};

const difficultyClass = (difficulty: string) => {
    const level = getDifficultyKey(difficulty);
    if (level === "very-easy") return "bg-lime-100 text-lime-700";
    if (level === "easy") return "bg-emerald-100 text-emerald-700";
    if (level === "medium") return "bg-amber-100 text-amber-700";
    if (level === "hard") return "bg-orange-100 text-orange-700";
    if (level === "very-hard") return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-700";
};

export default function RecipesPage() {
    const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipeCount, setRecipeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);

    const [ingredientInput, setIngredientInput] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [maxCookingTime, setMaxCookingTime] = useState<string>("");
    const [difficulty, setDifficulty] = useState<string>("");
    const [sortBy, setSortBy] = useState<"mostmatched" | "newest" | "az">("mostmatched");

    const [searchActive, setSearchActive] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);

    const searchPageCount = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));
    const listPageCount = Math.max(1, Math.ceil(recipeCount / PAGE_SIZE));

    const displayedRecipes = useMemo(() => {
        if (!searchActive) return recipes;
        const start = (page - 1) * PAGE_SIZE;
        return searchResults.slice(start, start + PAGE_SIZE);
    }, [searchActive, recipes, searchResults, page]);

    const addIngredient = (raw: string) => {
        const value = raw.trim();
        if (!value) return;
        const exists = ingredients.some((item) => item.toLowerCase() === value.toLowerCase());
        if (exists) return;

        setIngredients((prev) => [...prev, value]);
        setIngredientInput("");
    };

    const removeIngredient = (target: string) => {
        setIngredients((prev) => prev.filter((item) => item !== target));
    };

    const resetFilters = () => {
        setIngredients([]);
        setIngredientInput("");
        setMaxCookingTime("");
        setDifficulty("");
        setSortBy("mostmatched");
        setSearchError(null);
        setSearchResults([]);
        setSearchActive(false);
        setPage(1);
    };

    const applyClientSideFilters = (list: Recipe[]) => {
        let filtered = [...list];

        if (maxCookingTime === "90plus") {
            filtered = filtered.filter((item) => item.cookingTime >= 90);
        } else if (maxCookingTime) {
            const max = Number(maxCookingTime);
            filtered = filtered.filter((item) => item.cookingTime <= max);
        }

        if (difficulty) {
            const selectedKey = getDifficultyKey(difficulty);
            filtered = filtered.filter((item) => getDifficultyKey(item.difficulty) === selectedKey);
        }

        if (sortBy === "newest") {
            filtered.sort((a, b) => b.id - a.id);
        } else if (sortBy === "az") {
            filtered.sort((a, b) => a.title.localeCompare(b.title, "az"));
        } else {
            filtered.sort((a, b) => b.id - a.id);
        }

        return filtered;
    };

    const applySearch = async () => {
        setSearchLoading(true);
        setSearchError(null);
        setPage(1);
        setSearchActive(true);

        try {
            if (ingredients.length > 0) {
                const data = await searchRecipes({
                    ingredients,
                    maxCookingTime:
                        maxCookingTime && maxCookingTime !== "90plus"
                            ? Number(maxCookingTime)
                            : undefined,
                    difficulty: difficulty || undefined,
                    sortBy,
                });

                let processed = [...data];

                if (maxCookingTime === "90plus") {
                    processed = processed.filter((item) => item.cookingTime >= 90);
                }

                if (difficulty) {
                    const selectedKey = getDifficultyKey(difficulty);
                    processed = processed.filter((item) => getDifficultyKey(item.difficulty) === selectedKey);
                }

                setSearchResults(processed);
            } else {
                const totalCount = recipeCount > 0 ? recipeCount : await getRecipeCount();
                const allRecipes = await getRecipes(1, Math.max(totalCount, 120));
                const processed = applyClientSideFilters(allRecipes);
                setSearchResults(processed);
            }
        } catch {
            setSearchError("Axtarış zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd et.");
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        const loadInitial = async () => {
            try {
                const [count, random] = await Promise.all([getRecipeCount(), getRandomRecipe()]);
                setRecipeCount(count);
                setFeaturedRecipe(random);
            } catch {
                setRecipeCount(0);
            }
        };

        loadInitial();
    }, []);

    useEffect(() => {
        const loadRecipes = async () => {
            if (searchActive) return;

            setLoading(true);
            setError(null);
            try {
                const data = await getRecipes(page, PAGE_SIZE);
                setRecipes(data);
            } catch {
                setError("Reseptlər yüklənmədi. Zəhmət olmasa bir az sonra yenidən cəhd et.");
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, [page, searchActive]);

    useEffect(() => {
        if (!searchActive) {
            if (page > listPageCount) setPage(listPageCount);
            return;
        }

        if (page > searchPageCount) setPage(searchPageCount);
    }, [page, listPageCount, searchPageCount, searchActive]);

    const activePageCount = searchActive ? searchPageCount : listPageCount;

    if (loading) {
        return (
            <div className="min-h-screen px-4 py-12 md:px-6">
                <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                    <div className="h-11 w-2/3 rounded-xl bg-gray-200 md:w-1/2" />
                    <div className="h-52 rounded-3xl bg-gray-200" />
                    <div className="h-28 rounded-3xl bg-gray-200" />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <div key={i} className="h-80 rounded-2xl bg-gray-200" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-amber-50 via-emerald-50 to-white px-4 py-12 md:px-6 md:py-16">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
                <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-5"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                        <Sparkles size={16} />
                        API əsaslı smart resept axtarışı
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                                Resept Kolleksiyası
                            </h1>
                            <p className="mt-3 max-w-2xl text-base text-gray-600 md:text-lg">
                                Ingredientə, vaxta və çətinliyə görə filtrlə, sənə ən uyğun resepti tap.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white/85 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur">
                            {searchActive ? `Nəticə: ${searchResults.length}` : `Cəmi resept: ${recipeCount}`}
                        </div>
                    </div>
                </motion.section>

                {!searchActive && featuredRecipe && (
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.06 }}
                        className="overflow-hidden rounded-3xl border border-gray-200 bg-white/85 shadow-xl backdrop-blur"
                    >
                        <div className="grid lg:grid-cols-2">
                            <div className="relative h-72 overflow-hidden md:h-80 lg:h-full">
                                <img
                                    src={imagePath(featuredRecipe.imageUrl)}
                                    alt={featuredRecipe.title}
                                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                                />
                                <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                    Chef Firudin'dən günün seçimi
                                </div>
                            </div>

                            <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                                <h2 className="text-2xl font-black text-gray-900 md:text-3xl">{featuredRecipe.title}</h2>
                                <p className="mt-3 line-clamp-3 text-gray-600">{featuredRecipe.description}</p>

                                <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
                                    <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                                        <Clock3 size={15} />
                                        {featuredRecipe.cookingTime} dəq
                                    </span>
                                    <span className={`rounded-xl px-3 py-1.5 font-semibold ${difficultyClass(featuredRecipe.difficulty)}`}>
                                        {featuredRecipe.difficulty}
                                    </span>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        to={`/recipes/${featuredRecipe.id}`}
                                        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-emerald-200"
                                    >
                                        Ətraflı bax
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4 rounded-3xl border border-gray-200 bg-white/85 p-4 shadow-lg backdrop-blur md:p-5"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="inline-flex items-center gap-2 text-lg font-bold text-gray-900">
                            <SlidersHorizontal size={18} className="text-emerald-600" />
                            Smart Filter Panel
                        </h2>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700"
                        >
                            <X size={15} />
                            Filtrləri sıfırla
                        </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                        <div className="relative">
                            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={ingredientInput}
                                onChange={(e) => setIngredientInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addIngredient(ingredientInput);
                                    }
                                }}
                                placeholder="Ingredient yaz və Enter bas (istədiyin qədər əlavə edə bilərsən)"
                                className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => addIngredient(ingredientInput)}
                            className="h-11 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 font-semibold text-white transition hover:scale-[1.01]"
                        >
                            Ingredient əlavə et
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {quickIngredients.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => addIngredient(item)}
                                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
                            >
                                + {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {ingredients.length === 0 && (
                            <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                                Ingredient seçmədən də axtarış edə bilərsən
                            </span>
                        )}
                        {ingredients.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => removeIngredient(item)}
                                className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-semibold text-white shadow"
                            >
                                {item}
                                <X size={14} />
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                        <label className="space-y-1">
                            <span className="text-xs font-semibold text-gray-600">Maksimum vaxt</span>
                            <select
                                value={maxCookingTime}
                                onChange={(e) => setMaxCookingTime(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            >
                                <option value="">Hamısı</option>
                                <option value="15">15 dəq</option>
                                <option value="30">30 dəq</option>
                                <option value="45">45 dəq</option>
                                <option value="60">60 dəq</option>
                                <option value="90">90 dəq</option>
                                <option value="90plus">90+ dəq</option>
                            </select>
                        </label>

                        <label className="space-y-1">
                            <span className="text-xs font-semibold text-gray-600">Çətinlik</span>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            >
                                <option value="">Hamısı</option>
                                {difficultyOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-1">
                            <span className="text-xs font-semibold text-gray-600">Sıralama</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "mostmatched" | "newest" | "az")}
                                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            >
                                {sortOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button
                            type="button"
                            onClick={applySearch}
                            disabled={searchLoading}
                            className="mt-5.5 h-11 rounded-xl bg-linear-to-r from-emerald-500 to-orange-500 px-4 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {searchLoading ? "Axtarılır..." : "Filterlə və Axtar"}
                        </button>
                    </div>

                    {searchError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {searchError}
                        </div>
                    )}
                </motion.section>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {!error && displayedRecipes.length === 0 && !searchLoading && (
                    <div className="rounded-3xl border border-gray-200 bg-white/85 p-8 text-center shadow-lg">
                        <p className="text-lg font-semibold text-gray-800">Nəticə tapılmadı</p>
                        <p className="mt-2 text-gray-600">Ingredient və filter parametrlərini dəyişərək yenidən cəhd et.</p>
                    </div>
                )}

                {!error && displayedRecipes.length > 0 && (
                    <section className="space-y-6">
                        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {displayedRecipes.map((recipe, index) => (
                                    <motion.article
                                        key={`${recipe.id}-${index}`}
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -14, scale: 0.96 }}
                                        transition={{ duration: 0.35, delay: 0.03 * index }}
                                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={imagePath(recipe.imageUrl)}
                                                alt={recipe.title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-85" />

                                            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
                                                <Clock3 size={13} />
                                                {recipe.cookingTime} dəq
                                            </div>

                                            <div className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyClass(recipe.difficulty)}`}>
                                                {recipe.difficulty}
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-5">
                                            <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition group-hover:text-emerald-700">
                                                {recipe.title}
                                            </h3>

                                            <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                                                {recipe.description}
                                            </p>

                                            {searchActive && (
                                                <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                                                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Filter size={13} />
                                                            Uyğunluq
                                                        </span>
                                                        <span>{recipe.matchingScore ?? 0}</span>
                                                    </div>

                                                    {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                                                        <p className="line-clamp-2 text-xs text-gray-600">
                                                            Çatışmayanlar: {recipe.missingIngredients.join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-1">
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                                                    <Soup size={14} />
                                                    {recipe.ingredients.length} ingredient
                                                </span>

                                                <Link
                                                    to={`/recipes/${recipe.id}`}
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3"
                                                >
                                                    Ətraflı
                                                    <ArrowRight size={15} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {activePageCount > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft size={16} />
                                    Geri
                                </button>

                                <span className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                                    Səhifə {page} / {activePageCount}
                                </span>

                                <button
                                    onClick={() => setPage((prev) => Math.min(activePageCount, prev + 1))}
                                    disabled={page === activePageCount}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Növbəti
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