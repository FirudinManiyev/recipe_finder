import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import type { Recipe } from "../types/recipe";

export default function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/recipes/${id}`)
            .then(res => setRecipe(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Yüklənir...</p>;

    if (!recipe) return <p>Resept tapılmadı</p>;

    return (
        <div className="max-w-3xl mx-auto">
            <img
                src={`/${recipe.imageUrl}`}
                alt={recipe.title}
                className="w-full h-80 object-cover rounded-lg mb-6"
            />

            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

            <div className="flex gap-6 text-gray-600 mb-6">
                <span>Vaxt: {recipe.cookingTime} dəq</span>
                <span>Çətinlik: {recipe.difficulty}</span>
            </div>

            <p className="mb-6 text-gray-700">{recipe.description}</p>

            <h2 className="text-xl font-semibold mb-3">İngredientlər</h2>

            <ul className="list-disc pl-6 space-y-2">
                {recipe.ingredients.map((ing, index) => (
                    <li key={index}>{ing}</li>
                ))}
            </ul>
        </div>
    );
}