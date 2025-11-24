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

// Enhanced response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // Handle specific error cases
    if (error.response?.status === 400) {
      console.error("Bad Request - Check request data:", error.response.data);
    } else if (error.response?.status === 401) {
      console.error("Unauthorized - Check authentication token");
      // Optionally redirect to login
      // window.location.href = '/login';
    } else if (error.response?.status === 404) {
      console.error("Endpoint not found - Check API URL");
    }

    return Promise.reject(error);
  }
);

export const scheduleService = {
  // Get all headteachers who sent proposed schedules
  getAllProposedSchedules: async () => {
    try {
      const response = await api.get("/schedule-confirmations");
      return response.data;
    } catch (error) {
      console.error("Error fetching proposed schedules:", error);
      throw error;
    }
  },

  // Get detailed schedule by teacher ID
  getScheduleByTeacherId: async (teacherId) => {
    try {
      const response = await api.get(`/schedule-confirmations/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule for teacher ${teacherId}:`, error);
      throw error;
    }
  },

  // Approve all schedules in the proposal
  approveAllSchedules: async (proposalData = {}) => {
    try {
      const response = await api.put("/schedule-confirmations/approve-all", {
        submittedBy: proposalData.submittedBy,
        teacherId: proposalData.teacherId,
        timestamp: new Date().toISOString(),
        ...proposalData,
      });
      return response.data;
    } catch (error) {
      console.error("Error approving all schedules:", error);

      // Extract conflict details from the response
      const conflictDetails = error.response?.data?.Conflicts || [];
      const message =
        error.response?.data?.Message || error.response?.data?.message;

      const enhancedError = new Error(
        message || "Failed to approve schedules due to conflicts"
      );
      enhancedError.response = error.response;
      enhancedError.status = error.response?.status;
      enhancedError.conflicts = conflictDetails;
      enhancedError.originalMessage = message;

      throw enhancedError;
    }
  },

  // Decline all schedules in the proposal - UPDATED
  declineAllSchedules: async (proposalData = {}) => {
    try {
      const response = await api.put("/schedule-confirmations/decline-all", {
        // Include any required data from the proposal
        submittedBy: proposalData.submittedBy,
        teacherId: proposalData.teacherId,
        timestamp: new Date().toISOString(),
        ...proposalData,
      });
      return response.data;
    } catch (error) {
      console.error("Error declining all schedules:", error);

      // Provide more detailed error information
      const enhancedError = new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to decline schedules"
      );
      enhancedError.response = error.response;
      enhancedError.status = error.response?.status;

      throw enhancedError;
    }
  },
};

export default scheduleService;
