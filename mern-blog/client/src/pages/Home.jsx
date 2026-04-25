import { useEffect, useState } from "react";
import { fetchBlogs, updateBlog } from "../services/api";
import BlogCard from "../components/BlogCards";
import { motion } from "framer-motion";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  // 🔁 load blogs
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

  // ✏️ edit handler
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditForm({ title: blog.title, content: blog.content });
  };

  // ✅ submit edit
  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog(editingBlog._id, editForm);
      setEditingBlog(null);
      loadBlogs();
    } catch {
      alert("Update failed");
    }
  };

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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen px-6 py-10 bg-gradient-to-b from-gray-100 to-gray-200"
      >
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          ✨ Latest Blogs
        </h1>

        {blogs.length === 0 && (
          <p className="text-center text-gray-500">
            No blogs yet. Be the first one to write ✍️
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onDeleted={loadBlogs}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </motion.div>

      {/* ✏️ Edit Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-xl w-[380px]"
            onSubmit={submitEdit}
          >
            <h2 className="text-xl font-bold mb-4">Edit Blog ✏️</h2>

            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              value={editForm.content}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
              rows={4}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingBlog(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-1 bg-purple-600 text-white rounded">
                Update
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
};

export default Home;
