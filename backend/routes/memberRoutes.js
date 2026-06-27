const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const {
     protect, adminOnly 
    } = require("../middlewares/authMiddleware");

router.use(protect);
router.use(adminOnly);

const {
  addMember,
  getAllMembers,
  updateMember,
  deleteMember,
  getExpiredMembers,
  getExpiringMembers,
  getActiveMembers,
  getExpiryMembers,
  getMemberById,
  renewMember,
  sendExpiryWhatsApp
} = require("../controllers/memberController");
  

// extra routes (if used)

router.get("/expired", getExpiredMembers);
router.get("/expiring", getExpiringMembers);
router.get("/active", getActiveMembers);
router.post("/", upload.single("photo"), addMember);
router.get("/", getAllMembers);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);
router.get("/expiry-list",getExpiryMembers);
router.get("/:id",getMemberById);
router.post("/:id/send-whatsapp",sendExpiryWhatsApp);
router.post("/:id/renew",renewMember);



module.exports = router;