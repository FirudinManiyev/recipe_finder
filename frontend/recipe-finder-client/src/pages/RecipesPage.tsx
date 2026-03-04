import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Recipe } from "../types/recipe";
import { Link } from "react-router-dom";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/recipes")
            .then(res => {
                setRecipes(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Reseptlər</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <img
                            src={`/${recipe.imageUrl}`}
                            alt={recipe.title}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {recipe.title}
                            </h2>

                            <p className="text-gray-600 text-sm mb-4">
                                {recipe.description}
                            </p>

                            <Link
                                to={`/recipes/${recipe.id}`}
                                className="text-green-600 font-medium"
                            >
                                Ətraflı →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}