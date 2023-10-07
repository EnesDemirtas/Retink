const body = require("express-validator").body;

const createValidation = [
  // Id or comments should not be passed in the body
  (req, res, next) => {
    delete req.body._id;
    delete req.body.comments;
    next();
  },

  body("title").exists().withMessage("Title is a mandatory field"),
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("content").exists().withMessage("Content is a mandatory field"),
  body("content")
    .isLength({ min: 3 })
    .withMessage("Content must be at least 3 characters long"),
  body("author").exists().withMessage("Author is a mandatory field"),
  body("author").isMongoId().withMessage("Author must be a valid MongoId"),
];

const updateValidation = [
  // Id, comments, or author should not be passed in the body
  (req, res, next) => {
    delete req.body._id;
    delete req.body.comments;
    delete req.body.author;
    next();
  },

  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("content")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Content must be at least 3 characters long"),
];

module.exports = {
  createValidation,
  updateValidation,
};
