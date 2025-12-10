import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = window.authToken || null;
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
    return Promise.reject(error);
  }
);

// Profile API calls
export const profileService = {
  // Get current user's profile
  getProfile: async () => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  // Update profile (without ID - uses current user)
  updateProfile: async (profileData) => {
    try {
      const isFormData = profileData instanceof FormData;

      if (isFormData) {
        profileData.append("_method", "PUT");

        const response = await api.post("/profile", profileData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        const response = await api.put("/profile", profileData);
        return response.data;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  // Update profile by ID (new method)
  updateProfileById: async (id, profileData) => {
    try {
      const isFormData = profileData instanceof FormData;

      if (isFormData) {
        profileData.append("_method", "PUT");

        const response = await api.post(`/profile/${id}`, profileData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        const response = await api.put(`/profile/${id}`, profileData);
        return response.data;
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put("/change-password", passwordData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  },
};

export default api;
