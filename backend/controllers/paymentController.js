const Payment = require("../models/Payment");
const Member = require("../models/Member");
const generateInvoice = require("../utils/invoiceGenerator.js");
// =====================
// ADD PAYMENT
// =====================
exports.addPayment = async (req, res) => {
  try {
    const { memberId, paymentMode } = req.body;

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const payment = await Payment.create({
      memberId,
      name: member.name,
      amount: member.amount,
      paymentMode
    });

    const invoicePath = generateInvoice(member, payment);

    payment.invoice = invoicePath;
    await payment.save();

    res.json({
      message: "Payment recorded successfully",
      payment
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  const file = generateInvoice(member, payment);
};

// =====================
// GET ALL PAYMENTS
// =====================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// MONTHLY REVENUE
// =====================
exports.monthlyRevenue = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const payments = await Payment.find({
      createdAt: { $gte: start }
    });

    const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      month: start.toISOString().slice(0, 7),
      total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// DATE RANGE REVENUE
// =====================
exports.getPaymentsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(23, 59, 59, 999);

    const payments = await Payment.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    });

    const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      total,
      count: payments.length,
      payments
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};