import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!value) {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
      return;
    }

    // ✅ Handle full OTP paste inside onChange too
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const updated = [...otp];
      for (let i = 0; i < 6; i++) {
        updated[i] = pasted[i] || "";
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = pasted[i] || "";
        }
      }
      setOtp(updated);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    // ✅ Handle single digit input
    if (!/^\d$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split("");
    const updated = [...otp];
    for (let i = 0; i < 6; i++) {
      updated[i] = digits[i] || "";
    }
    setOtp(updated);
    inputRefs.current.forEach((ref, idx) => {
      if (ref) ref.value = updated[idx] || "";
    });
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6 || !newPassword || !email) {
      toast.error("Please fill all fields correctly", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
  email,
  otp: fullOtp,
  newPassword,
});

      toast.success(res.data?.message || "Reset Successfully", { position: "top-center" });

      setTimeout(() => navigate("/user-login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center px-4">
      <ToastContainer />
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[i] = el)}
                className="w-10 h-10 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
              />
            ))}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
