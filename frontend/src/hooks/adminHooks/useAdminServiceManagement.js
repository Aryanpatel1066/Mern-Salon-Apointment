import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const useAdminServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    available: true,
  });

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load services");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      available: true,
    });
    setEditingId(null);
    setFormVisible(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, formData);
        toast.success("Service updated");
      } else {
        await api.post("/services", formData);
        toast.success("Service created");
      }
      resetForm();
      window.location.reload();
    } catch (err) {
      toast.error("Failed to save service");
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      available: service.available,
    });
    setEditingId(service._id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Service deleted");
      window.location.reload();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return {
    services,
    loading,
    formVisible,
    setFormVisible,
    editingId,
    formData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};

export default useAdminServiceManagement;