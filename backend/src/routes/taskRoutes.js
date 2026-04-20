const express = require("express");
const { body } = require("express-validator");
const { getTasks, createTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getTasks);
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("due_date").isISO8601().withMessage("Valid due_date is required"),
    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done", "overdue"])
      .withMessage("Invalid task status"),
    handleValidation,
  ],
  createTask
);

module.exports = router;
