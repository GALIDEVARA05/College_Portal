import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManageUsers from "./components/ManageUsers";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import MainAdmin from "./components/MainAdminDashboard";
import UploadPDF from "./components/UploadPDF";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import UserDashboard from "./components/UserDashboard";
import NormalAdminDashboard from "./pages/NormalAdminDashboard";
import ForgotPassword from "./components/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword";
import ResultsPage from "./pages/ResultsPage";  


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} /> 
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} /> 
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/normal-admin-dashboard" element={<NormalAdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/main-admin" element={<MainAdmin />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/upload-pdf" element={<UploadPDF />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
