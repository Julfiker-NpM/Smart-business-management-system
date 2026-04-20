const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    due_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done", "overdue"],
      default: "todo",
    },
    related_client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },
    related_lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
