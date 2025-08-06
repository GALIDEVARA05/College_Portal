const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  makeUserAdmin,
  removeAdminRole,
  getAllAdmins,
  updateProfile,
} = require("../controllers/adminController");

router.post("/make-admin", protect, isAdmin, makeUserAdmin);
router.post("/remove-admin", protect, isAdmin, removeAdminRole);
router.put("/update-profile", protect, isAdmin, updateProfile);
router.get("/all-admins", protect, isAdmin, getAllAdmins);

module.exports = router;
