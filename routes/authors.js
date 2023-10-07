/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *       properties:
 *         _id:
 *           type: ObjectId
 *           description: The auto-generated id of the author
 *         full_name:
 *           type: string
 *           description: The author's full name
 *         email:
 *           type: string
 *           description: The author's email address
 *         blogs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Blog'
 *           description: The blogs of the author
 *       example:
 *         _id: 652166667828332c4baf5d6a
 *         full_name: John Doe
 *         email: johndoe@gmail.com
 *         blogs: ["652166667828332c4baf5d6a"]
 */

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: API to manage your authors
 * /authors:
 *   get:
 *     summary: Lists all the authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: The list of the authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: The created author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       500:
 *         description: Some server error
 * /authors/{id}:
 *   get:
 *     summary: Get the author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The author response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: The author was not found
 *   patch:
 *    summary: Update the author by the id
 *    tags: [Authors]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The author id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Author'
 *    responses:
 *      200:
 *        description: The author was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Author'
 *      404:
 *        description: The author was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The author id
 *
 *     responses:
 *       200:
 *         description: The author was deleted
 *       404:
 *         description: The author was not found
 */

const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const {
  createValidation,
  updateValidation,
} = require("../validations/authorValidations");

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find().exec();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get author by id
router.get("/:id", getAuthorById, (req, res) => {
  res.send(res.author);
});

// Create an author
router.post("/", createValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const author = new Author({
    full_name: req.body.full_name,
    email: req.body.email,
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an author
router.patch("/:id", getAuthorById, updateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.body.full_name != null) {
    res.author.full_name = req.body.full_name;
  }
  if (req.body.email != null) {
    res.author.email = req.body.email;
  }

  try {
    const updatedAuthor = await res.author.save();
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an author
router.delete("/:id", getAuthorById, async (req, res) => {
  try {
    await res.author.deleteOne();
    res.json({ message: "Author has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Private method - Get author by id
async function getAuthorById(req, res, next) {
  let author;
  try {
    author = await Author.findById(req.params.id).exec();
    if (author == null) {
      return res.status(404).json({ message: "Cannot find the author" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.author = author;
  next();
}

module.exports = router;
