import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Calendar,TrendingUp,Users,DollarSign,Clock,Star,RefreshCw,} from "lucide-react";
import {LineChart,Line,BarChart,Bar,PieChart,Pie,Cell,XAxis, YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from "recharts";
import { toast } from "react-toastify";
import useAdminDashboard from "../hooks/adminHooks/useAdminDashboard";

function AdminDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("monthly");

  const {loading,stats,bookingData,servicesData,statusData,peakHoursData,} = useAdminDashboard(timeFilter);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      className="bg-white p-6 rounded shadow border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>
        <Icon size={40} style={{ color }} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Users" value={stats.totalUsers} icon={Users} color="#ec4899" />
        <StatCard title="Services" value={stats.totalServices} icon={Star} color="#3b82f6" />
        <StatCard title="Bookings" value={stats.totalBookings} icon={Calendar} color="#10b981" />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={DollarSign}
          color="#f59e0b"
        />
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {["daily", "weekly", "monthly", "yearly"].map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`px-4 py-2 rounded ${
              timeFilter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* BOOKING TRENDS */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-bold mb-4">Booking Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="bookings" stroke="#8b5cf6" />
            <Line dataKey="revenue" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TWO COLUMN */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* POPULAR SERVICES */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Popular Services</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={servicesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings">
                {servicesData.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BOOKING STATUS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Booking Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {statusData.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PEAK HOURS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Clock size={18} /> Peak Booking Hours
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
