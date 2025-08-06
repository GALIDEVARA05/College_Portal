import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    rollNumber: '',
    year: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, form);
    toast.success("🎉 Registered Successfully!", {
      position: "top-right",
      autoClose: 2000,
      pauseOnHover: false,
      theme: "colored",
    });

    setTimeout(() => {
      navigate('/user-login');
    }, 2500);
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed');
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">User Registration</h2>
        
        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="branch"
          placeholder="Branch"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.branch}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="rollNumber"
          placeholder="Roll Number"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.rollNumber}
          onChange={handleChange}
          required
        />

        <select
          name="year"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.year}
          onChange={handleChange}
          required
        >
          <option value="">Select Year</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
        </select>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-200"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/user-login" className="text-purple-700 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default UserRegister;
