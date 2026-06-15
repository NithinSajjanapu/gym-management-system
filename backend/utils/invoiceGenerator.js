const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../invoices");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function drawRow(doc, y, label, value, shaded = false) {
  if (shaded) {
    doc.rect(55, y - 6, 500, 28).fill("#fff7df");
  }

  doc
    .fillColor("#4b5563")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(label, 70, y, { width: 170 });

  doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(11)
    .text(value || "-", 250, y, { width: 280 });
}

const generateInvoice = (member, payment) => {
  const fileName = `${member._id}.pdf`;
  const filePath = path.join(dir, fileName);
  const doc = new PDFDocument({
    size: "A4",
    margin: 45
  });

  doc.pipe(fs.createWriteStream(filePath));

  doc.rect(0, 0, 595.28, 130).fill("#111827");
  doc.circle(84, 65, 34).fill("#facc15");
  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("VF", 68, 54);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("VEER FITNESS CLUB", 130, 42);

  doc
    .fillColor("#facc15")
    .font("Helvetica")
    .fontSize(11)
    .text("Strength • Cardio • Transformation", 132, 75);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("INVOICE", 440, 42, { width: 100, align: "right" });

  doc
    .fillColor("#d1d5db")
    .font("Helvetica")
    .fontSize(10)
    .text(`Invoice ID: ${String(payment._id || member._id).slice(-8).toUpperCase()}`, 360, 72, {
      width: 180,
      align: "right"
    })
    .text(`Date: ${formatDate(payment.date)}`, 360, 88, {
      width: 180,
      align: "right"
    });

  doc.roundedRect(45, 155, 505, 90, 8).fillAndStroke("#ffffff", "#facc15");
  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Billed To", 65, 172);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#111827")
    .text(member.name || "-", 65, 195);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#4b5563")
    .text(`Phone: ${member.phone || "-"}`, 65, 220);

  doc
    .roundedRect(45, 270, 505, 235, 8)
    .fillAndStroke("#ffffff", "#e5e7eb");

  doc
    .rect(45, 270, 505, 42)
    .fill("#facc15");

  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Membership Details", 65, 284);

  drawRow(doc, 335, "Workout Type", member.workoutType, true);
  drawRow(doc, 372, "Plan", `${member.plan || "-"} Month(s)`);
  drawRow(doc, 409, "Start Date", formatDate(member.startDate), true);
  drawRow(doc, 446, "Expiry Date", formatDate(member.endDate));
  drawRow(doc, 483, "Payment Mode", payment.paymentMode || "-", true);

  doc.roundedRect(310, 535, 240, 80, 8).fill("#111827");
  doc
    .fillColor("#facc15")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("TOTAL PAID", 330, 555);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text(`Rs. ${payment.amount || member.amount || 0}`, 330, 575);

  doc
    .fillColor("#4b5563")
    .font("Helvetica")
    .fontSize(10)
    .text("Thank you for choosing Veer Fitness Club. Please keep this invoice for your records.", 55, 655, {
      width: 485,
      align: "center"
    });

  doc
    .moveTo(55, 690)
    .lineTo(540, 690)
    .strokeColor("#e5e7eb")
    .stroke();

  doc
    .fillColor("#6b7280")
    .fontSize(9)
    .text("This is a computer generated invoice.", 55, 710, {
      width: 485,
      align: "center"
    });

  doc.end();

  return filePath;
};

module.exports = generateInvoice;
