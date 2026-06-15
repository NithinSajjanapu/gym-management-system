const Member = require("../models/Member");
const MemberHistory = require("../models/MemberHistory");
const Payment = require("../models/Payment");
const sendWhatsAppMessage =
require("../utils/whatsappService");
const generateInvoice =
require("../utils/invoiceGenerator");

const getInvoiceUrl = (memberId) =>
  `http://localhost:5000/invoices/${memberId}.pdf`;

// =====================
// STATUS HELPER
// =====================
const getStatus = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "EXPIRED";
  if (diffDays <= 2) return "EXPIRING SOON";
  return "ACTIVE";
};

const getDaysRemaining = (endDate) => {

  const today = new Date();
  const end = new Date(endDate);

  today.setHours(0,0,0,0);
  end.setHours(0,0,0,0);

  const diff =
    Math.ceil(
      (end - today) /
      (1000 * 60 * 60 * 24)
    );

  return diff;
};
//new expiry API
exports.getExpiryMembers = async (req,res)=>{

  try{

    const filter = req.query.filter;

    let members = await Member.find();

    let result = members.map(m=>{

      const daysRemaining =
        getDaysRemaining(m.endDate);

      let status = "ACTIVE";

      if(daysRemaining < 0){
        status = "EXPIRED";
      }
      else if(daysRemaining <= 2){
        status = "EXPIRING";
      }

      let photoUrl = "";

      if(m.photo){

        const fileName =
          m.photo.split("/").pop();

        photoUrl =
          `http://localhost:5000/uploads/member_photos/${fileName}`;
      }

      return {

        ...m._doc,
        daysRemaining,
        status,
        photoUrl

      };

    });

    // SHOW ONLY 5 DAYS OR LESS

    result = result.filter(
      m => m.daysRemaining <= 5
    );

    // FILTERS

    if(filter){

      if(filter === "expired"){

        result =
          result.filter(
            m => m.daysRemaining < 0
          );

      }else{

        result =
          result.filter(
            m =>
            m.daysRemaining === Number(filter)
          );

      }

    }

    // SORT NEAREST EXPIRY FIRST

    result.sort(
      (a,b)=>
      a.daysRemaining - b.daysRemaining
    );

    res.json(result);

  }catch(err){

    res.status(500).json({
      error:err.message
    });

  }

};

//member details api

exports.getMemberById = async (req,res)=>{

  try{

    const member =
      await Member.findById(
        req.params.id
      );

    if(!member){

      return res.status(404).json({
        message:"Member not found"
      });

    }

    res.json(member);

  }catch(err){

    res.status(500).json({
      error: err.message
    });

  }

};
//whatsapp manual trigger api

exports.sendExpiryWhatsApp = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const days = getDaysRemaining(member.endDate);

    if (days > 2) {
      return res.status(400).json({
        message: "WhatsApp allowed only for <=2 days"
      });
    }

    const planText = `${member.workoutType} ${member.plan} MONTHS`;

    const message = `Hello ${member.name},

We regret to inform you that your membership to (${planText}) has expired in ${days < 0 ? "0" : days} days.

Please renew your membership as soon as possible.

Thank you,
VFC - Veer Fitness Club`;

    res.json({
      success: true,
      phone: member.phone,
      message
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// ADD MEMBER
// =====================
exports.addMember = async (req, res) => {
  try {

    const {
      name,
      phone,
      age,
      weight,
      gender,
      plan,
      workoutType,
      paymentMode,
      joinDate
    } = req.body;

    // PHOTO
    let photo =
  req.body.existingPhoto || "";

 

    if (req.file) {
      photo = `/uploads/member_photos/${req.file.filename}`;
    }

    if (!photo) {
      return res.status(400).json({
        message: "Photo is required"
      });
    }

    // JOIN DATE
    const startDate = joinDate
      ? new Date(joinDate)
      : new Date();

    // PLAN
    let months = 1;

    if (plan === "1") months = 1;
    else if (plan === "3") months = 3;
    else if (plan === "6") months = 6;
    else if (plan === "12") months = 12;

    // END DATE
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    // PRICE
    let amount = 0;

    if (workoutType === "STRENGTH") amount = 800;
    else if (workoutType === "CARDIO") amount = 1000;
    else if (workoutType === "BOTH") amount = 1500;

    amount = amount * months;

    // CREATE MEMBER
    const member = await Member.create({
      name,
      phone,
      age,
      weight,
      gender,
      photo,
      plan,
      startDate,
      endDate,
      workoutType,
      amount,
      status: "ACTIVE"
    });

    // PAYMENT ENTRY
    const payment =
      await Payment.create({

        memberId: member._id,
        name: member.name,
        amount,
        paymentMode

      });

      generateInvoice(member, payment);

      const invoiceUrl = getInvoiceUrl(member._id);

      payment.invoice = invoiceUrl;

      await payment.save(); 

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      invoice: invoiceUrl,
      member: {
        ...member.toObject(),
        invoice: invoiceUrl
      }
    });

  } catch (err) {
    console.log("ADD MEMBER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Failed to add member"
    });
  }
};
// =====================
// ALL MEMBERS
// =====================
exports.getAllMembers = async (req, res) => {
  try {

    const members = await Member.find()
      .sort({ createdAt: -1 });

    const updatedMembers = members.map(member => {

      let photoUrl = "";

      if (member.photo) {

        const fileName = member.photo.split("/").pop();

        photoUrl =
          `http://localhost:5000/uploads/member_photos/${fileName}`;
      }

      return {
        ...member._doc,
        status: getStatus(member.endDate),
        photoUrl
      };
    });

    res.json(updatedMembers);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// =====================
// EXPIRED MEMBERS
// =====================
exports.getExpiredMembers = async (req, res) => {
  try {
    const members = await Member.find();

    const expired = members.filter(
      m => getStatus(m.endDate) === "EXPIRED"
    );

    res.json(expired);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// EXPIRING SOON
// =====================
exports.getExpiringMembers = async (req, res) => {
  try {
    const members = await Member.find();

    const expiring = members.filter(
      m => getStatus(m.endDate) === "EXPIRING SOON"
    );

    res.json(expiring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// ACTIVE MEMBERS
// =====================
exports.getActiveMembers = async (req, res) => {
  try {
    const members = await Member.find();

    const active = members.filter(
      m => getStatus(m.endDate) === "ACTIVE"
    );

    res.json(active);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// DASHBOARD STATS
// =====================
exports.getDashboardStats = async (req, res) => {
  try {

    const members = await Member.find();
    const payments = await Payment.find();

    let totalMembers = members.length;
    let active = 0;
    let expired = 0;
    let expiring = 0;

    members.forEach(m => {
      const status = getStatus(m.endDate);

      if (status === "EXPIRED") expired++;
      else if (status === "EXPIRING SOON") expiring++;
      else active++;
    });

    let totalRevenue = 0;
    let upi = 0;
    let cash = 0;

    payments.forEach(p => {
      totalRevenue += p.amount;

      if (p.paymentMode === "UPI") upi += p.amount;
      else if (p.paymentMode === "CASH") cash += p.amount;
    });

    res.json({
      totalMembers,
      active,
      expired,
      expiring,
      totalRevenue,
      upi,
      cash
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// REVIEW / RENEW MEMBER
// =====================
exports.renewMember =
async (req,res)=>{

  try{

    const { id } = req.params;

    const {
      plan,
      paymentMode,
      joinDate
    } = req.body;

    const member =
      await Member.findById(id);

    if(!member){

      return res.status(404).json({
        message:"Member not found"
      });

    }

    let months = Number(plan) || 1;

    let newAmount = 0;

    if (member.workoutType === "STRENGTH") newAmount = 800;
    else if (member.workoutType === "CARDIO") newAmount = 1000;
    else if (member.workoutType === "BOTH") newAmount = 1500;

    newAmount = newAmount * months;

    await MemberHistory.create({

      memberId: member._id,

      oldPlan: member.plan,
      newPlan: plan,

      oldAmount: member.amount,
      newAmount,

      action: "RENEW"

    });

    const startDate =
      joinDate ? new Date(joinDate) : new Date();

    const endDate =
      new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() + months
    );

    member.plan = plan;
    member.startDate = startDate;
    member.endDate = endDate;
    member.amount = newAmount;
    member.status = "ACTIVE";

    await member.save();

    const payment = await Payment.create({

      memberId: member._id,

      name: member.name,

      amount: newAmount,

      paymentMode

    });

    generateInvoice(member, payment);

    const invoiceUrl = getInvoiceUrl(member._id);

    payment.invoice = invoiceUrl;

    await payment.save();

    res.json({

      success:true,
      invoice: invoiceUrl,
      member: {
        ...member.toObject(),
        invoice: invoiceUrl
      }

    });

  }catch(err){

    res.status(500).json({
      error:err.message
    });

  }

};

exports.updateMember = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedData = req.body;

    const member = await Member.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.json(member);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    await Member.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



