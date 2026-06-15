const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ✅ FIX: correct absolute safe path
const uploadPath = path.join(__dirname, "../uploads/member_photos");

// create folder if not exists
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;