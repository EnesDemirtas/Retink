const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

blogSchema.post("remove", async function (next) {
  const Comment = require("./comment");
  const Author = require("./author");

  try {
    await Comment.deleteMany({ blog: this._id }).exec();
    await Author.findByIdAndUpdate(this.author, {
      $pull: { blogs: this._id },
    }).exec();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Blog", blogSchema);
