import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import api from "../api/api";
import useOtp from "../hooks/useOtp";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const { resendOtp, loading } = useOtp();

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      await api.post("/email/verify-otp", { otp });
      navigate("/reset-password", { state: { otp } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            maxLength={6}
            required
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded text-center tracking-widest"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            disabled={verifying}
            className={`w-full p-2 rounded text-white ${
              verifying
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          disabled={timer > 0 || loading}
          onClick={() => {
            resendOtp(email);
            setTimer(60);
          }}
          className={`mt-4 w-full p-2 rounded ${
            timer > 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </button>

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-4 w-full bg-green-500 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-green-600"
        >
          <IoArrowBack /> Back
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
