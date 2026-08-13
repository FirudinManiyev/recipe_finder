import { useEffect, useState } from "react"
import api from "../../api/axios"

interface Feedback {
    fullName: string
    email: string
    message: string
    id: number
}

export default function AdminFeedbackPage() {

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

    const getFeedbacks = async () => {
        try {
            const res = await api.get("/feedback")
            setFeedbacks(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFeedbacks()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Feedbacki silmək istəyirsən?")) return
        try {
            await api.delete(`/feedback/${id}`)
            setFeedbacks(feedbacks.filter(f => f.id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-4 md:p-6">

            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Feedback mesajları
            </h1>

            <div className="space-y-4">

                {feedbacks.map(f => (

                    <div
                        key={f.id}
                        className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >

                        <div className="flex-1">

                            <h2 className="font-semibold text-lg text-gray-800">
                                {f.fullName}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {f.email}
                            </p>

                            <p className="text-gray-700 mt-3 leading-relaxed">
                                {f.message}
                            </p>

                        </div>

                        <button
                            onClick={() => handleDelete(f.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-all duration-300 self-start md:self-center"
                        >
                            Delete
                        </button>

                    </div>

                ))}

            </div>

        </div>
    )
}