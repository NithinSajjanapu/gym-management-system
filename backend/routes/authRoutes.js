const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin
} = require("../controllers/authController");

const {
  getExpiredMembers,
  getExpiringMembers,
  getActiveMembers
} = require("../controllers/memberController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/expired", getExpiredMembers);
router.get("/expiring", getExpiringMembers);
router.get("/active", getActiveMembers);

module.exports = router;