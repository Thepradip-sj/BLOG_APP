import { useState } from "react";
import { motion } from "framer-motion";
import { createBlog } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [form, setForm] = useState({ title: "", content: "", img: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createBlog(form);
      navigate("/");
    } catch {
      setError("Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContent = (e) => {
    setForm({ ...form, content: e.target.value });
    setCharCount(e.target.value.length);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a0a14 0%, #0d1117 100%)" }}
    >
      {/* ambient glows */}
      <div className="absolute pointer-events-none"
        style={{
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,69,96,0.13) 0%, transparent 70%)",
          top: -120, left: -120,
        }}
      />
      <div className="absolute pointer-events-none"
        style={{
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)",
          bottom: -80, right: -80,
        }}
      />

      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">

        {/* Back link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium mb-8"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          <span style={{ fontSize: 16 }}>←</span> Back to blogs
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
            style={{ color: "#e94560" }}
          >
            New post
          </p>
          <h1
            className="text-3xl sm:text-4xl font-extrabold"
            style={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}
          >
            Write something great
          </h1>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "2rem",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={submit} className="space-y-6">

            {/* Title */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Title
              </label>
              <input
                required
                placeholder="Give your post a compelling title…"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#f1f5f9",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            {/* Cover image URL */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Cover image URL <span style={{ color: "rgba(255,255,255,0.22)", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                placeholder="https://example.com/image.jpg"
                value={form.img}
                onChange={(e) => setForm({ ...form, img: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#f1f5f9",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
              {/* live preview */}
              {form.img && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 overflow-hidden rounded-xl"
                >
                  <img
                    src={form.img}
                    alt="Cover preview"
                    className="w-full object-cover rounded-xl"
                    style={{ maxHeight: 180 }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Content
                </label>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {charCount} chars
                </span>
              </div>
              <textarea
                required
                placeholder="Start writing your post here…"
                rows={10}
                value={form.content}
                onChange={handleContent}
                className="w-full px-4 py-3 rounded-xl text-sm leading-relaxed outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#f1f5f9",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  color: "#fb7185",
                  background: "rgba(233,69,96,0.12)",
                  border: "1px solid rgba(233,69,96,0.25)",
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                Discard
              </button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                disabled={loading}
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? "rgba(233,69,96,0.35)"
                    : "linear-gradient(135deg, #e94560 0%, #c2185b 100%)",
                  color: "#fff",
                  boxShadow: loading ? "none" : "0 4px 24px rgba(233,69,96,0.35)",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="block w-4 h-4 rounded-full"
                      style={{
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                      }}
                    />
                    Publishing…
                  </>
                ) : (
                  <>✦ Publish post</>
                )}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBlog;