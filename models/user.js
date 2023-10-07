const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

userSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    const Comment = require("./comment");

    try {
      await Comment.deleteMany({ user: doc._id }).exec();
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("User", userSchema);
