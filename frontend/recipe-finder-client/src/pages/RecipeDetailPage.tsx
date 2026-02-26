import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";
import type { Recipe } from "../types/recipe";

const RecipeDetailPage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(Number(id));
                setRecipe(data);
            } catch (error) {
                console.error("Xəta:", error);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) return <p className="text-center mt-10">Yüklənir...</p>;

    return (
        <div className="container mx-auto p-6">
            <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
            />

            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

            <p className="text-gray-600 mb-4">
                {recipe.cookingTime} dəq • {recipe.difficulty}
            </p>

            <p className="mb-6">{recipe.description}</p>

            <h2 className="text-xl font-semibold mb-2">İnqrediyentlər:</h2>
            <ul className="list-disc pl-6">
                {recipe.ingredients.map((ing, index) => (
                    <li key={index}>{ing}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeDetailPage;