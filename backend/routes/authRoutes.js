const express = require('express'); 
const router = express.Router();
const  verifyToken  = require("../middleware/verifyToken");
// Importing controllers
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  adminLogin,
  checkEmailExists,
  logout,
  getProfile 
} = require('../controllers/authController');

// Routes for user authentication
router.post('/register', register);             // Only for user registration
router.post('/login', login);                   // User login
router.post('/forgot-password', forgotPassword); // Forgot password for all
router.post('/reset-password', resetPassword);   // Reset password with OTP
router.post('/check-email', checkEmailExists);
// Route for admin login (separate logic)
router.post('/admin-login', adminLogin);         // Dedicated admin login route
router.post('/logout', logout);
router.get("/profile", verifyToken, getProfile);


module.exports = router;
