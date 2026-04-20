const express = require("express");
const { body } = require("express-validator");
const { getMeetings, createMeeting } = require("../controllers/meetingController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getMeetings);
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Meeting title is required"),
    body("date").isISO8601().withMessage("Valid meeting date is required"),
    body("time").trim().notEmpty().withMessage("Meeting time is required"),
    handleValidation,
  ],
  createMeeting
);

module.exports = router;
