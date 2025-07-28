// adminController.js
const User = require("../models/User");
const bcrypt = require('bcryptjs');

// Make a user admin
// Make a user admin
const makeUserAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    // Get the logged-in user performing the action
    const requestingUser = await User.findById(req.user._id);

    if (!requestingUser || (requestingUser.role !== 'admin' && requestingUser.role !== 'main')) {
      return res.status(403).json({ message: "Only admins can assign admin roles" });
    }

    // Find the target user to be promoted
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent modifying the main admin
    if (user.role === 'main') {
      return res.status(403).json({ message: "Main admin role cannot be modified" });
    }

    // If already admin, prevent reassignment
    if (user.role === 'admin') {
      return res.status(400).json({ message: `${email} is already an admin` });
    }

    user.role = 'admin';
    await user.save();

    res.json({ message: `${email} is now an admin` });
  } catch (error) {
    console.error("Error in makeUserAdmin:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Remove admin rights
const removeAdminRole = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent demotion of main admin
    if (user.role === "main") {
      return res.status(403).json({ message: "Main admin cannot be demoted" });
    }

    if (user.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    user.role = "user";
    await user.save();

    res.json({ message: `${email} is no longer an admin` });
  } catch (error) {
    console.error("Error removing admin role:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Update admin's profile
const updateAdminDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: "Admin profile updated successfully",
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error in updateAdminDetails:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  makeUserAdmin,
  removeAdminRole,
  updateAdminDetails,
};
