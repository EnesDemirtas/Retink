const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

commentSchema.post("remove", async function (next) {
  const Blog = require("./blog");
  const User = require("./user");

  try {
    await Blog.findByIdAndUpdate(this.blog, {
      $pull: { comments: this._id },
    }).exec();
    await User.findByIdAndUpdate(this.user, {
      $pull: { comments: this._id },
    }).exec();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Comment", commentSchema);
