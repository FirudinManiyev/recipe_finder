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

    const [uploading, setUploading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        try {

            setUploading(true)

            const res = await api.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            setForm({
                ...form,
                imageUrl: res.data.imageUrl
            })

        } catch (error) {
            console.log(error)
        } finally {
            setUploading(false)
        }
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
                    className="w-full border p-2"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <textarea
                    name="instructions"
                    placeholder="Instructions"
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="cookingTime"
                    type="number"
                    placeholder="Cooking Time"
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="difficulty"
                    placeholder="Difficulty"
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                {/* Image Upload */}

                <div>
                    <label className="block mb-2 font-medium">
                        Şəkil Yüklə
                    </label>

                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="w-full"
                    />

                    {uploading && (
                        <p className="text-sm text-gray-500 mt-1">
                            Upload olunur...
                        </p>
                    )}

                    {form.imageUrl && (
                        <img
                            src={`https://localhost:5001${form.imageUrl}`}
                            alt="preview"
                            className="mt-3 w-40 rounded"
                        />
                    )}
                </div>

                <input
                    name="ingredients"
                    placeholder="Ingredients (vergül ilə)"
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