const mongoose = require("mongoose");

const missingStudentSchema = new mongoose.Schema({
  htno: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: String,
  branch: String,
  year: String
}, { timestamps: true });

module.exports = mongoose.model("MissingStudent", missingStudentSchema);
