import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
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

  // Always clear localStorage and redirect (even if request fails)
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/user-login");
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4 relative">

      {/* ✅ Profile Dropdown */}
      <div className="absolute top-4 right-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-3xl text-blue-700 focus:outline-none"
          >
            <FaUserCircle />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50 px-4 w-fit max-w-sm">
              <p className="py-2 text-sm text-gray-800 border-b whitespace-nowrap overflow-auto">
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome, {user?.username || "User"}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">You are successfully logged in.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg shadow overflow-x-auto">
            <p className="text-gray-800 whitespace-nowrap">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg shadow">
            <p className="text-gray-800">
              <strong>Phone:</strong> {user?.phone || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
