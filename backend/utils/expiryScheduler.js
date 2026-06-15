const cron = require("node-cron");
const Member = require("../models/Member");
const Notification = require("../models/Notification");
const sendWhatsAppMessage = require("./whatsappService");

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {

  try {

    console.log("🔁 Expiry Scheduler Running...");

    const today = new Date();
    const members = await Member.find();

    for (let m of members) {

      if (!m.endDate) continue; // ✅ safety check

      const endDate = new Date(m.endDate);

      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let type = null;
      let message = null;

      // --------------------
      // EXPIRY LOGIC
      // --------------------

      if (diffDays === 2) {
        type = "2-day";
        message = `${m.name} expires in 2 days`;
      }

      else if (diffDays === 1) {
        type = "1-day";
        message = `${m.name} expires tomorrow`;
      }

      else if (diffDays <= 0) {
        type = "expired";
        message = `${m.name} membership expired`;

        if (m.status !== "EXPIRED") {
          m.status = "EXPIRED";
          await m.save();
        }
      }

      // --------------------
      // ONLY CHECK DUPLICATE IF TYPE EXISTS
      // --------------------

      if (!type) continue;

      const existing = await Notification.findOne({
        memberId: m._id,
        type: type,
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      });

      if (existing) continue;

      // --------------------
      // CREATE NOTIFICATION
      // --------------------
     
      await Notification.create({
        memberId: m._id,
        type,
        message,
        sent: false
      });
      await sendWhatsAppMessage(m.phone, message);
      console.log("📩 Notification saved:", message);
    }

  } catch (err) {
    console.log("Scheduler Error:", err.message);
  }

});