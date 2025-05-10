// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import AdminSidebar from "./AdminSidebar";

// function AdminDashboard(){
//       const navigate = useNavigate();
    
//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         toast.success("You have logged out successfully!", { autoClose: 2000 });
//         navigate("/login");
//       };
//     return(
//         <>
//          <h1>AdminDashboard page</h1>

//         <button
//           onClick={handleLogout}
//           className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//         </>
//     )
// }
// export default AdminDashboard;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../api/api"; // ensure your API file is correctly configured

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have logged out successfully!", { autoClose: 2000 });
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, serviceRes, bookingRes] = await Promise.all([
          api.get("/users/admin/userCount"),
          api.get("/services/admin/serviceCount"),
          api.get("/booking/admin/bookingCount"),
        ]);

        setStats({
          users: userRes.data.count || 0,
          services: serviceRes.data.count || 0,
          bookings: bookingRes.data.count || 0,
        });
      } catch (err) {
        toast.error("Failed to load dashboard stats.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
       <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users */}
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-pink-500">
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-pink-600 mt-2">{stats.users}</p>
          </div>

          {/* Services */}
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-700">Total Services</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.services}</p>
          </div>

          {/* Bookings */}
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-gray-700">Total Bookings</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.bookings}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
