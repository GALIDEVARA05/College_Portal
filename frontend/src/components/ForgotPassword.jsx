import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // ✅ Check if email exists and get role from backend
      const check = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/checkemail`, // ⬅ updated endpoint
        { email }
      );

      if (!check.data.exists) {
        toast.error("Email is not registered");
        setLoading(false);
        return;
      }

      const role = check.data.role || "user"; // 👈 get role from API

      // ✅ Send OTP
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email }
      );

      toast.success(res.data?.message || "OTP sent to your email");

      // ✅ Pass email & role to ResetPassword
      navigate("/reset-password", { state: { email, role } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-gray-300 flex flex-col px-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Back Button at top-left */}
      <div className="w-full max-w-6xl mt-4 mb-2">
        <button
          onClick={() => navigate("/user-login")}
          className="text-indigo-700 hover:text-indigo-900 text-lg font-semibold flex items-center"
        >
          ← Back
        </button>
      </div>

      {/* Centered Forgot Password Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Forgot Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
