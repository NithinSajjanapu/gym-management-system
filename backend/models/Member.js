const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({

  name: String,
  phone: String,
  age: Number,
  weight: Number,

  gender: String,

  photo: String,

  plan: String,

  startDate: Date,
  endDate: Date,

  workoutType: {
    type: String,
    enum: ["STRENGTH", "CARDIO", "BOTH"]
  },

  amount: Number,

  status: {
    type: String,
    default: "ACTIVE"
  },

  registrationTime: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);