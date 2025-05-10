import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import { IoArrowBack } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const otp = location.state?.otp;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("email/reset-password", { otp, newPassword });
      toast.success("✅ Password reset successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || "Error resetting password"}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button type="submit" className="w-full bg-red-500 text-white p-2 rounded">
            Reset Password
          </button>
          <button className="w-15 bg-green-500 text-white p-2 m-5 rounded flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
            <IoArrowBack className="text-white" />  
            <NavLink to="/verify-otp" className="text-white">Back</NavLink>
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={2000} transition={Bounce} />
      </div>
    </div>
  );
}

export default ResetPassword;
