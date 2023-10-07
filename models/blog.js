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

blogSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    const Comment = require("./comment");
    const Author = require("./author");
    const User = require("./user");

    try {
      const comment_ids = await Comment.find({ blog: doc._id }).exec();
      const user_ids = await User.find({
        comments: { $in: comment_ids },
      }).exec();
      await User.updateMany(
        { _id: { $in: user_ids } },
        { $pull: { comments: { $in: comment_ids } } }
      ).exec();
      await Comment.deleteMany({ blog: doc._id }).exec();
      await Author.findByIdAndUpdate(doc.author, {
        $pull: { blogs: doc._id },
      }).exec();
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("Blog", blogSchema);
