const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Auth middleware - protect routes
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'main')) {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};


module.exports = { protect, isAdmin };
