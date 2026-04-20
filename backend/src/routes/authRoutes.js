const express = require("express");
const { body } = require("express-validator");
const { login, register } = require("../controllers/authController");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    handleValidation,
  ],
  register
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidation,
  ],
  login
);

module.exports = router;
