import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const fetchAdminProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const admin = res.data.data;

    setAdminData(admin);
    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
    });
    localStorage.setItem("user", JSON.stringify(admin));
  } catch (err) {
    console.error("Error fetching admin profile", err);
  }
};


  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("👋 Logged out successfully!", {
      position: "top-center",
      autoClose: 3000,
    });

    setTimeout(() => {
      navigate("/admin-login");
    }, 3000);
  };

  const handleProfileUpdate = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
  `${import.meta.env.VITE_API_URL}/api/admin/update-profile`,
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 👇 Instead of trying to extract data that doesn't exist
    if (res.data.message === "Profile updated successfully") {
      toast.success("✅ Profile updated successfully!");
      // Optional: fetch updated profile again from server
      fetchAdminProfile(); // Refresh UI
      setShowProfileForm(false);
    } else {
      toast.error("❌ Unexpected server response.");
    }

  } catch (err) {
    console.error("Update error:", err.response?.data || err.message);
    toast.error(
      `❌ Failed to update profile: ${err.response?.data?.message || "Server error"}`
    );
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center py-10 px-6 relative">
      <ToastContainer />

      {/* Profile Icon */}
      <div className="absolute top-6 right-6">
        <button onClick={() => setShowProfileInfo(true)}>
          <FaUserCircle className="text-4xl text-indigo-700 hover:text-indigo-900 transition" />
        </button>
      </div>

      {/* Profile Info Modal */}
      {showProfileInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">Admin Info</h2>
            <p className="text-gray-800 mb-4 text-center">
              <strong>Email:</strong> {adminData.email || "N/A"}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowProfileInfo(false);
                  setShowProfileForm(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Update Profile
              </button>
              <button
                onClick={() => setShowProfileInfo(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Update Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">Update Profile</h2>

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Cards */}
      <h1 className="text-4xl font-bold text-indigo-800 mb-8">Welcome, Admin 🎩</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">📄 Upload PDF</h2>
          <p className="text-gray-600 mb-4">Upload semester-wise academic PDFs.</p>
          <button
            onClick={() => navigate("/upload-pdf")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go to Upload
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">📚 View Portals</h2>
          <p className="text-gray-600 mb-4">Browse and manage existing portals.</p>
          <button
            onClick={() => navigate("/view-portals")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            View Portals
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">👥 Manage Users</h2>
          <p className="text-gray-600 mb-4">Edit or remove user access & details.</p>
          <button
            onClick={() => navigate("/manage-users")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Manage Users
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
