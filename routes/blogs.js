/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: ObjectId
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The blog title
 *         content:
 *           type: string
 *           description: The blog content
 *         author:
 *           type: ObjectId
 *           ref: Author
 *           description: The author id of the blog
 *         comments:
 *          type: array
 *          ref: Comment
 *          description: The comments of the blog
 *       example:
 *         _id: 652166667828332c4baf5d6a
 *         title: My First Blog
 *         content: This is my first blog.
 *         author: 652166667828332c4baf5d6a
 *         comments: ["652166667828332c4baf5d6a"]
 */

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: API to manage your blogs
 * /blogs:
 *   get:
 *     summary: Lists all the blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: The list of the blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: The created blog.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 * /blogs/{id}:
 *   get:
 *     summary: Get the blog by id
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *     responses:
 *       200:
 *         description: The blog response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The blog was not found
 *   patch:
 *    summary: Update the blog by the id
 *    tags: [Blogs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The blog id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Blog'
 *    responses:
 *      200:
 *        description: The blog was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      404:
 *        description: The blog was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the blog by id
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *
 *     responses:
 *       200:
 *         description: The blog was deleted
 *       404:
 *         description: The blog was not found
 */

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
    const author = await Author.findById({ _id: req.body.author }).exec();
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
      return res.status(404).json({ message: "Cannot find the blog" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blog = blog;
  next();
}

module.exports = router;
