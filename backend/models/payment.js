const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  memberId: mongoose.Schema.Types.ObjectId,

  name: String,

  amount: Number,

  paymentMode: {
    type: String,
    enum: ["UPI", "CASH"]
  },

  invoice: String,

  date: {
    type: Date,
    default: Date.now
  }

});
module.exports = mongoose.model("Payment", paymentSchema);