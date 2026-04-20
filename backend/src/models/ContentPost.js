const mongoose = require("mongoose");

const contentPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    scheduled_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContentPost", contentPostSchema);
