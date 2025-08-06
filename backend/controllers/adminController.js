const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Make a user admin
const makeUserAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const requestingUser = await User.findById(req.user._id);

    if (!requestingUser || (requestingUser.role !== "admin" && requestingUser.role !== "main")) {
      return res.status(403).json({ message: "Only admins can assign admin roles" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "main") {
      return res.status(403).json({ message: "Main admin role cannot be modified" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: `${email} is already an admin` });
    }

    user.role = "admin";
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
    if (!user) return res.status(404).json({ message: "User not found" });

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

// Special: Transfer main role to another email
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const currentAdmin = await User.findById(req.user._id);
    if (!currentAdmin || currentAdmin.role !== "main") {
      return res.status(403).json({ message: "Only main admin can perform this action" });
    }

    const newMainUser = await User.findOne({ email });
    if (!newMainUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Update role transfer
    currentAdmin.role = "user";
    await currentAdmin.save();

    newMainUser.name = name || newMainUser.name;
    newMainUser.password = password ? await bcrypt.hash(password, 10) : newMainUser.password;
    newMainUser.role = "main";
    await newMainUser.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "main"] } }, "name email role");
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  makeUserAdmin,
  removeAdminRole,
  updateProfile,
  getAllAdmins,
};
