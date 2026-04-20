const express = require("express");
const { body } = require("express-validator");
const {
  getMessages,
  createMessage,
  getTemplates,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getMessages);
router.post(
  "/",
  [
    body("client_id").notEmpty().withMessage("client_id is required"),
    body("message_text").trim().notEmpty().withMessage("message_text is required"),
    body("type").isIn(["sent", "received"]).withMessage("Message type must be sent or received"),
    handleValidation,
  ],
  createMessage
);
router.get("/templates", getTemplates);

module.exports = router;
