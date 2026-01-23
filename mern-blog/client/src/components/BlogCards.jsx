import { motion } from "framer-motion";
import { getUser } from "../services/auth";
import { deleteBlog } from "../services/api";

const BlogCard = ({ blog, onDeleted }) => {
  const user = getUser();
  const isOwner = user && blog.author?._id === user.id;

  const remove = async () => {
    if (!confirm("Delete this blog?")) return;
    await deleteBlog(blog._id);
    onDeleted(); // refresh list
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-5 rounded-2xl shadow-xl"
    >
      <h2 className="text-xl font-bold">{blog.title}</h2>
      <p className="text-sm opacity-90 mt-2 line-clamp-3">{blog.content}</p>

      <div className="mt-4 flex items-center justify-between text-xs opacity-90">
        <span>✍️ {blog.author?.name}</span>

        {isOwner && (
          <button
            onClick={remove}
            className="bg-black/30 px-3 py-1 rounded hover:bg-black/50"
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BlogCard;
