import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboardPage() {

  const [stats, setStats] = useState({
    recipes: 0,
    blogs: 0,
    feedbacks: 0
  });

  const getStats = async () => {
    try {
      const [recipes, blogs, feedbacks] = await Promise.all([
        api.get("/recipes/count"),
        api.get("/blogs"),
        api.get("/feedback")
      ]);

      setStats({
        recipes: recipes.data,
        blogs: blogs.data.length,
        feedbacks: feedbacks.data.length
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="p-6 md:p-8">

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white/90 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h2 className="text-gray-500 mb-2">Reseptlər</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-800">{stats.recipes}</p>
        </div>

        <div className="bg-white/90 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h2 className="text-gray-500 mb-2">Bloglar</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-800">{stats.blogs}</p>
        </div>

        <div className="bg-white/90 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h2 className="text-gray-500 mb-2">Feedback</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-800">{stats.feedbacks}</p>
        </div>

      </div>
    </div>
  );
}