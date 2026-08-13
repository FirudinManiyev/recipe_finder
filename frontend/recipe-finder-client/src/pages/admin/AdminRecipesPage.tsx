import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import type { Recipe } from "../../types/recipe"

export default function AdminRecipesPage() {

    const [recipes, setRecipes] = useState<Recipe[]>([])

    const navigate = useNavigate()

    const getRecipes = async () => {
        try {
            const res = await api.get("/recipes?pageNumber=1&pageSize=100")
            setRecipes(res.data)
        } catch (error) {
            console.log(error)
        }
    }

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
        <div className="p-4 md:p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Reseptləri idarə et
                </h1>

                <button
                    onClick={() => navigate("/admin/recipes/create")}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition-all duration-300"
                >
                    + Yeni resept
                </button>

            </div>

            <div className="space-y-4">

                {recipes.map(recipe => (

                    <div
                        key={recipe.id}
                        className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >

                        <div>

                            <h2 className="font-semibold text-lg text-gray-800">
                                {recipe.title}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {recipe.cookingTime} dəqiqə
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <button
                                onClick={() => navigate(`/admin/recipes/edit/${recipe.id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm shadow hover:scale-105 transition-all duration-300"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(recipe.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm shadow hover:scale-105 transition-all duration-300"
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