import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import type { Blog } from "../types/blog";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(res => setBlog(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Yüklənir...</p>;

  if (!blog) return <p>Blog tapılmadı</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <img
        src={`/${blog.imageUrl}`}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      <p className="text-gray-500 mb-6">
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      <p className="text-gray-700 leading-relaxed">
        {blog.content}
      </p>
    </div>
  );
}