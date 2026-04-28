import React, { createContext, useState, useCallback } from "react";
import api from "../api/api";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = useCallback(async (loadMore = false, cursor = null) => {
    try {
      setLoading(true);

      const res = await api.get("/notifications", {
        params: {
          limit: 10,
          cursor: loadMore ? cursor : undefined,
        },
      });

      const {
        data = [],
        nextCursor: newCursor = null,
        hasMore: moreAvailable = false,
      } = res.data;

      setNotifications((prev) => {
        const updated = loadMore ? [...prev, ...data] : data;
        setUnreadCount(updated.filter((n) => !n.read).length);
        return updated;
      });

      setNextCursor(newCursor);
      setHasMore(moreAvailable);
      setError("");
    } catch (err) {
      setError("Failed to load notifications");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        unreadCount,
        hasMore,
        nextCursor,
        fetchNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};