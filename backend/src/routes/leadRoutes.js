const express = require("express");
const { body } = require("express-validator");
const { getLeads, createLead, updateLead } = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getLeads);
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Lead name is required"),
    body("status")
      .optional()
      .isIn(["new", "contacted", "qualified", "proposal", "won", "lost"])
      .withMessage("Invalid lead status"),
    handleValidation,
  ],
  createLead
);
router.put(
  "/:id",
  [
    body("status")
      .optional()
      .isIn(["new", "contacted", "qualified", "proposal", "won", "lost"])
      .withMessage("Invalid lead status"),
    body("name").optional().trim().notEmpty().withMessage("Lead name cannot be empty"),
    handleValidation,
  ],
  updateLead
);

module.exports = router;
