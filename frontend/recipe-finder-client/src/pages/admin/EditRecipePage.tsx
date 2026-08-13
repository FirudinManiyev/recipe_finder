import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/axios"

export default function EditRecipePage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        title: "",
        description: "",
        instructions: "",
        cookingTime: 0,
        difficulty: "",
        imageUrl: "",
        ingredients: ""
    })

    const difficulties = [
        "Çox asan",
        "Asan",
        "Orta",
        "Çətin",
        "Çox çətin"
    ]

    useEffect(() => {
        getRecipe()
    }, [])

    const getRecipe = async () => {
        try {

            const res = await api.get(`/recipes/${id}`)
            const r = res.data

            setForm({
                title: r.title,
                description: r.description,
                instructions: r.instructions,
                cookingTime: r.cookingTime,
                difficulty: r.difficulty,
                imageUrl: r.imageUrl,
                ingredients: r.ingredients.join(", ")
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {

            const ingredientsArray = form.ingredients
                .split(",")
                .map((i) => i.trim())

            await api.put(`/recipes/${id}`, {
                Title: form.title,
                Description: form.description,
                Instructions: form.instructions,
                CookingTime: Number(form.cookingTime),
                Difficulty: form.difficulty,
                ImageUrl: form.imageUrl,
                Ingredients: ingredientsArray
            })

            navigate("/admin/recipes")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex justify-center p-4 md:p-8">

            <div className="w-full max-w-2xl bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl">

                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Resepti redaktə et
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Title
                        </label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Instructions
                        </label>
                        <textarea
                            name="instructions"
                            value={form.instructions}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Cooking Time (dəqiqə)
                        </label>
                        <input
                            name="cookingTime"
                            type="number"
                            value={form.cookingTime}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Difficulty
                        </label>
                        <select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="">Çətinlik seç</option>

                            {difficulties.map((d, i) => (
                                <option key={i} value={d}>
                                    {d}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Image URL
                        </label>
                        <input
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Ingredients
                        </label>
                        <input
                            name="ingredients"
                            value={form.ingredients}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition-all duration-300"
                    >
                        Yadda saxla
                    </button>

                </form>

            </div>

        </div>
    )
}