import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <h1 className="font-bold text-lg">Student Portal</h1>
      <div className="flex gap-4">
        <Link to="/user/login">User Login</Link>
        <Link to="/user/register">Register</Link>
        <Link to="/admin/login">Admin Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
