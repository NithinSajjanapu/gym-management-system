const Notification = require("../models/Notification");

// GET ALL NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  const data = await Notification.find().sort({ createdAt: -1 });
  res.json(data);
};

// MARK AS SENT
exports.markAsSent = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    sent: true
  });

  res.json({ message: "Marked as sent" });
};