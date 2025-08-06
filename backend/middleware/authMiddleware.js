const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "main")) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = { protect, isAdmin };
