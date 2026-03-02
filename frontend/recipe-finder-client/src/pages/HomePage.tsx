import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { searchRecipes } from "../services/recipeService";

const HomePage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadRecipes(1);
    }, []);

    const loadRecipes = async (pageNumber: number) => {
        try {
            setLoading(true);
            const data = await getRecipes(pageNumber, 6);

            if (pageNumber === 1) {
                setRecipes(data);
            } else {
                setRecipes((prev) => [...prev, ...data]);
            }

            if (data.length < 6) {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (data: any) => {
        try {
            setLoading(true);
            setPage(1);          
            setHasMore(false);   

            const result = await searchRecipes(data);
            setRecipes(result);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    {
        loading && (
            <div className="flex justify-center my-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <SearchBar onSearch={handleSearch} />
            <h1 className="text-3xl font-bold mb-6">Reseptlər</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <Link
                        to={`/recipes/${recipe.id}`}
                        key={recipe.id}
                        className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition block"
                    >
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />

                        <h2 className="text-xl font-semibold">
                            {recipe.title}
                        </h2>

                        {recipe.matchingScore > 0 && (
                            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-2">
                                Uyğunluq: {recipe.matchingScore}
                            </span>
                        )}

                        <p className="text-gray-500 text-sm mb-2">
                            {recipe.cookingTime} dəq • {recipe.difficulty}
                        </p>

                        <p className="text-gray-600 text-sm line-clamp-3">
                            {recipe.description}
                        </p>

                        {recipe.missingIngredients.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs text-red-500 font-semibold">
                                    Çatışmayan inqrediyentlər:
                                </p>
                                <p className="text-xs text-gray-500">
                                    {recipe.missingIngredients.join(", ")}
                                </p>
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {!loading && recipes.length === 0 && (
                <div className="text-center mt-10">
                    <p className="text-gray-500 text-lg">
                        Heç bir resept tapılmadı 😔
                    </p>
                </div>
            )}

            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => {
                            const nextPage = page + 1;
                            setPage(nextPage);
                            loadRecipes(nextPage);
                        }}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg"
                    >
                        Daha çox göstər
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;