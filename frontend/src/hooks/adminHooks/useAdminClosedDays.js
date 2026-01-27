import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";

const useAdminClosedDays = () => {
  const [closedDays, setClosedDays] = useState([]);
  const [newDate, setNewDate] = useState("");

  // Fetch all closed days
  const fetchClosedDays = async () => {
    try {
      const res = await api.get("/closed-days");
      setClosedDays(res.data.closedDays || []);
    } catch (err) {
      toast.error("Failed to fetch closed days");
    }
  };

  useEffect(() => {
    fetchClosedDays();
  }, []);

  // Add new closed day
  const handleAdd = async () => {
    if (!newDate) return toast.error("Please select a date");

    try {
      await api.post("/closed-days", { date: newDate });
      toast.success("Closed day added");
      setNewDate("");
      fetchClosedDays();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add closed day");
    }
  };

  // Delete closed day
  const handleDelete = async (id) => {
    try {
      await api.delete(`/closed-days/${id}`);
      toast.success("Closed day removed");
      fetchClosedDays();
    } catch (err) {
      toast.error("Failed to remove closed day");
    }
  };

  return {
    closedDays,
    newDate,
    setNewDate,
    handleAdd,
    handleDelete,
  };
};

export default useAdminClosedDays;
