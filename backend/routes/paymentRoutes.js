const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  addPayment,
  getPayments,
  getPaymentsByDate
} = require("../controllers/paymentController");


router.use(protect);
router.use(adminOnly);
// ADD PAYMENT
router.post("/", addPayment);

// GET ALL PAYMENTS
router.get("/", getPayments);

// DATE FILTER
router.get("/filter", getPaymentsByDate);

module.exports = router;