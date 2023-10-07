const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

const Author = require("../models/author");

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().exec();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get blog by id
router.get("/:id", getBlogById, (req, res) => {
  res.send(res.blog);
});

// Create a blog
router.post("/", async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  });

  try {
    const author = await Author.findOne({ _id: req.body.author }).exec();
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    author.blogs.push(blog._id);

    const newBlog = await blog.save();
    await author.save();

    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a blog
router.patch("/:id", getBlogById, async (req, res) => {
  if (req.body.title != null) {
    res.blog.title = req.body.title;
  }
  if (req.body.content != null) {
    res.blog.content = req.body.content;
  }

  try {
    const updatedBlog = await res.blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a blog
router.delete("/:id", getBlogById, async (req, res) => {
  try {
    await res.blog.deleteOne();
    res.json({ message: "Blog has been deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBlogById(req, res, next) {
  let blog;
  try {
    blog = await Blog.findById(req.params.id).exec();
    if (blog == null) {
      return res.status(404).json({ message: "Cannot find blog" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blog = blog;
  next();
}

module.exports = router;
