const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

const Blog = require("../models/blog");
const User = require("../models/user");

// Get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().exec();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comment by id
router.get("/:id", getCommentById, (req, res) => {
  res.send(res.comment);
});

// Create a comment
router.post("/", async (req, res) => {
  const comment = new Comment({
    blog: req.body.blog,
    comment: req.body.comment,
    user: req.body.user,
  });

  try {
    const blog = await Blog.findById(req.body.blog).exec();
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const user = await User.findById(req.body.user).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    blog.comments.push(comment._id);
    user.comments.push(comment._id);

    const newComment = await comment.save();
    await blog.save();
    await user.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a comment
router.patch("/:id", getCommentById, async (req, res) => {
  if (req.body.content != null) {
    res.comment.content = req.body.content;
  }

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comment
router.delete("/:id", getCommentById, async (req, res) => {
  try {
    await res.comment.deleteOne();
    res.json({ message: "The comment has been deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Private method - Get comment by id
async function getCommentById(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id).exec();
    if (comment == null) {
      return res.status(404).json({ message: "Cannot find comment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

module.exports = router;
