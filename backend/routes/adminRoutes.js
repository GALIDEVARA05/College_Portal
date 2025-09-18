const express = require("express");
const multer = require("multer");
const { protect, isAdmin, isMainAdmin } = require("../middleware/authMiddleware");
const { makeUserAdmin, removeAdminRole, getAllAdmins, updateProfile } = require("../controllers/adminController");
const { uploadPdfAndProcess } = require("../controllers/resultUploadController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/make-admin", protect, isAdmin, makeUserAdmin);
router.post("/remove-admin", protect, isAdmin, removeAdminRole);
router.put("/update-profile", protect, isAdmin, updateProfile);
router.get("/all-admins", protect, isAdmin, getAllAdmins);

// 🚨 Only main admin can upload results
router.post("/upload-pdf", protect, isMainAdmin, upload.single("pdf"), uploadPdfAndProcess);

module.exports = router;