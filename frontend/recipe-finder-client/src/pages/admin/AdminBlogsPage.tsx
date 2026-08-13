import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import type { Blog } from "../../types/blog"

export default function AdminBlogsPage() {

    const [blogs, setBlogs] = useState<Blog[]>([])
    const navigate = useNavigate()

    const getBlogs = async () => {
        try {

            const res = await api.get("/blogs")
            setBlogs(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBlogs()
    }, [])

    const handleDelete = async (id: number) => {

        if (!confirm("Blogu silmək istəyirsən?")) return

        try {

            await api.delete(`/blogs/${id}`)

            setBlogs(blogs.filter(b => b.id !== id))

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-4 md:p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Blogları idarə et
                </h1>

                <button
                    onClick={() => navigate("/admin/blogs/create")}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition-all duration-300"
                >
                    + Yeni Blog
                </button>

            </div>

            <div className="space-y-4">

                {blogs.map(blog => (

                    <div
                        key={blog.id}
                        className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >

                        <div>

                            <h2 className="font-semibold text-lg text-gray-800">
                                {blog.title}
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <button
                                onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm shadow hover:scale-105 transition-all duration-300"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(blog.id)}
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