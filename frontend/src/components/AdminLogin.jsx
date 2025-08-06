import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import {toast, Toaster } from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/admin-login`,
      {
        email,
        password,
      }
    );

    const { message, role, token } = response.data;

    if (role === "main") {
      toast.success("Main Admin logged in!");
      localStorage.setItem("token", token);
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } else if (role === "admin") {
      toast.success("Admin logged in!");
      localStorage.setItem("token", token);
      setTimeout(() => navigate("/normal-admin-dashboard"), 1000);
    } else {
      toast.error("Unauthorized role!");
    }
  } catch (err) {
    toast.error("Login failed. Invalid credentials.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Admin Login</h2>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not an admin?{" "}
          <Link to="/user-login" className="text-purple-600 hover:underline font-medium">
            Go to User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
