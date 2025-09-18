const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const missingStudentsRoutes = require("./routes/missingStudentsRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resultsRoutes = require("./routes/resultsRoutes");

console.log("Loaded resultsRoutes:", resultsRoutes);

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// 🚀 Increase body size + handle timeouts
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

// Increase timeout for all requests
app.use((req, res, next) => {
  res.setTimeout(10 * 60 * 1000); // 10 minutes
  next();
});

/**
 * 🚀 IMPORTANT:
 * Mount adminRoutes before express.json()
 * so file uploads (multipart/form-data) won't get broken
 */
app.use("/api/admin", adminRoutes);
app.use("/api", missingStudentsRoutes);

// Other routes
app.use("/api/auth", authRoutes);
app.use("/api/results", resultsRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Increase socket timeout as well (backend side)
server.setTimeout(600000);
