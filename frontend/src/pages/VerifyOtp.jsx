import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import { IoArrowBack } from "react-icons/io5"; // Using react-icons for the back arrow icon
import { NavLink } from "react-router-dom";
function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("email/verify-otp", { otp });
      toast.success("✅ OTP verified successfully!", { autoClose: 2000 });
      setTimeout(() => navigate("/reset-password", { state: { otp } }), 2000);
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || "Invalid OTP"}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
            Verify OTP
          </button>
          <button className="w-15 bg-green-500 text-white p-2 m-5 rounded flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
  <IoArrowBack className="text-white" />  
  <NavLink to="/forgot-password" className="text-white">Back</NavLink>
</button>
        </form>
        <ToastContainer position="top-right" autoClose={2000} transition={Bounce} />
      </div>
    </div>
  );
}

export default VerifyOtp;
