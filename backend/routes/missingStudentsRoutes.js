const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { uploadMissingStudents } = require("../controllers/missingStudentsController");

router.post("/upload-missing-students", protect, isAdmin, ...uploadMissingStudents);

module.exports = router;
