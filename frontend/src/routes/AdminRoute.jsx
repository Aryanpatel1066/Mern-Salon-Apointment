import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const { user, token, loading } = useAuth();

  // ⏳ wait until auth check finishes
  if (loading) {
    return null; // or loader
  }

  // ❌ not logged in
  if (!token || !user) {
    return <Navigate to="/404" replace />;
  }

  // ❌ logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/404" replace />;
  }

  // ✅ admin allowed
  return <Outlet />;
};

export default AdminRoute;
