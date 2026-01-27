
import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const useServices = (filters = {}, limit) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value === true ? "true" : value);
          }
        });

        const res = await api.get(`/services?${params.toString()}`);
        const data = limit
          ? res.data.services.slice(0, limit)
          : res.data.services;

        setServices(data);
      } catch {
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [JSON.stringify(filters), limit]);

  return { services, loading };
};

export default useServices;
