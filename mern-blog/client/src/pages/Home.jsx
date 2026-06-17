import { useEffect, useState } from "react";
import { fetchBlogs, updateBlog } from "../services/api";
import BlogCard from "../components/BlogCards";
import { motion, AnimatePresence } from "framer-motion";
import { callGemini, geminiPrompts, hasGeminiKey } from "../services/gemini";

const fmt = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

/* ── Blog Detail Panel ───────────────────────────────── */
const BlogDetail = ({ blog, onClose }) => (
  <AnimatePresence>
    {blog && (
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        />
        <motion.aside
          key="panel"
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
          style={{
            width: "min(560px,100vw)",
            background: "linear-gradient(160deg,#0f0f1a 0%,#111827 100%)",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {blog.img && (
            <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
              <img src={blog.img} alt={blog.title} className="w-full h-full object-cover"
                style={{ filter: "brightness(0.72)" }} />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom,transparent 40%,#0f0f1a 100%)",
              }} />
            </div>
          )}
          <div className="px-8 py-6">
            <button onClick={onClose} className="mb-6 flex items-center gap-2 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.38)" }}>
              <span style={{ fontSize: 16 }}>←</span> Back to blogs
            </button>
            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "rgba(233,69,96,0.18)", color: "#e94560", border: "1px solid rgba(233,69,96,0.3)" }}>
              Blog
            </span>
            <h1 className="text-2xl font-extrabold leading-tight mb-4" style={{ color: "#f1f5f9" }}>
              {blog.title}
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "#e94560", color: "#fff" }}>
                {blog.author?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
                  {blog.author?.name ?? "Anonymous"}
                </p>
                {fmt(blog.createdAt) && (
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {fmt(blog.createdAt)}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-8" style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
            <div className="text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: "rgba(255,255,255,0.7)" }}>
              {blog.content}
            </div>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

/* ── Edit Modal ──────────────────────────────────────── */
const EditModal = ({ blog, form, onChange, onSubmit, onClose }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const improveWithAI = async () => {
    if (!hasGeminiKey()) {
      setAiError("No Gemini API key saved. Add one on the Create page first.");
      return;
    }
    if (!form.content.trim()) {
      setAiError("Add some content first so Gemini has something to improve.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const improved = await callGemini(geminiPrompts.improve(form.content));
      onChange({ ...form, content: improved });
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f1f5f9",
  };

  return (
    <AnimatePresence>
      {blog && (
        <>
          <motion.div
            key="edit-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            key="edit-modal"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div style={{
              pointerEvents: "all",
              width: "min(480px,100%)",
              background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 20,
              padding: "2rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: "#f1f5f9" }}>
                Edit blog
              </h2>

              {/* Title */}
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: "rgba(255,255,255,0.38)" }}>Title</label>
              <input
                value={form.title}
                onChange={(e) => onChange({ ...form, title: e.target.value })}
                className="w-full mb-4 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />

              {/* Cover image URL */}
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: "rgba(255,255,255,0.38)" }}>
                Cover image URL{" "}
                <span style={{ textTransform: "none", letterSpacing: 0, color: "rgba(255,255,255,0.22)" }}>
                  (optional)
                </span>
              </label>
              <input
                value={form.img ?? ""}
                placeholder="https://example.com/image.jpg"
                onChange={(e) => onChange({ ...form, img: e.target.value })}
                className="w-full mb-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {form.img ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 mt-2 overflow-hidden rounded-xl"
                >
                  <img src={form.img} alt="Preview" className="w-full object-cover rounded-xl"
                    style={{ maxHeight: 140 }}
                    onError={(e) => (e.target.style.display = "none")} />
                </motion.div>
              ) : <div className="mb-4" />}

              {/* Content + AI improve */}
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.38)" }}>Content</label>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={improveWithAI}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: aiLoading
                      ? "rgba(99,102,241,0.12)"
                      : "rgba(99,102,241,0.18)",
                    color: aiLoading ? "rgba(165,180,252,0.45)" : "#a5b4fc",
                    border: "1px solid rgba(99,102,241,0.3)",
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {aiLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="block w-3 h-3 rounded-full"
                        style={{ border: "1.5px solid rgba(165,180,252,0.3)", borderTopColor: "#a5b4fc" }}
                      />
                      Improving…
                    </>
                  ) : <>✦ Improve with AI</>}
                </motion.button>
              </div>

              {aiError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] px-2.5 py-1.5 rounded-lg mb-2"
                  style={{
                    color: "#fb7185",
                    background: "rgba(233,69,96,0.1)",
                    border: "1px solid rgba(233,69,96,0.2)",
                  }}
                >
                  ⚠ {aiError}
                </motion.p>
              )}

              <textarea
                value={form.content}
                onChange={(e) => onChange({ ...form, content: e.target.value })}
                rows={6}
                className="w-full mb-6 px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />

              <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                  Cancel
                </button>
                <button onClick={onSubmit} className="px-5 py-2 rounded-xl text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg,#e94560,#c2185b)",
                    color: "#fff",
                    boxShadow: "0 2px 16px rgba(233,69,96,0.3)",
                  }}>
                  Save changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Home ────────────────────────────────────────────── */
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", img: "" });

  const loadBlogs = async () => {
    try {
      const res = await fetchBlogs();
      setBlogs(res.data);
    } catch {
      console.log("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlogs(); }, []);

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditForm({ title: blog.title, content: blog.content, img: blog.img ?? "" });
  };

  const submitEdit = async () => {
    try {
      await updateBlog(editingBlog._id, editForm);
      setEditingBlog(null);
      if (selectedBlog?._id === editingBlog._id) {
        setSelectedBlog({ ...selectedBlog, ...editForm });
      }
      loadBlogs();
    } catch {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ background: "#0a0a14" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          className="w-10 h-10 rounded-full"
          style={{ border: "3px solid rgba(233,69,96,0.25)", borderTopColor: "#e94560" }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen"
        style={{ background: "linear-gradient(160deg,#0a0a14 0%,#0d1117 100%)" }}>
        <motion.header
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-6 pt-14 pb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#e94560" }}>
            Community writing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            Latest Blogs
          </h1>
          <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.38)" }}>
            Click any card to read the full post.
          </p>
        </motion.header>

        <div className="max-w-6xl mx-auto px-6">
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        <main className="max-w-6xl mx-auto px-6 py-10">
          {blogs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 gap-4">
              <span style={{ fontSize: 48 }}>✍️</span>
              <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                No blogs yet — be the first to write.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {blogs.map((blog) => (
                <motion.div key={blog._id}
                  variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                  <BlogCard
                    blog={blog}
                    onDeleted={loadBlogs}
                    onEdit={handleEdit}
                    onClick={() => setSelectedBlog(blog)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      <BlogDetail blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      <EditModal
        blog={editingBlog}
        form={editForm}
        onChange={setEditForm}
        onSubmit={submitEdit}
        onClose={() => setEditingBlog(null)}
      />
    </>
  );
};

export default Home;