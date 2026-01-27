import React, { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/api";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");

      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.read).length);
      setError("");
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-read");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

useEffect(() => {
  if (localStorage.getItem("token")) {
    fetchNotifications();
  }
}, []);


  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        unreadCount,
        fetchNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
