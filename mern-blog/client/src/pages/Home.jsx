import { useEffect, useState } from "react";
import { fetchBlogs } from "../services/api";
import BlogCard from "../components/BlogCards";
import { motion } from "framer-motion";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 central function to load blogs
  const loadBlogs = async () => {
    try {
      const res = await fetchBlogs();
      setBlogs(res.data);
    } catch (error) {
      console.log("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // ⏳ Loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-6 py-10 bg-gradient-to-b from-gray-100 to-gray-200"
    >
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        ✨ Latest Blogs
      </h1>

      {/* Empty state */}
      {blogs.length === 0 && (
        <p className="text-center text-gray-500">
          No blogs yet. Be the first one to write ✍️
        </p>
      )}

      {/* Blog grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onDeleted={loadBlogs} // 🔥 refresh after delete
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
