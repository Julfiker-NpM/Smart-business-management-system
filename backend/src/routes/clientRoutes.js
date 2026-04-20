const express = require("express");
const { body } = require("express-validator");
const {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getClients);
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Client name is required"),
    body("status").optional().isIn(["lead", "active", "closed"]).withMessage("Invalid status"),
    handleValidation,
  ],
  createClient
);
router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("status").optional().isIn(["lead", "active", "closed"]).withMessage("Invalid status"),
    handleValidation,
  ],
  updateClient
);
router.delete("/:id", deleteClient);

module.exports = router;
