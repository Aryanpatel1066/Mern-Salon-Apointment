
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", form);

      login(res.data.token, res.data.user);

      toast.success("Login successful!", { autoClose: 2000 });

      navigate(res.data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-12 p-6 shadow-lg rounded-xl bg-white space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" placeholder="Email"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded" />

          <div className="relative">
            <input name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded pr-10" />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button className="bg-pink-600 text-white px-4 py-2 rounded w-full">
            Login
          </button>
        </form>

        <NavLink to="/register" className="block text-center text-pink-600 hover:underline">
          Don’t have an account? Register
        </NavLink>

        <div className="text-center mt-2">
          <NavLink to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot password?
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Login;
