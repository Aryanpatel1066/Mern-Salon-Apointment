import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

export default function useOtp() {
  const [loading, setLoading] = useState(false);

  const sendOtp = async (email) => {
    setLoading(true);
    try {
      await api.post("email/send-otp", { email });
      toast.success("OTP sent");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    setLoading(true);
    try {
      await api.post("email/resend-otp", { email });
      toast.success("OTP resent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Please wait before resending");
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, resendOtp, loading };
}
