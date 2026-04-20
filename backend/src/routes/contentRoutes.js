const express = require("express");
const { body } = require("express-validator");
const { getContent, createContent } = require("../controllers/contentController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getContent);
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("platform").trim().notEmpty().withMessage("Platform is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("scheduled_date").isISO8601().withMessage("Valid scheduled_date is required"),
    body("status")
      .optional()
      .isIn(["draft", "scheduled", "published"])
      .withMessage("Invalid content status"),
    handleValidation,
  ],
  createContent
);

module.exports = router;
