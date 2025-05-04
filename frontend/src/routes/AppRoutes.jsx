import React from 'react';
import {  Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
 import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import ServicesPage from '../pages/ServicePage';
 import BookingForm from '../components/BookingForm';
 import Success from "../pages/Success";
 import MyBookings from '../pages/MyBookings';
const AppRoutes = () => {
  return (
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/services" element={<ServicesPage/>}/>
          <Route path="/booking" element={<BookingForm/>}/>
          <Route path="/success" element={<Success/>}/>
          <Route path='/my-bookings' element={<MyBookings/>} />
        </Routes>
   );
};

export default AppRoutes;
