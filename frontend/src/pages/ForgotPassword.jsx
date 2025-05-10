 import { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import { NavLink, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("email/send-otp", { email });
      toast.success("✅ OTP sent successfully!", { autoClose: 2000 });
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 2000);
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || "Error sending OTP"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded flex justify-center items-center ${
              loading
                ? "bg-blue-400 opacity-60 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Send OTP"
            )}
          </button>

          <button className="w-15 bg-green-500 text-white p-2 m-5 rounded flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
            <IoArrowBack className="text-white" />
            <NavLink to="/login" className="text-white">
              Back
            </NavLink>
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={2000} transition={Bounce} />
      </div>
    </div>
  );
}

export default ForgotPassword;
