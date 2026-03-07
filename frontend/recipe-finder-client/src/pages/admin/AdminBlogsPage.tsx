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
        <div>

            <div className="flex justify-between mb-6">

                <h1 className="text-2xl font-bold">
                    Blogları idarə et
                </h1>

                <button
                    onClick={() => navigate("/admin/blogs/create")}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Yeni Blog
                </button>

            </div>

            <div className="space-y-4">

                {blogs.map(blog => (

                    <div
                        key={blog.id}
                        className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >

                        <div>

                            <h2 className="font-semibold">
                                {blog.title}
                            </h2>

                            <p className="text-gray-500 text-sm">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>

                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(blog.id)}
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