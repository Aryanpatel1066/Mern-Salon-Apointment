import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error while typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("❌ Please fix the errors");
      return;
    }

    try {
      const res = await api.post("/users/login", form);

      login(res.data.token, res.data.user);

      toast.success("✅ Login successful!", { autoClose: 1500 });

      setTimeout(() => {
        navigate(res.data.user.role === "admin" ? "/admin" : "/");
      }, 1600);

    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto mt-12 p-6 shadow-lg rounded-xl bg-white space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Password */}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
          </div>

          <button className="bg-pink-600 text-white px-4 py-2 rounded w-full">
            Login
          </button>
        </form>

        <NavLink
          to="/register"
          className="block text-center text-pink-600 hover:underline"
        >
          Don’t have an account? Register
        </NavLink>

        <div className="text-center mt-2">
          <NavLink
            to="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot password?
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Login;