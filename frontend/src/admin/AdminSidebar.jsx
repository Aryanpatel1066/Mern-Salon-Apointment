import { Link, Outlet } from "react-router-dom";
import { Home, Scissors, Users, CalendarCheck,CalendarX,CalendarClock } from "lucide-react";

function AdminSidebar() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-5 border-r border-gray-200">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">Admin Panel</h2>
        <ul className="space-y-4 text-gray-700">
          <li>
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-2 hover:text-pink-600 transition"
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/services"
              className="flex items-center space-x-2 hover:text-pink-600 transition"
            >
              <Scissors size={18} />
              <span>Service Management</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="flex items-center space-x-2 hover:text-pink-600 transition"
            >
              <Users size={18} />
              <span>User Management</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/bookings"
              className="flex items-center space-x-2 hover:text-pink-600 transition"
            >
              <CalendarCheck size={18} />
              <span>Booking Management</span>
            </Link>         
          </li>
           <li>
            <Link
              to="/admin/closed-days"
              className="flex items-center space-x-2 hover:text-pink-600 transition"
            >
              <CalendarX size={18} />
              <span>Closed Days</span>
            </Link>
          </li>
           <li>
            <Link
              to="/admin/time-sloat"
              className="flex items-center space-x-2 hover:text-pink-600 transition"
            >
              <CalendarClock size={18} />
              <span>Time Management</span>
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminSidebar;
