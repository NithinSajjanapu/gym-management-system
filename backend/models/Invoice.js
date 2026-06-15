const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({

  memberId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  invoiceUrl: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Invoice", invoiceSchema);