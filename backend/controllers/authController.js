const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const Admin = require("../models/Admin");
const blacklist = new Set();
// Generate JWT11
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ User Registration (only role: user)
exports.register = async (req, res) => {
  try {
    const { name, email, password, branch, rollNumber, year } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail)
      return res.status(400).json({ message: 'Email already registered' });

    const existingUserByRoll = await User.findOne({ rollNumber });
    if (existingUserByRoll)
      return res.status(400).json({ message: 'Roll Number already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      branch,
      rollNumber,
      year,
      role: 'user' // Explicitly set role as user
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({ message: 'User registered', user, token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// ✅ User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ✅ Admin or Main Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await User.findOne({ email });

    if (!admin || (admin.role !== "admin" && admin.role !== "main")) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
      role: admin.role,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Forgot Password (Unchanged)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const emailBody = `<p>Your OTP to reset your password is: <strong>${otp}</strong></p>`;
    await sendEmail(email, 'Password Reset OTP', emailBody);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// ✅ Reset Password (Unchanged)
exports.resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({ message: 'OTP and new password are required' });
    }

    const user = await User.findOne({ otp });
    if (!user || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ exists: false, message: 'Email not found' });
    }

    return res.status(200).json({ exists: true, message: 'Email exists' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Optionally verify token (not strictly necessary just to blacklist it)
    jwt.verify(token, process.env.JWT_SECRET);

    // Add token to blacklist
    blacklist.add(token);

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Utility function for middleware
exports.getProfile = async (req, res) => {
  try {
    const { id, type } = req.user;

    if (type === 'user') {
      const user = await User.findById(id);
      if (user) return res.status(200).json({ role: user.role, data: user });
    } else if (type === 'admin') {
      const admin = await Admin.findById(id);
      if (admin) return res.status(200).json({ role: "admin", data: admin });
    }

    return res.status(404).json({ message: "Profile not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};
