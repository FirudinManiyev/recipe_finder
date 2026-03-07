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
        <div>
            <h1 className="text-2xl font-bold mb-6">Feedback mesajları</h1>

            <div className="space-y-4">
                {feedbacks.map(f => (
                    <div
                        key={f.id}
                        className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >
                        <div>
                            <h2 className="font-semibold">{f.fullName}</h2>
                            <p className="text-gray-500 text-sm">{f.email}</p>
                            <p className="text-gray-700 mt-2">{f.message}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(f.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}