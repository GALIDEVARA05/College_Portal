const express = require('express'); 
const router = express.Router();
// Importing controllers
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  adminLogin 
} = require('../controllers/authController');

// Routes for user authentication
router.post('/register', register);             // Only for user registration
router.post('/login', login);                   // User login
router.post('/forgot-password', forgotPassword); // Forgot password for all
router.post('/reset-password', resetPassword);   // Reset password with OTP

// Route for admin login (separate logic)
router.post('/admin-login', adminLogin);         // Dedicated admin login route

module.exports = router;
