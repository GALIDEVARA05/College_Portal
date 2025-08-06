import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const [emailToAdd, setEmailToAdd] = useState("");
  const [admins, setAdmins] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState("");

  const navigate = useNavigate();

  // Fetch all admins
  useEffect(() => {
  const fetchAdmins = async () => {
    try {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/all-admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const adminsList = Array.isArray(res.data) 
    ? res.data 
    : res.data.admins || [];

  setAdmins(adminsList);
}
catch (err) {
      console.error("ERROR FETCHING ADMINS:", err.response?.data || err.message);
      toast.error("Failed to fetch admins");
    }
  };

  fetchAdmins();
}, [refresh]);


  // Make Admin Handler
  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
await axios.post(
  `${import.meta.env.VITE_API_URL}/api/admin/make-admin`,
  { email: emailToAdd },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      toast.success("✅ Admin created successfully!");
      setEmailToAdd("");

      // ✅ Re-fetch updated list (corrected here)
      const updated = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/all-admins`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      setAdmins(updated.data); // ✅ fix here
    } catch (err) {
      toast.error("❌ Failed to make admin");
    }
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setConfirmEmail("");
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmEmail !== selectedAdmin.email) {
      toast.warning("Emails do not match. Deletion cancelled.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
await axios.post(
  `${import.meta.env.VITE_API_URL}/api/admin/remove-admin`,
  { email: selectedAdmin.email },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      toast.success("🗑️ Admin removed successfully!");
      setShowModal(false);
      setRefresh(!refresh); // ✅ trigger re-fetch
    } catch (err) {
      toast.error("❌ Failed to remove admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center py-10 px-6">
      <ToastContainer />

      <div className="w-full max-w-4xl mb-2">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="text-indigo-700 hover:text-indigo-900 font-semibold flex items-center mb-4"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Manage Admins 👥</h2>

      {/* Form to make admin */}
      <form
        onSubmit={handleMakeAdmin}
        className="bg-white p-6 rounded-xl shadow-md mb-8 w-full max-w-md"
      >
        <label className="block text-gray-700 font-semibold mb-2">
          Enter Email to Make Admin
        </label>
        <input
          type="email"
          required
          value={emailToAdd}
          onChange={(e) => setEmailToAdd(e.target.value)}
          placeholder="example@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Make Admin
        </button>
      </form>

      {/* Admins List */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl overflow-auto">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Current Admins</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="border-b py-2">Name</th>
              <th className="border-b py-2">Email</th>
              <th className="border-b py-2">Role</th>
              <th className="border-b py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No admins found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="py-2">{admin.name || "N/A"}</td>
                  <td className="py-2">{admin.email}</td>
                  <td className="py-2">{admin.role || "admin"}</td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => openDeleteModal(admin)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove Admin"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Admin Removal</h3>
            <p className="mb-2">
              To confirm deletion of <strong>{selectedAdmin?.name || "this admin"}</strong>,
              please enter their email:
            </p>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              placeholder="Enter email to confirm"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
