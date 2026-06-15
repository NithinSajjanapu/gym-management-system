const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true
  },

  type: {
    type: String,
    enum: ["2-day", "1-day", "expired"],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING"
  },

  sentAt: {
    type: Date,
    default: null
  },

  attemptCount: {
    type: Number,
    default: 0
  },

  lastAttemptAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Notification", notificationSchema);