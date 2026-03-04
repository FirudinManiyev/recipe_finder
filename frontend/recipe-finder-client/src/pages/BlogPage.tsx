import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Blog } from "../types/blog";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs")
      .then(res => setBlogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Yüklənir...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog.id} className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src={`/${blog.imageUrl}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {blog.title}
              </h2>

              <p className="text-gray-600 text-sm mb-4">
                {blog.content.substring(0, 100)}...
              </p>

              <Link
                to={`/blog/${blog.id}`}
                className="text-green-600 font-medium"
              >
                Oxu →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}