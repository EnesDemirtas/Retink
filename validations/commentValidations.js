const body = require("express-validator").body;

const createValidation = [
  // Id should not be passed in the body
  (req, res, next) => {
    delete req.body._id;
  },

  body("blog").exists().withMessage("Blog is a mandatory field"),
  body("blog").isMongoId().withMessage("Blog must be a valid MongoId"),
  body("content").exists().withMessage("Content is a mandatory field"),
  body("content")
    .isLength({ min: 2 })
    .withMessage("Content must be at least 2 characters long"),
  body("user").exists().withMessage("User is a mandatory field"),
  body("user").isMongoId().withMessage("User must be a valid MongoId"),
];

const updateValidation = [
  // Id, blog or user should not be passed in the body
  (req, res, next) => {
    delete req.body._id;
    delete req.body.blog;
    delete req.body.user;
    next();
  },
  body("content")
    .exists()
    .isLength({ min: 2 })
    .withMessage("Content must be at least 2 characters long"),
];

module.exports = {
  createValidation,
  updateValidation,
};
