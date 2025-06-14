const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["added", "updated", "removed"],
    required: true,
  },
  message: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
