import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (error) {
                console.error("Xəta baş verdi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) return <p className="text-center mt-10">Yüklənir...</p>;

    return (
        <div className="container mx-auto p-6">
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

                        <p className="text-gray-500 text-sm mb-2">
                            {recipe.cookingTime} dəq • {recipe.difficulty}
                        </p>

                        <p className="text-gray-600 text-sm line-clamp-3">
                            {recipe.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;