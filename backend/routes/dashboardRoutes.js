const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", protect, adminOnly, getDashboard);

module.exports = router;