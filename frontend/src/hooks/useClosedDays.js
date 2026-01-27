import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { formatDate } from "../utils/dateUtils";

const useClosedDays = () => {
  const [closedDays, setClosedDays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClosedDays = async () => {
      setLoading(true);
      try {
        const res = await api.get("/closed-days");
        setClosedDays(res.data.closedDays.map((d) => d.date));
      } catch {
        toast.error("Failed to load closed days");
      } finally {
        setLoading(false);
      }
    };

    fetchClosedDays();
  }, []);

  // helper used by DatePicker
  const allowDate = (date) => !closedDays.includes(formatDate(date));

  return {
    closedDays,
    allowDate,
    loading,
  };
};

export default useClosedDays;
