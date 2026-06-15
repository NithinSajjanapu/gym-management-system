const Member = require("../models/Member");
const Payment = require("../models/Payment");

exports.getDashboard = async (req, res) => {
  try {

    const totalMembers = await Member.countDocuments();

    const activeMembers = await Member.countDocuments({
      status: "ACTIVE"
    });

    const expiredMembers = await Member.countDocuments({
      status: "EXPIRED"
    });

    const payments = await Payment.find();

    let totalRevenue = 0;
    let upiRevenue = 0;
    let cashRevenue = 0;

    payments.forEach(p => {

      totalRevenue += p.amount || 0;

      if (p.paymentMode === "UPI") {
        upiRevenue += p.amount || 0;
      }

      if (p.paymentMode === "CASH") {
        cashRevenue += p.amount || 0;
      }
    });

    // CURRENT MONTH REVENUE

    const now = new Date();

    const firstDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const monthlyPayments = await Payment.find({
      date: { $gte: firstDay }
    });

    let monthlyRevenue = 0;

    monthlyPayments.forEach(p => {
      monthlyRevenue += p.amount || 0;
    });

    res.json({
      totalMembers,
      activeMembers,
      expiredMembers,
      totalRevenue,
      monthlyRevenue,
      upiRevenue,
      cashRevenue
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};