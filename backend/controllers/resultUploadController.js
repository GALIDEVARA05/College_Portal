const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const User = require("../models/User");

exports.uploadPdfAndProcess = async (req, res) => {
  console.log("📥 Upload handler called");

  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const pdfPath = req.file.path;

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const outputPath = path.join(uploadDir, `parsed_${Date.now()}.json`);
    const pyScript = path.join(__dirname, "..", "utils", "parse_results.py");

    console.log("📄 PDF path to parse:", pdfPath);
    console.log("📄 Output JSON path:", outputPath);

    // Cross-platform Python command
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    const py = spawn(pythonCmd, [pyScript, pdfPath, outputPath], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    // ✅ Stream logs from Python in real-time
    py.stdout.on("data", (data) => {
      console.log(`[Parser Log]: ${data.toString().trim()}`);
    });

    py.stderr.on("data", (data) => {
      console.error(`[Parser Error]: ${data.toString().trim()}`);
    });

    py.on("close", async (code) => {
      console.log(`📦 Parser finished with code ${code}`);

      try {
        // Remove temp PDF
        try { fs.unlinkSync(pdfPath); } catch {}

        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({
            message: "Parsing failed: No output file generated",
            detail: "Check parser logs above in Node console",
          });
        }

        const parsed = JSON.parse(fs.readFileSync(outputPath, "utf8"));
        fs.unlinkSync(outputPath); // cleanup

        const semester = parsed.meta?.semester;
        const examType = parsed.meta?.exam_type;
        const rows = parsed.rows || [];

        if (!semester) {
          return res.status(400).json({ message: "Semester could not be determined" });
        }

        // Group by hall ticket number
        const byHtno = {};
        for (const r of rows) {
          const ht = r.hlno?.trim()?.toUpperCase();
          if (!ht) continue;
          if (!byHtno[ht]) byHtno[ht] = [];
          byHtno[ht].push({
            sno: r.sno,
            subcode: r.subcode,
            subname: r.subname,
            internals: r.internals,
            grade: r.grade,
            credits: r.credits,
          });
        }

        // ✅ Bulk write for performance
        const operations = [];
        for (const htno of Object.keys(byHtno)) {
          const update =
            examType === "Supplementary"
              ? { $set: { [`results.${semester}`]: byHtno[htno] } } // overwrite
              : { $set: { [`results.${semester}`]: byHtno[htno] } }; // always set

          operations.push({
            updateOne: {
              filter: { rollNumber: htno },
              update,
              upsert: false,
            },
          });
        }

        let bulkResult = { matchedCount: 0, modifiedCount: 0 };
        if (operations.length > 0) {
          bulkResult = await User.bulkWrite(operations, { ordered: false });
        }

        res.json({
          message: "✅ Processing complete",
          semester,
          examType,
          processed: rows.length,
          matched: bulkResult.matchedCount,
          modified: bulkResult.modifiedCount,
        });
      } catch (err) {
        console.error("❌ Error in uploadPdfAndProcess:", err);
        res.status(500).json({ message: "Processing failed", error: err.message });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
