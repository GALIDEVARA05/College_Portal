// middleware/verifyAdmin.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = admin; // attach admin data to request
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyAdmin;
