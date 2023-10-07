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

commentSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    const Blog = require("./blog");
    const User = require("./user");

    try {
      await Blog.findByIdAndUpdate(doc.blog, {
        $pull: { comments: doc._id },
      }).exec();
      await User.findByIdAndUpdate(doc.user, {
        $pull: { comments: doc._id },
      }).exec();
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("Comment", commentSchema);
