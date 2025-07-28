const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  makeUserAdmin,
  removeAdminRole,
  updateAdminDetails,
} = require("../controllers/adminController"); // ✅ Make sure this path and function names are correct

// Make a user an admin (by main admin)
router.post("/make-admin", protect, isAdmin, makeUserAdmin);

// Remove admin rights
router.post("/remove-admin", protect, isAdmin, removeAdminRole);

// Update admin's own details
router.put("/update-profile", protect, isAdmin, updateAdminDetails);

module.exports = router;
