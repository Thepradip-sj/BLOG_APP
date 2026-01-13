const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const protect = require("../middleware/authMiddleware");

// CREATE BLOG
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.log("CREATE BLOG ERROR 👉", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL BLOGS
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(blogs);
  } catch (error) {
    console.log("GET BLOGS ERROR 👉", error.message);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log("DELETE BLOG ERROR 👉", error.message);
    res.status(500).json({ message: error.message });
  }
});
// UPDATE BLOG (only owner)
router.put("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔐 ownership check
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    const updatedBlog = await blog.save();

    res.json(updatedBlog);
  } catch (error) {
    console.log("UPDATE BLOG ERROR 👉", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
