import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getUser } from "../services/auth";
import { deleteBlog } from "../services/api";

const BlogCard = ({ blog, onDeleted, onEdit, onClick }) => {
  const user = getUser();
  const isOwner = user && blog.author?._id === user.id;
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // Reset imgError whenever the blog's image URL changes
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [blog.img]);

  const remove = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this blog?")) return;
    setDeleting(true);
    await deleteBlog(blog._id);
    onDeleted();
  };

  const edit = (e) => {
    e.stopPropagation();
    onEdit(blog);
  };

  // Treat empty string as no image too
  const hasImage = !!(blog.img && blog.img.trim() && !imgError);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden cursor-pointer select-none flex flex-col"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
        boxShadow: hovered
          ? "0 0 0 2px #e94560, 0 20px 60px rgba(233,69,96,0.25)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* hover tint overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? "linear-gradient(135deg, rgba(233,69,96,0.1) 0%, rgba(99,102,241,0.07) 100%)"
            : "transparent",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* ── Cover image ── */}
      {hasImage ? (
        <div
          className="relative w-full flex-shrink-0 overflow-hidden"
          style={{ height: 192 }}
        >
          {/*
            Use a plain <img> (NOT motion.img) so native onError fires reliably.
            The zoom effect is applied via CSS transition on the wrapper instead.
          */}
          <img
            src={blog.img}
            alt={blog.title}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
          {/* gradient fade into card body */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 45%, #16213e 100%)",
            }}
          />
          {/* floating "Blog" tag */}
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(233,69,96,0.85)",
              color: "#fff",
              backdropFilter: "blur(8px)",
              zIndex: 2,
            }}
          >
            Blog
          </span>
        </div>
      ) : (
        /* no-image placeholder */
        <div
          className="w-full flex-shrink-0 flex items-center justify-center"
          style={{
            height: 80,
            background:
              "linear-gradient(135deg, rgba(233,69,96,0.12) 0%, rgba(99,102,241,0.1) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: 28, opacity: 0.35 }}>✍️</span>
        </div>
      )}

      {/* ── Content ── */}
      <div className="relative z-20 p-5 flex flex-col flex-1">
        {!hasImage && (
          <span
            className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={{
              background: "rgba(233,69,96,0.18)",
              color: "#e94560",
              border: "1px solid rgba(233,69,96,0.35)",
            }}
          >
            Blog
          </span>
        )}

        <h2 className="text-white text-lg font-bold leading-snug mb-2 line-clamp-2">
          {blog.title}
        </h2>

        <p
          className="text-sm line-clamp-3 leading-relaxed flex-1"
          style={{ color: "rgba(255,255,255,0.52)" }}
        >
          {blog.content}
        </p>

        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-semibold mt-2"
          style={{ color: "#e94560" }}
        >
          Read full post →
        </motion.p>

        <div className="my-4" style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full min-w-0"
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
              className="text-xs font-medium truncate"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              {blog.author?.name ?? "Anonymous"}
            </span>
          </div>

          <AnimatePresence>
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex gap-2 flex-shrink-0"
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
                  {deleting ? "…" : "🗑 Delete"}
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