import axios from "axios";

// Import default banner
import DefaultBanner from "../assets/images/DefaultBanner.jpg";

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
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const normalizeAudience = (audience) => {
  console.log("Normalizing audience:", audience);
  if (!audience) {
    return "All Users";
  }
  const normalized = audience.trim();
  const audienceMap = {
    "all users": "All Users",
    students: "Students",
    teachers: "Teachers",
    parents: "Parents",
  };

  const lowerNormalized = normalized.toLowerCase();
  if (audienceMap[lowerNormalized]) {
    return audienceMap[lowerNormalized];
  }

  // Fallback
  console.warn(`Unknown audience "${audience}", defaulting to "All Users"`);
  return "All Users";
};

// Create announcement
export const announcementService = {
  async createAnnouncement(announcementData) {
    try {
      console.log("Creating announcement with data:", announcementData);

      const formData = new FormData();
      formData.append("Title", announcementData.Title);
      formData.append("Content", announcementData.Content);
      formData.append("Summary", announcementData.Summary);
      formData.append("Category", announcementData.Category);
      formData.append(
        "TargetAudience",
        normalizeAudience(announcementData.TargetAudience)
      );
      formData.append(
        "IsPinned",
        Boolean(announcementData.IsPinned) ? "1" : "0"
      );
      formData.append("IsActive", "1");
      formData.append(
        "PublishDate",
        new Date().toISOString().slice(0, 19).replace("T", " ")
      );

      const expiryDate =
        announcementData.ExpiryDate ||
        (() => {
          const defaultExpiry = new Date();
          defaultExpiry.setDate(defaultExpiry.getDate() + 7);
          return defaultExpiry.toISOString().slice(0, 19).replace("T", " ");
        })();
      formData.append("ExpiryDate", expiryDate);

      // Only append banner if it's a valid File object
      if (announcementData.banner && announcementData.banner instanceof File) {
        formData.append("Banner", announcementData.banner);
      } else {
        // Try to fetch and append default banner
        try {
          const response = await fetch(DefaultBanner);
          if (response.ok) {
            const blob = await response.blob();
            // Ensure we have a valid blob before creating File
            if (blob && blob.size > 0) {
              const defaultBannerFile = new File([blob], "DefaultBanner.jpg", {
                type: "image/jpeg",
              });
              formData.append("Banner", defaultBannerFile);
            } else {
              console.warn("Default banner blob is empty, skipping banner");
            }
          } else {
            console.warn("Failed to fetch default banner, skipping");
          }
        } catch (error) {
          console.error("Failed to load default banner:", error);
          // Don't throw - just continue without banner
        }
      }

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1]);
      }

      const response = await api.post("/announcements", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Announcement created successfully:", response.data);

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw this.handleError(error);
    }
  },

  // Update announcement
  async updateAnnouncement(id, updateData) {
    try {
      const formData = new FormData();
      formData.append("Title", updateData.Title);
      formData.append("Content", updateData.Content);
      formData.append("Summary", updateData.Summary);
      formData.append("Category", updateData.Category);
      formData.append(
        "TargetAudience",
        normalizeAudience(updateData.TargetAudience)
      );
      formData.append("IsPinned", Boolean(updateData.IsPinned) ? "1" : "0");
      formData.append("IsActive", updateData.IsActive !== false ? "1" : "0");

      if (updateData.PublishDate) {
        formData.append("PublishDate", updateData.PublishDate);
      }
      if (updateData.ExpiryDate) {
        formData.append("ExpiryDate", updateData.ExpiryDate);
      }
      if (updateData.banner && updateData.banner instanceof File) {
        formData.append("Banner", updateData.banner);
        console.log("📷 New banner image attached:", updateData.banner.name);
      }
      formData.append("_method", "PUT");
      const response = await api.post(`/announcements/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error details:", error.response.data);

        if (error.response.status === 422) {
          console.error("VALIDATION ERRORS DETAIL:");
          console.error("Field errors:", error.response.data.errors);
          console.error("Full error response:", error.response.data);
        }
      }
      throw this.handleError(error);
    }
  },

  // Get all announcements
  async getAnnouncements(params = {}) {
    try {
      const response = await api.get("/announcements", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get announcement by ID
  async getAnnouncementById(id) {
    try {
      const response = await api.get(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get all announcements
  async getArchivedAnnouncements(params = {}) {
    try {
      const response = await api.get("/announcements/archived", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Archive announcement
  async archiveAnnouncement(id) {
    try {
      console.log(`Archiving announcement ${id}...`);
      const response = await api.patch(`/announcements/${id}/archive`);
      console.log("Archive response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Archive error:", error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Restore announcement
  async restoreAnnouncement(id) {
    try {
      console.log(`Restoring announcement ${id}...`);
      const response = await api.patch(`/announcements/${id}/unarchive`);
      console.log("Restore response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Restore error:", error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  //Pinning and Unpinning announcements
  async togglePinAnnouncement(id, isPinned) {
    if (!id || id === "undefined" || id === undefined) {
      const error = new Error("Invalid announcement ID");
      throw error;
    }
    try {
      const endpoint = `/announcements/${id}/${isPinned ? "pin" : "unpin"}`;
      const response = await api.patch(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Failed to ${isPinned ? "pin" : "unpin"} announcement:`,
        error
      );
      throw this.handleError(error);
    }
  },

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data, config } = error.response;
      console.error(`API Error ${status}:`, data);

      // Enhanced 422 error logging
      if (status === 422 && data.errors) {
        console.error("DETAILED VALIDATION ERRORS:");
        Object.entries(data.errors).forEach(([field, errors]) => {
          console.error(`   ${field}:`, errors);
        });

        console.error("WHAT WE SENT:");
        if (config && config.data) {
          try {
            const requestData = JSON.parse(config.data);
            console.error("Request data:", requestData);
            console.error("TargetAudience sent:", requestData.TargetAudience);
          } catch (e) {
            console.error("Request data (FormData):", config.data);
          }
        }
      }

      switch (status) {
        case 400:
          return new Error(
            data.message || "Bad request - Please check your input"
          );
        case 401:
          return new Error("Unauthorized - Please login again");
        case 403:
          return new Error("Forbidden - You do not have permission");
        case 404:
          return new Error("Announcement not found");
        case 422:
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(", ");
            return new Error(`Validation failed: ${errorMessages}`);
          }
          return new Error(data.message || "Validation failed");
        case 500:
          return new Error("Server error - Please try again later");
        default:
          return new Error(data.message || "Something went wrong");
      }
    } else if (error.request) {
      return new Error("Network error - Please check your connection");
    } else {
      return new Error(error.message || "Something went wrong");
    }
  },
};

export default announcementService;
