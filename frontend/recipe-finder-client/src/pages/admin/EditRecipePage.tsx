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
        <div className="max-w-xl">

            <h1 className="text-2xl font-bold mb-6">
                Resepti redaktə et
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <textarea
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="cookingTime"
                    type="number"
                    value={form.cookingTime}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Yadda saxla
                </button>

            </form>

        </div>
    )
}   