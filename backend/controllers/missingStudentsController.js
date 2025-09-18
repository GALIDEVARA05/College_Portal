const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { execFile } = require("child_process");
const MissingStudent = require("../models/MissingStudent"); // new DB model for missing students

// Multer config
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Route handler
const uploadMissingStudents = [
  upload.single("pdf"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const pdfPath = req.file.path;
    const pyScript = path.join(__dirname, "..", "utils", "upload_missing_students.py");

    execFile("python", [pyScript, pdfPath], async (err, stdout, stderr) => {
      fs.unlinkSync(pdfPath); // cleanup uploaded PDF

      if (err) {
        console.error("Python error:", stderr || err);
        return res.status(500).json({ message: "Python execution failed", detail: stderr || err.message });
      }

      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch (e) {
        console.error("JSON parse error:", e);
        return res.status(500).json({ message: "Invalid JSON from Python script" });
      }

      try {
        // 1️⃣ Clear old records before inserting
        await MissingStudent.deleteMany({});

        // 2️⃣ Insert new records
        const inserted = await MissingStudent.insertMany(parsed);

        res.json({
          message: "Missing students updated successfully",
          addedCount: inserted.length
        });
      } catch (dbErr) {
        console.error("DB error:", dbErr);
        res.status(500).json({ message: "Database error", detail: dbErr.message });
      }
    });
  }
];

module.exports = { uploadMissingStudents };
