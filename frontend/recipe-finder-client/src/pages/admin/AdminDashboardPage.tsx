import { useEffect, useState } from "react"
import api from "../../api/axios"

export default function AdminDashboardPage() {

  const [stats, setStats] = useState({
    recipes: 0,
    blogs: 0,
    feedbacks: 0
  })

  const getStats = async () => {
    try {
      const [recipes, blogs, feedbacks] = await Promise.all([
        api.get("/recipes/count"),
        api.get("/blogs"),
        api.get("/feedback")
      ])

      setStats({
        recipes: recipes.data,
        blogs: blogs.data.length,
        feedbacks: feedbacks.data.length
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Reseptlər</h2>
          <p className="text-3xl font-bold">{stats.recipes}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Bloglar</h2>
          <p className="text-3xl font-bold">{stats.blogs}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Feedback</h2>
          <p className="text-3xl font-bold">{stats.feedbacks}</p>
        </div>

      </div>
    </div>
  )
}