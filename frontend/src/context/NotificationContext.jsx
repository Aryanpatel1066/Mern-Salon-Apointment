import React, { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/api";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 🔥 Fetch notifications (paginated)
  const fetchNotifications = useCallback(
    async (loadMore = false) => {
      try {
        setLoading(true);

        const res = await api.get("/notifications", {
          params: {
            limit: 10,
            cursor: loadMore ? nextCursor : undefined,
          },
        });

        const { data, nextCursor: newCursor, hasMore } = res.data;

        setNotifications((prev) =>
          loadMore ? [...prev, ...data] : data
        );

        setNextCursor(newCursor);
        setHasMore(hasMore);

        const unread = (loadMore ? [...notifications, ...data] : data)
          .filter((n) => !n.read).length;

        setUnreadCount(unread);
        setError("");
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    },
    [nextCursor, notifications]
  );

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-read");

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchNotifications(false);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        unreadCount,
        hasMore,
        fetchNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
