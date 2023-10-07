const body = require("express-validator").body;

const createValidation = [
  // Id or blogs should not be passed in the body
  (req, res, next) => {
    delete req.body._id;
    delete req.body.blogs;
    next();
  },

  body("full_name").exists().withMessage("Full name is a mandatory field"),
  body("full_name")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("email").exists().withMessage("Email is a mandatory field"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
];

const updateValidation = [
  // Id or blogs should not be passed in the body
  (req, res, next) => {
    delete req.body._id;
    delete req.body.blogs;
    next();
  },

  body("full_name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address"),
];

module.exports = {
  createValidation,
  updateValidation,
};
