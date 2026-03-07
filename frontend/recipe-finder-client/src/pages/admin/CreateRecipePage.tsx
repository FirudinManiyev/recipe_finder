import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

export default function CreateRecipePage() {

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            const ingredientsArray = form.ingredients
                .split(",")
                .map(i => i.trim())

            await api.post("/recipes", {
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
                Yeni Resept
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    required
                    className="w-full border p-2"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    required
                    className="w-full border p-2"
                />

                <textarea
                    name="instructions"
                    placeholder="Instructions"
                    onChange={handleChange}
                    required
                    className="w-full border p-2"
                />

                <input
                    name="cookingTime"
                    type="number"
                    placeholder="Cooking Time"
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full border p-2"
                />

                <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    required
                    className="w-full border p-2"
                >
                    <option value="">Çətinlik seç</option>

                    {difficulties.map((d, i) => (
                        <option key={i} value={d}>
                            {d}
                        </option>
                    ))}
                </select>

                <input
                    name="imageUrl"
                    placeholder="Image url (məs: images/pasta.jpg)"
                    onChange={handleChange}
                    required
                    className="w-full border p-2"
                />

                <input
                    name="ingredients"
                    placeholder="Ingredients (vergül ilə)"
                    onChange={handleChange}
                    required
                    className="w-full border p-2"
                />

                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Yadda saxla
                </button>

            </form>

        </div>
    )
}