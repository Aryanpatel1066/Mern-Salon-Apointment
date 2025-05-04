import React, { useEffect, useState } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const decoded = jwtDecode(token);
    api.get(`/users/profile/${decoded.userId}`)
      .then(res => setUser(res.data))
      .catch(err => {
        toast.error("Session expired. Please log in again.", { autoClose: 2000 });
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have logged out successfully!", { autoClose: 2000 });
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">Welcome, {user.name}</h1>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>

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
