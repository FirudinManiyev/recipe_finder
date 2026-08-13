import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../api/axios"

export default function EditBlogPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        title: "",
        content: "",
        imageUrl: ""
    })

    useEffect(() => {
        getBlog()
    }, [])

    const getBlog = async () => {
        try {
            const res = await api.get(`/blogs/${id}`)
            const b = res.data
            setForm({
                title: b.title,
                content: b.content,
                imageUrl: b.imageUrl
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
            await api.put(`/blogs/${id}`, {
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
        <div className="flex justify-center p-4 md:p-8">

            <div className="w-full max-w-2xl bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl">

                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Blogu redaktə et
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
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
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