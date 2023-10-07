const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by id
router.get("/:id", getUserById, (req, res) => {
  res.send(res.user);
});

// Create a user
router.post("/", async (req, res) => {
  const user = new User({
    full_name: req.body.full_name,
    email: req.body.email,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
router.patch("/:id", getUserById, async (req, res) => {
  if (req.body.full_name != null) {
    res.user.full_name = req.body.full_name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete("/:id", getUserById, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "User has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Private method - Get user by id
async function getUserById(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id).exec();
    if (user == null) {
      return res.status(404).json({ message: "Cannot find the user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
