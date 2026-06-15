const express = require("express");
const router = express.Router();

const {
  addPayment,
  getPayments,
  getPaymentsByDate
} = require("../controllers/paymentController");

// ADD PAYMENT
router.post("/", addPayment);

// GET ALL PAYMENTS
router.get("/", getPayments);

// DATE FILTER
router.get("/filter", getPaymentsByDate);

module.exports = router;