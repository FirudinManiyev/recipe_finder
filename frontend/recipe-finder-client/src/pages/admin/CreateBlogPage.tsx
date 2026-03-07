import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

export default function CreateBlogPage() {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        title: "",
        content: "",
        imageUrl: ""
    })

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {

            await api.post("/blogs", {
                Title: form.title,
                Content: form.content,
                ImageUrl: form.imageUrl
            })

            navigate("/admin/blogs")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="max-w-xl">

            <h1 className="text-2xl font-bold mb-6">
                Yeni Blog
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <textarea
                    name="content"
                    placeholder="Content"
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="imageUrl"
                    placeholder="Image url"
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