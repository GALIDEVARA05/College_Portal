// src/pages/NormalAdminDashboard.jsx
import React from "react";

const NormalAdminDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">Normal Admin Dashboard</h1>
        <p className="text-gray-700">
          Welcome, Admin! You have limited administrative access.
        </p>
      </div>
    </div>
  );
};

export default NormalAdminDashboard;
