import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Star,
  RefreshCw,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [bookingData, setBookingData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have logged out successfully!", { autoClose: 2000 });
    navigate("/login");
  };

  // Format booking data based on period
  const formatBookingData = (data, period) => {
    return data.map((item) => {
      let name;
      if (period === "daily") {
        name = new Date(item._id).toLocaleDateString("en-US", {
          weekday: "short",
        });
      } else if (period === "weekly") {
        name = `Week ${item._id}`;
      } else if (period === "monthly") {
        const [year, month] = item._id.split("-");
        name = new Date(year, month - 1).toLocaleDateString("en-US", {
          month: "short",
        });
      } else {
        name = item._id;
      }
      return {
        name,
        bookings: item.bookings,
        revenue: item.revenue,
      };
    });
  };

  // Format services data
  const formatServicesData = (data) => {
    const colors = [
      "#8b5cf6",
      "#ec4899",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#6366f1",
    ];
    return data.map((item, index) => ({
      name: item.name,
      bookings: item.bookings,
      color: colors[index % colors.length],
    }));
  };

  // Format status data
  const formatStatusData = (data) => {
    const colorMap = {
      Confirmed: "#10b981",
      Pending: "#f59e0b",
      Cancelled: "#ef4444",
    };
    return data.map((item) => ({
      name: item.name,
      value: item.value,
      color: colorMap[item.name] || "#6b7280",
    }));
  };

  // Format peak hours data
  const formatPeakHoursData = (data) => {
    return data.map((item) => ({
      time: item.time,
      bookings: item.bookings,
    }));
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch summary stats
      const summaryRes = await api.get("/booking/analytics/dashboard-summary");
      setStats(summaryRes.data);

      // Fetch booking trends based on time filter
      const trendsRes = await api.get(
        `/booking/analytics/trends?period=${timeFilter}`,
      );
      setBookingData(formatBookingData(trendsRes.data, timeFilter));

      // Fetch popular services
      const servicesRes = await api.get("/booking/analytics/popular-services");
      setServicesData(formatServicesData(servicesRes.data));

      // Fetch status distribution
      const statusRes = await api.get("/booking/analytics/status-distribution");
      setStatusData(formatStatusData(statusRes.data));

      // Fetch peak hours
      const peakRes = await api.get("/booking/analytics/peak-hours");
      setPeakHoursData(formatPeakHoursData(peakRes.data));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>
            {value}
          </p>
        </div>
        <Icon size={40} style={{ color }} className="opacity-70" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="animate-spin text-purple-600 mx-auto mb-4"
            size={48}
          />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="#ec4899"
        />
        <StatCard
          title="Total Services"
          value={stats.totalServices}
          icon={Star}
          color="#3b82f6"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="#10b981"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="#f59e0b"
        />
      </div>

      {/* Booking Trends Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Booking Trends & Revenue
          </h2>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly", "yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeFilter === filter
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {bookingData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
            <p>No booking data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Bookings"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                name="Revenue (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Popular Services */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Popular Services
          </h2>
          {servicesData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Star size={48} className="mx-auto mb-3 opacity-50" />
              <p>No service booking data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Booking Status
          </h2>
          {statusData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-3 opacity-50" />
              <p>No status data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            Peak Booking Hours
          </h2>
        </div>
        {peakHoursData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock size={48} className="mx-auto mb-3 opacity-50" />
            <p>No peak hours data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
