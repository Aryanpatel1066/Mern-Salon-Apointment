import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const useAdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/admin/userList");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/admin/userDelete/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    setIsOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await api.put(`/users/admin/userupdate/${selectedUser._id}`, formData);
      setUsers(
        users.map((u) => (u._id === selectedUser._id ? res.data.user : u))
      );
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return {
    users,
    loading,
    error,
    isOpen,
    setIsOpen,
    selectedUser,
    formData,
    setFormData,
    fetchUsers,
    handleDelete,
    openEditModal,
    handleEditSubmit,
  };
};

export default useAdminUserManagement;
