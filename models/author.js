const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

authorSchema.post("remove", async function (next) {
  const Blog = require("./blog");

  try {
    await Blog.deleteMany({ author: this._id }).exec();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Author", authorSchema);
