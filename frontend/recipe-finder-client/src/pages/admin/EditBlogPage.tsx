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
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Blogu redaktə et</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full border p-2"
                />

                <input
                    name="imageUrl"
                    value={form.imageUrl}
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