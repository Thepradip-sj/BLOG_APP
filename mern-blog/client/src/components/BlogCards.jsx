import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getUser } from "../services/auth";
import { deleteBlog } from "../services/api";

const BlogCard = ({ blog, onDeleted, onEdit, onClick }) => {
  const user = getUser();
  const isOwner = user && blog.author?._id === user.id;
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async (e) => {
    e.stopPropagation(); // don't open detail
    if (!confirm("Delete this blog?")) return;
    setDeleting(true);
    await deleteBlog(blog._id);
    onDeleted();
  };

  const edit = (e) => {
    e.stopPropagation(); // don't open detail
    onEdit(blog);
  };

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative group rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
        boxShadow: hovered
          ? "0 0 0 2px #e94560, 0 20px 60px rgba(233,69,96,0.25)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? "linear-gradient(135deg, rgba(233,69,96,0.12) 0%, rgba(99,102,241,0.08) 100%)"
            : "transparent",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Cover image */}
      {blog.img && (
        <div className="relative w-full h-44 overflow-hidden">
          <motion.img
            src={blog.img}
            alt={blog.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, #1a1a2e 100%)",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 p-5">
        {/* Tag pill */}
        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{
            background: "rgba(233,69,96,0.18)",
            color: "#e94560",
            border: "1px solid rgba(233,69,96,0.35)",
          }}
        >
          Blog
        </span>

        {/* Title */}
        <h2 className="text-white text-lg font-bold leading-snug mb-2 line-clamp-2">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p
          className="text-sm line-clamp-3 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {blog.content}
        </p>

        {/* Read more hint */}
        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-semibold mt-2"
          style={{ color: "#e94560" }}
        >
          Read full post →
        </motion.p>

        {/* Divider */}
        <div
          className="my-4"
          style={{ height: 1, background: "rgba(255,255,255,0.08)" }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          {/* Author chip */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "#e94560", color: "#fff" }}
            >
              {blog.author?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span
              className="text-xs font-medium truncate max-w-[100px]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {blog.author?.name ?? "Anonymous"}
            </span>
          </div>

          {/* Owner actions */}
          <AnimatePresence>
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={edit}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(99,102,241,0.18)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99,102,241,0.35)",
                  }}
                >
                  ✏️ Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={remove}
                  disabled={deleting}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(233,69,96,0.18)",
                    color: "#fb7185",
                    border: "1px solid rgba(233,69,96,0.35)",
                    opacity: deleting ? 0.5 : 1,
                  }}
                >
                  {deleting ? "..." : "🗑 Delete"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;