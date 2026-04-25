import { useState } from "react";
import { motion } from "framer-motion";
import { createBlog } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBlog(form);
      navigate("/"); // back to home
    } catch {
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-600">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[420px]"
      >
        <h2 className="text-2xl font-bold mb-4">Write a new blog ✍️</h2>

        <input
          required
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          required
          placeholder="Content..."
          rows={5}
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Publishing..." : "Publish"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default CreateBlog;
