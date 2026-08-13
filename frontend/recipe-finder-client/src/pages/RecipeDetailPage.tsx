import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Recipe } from "../types/recipe";
import { safeImageUrl } from "../shared/lib/safeImageUrl";
import { getRecipeById, getRecipeCount, getRecipes } from "../features/recipes/recipeApi";
import {
    ArrowLeft,
    ArrowRight,
    ChefHat,
    Clock3,
    Flame,
    ListChecks,
    Sparkles,
    UtensilsCrossed,
} from "lucide-react";


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

export default function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const instructionSteps = useMemo(() => {
        const raw = recipe?.instructions?.trim();
        if (!raw) return [] as string[];

        return raw
            .split(/\r?\n+/)
            .map((item) => item.trim())
            .filter(Boolean);
    }, [recipe?.instructions]);

    useEffect(() => {
        const loadRecipe = async () => {
            if (!id) {
                setError("Resept ID tapılmadı.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await getRecipeById(Number(id));
                setRecipe(data);
            } catch {
                setError("Resept yüklənmədi. Zəhmət olmasa bir az sonra yenidən cəhd et.");
                setRecipe(null);
            } finally {
                setLoading(false);
            }
        };

        loadRecipe();
    }, [id]);

    useEffect(() => {
        const loadSimilarRecipes = async () => {
            if (!recipe) return;

            try {
                const totalCount = await getRecipeCount();
                const candidates = await getRecipes(1, Math.max(totalCount, 120));

                const normalizeToken = (value: string) =>
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

                const currentIngredients = new Set(recipe.ingredients.map((item) => normalizeToken(item)));
                const currentDifficulty = normalizeToken(recipe.difficulty);

                const ranked = candidates
                    .filter((item) => item.id !== recipe.id)
                    .map((item) => {
                        const itemIngredients = item.ingredients.map((ing) => normalizeToken(ing));

                        const overlapCount = itemIngredients.filter((ing) => currentIngredients.has(ing)).length;
                        const sameDifficulty = normalizeToken(item.difficulty) === currentDifficulty ? 1 : 0;
                        const timeDiff = Math.abs(item.cookingTime - recipe.cookingTime);

                        const score = overlapCount * 3 + sameDifficulty * 4 - timeDiff * 0.02;

                        return { item, score };
                    })
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((entry) => entry.item);

                setSimilarRecipes(ranked);
            } catch {
                setSimilarRecipes([]);
            }
        };

        loadSimilarRecipes();
    }, [recipe]);

    if (loading) {
        return (
            <div className="min-h-screen px-4 py-10 md:px-6 md:py-14">
                <div className="mx-auto max-w-6xl animate-pulse space-y-6">
                    <div className="h-10 w-40 rounded-xl bg-gray-200" />
                    <div className="h-80 rounded-3xl bg-gray-200" />
                    <div className="h-9 w-2/3 rounded-xl bg-gray-200" />
                    <div className="h-24 rounded-2xl bg-gray-200" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-64 rounded-2xl bg-gray-200" />
                        <div className="h-64 rounded-2xl bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen px-4 py-12 md:px-6">
                <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen px-4 py-12 md:px-6">
                <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 shadow">
                    Resept tapılmadı.
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-amber-50 via-emerald-50 to-white px-4 py-10 md:px-6 md:py-14">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
                <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl space-y-7">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Link
                        to="/recipes"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                        <ArrowLeft size={16} />
                        Reseptlərə geri dön
                    </Link>
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl border border-gray-200 bg-white/85 shadow-xl backdrop-blur"
                >
                    <div className="grid lg:grid-cols-2">
                        <div className="relative h-80 overflow-hidden md:h-96 lg:h-full">
                            <img
                                src={safeImageUrl(recipe.imageUrl)}
                                alt={recipe.title}
                                className="h-full w-full object-cover transition duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 backdrop-blur">
                                <Sparkles size={14} />
                                Chef Firudin seçimi
                            </div>
                        </div>

                        <div className="p-6 md:p-8 lg:p-10">
                            <h1 className="text-3xl font-black leading-tight text-gray-900 md:text-4xl">
                                {recipe.title}
                            </h1>

                            <p className="mt-4 text-base leading-7 text-gray-600">{recipe.description}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                                    <Clock3 size={15} />
                                    {recipe.cookingTime} dəq
                                </span>
                                <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-semibold ${difficultyClass(recipe.difficulty)}`}>
                                    <Flame size={14} />
                                    {recipe.difficulty}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                                    <UtensilsCrossed size={14} />
                                    {recipe.ingredients.length} ingredient
                                </span>
                            </div>

                            <div className="mt-7">
                                <Link
                                    to="/recipes"
                                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-emerald-200"
                                >
                                    Digər reseptlər
                                    <ArrowRight size={17} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="grid gap-5 lg:grid-cols-2"
                >
                    <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur">
                        <h2 className="mb-4 inline-flex items-center gap-2 text-xl font-black text-gray-900">
                            <ListChecks size={20} className="text-emerald-600" />
                            İnqridentlər
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ingredient, index) => (
                                    <span
                                        key={`${ingredient}-${index}`}
                                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700"
                                    >
                                        {ingredient}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-600">Ingredient məlumatı yoxdur.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-lg backdrop-blur">
                        <h2 className="mb-4 inline-flex items-center gap-2 text-xl font-black text-gray-900">
                            <UtensilsCrossed size={20} className="text-emerald-600" />
                            Hazırlanma təlimatı
                        </h2>

                        <AnimatePresence mode="popLayout">
                            {instructionSteps.length > 0 ? (
                                <ol className="space-y-3">
                                    {instructionSteps.map((step, index) => (
                                        <motion.li
                                            key={`${index}-${step}`}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, delay: index * 0.04 }}
                                            className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3"
                                        >
                                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm leading-6 text-gray-700">{step}</p>
                                        </motion.li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-sm leading-6 text-gray-600">
                                    Bu resept üçün əlavə təlimat məlumatı paylaşılmayıb.
                                </p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {similarRecipes.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="space-y-4"
                    >
                        <h2 className="inline-flex items-center gap-2 text-2xl font-black text-gray-900">
                            <ChefHat size={22} className="text-emerald-600" />
                            Oxşar Reseptlər
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {similarRecipes.map((item, index) => (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.03 * index }}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={safeImageUrl(item.imageUrl)}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-85" />
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition group-hover:text-emerald-700">
                                            {item.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                                                <Clock3 size={13} />
                                                {item.cookingTime} dəq
                                            </span>
                                            <span className={`rounded-lg px-2.5 py-1 font-semibold ${difficultyClass(item.difficulty)}`}>
                                                {item.difficulty}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/recipes/${item.id}`}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3"
                                        >
                                            Aç
                                            <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
