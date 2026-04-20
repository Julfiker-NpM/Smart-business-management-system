const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    message_text: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
    type: { type: String, enum: ["sent", "received"], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
