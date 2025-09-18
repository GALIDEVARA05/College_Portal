const User = require("../models/User");

// Get results for the logged-in student
const getMyResults = async (req, res) => {
  try {
    console.log("👉 req.user:", req.user);

    const user = await User.findById(req.user.id).select("rollNumber results");
    console.log("👉 Found user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // results are stored directly on the user doc
    res.json({ results: user.results || {} });
  } catch (err) {
    console.error("❌ Error in getMyResults:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get results by roll number (admin or student if same roll)
const getResultsByRoll = async (req, res) => {
  try {
    const hlno = req.params.hlno.trim().toUpperCase();
    const user = await User.findOne({ rollNumber: hlno }).select("rollNumber results");

    if (!user) {
      return res.status(404).json({ message: "Results not found" });
    }

    res.json({ results: user.results || {} });
  } catch (err) {
    console.error("❌ Error in getResultsByRoll:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMyResults, getResultsByRoll };
