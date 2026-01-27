import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        const res = await api.get(`/users/profile/${decoded.userId}`);

        setUser(res.data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
