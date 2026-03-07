import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import type { Recipe } from "../../types/recipe"

export default function AdminRecipesPage() {

    const [recipes, setRecipes] = useState<Recipe[]>([])

    const getRecipes = async () => {
        try {
            const res = await api.get("/recipes?pageNumber=1&pageSize=100")
            setRecipes(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        getRecipes()
    }, [])

    const handleDelete = async (id: number) => {

        if (!confirm("Resepti silmək istəyirsən?")) return

        try {

            await api.delete(`/recipes/${id}`)

            setRecipes(recipes.filter(r => r.id !== id))

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>

            <div className="flex justify-between mb-6">

                <h1 className="text-2xl font-bold">
                    Reseptləri idarə et
                </h1>

                <button
                    onClick={() => navigate("/admin/recipes/create")}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Yeni resept
                </button>

            </div>

            <div className="space-y-4">

                {recipes.map(recipe => (

                    <div
                        key={recipe.id}
                        className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >

                        <div>

                            <h2 className="font-semibold">
                                {recipe.title}
                            </h2>

                            <p className="text-gray-500 text-sm">
                                {recipe.cookingTime} dəqiqə
                            </p>

                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={() => navigate(`/admin/recipes/edit/${recipe.id}`)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(recipe.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}