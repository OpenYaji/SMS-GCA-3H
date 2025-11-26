// services/dashboardService.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = window.authToken || localStorage.getItem("authToken") || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const dashboardService = {
  // Get all dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get("/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  async getUserStats() {
    try {
      const response = await api.get("/dashboard");
      return response.data.data.Users;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  async getStudentStats() {
    try {
      const response = await api.get("/dashboard");
      return response.data.data.Users.StudentCount;
    } catch (error) {
      console.error("Error fetching student stats:", error);
      throw error;
    }
  },

  async getPinnedAnnouncements() {
    try {
      const response = await api.get("/dashboard");
      return response.data.data.PinnedAnnouncements || [];
    } catch (error) {
      console.error("Error fetching pinned announcements:", error);
      throw error;
    }
  },

  async getFeeStatus() {
    try {
      const response = await api.get("/dashboard");
      return response.data.data.fees.feeStatus || {};
    } catch (error) {
      console.error("Error fetching fee status:", error);
      throw error;
    }
  },

  async getFeesCollection() {
    try {
      const response = await api.get("/dashboard");
      return response.data.data.fees.feesCollection.MonthlyTotal || {};
    } catch (error) {
      console.error("Error fetching fees collection:", error);
      throw error;
    }
  },
};

export default api;
