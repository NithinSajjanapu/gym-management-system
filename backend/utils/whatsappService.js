const sendWhatsAppMessage = async (phone, message) => {
  try {

    // ⚠️ THIS IS PLACEHOLDER FOR REAL API (Twilio / Meta API)
    console.log("📲 Sending WhatsApp Message");
    console.log("To:", phone);
    console.log("Message:", message);

    return true;

  } catch (err) {
    console.log("WhatsApp Error:", err.message);
    return false;
  }
};

module.exports = sendWhatsAppMessage;