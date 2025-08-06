import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiLogOut } from "react-icons/fi";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ✅ Ref to detect outside click

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout request failed:", err.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("✅ Logged out successfully");

    setTimeout(() => {
      navigate("/user-login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4 relative">

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ✅ Profile Dropdown */}
      <div className="absolute top-4 right-6" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-4xl text-blue-700 focus:outline-none"
            title="Profile"
          >
            <FaUserCircle />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg w-64 z-50 py-4 px-5">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-gray-600">Welcome,</h2>
                <p className="text-base font-bold text-indigo-700 truncate">
                  {user?.name || "User"}
                </p>
              </div>

              <hr className="border-gray-200 mb-3" />

              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">📧</span>
                <p className="text-sm text-gray-800 truncate">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 border border-red-100 bg-white text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-indigo-800 mb-8">Student Dashboard</h1>

      {/* ✅ Main Dashboard Content */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8">
          Welcome, {user?.name || "User"} 🎓
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 🎓 Results Portal */}
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">🎓 Results Portal</h2>
            <p className="text-gray-600 mb-4">Check your academic performance and grades.</p>
            <button
              onClick={() => navigate("/results")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              View Results
            </button>
          </div>

          {/* 📊 Attendance Status */}
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">📊 Attendance Status</h2>
            <p className="text-gray-600 mb-4">Monitor your attendance records and stats.</p>
            <button
              onClick={() => navigate("/attendance")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Check Attendance
            </button>
          </div>

          {/* 💸 Payments */}
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">💸 Payments</h2>
            <p className="text-gray-600 mb-4">Make payments for semester fees and others.</p>
            <button
              onClick={() => navigate("/payments")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Go to Payments
            </button>
          </div>

          {/* 🧾 Fee Dues */}
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">🧾 Fee Dues</h2>
            <p className="text-gray-600 mb-4">Check your pending fee dues and details.</p>
            <button
              onClick={() => navigate("/fee-dues")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              View Dues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
