import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";

const useAdminDashboard = (timeFilter) => {
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

  /* ---------------- FORMATTERS ---------------- */

  const formatBookingData = (data, period) =>
    data.map((item) => {
      let name = item._id;
      if (period === "daily") {
        name = new Date(item._id).toLocaleDateString("en-US", {
          weekday: "short",
        });
      } else if (period === "monthly") {
        const [year, month] = item._id.split("-");
        name = new Date(year, month - 1).toLocaleDateString("en-US", {
          month: "short",
        });
      }
      return {
        name,
        bookings: item.bookings,
        revenue: item.revenue,
      };
    });

  const formatServicesData = (data) => {
    const colors = [
      "#8b5cf6",
      "#ec4899",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
    ];
    return data.map((item, i) => ({
      name: item.name,
      bookings: item.bookings,
      color: colors[i % colors.length],
    }));
  };

  const formatStatusData = (data) => {
    const map = {
      Confirmed: "#10b981",
      Pending: "#f59e0b",
      Cancelled: "#ef4444",
    };
    return data.map((item) => ({
      name: item.name,
      value: item.value,
      color: map[item.name] || "#6b7280",
    }));
  };

  /* ---------------- FETCH ---------------- */

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [summary, trends, services, status, peak] = await Promise.all([
        api.get("/booking/analytics/dashboard-summary"),
        api.get(`/booking/analytics/trends?period=${timeFilter}`),
        api.get("/booking/analytics/popular-services"),
        api.get("/booking/analytics/status-distribution"),
        api.get("/booking/analytics/peak-hours"),
      ]);

      setStats(summary.data);
      setBookingData(formatBookingData(trends.data, timeFilter));
      setServicesData(formatServicesData(services.data));
      setStatusData(formatStatusData(status.data));
      setPeakHoursData(peak.data);
    } catch (err) {
      toast.error("Failed to load dashboard analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [timeFilter]);

  return {
    loading,
    stats,
    bookingData,
    servicesData,
    statusData,
    peakHoursData,
  };
};

export default useAdminDashboard;
