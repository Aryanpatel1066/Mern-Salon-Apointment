import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const useServices = (filters = {}, limit) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⭐ NEW STATES
  const [bookingLimitReached, setBookingLimitReached] = useState(false);
  const [remainingBookings, setRemainingBookings] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value === true ? "true" : value);
          }
        });

        const res = await api.get(`/services?${params.toString()}`);

        const servicesData = limit
          ? res.data.services.slice(0, limit)
          : res.data.services;

        setServices(servicesData);

        // ⭐ READ LIMIT INFO FROM BACKEND
        setBookingLimitReached(res.data.bookingLimitReached ?? false);
        setRemainingBookings(res.data.remainingBookings ?? null);
      } catch (err) {
        toast.error("❌ Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [JSON.stringify(filters), limit]);

  return {
    services,
    loading,
    bookingLimitReached,
    remainingBookings,
  };
};

export default useServices;
