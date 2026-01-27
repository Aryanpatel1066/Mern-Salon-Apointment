import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import useOtp from "../hooks/useOtp";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { sendOtp, loading } = useOtp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ok = await sendOtp(email);

    if (!ok) {
      setError("User not found or failed to send OTP");
      return;
    }

    navigate("/verify-otp", { state: { email } });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white flex justify-center ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 w-full bg-green-500 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-green-600"
        >
          <IoArrowBack /> Back
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
