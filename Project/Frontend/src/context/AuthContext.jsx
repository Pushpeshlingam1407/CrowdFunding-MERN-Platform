import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(() => JSON.parse(localStorage.getItem("user"))?.role === "admin" || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);

  // Admin Session
  const [adminUser, setAdminUser] = useState(() => JSON.parse(localStorage.getItem("adminUser")) || null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => !!localStorage.getItem("adminToken"));
  const [isAdminMode, setIsAdminMode] = useState(false);

  const updateUser = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAdmin(userData.role === "admin");
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    setErrorField(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { success, token, user: userData } = response.data;

      if (!success) throw new Error("Login failed");

      if (userData.role === "admin") {
        throw new Error("Access Denied. Please sign in through the Admin Portal.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(false);
      setIsLoading(false);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      const field = err.response?.data?.field || null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsLoading(false);
      setError(message);
      setErrorField(field);
      return false;
    }
  };

  const adminLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    setErrorField(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { success, token, user: userData } = response.data;

      if (!success) throw new Error("Admin login failed");

      if (userData.role !== "admin") {
        throw new Error("Access denied. Admin privileges required.");
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(userData));

      setAdminUser(userData);
      setAdminAuthenticated(true);
      setIsAdminMode(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Admin login failed";
      const field = err.response?.data?.field || null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setAdminUser(null);
      setAdminAuthenticated(false);
      setIsAdminMode(false);
      setIsLoading(false);
      setError(message);
      setErrorField(field);
      return false;
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", userData);
      const { success, token, user: newUserData } = response.data;

      if (!success) throw new Error("Registration failed");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUserData));

      setUser(newUserData);
      setIsAuthenticated(true);
      setIsAdmin(newUserData.role === "admin");
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setIsLoading(false);
      setIsAuthenticated(false);
      setIsAdmin(false);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setError(null);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    setAdminAuthenticated(false);
    setIsAdminMode(false);
    setError(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");

      if (!token && !adminToken) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setAdminAuthenticated(false);
        setIsAdminMode(false);
        return;
      }

      // Check Admin Token
      if (adminToken) {
        try {
          const response = await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          const { success, user: userData } = response.data;

          if (success && userData.role === "admin") {
            localStorage.setItem("adminUser", JSON.stringify(userData));
            setAdminUser(userData);
            setAdminAuthenticated(true);
            setIsAdminMode(true);
          }
        } catch (err) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
        }
      }

      // Check User Token
      if (token) {
        try {
          const response = await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { success, user: userData } = response.data;

          if (success) {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(userData.role === "admin");
          }
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    errorField,
    adminUser,
    adminAuthenticated,
    isAdminMode,
    updateUser,
    login,
    adminLogin,
    register,
    logout,
    adminLogout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
