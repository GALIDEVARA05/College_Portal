// backend/models/Result.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subcode: String,
  subname: String,
  internals: String,
  grade: String,
  credits: Number,
});

const resultSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, index: true },
    semester: { type: String },
    examType: { type: String },
    college: { type: String },
    subjects: [subjectSchema],
    meta: { type: Object },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
