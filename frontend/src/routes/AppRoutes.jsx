import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminRoute, PrivateRoute } from "./AdminRoute";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import AdminDashboard from "../admin/AdminDashboard";
import ServicesPage from "../pages/ServicePage";
import BookingForm from "../components/BookingForm";
import Success from "../pages/Success";
import MyBookings from "../pages/MyBookings";
import AdminServiceManagement from "../admin/AdminServiceManagement";
import AdminUserManagement from "../admin/AdminUserManagement";
import AdminBookingManagement from "../admin/AdminBookingManagement";
import AdminSidebar from "../admin/AdminSidebar";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import Notification from "../pages/Notification";
import AdminClosedDays from "../admin/AdminCloseDays";
import AdminTimeSlots from "../admin/AdminTimeSloats";
import NotFound from "../components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/services" element={<ServicesPage />} />

      {/* Protected User Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <PrivateRoute>
            <BookingForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/success"
        element={
          <PrivateRoute>
            <Success />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        }
      />
      <Route
        path="/notification"
        element={
          <PrivateRoute>
            <Notification />
          </PrivateRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminSidebar />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="services" element={<AdminServiceManagement />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="bookings" element={<AdminBookingManagement />} />
        <Route path="closed-days" element={<AdminClosedDays />} />
        <Route path="time-sloat" element={<AdminTimeSlots />} />
      </Route>

      {/* 404 Not Found - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;