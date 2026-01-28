import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🔴 Password length check
    if (form.password.length < 6) {
      toast.error("❌ Password must be at least 6 characters");
      return;
    }
    // 🔴 Frontend validations
    if (form.password !== form.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("❌ Invalid phone number");
      return;
    }

    try {
      await api.post("/users/register", form);

      toast.success("✅ Registration successful!", {
        autoClose: 1500,
      });

      // redirect AFTER toast
      setTimeout(() => {
        navigate("/login");
      }, 1600);

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "❌ Registration failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto mt-12 p-6 shadow-lg rounded-xl bg-white space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Mobile Number"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            pattern="[0-9]{10}"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
          </div>

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button className="bg-pink-600 text-white px-4 py-2 rounded w-full">
            Register
          </button>
        </form>

        <NavLink
          to="/login"
          className="block text-center text-pink-600 hover:underline"
        >
          Already have an account? Login
        </NavLink>
      </div>
    </>
  );
};

export default Register;