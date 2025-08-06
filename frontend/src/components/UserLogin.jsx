import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentialsLoaded, setCredentialsLoaded] = useState(false); // ✅ new state
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    setCredentialsLoaded(true); // ✅ wait for localStorage to load
  }, []);

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.", { position: "top-center" });
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.", { position: "top-center" });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const userRole = response.data.user.role;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      toast.success(
        userRole === "admin"
          ? "✅ Admin logged in successfully!"
          : userRole === "main"
          ? "✅ Main logged in successfully!"
          : "✅ Logged in successfully!",
        { position: "top-center", autoClose: 3000 }
      );

      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/normal-admin-dashboard");
        } else if (userRole === "main") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 3000);
    } catch (error) {
      toast.error("❌ Login failed! Check email or password", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    credentialsLoaded && (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4 relative">
        <ToastContainer />
        <Link
          to="/admin-login"
          className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition duration-300"
        >
          Admin Login
        </Link>

        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">User Login</h2>

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="on">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded-md transition duration-300`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    )
  );
};

export default UserLogin;
