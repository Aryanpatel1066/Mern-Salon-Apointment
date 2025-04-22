import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/register", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Registration successful!", { autoClose: 2000 });
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", { autoClose: 2000 });
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-12 p-6 shadow-lg rounded-xl bg-white space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded w-full">Register</button>
        </form>

        <NavLink to="/login" className="block text-center text-pink-600 mt-2 hover:underline">
          Already have an account? Login
        </NavLink>
      </div>
    </>
  );
};

export default Register;
