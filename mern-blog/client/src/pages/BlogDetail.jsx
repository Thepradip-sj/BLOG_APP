import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBlogById } from "../services/api";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await fetchBlogById(id);

        setBlog(response.data);
      } catch (error) {
        console.log(
          "GET BLOG ERROR 👉",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    getBlog();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <p>Loading blog...</p>
      </div>
    );
  }

  // Blog not found
  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Blog not found
          </h2>

          <button
            onClick={() => navigate("/blogs")}
            className="px-5 py-2 rounded-lg bg-[#e94560]"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(160deg,#0f0f1a 0%,#111827 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <span className="text-lg">←</span>
          Back to blogs
        </button>

        {/* Blog Image */}
        {blog.img && (
          <div className="relative w-full overflow-hidden rounded-2xl mb-8">
            <img
              src={blog.img}
              alt={blog.title}
              className="w-full h-[220px] sm:h-[350px] object-cover"
              style={{ filter: "brightness(0.72)" }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom,transparent 40%,#0f0f1a 100%)",
              }}
            />
          </div>
        )}

        {/* Blog Category */}
        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
          style={{
            background: "rgba(233,69,96,0.18)",
            color: "#e94560",
            border: "1px solid rgba(233,69,96,0.3)",
          }}
        >
          Blog
        </span>

        {/* Blog Title */}
        <h1
          className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6"
          style={{ color: "#f1f5f9" }}
        >
          {blog.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8">

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "#e94560",
              color: "#fff",
            }}
          >
            {blog.author?.name?.[0]?.toUpperCase() ?? "?"}
          </div>

          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "#e2e8f0" }}
            >
              {blog.author?.name ?? "Anonymous"}
            </p>

            {blog.createdAt && (
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

        </div>

        {/* Divider */}
        <div
          className="mb-8"
          style={{
            height: 1,
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {/* Blog Content */}
        <article
          className="text-base sm:text-lg leading-8 whitespace-pre-wrap pb-16"
          style={{
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {blog.content}
        </article>

      </div>
    </div>
  );
};

export default BlogDetail;