const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  branch: String,
  rollNumber: { type: String, unique: true },
  year: String,
  otp: String,
  otpExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'main'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
