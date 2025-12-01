// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userData =
      localStorage.getItem("userData") || sessionStorage.getItem("userData");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const login = (token, userData, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    // Clear local storage first
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");

    setIsAuthenticated(false);
    setUser(null);

    // Then call the logout service
    window.location.href = "http://localhost:5173/login";
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
