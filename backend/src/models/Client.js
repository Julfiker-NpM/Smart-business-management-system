const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    status: {
      type: String,
      enum: ["lead", "active", "closed"],
      default: "lead",
    },
    last_contact_date: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
