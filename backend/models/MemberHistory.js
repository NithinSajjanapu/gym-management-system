const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({

  memberId: mongoose.Schema.Types.ObjectId,
  oldPlan: String,
  newPlan: String,
  oldAmount: Number,
  newAmount: Number,

  action: {
    type: String,
    enum: ["JOIN", "RENEW", "EXPIRE"]
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("MemberHistory", historySchema);