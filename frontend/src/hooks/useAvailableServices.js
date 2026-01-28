import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const useAvailableServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableServices = async () => {
      setLoading(true);
      try {
        const res = await api.get("/services/available");
        setServices(res.data.services);
      } catch (error) {
        toast.error("Failed to load available services");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableServices();
  }, []);

  return { services, loading };
};

export default useAvailableServices;
