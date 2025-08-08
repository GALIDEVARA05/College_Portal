import React from "react";
import { useNavigate } from "react-router-dom";

const NormalAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-8">Normal Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✅ Mark Attendance */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-3">📝 Mark Attendance</h2>
            <p className="text-gray-600 mb-4">Mark student attendance for each class session.</p>
            <button
              onClick={() => navigate("/mark-attendance")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Mark Now
            </button>
          </div>

          {/* ✅ View Attendance */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-3">📊 View Attendance</h2>
            <p className="text-gray-600 mb-4">Check attendance records and insights.</p>
            <button
              onClick={() => navigate("/view-attendance")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              View Records
            </button>
          </div>

          {/* ✅ Student Details */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-3">👥 Student Details</h2>
            <p className="text-gray-600 mb-4">Access and manage student profile information.</p>
            <button
              onClick={() => navigate("/student-details")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              View Students
            </button>
          </div>

          {/* ✅ Announcements */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-3">📢 Announcements</h2>
            <p className="text-gray-600 mb-4">Create and share important notices.</p>
            <button
              onClick={() => navigate("/announcements")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Post Announcement
            </button>
          </div>

          {/* ✅ Uploading Study Materials */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-3">📚 Study Materials</h2>
            <p className="text-gray-600 mb-4">Upload and manage course materials.</p>
            <button
              onClick={() => navigate("/upload-materials")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Upload Files
            </button>
          </div>

          {/* ✅ Time Table */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-3">🗓️ Time Table</h2>
            <p className="text-gray-600 mb-4">Manage and view class time schedules.</p>
            <button
              onClick={() => navigate("/time-table")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              View Time Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalAdminDashboard;
