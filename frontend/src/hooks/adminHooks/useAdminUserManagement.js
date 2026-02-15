import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const LIMIT = 10;

const useAdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // edit modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // 🔹 Fetch users (cursor based)
  const fetchUsers = async (loadMore = false) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.get("/users/admin/userList", {
        params: {
          limit: LIMIT,
          cursor: loadMore ? cursor : null,
        },
      });

      const { data, nextCursor, hasMore } = res.data;

      setUsers((prev) => (loadMore ? [...prev, ...data] : data));
      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // first load
  useEffect(() => {
    fetchUsers(false);
  }, []);

  // 🔹 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/users/admin/userDelete/${id}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔹 Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setIsOpen(true);
  };

  // 🔹 Edit submit
const handleEditSubmit = async () => {
  try {
    await api.put(
      `/users/admin/userupdate/${selectedUser._id}`,
      formData
    );

    toast.success("User updated successfully");
    setIsOpen(false);
    fetchUsers(); // refetch list
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};


  return {
    users,
    loading,
    error,
    hasMore,
    fetchUsers,

    // modal
    isOpen,
    setIsOpen,
    selectedUser,
    formData,
    setFormData,
    handleDelete,
    openEditModal,
    handleEditSubmit,
  };
};

export default useAdminUserManagement;
