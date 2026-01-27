import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect AFTER render, not during render
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("You have logged out successfully!", { autoClose: 2000 });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // While redirecting, render nothing
  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">
          Welcome, {user.name}
        </h1>

        <p className="mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mb-2">
          <strong>Mobile:</strong> {user.phone}
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
