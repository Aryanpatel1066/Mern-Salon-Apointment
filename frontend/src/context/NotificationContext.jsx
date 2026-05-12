import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import api from "../api/api";
import socket from "../socket";
import useAuth from "../hooks/useAuth";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = useCallback(
    async (loadMore = false, cursor = null) => {
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
    },
    []
  );

  // =========================
  // MARK ALL AS READ
  // =========================

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-read");

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {
    if (!user?._id) return;

    // JOIN USER ROOM
    socket.emit("join", user._id);

    console.log("✅ Joined socket room:", user._id);

    // NEW NOTIFICATION
    socket.on("new_notification", (notification) => {
     // console.log("🔥 Live notification received:", notification);

      setNotifications((prev) => [
        notification,
        ...prev,
      ]);

      setUnreadCount((prev) => prev + 1);
    });

    // ALL READ EVENT
    socket.on("notifications_read_all", () => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    });

    // UNREAD COUNT UPDATE
    socket.on("unread_count_updated", ({ count }) => {
      setUnreadCount(count);
    });

    return () => {
      socket.off("new_notification");
      socket.off("notifications_read_all");
      socket.off("unread_count_updated");
    };
  }, [user]);

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