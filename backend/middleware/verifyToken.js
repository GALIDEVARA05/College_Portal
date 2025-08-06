const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require('../models/User');
const Admin = require('../models/Admin');
dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(403).json({ error: 'No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try finding in User collection
    let user = await User.findById(decoded.id);
    if (user) {
      req.user = { id: user._id, role: user.role, type: 'user' };
      return next();
    }

    // Try finding in Admin collection
    let admin = await Admin.findById(decoded.id);
    if (admin) {
      req.user = { id: admin._id, role: "admin", type: 'admin' };
      return next();
    }

    return res.status(404).json({ error: 'User not found.' });

  } catch (err) {
    res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = verifyToken;
