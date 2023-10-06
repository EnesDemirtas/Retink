const express = require("express");
const router = express.Router();
const Author = require("../models/author");

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
router.post("/", async (req, res) => {
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
router.patch("/:id", getAuthorById, async (req, res) => {
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
    res.json({ message: "Author deleted" });
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
      return res.status(404).json({ message: "Cannot find author" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.author = author;
  next();
}

module.exports = router;
