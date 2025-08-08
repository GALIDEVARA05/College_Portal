const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import route files
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: ['https://college-portal-z576.vercel.app'], // your Vercel frontend URL
  credentials: true,
}));/**/
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);     // Auth routes (login, register, etc.)
app.use("/api/admin", adminRoutes);   // Admin privilege management routes

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
