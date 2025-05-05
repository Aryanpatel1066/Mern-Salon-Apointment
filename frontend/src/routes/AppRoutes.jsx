import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import AdminDashboard from '../admin/AdminDashboard';
import ServicesPage from '../pages/ServicePage';
import BookingForm from '../components/BookingForm';
import Success from "../pages/Success";
import MyBookings from '../pages/MyBookings';
import AdminServiceManagement from "../admin/AdminServiceManagement";
import AdminUserManagement from "../admin/AdminUserManagement";
import AdminBookingManagement from "../admin/AdminBookingManagement";
import AdminSidebar from '../admin/AdminSidebar';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/services" element={<ServicesPage />} />
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/success" element={<Success />} />
      <Route path='/my-bookings' element={<MyBookings />} />
      <Route path="/admin" element={<AdminSidebar />}>
        <Route index element={<AdminDashboard />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="services" element={<AdminServiceManagement />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="bookings" element={<AdminBookingManagement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
