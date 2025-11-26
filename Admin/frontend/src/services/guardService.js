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

// Helper function to format name with middle initial
const formatNameWithMiddleInitial = (guard) => {
  if (!guard.Profile) return "";

  const firstName = guard.Profile?.FirstName || "";
  const middleName = guard.Profile?.MiddleName || "";
  const lastName = guard.Profile?.LastName || "";

  let fullName = firstName;

  if (middleName) {
    const middleInitial = middleName.charAt(0).toUpperCase() + ".";
    fullName += ` ${middleInitial}`;
  }

  fullName += ` ${lastName}`;

  return fullName.trim();
};

export const guardService = {
  async getGuards(params = {}) {
    try {
      const response = await api.get("/guard-profiles", { params });

      if (response.data && Array.isArray(response.data.data)) {
        const transformedData = response.data.data.map((guard) => {
          const isArchived = guard.User?.IsArchived === true;

          return {
            id: guard.GuardProfileID?.toString(),
            guardId: guard.EmployeeNumber,
            name: formatNameWithMiddleInitial(guard),
            firstName: guard.Profile?.FirstName || "",
            lastName: guard.Profile?.LastName || "",
            middleName: guard.Profile?.MiddleName || "",
            email: guard.User?.EmailAddress || "",
            archived: isArchived,
            accountStatus: guard.User?.AccountStatus || "Active",
            profilePicture: guard.Profile?.ProfilePictureURL || "",
            rawData: guard,
          };
        });

        console.log(
          `Transformed guards - Total: ${transformedData.length}, Archived: ${
            transformedData.filter((g) => g.archived).length
          }`
        );

        return {
          guards: transformedData,
          total: transformedData.length,
        };
      }

      return { guards: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch guards:", error);
      throw this.handleError(error);
    }
  },

  async getGuardById(id) {
    try {
      console.log(`Fetching guard with ID: ${id}`);
      const response = await api.get(`/guard-profiles/${id}`);
      console.log("Guard fetched successfully:", response.data);

      const guard = response.data.data || response.data;

      if (guard) {
        return {
          id: guard.GuardProfileID?.toString() || id,
          guardId: guard.EmployeeNumber,
          name: formatNameWithMiddleInitial(guard),
          email: guard.User?.EmailAddress || "",
          firstName: guard.Profile?.FirstName || "",
          lastName: guard.Profile?.LastName || "",
          middleName: guard.Profile?.MiddleName || "",
          phone: guard.Profile?.PhoneNumber || "",
          address: guard.Profile?.Address || "",
          nationality: guard.Profile?.Nationality || "",
          archived: guard.User?.IsArchived === true,
          accountStatus: guard.User?.AccountStatus || "Active",
          profilePicture: guard.Profile?.ProfilePictureURL || "",
          ...guard,
        };
      }

      return guard;
    } catch (error) {
      console.error(`Failed to fetch guard ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Create new guard
  async createGuard(guardData) {
    try {
      console.log("Creating new guard...");
      console.log("Guard data being sent:", guardData);

      const isFormData = guardData instanceof FormData;
      const config = isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

      const response = await api.post("/guard-profiles", guardData, config);
      console.log("Guard created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create guard:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw this.handleError(error);
    }
  },

  // Update guard
  async updateGuard(id, updateData) {
    try {
      console.log(`Updating guard ${id}...`);
      console.log("Update data:", updateData);

      // Check if have a file upload
      const hasFile = updateData.ProfilePicture instanceof File;

      if (hasFile) {
        const formData = new FormData();
        formData.append("FirstName", updateData.FirstName);
        formData.append("MiddleName", updateData.MiddleName || "");
        formData.append("LastName", updateData.LastName);
        formData.append("PhoneNumber", updateData.PhoneNumber);
        formData.append("Address", updateData.Address);
        formData.append("EmailAddress", updateData.EmailAddress);
        if (updateData.Nationality)
          formData.append("Nationality", updateData.Nationality);
        if (updateData.ProfilePicture) {
          formData.append("ProfilePicture", updateData.ProfilePicture);
        }

        formData.append("_method", "PUT");

        const response = await api.post(`/guard-profiles/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Guard updated successfully:", response.data);
        return response.data;
      } else {
        // Regular JSON update without file
        const response = await api.put(`/guard-profiles/${id}`, updateData);
        console.log("Guard updated successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to update guard:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      throw this.handleError(error);
    }
  },

  // Archive guard
  async archiveGuard(guardId, accountStatus = "Inactive") {
    try {
      console.log(`Archiving guard ${guardId} with status: ${accountStatus}`);
      const response = await api.patch(`/guard-profiles/${guardId}/archive`, {
        AccountStatus: accountStatus,
      });
      console.log("Guard archived successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to archive guard:", error);
      throw this.handleError(error);
    }
  },

  // Restore guard
  async restoreGuard(guardId) {
    try {
      console.log(`Restoring guard ${guardId}...`);
      const response = await api.patch(`/guard-profiles/${guardId}/unarchive`);
      console.log("Guard restored successfully:", response.data);

      if (response.data.data?.User?.AccountStatus) {
        console.log(
          `Guard AccountStatus set to: ${response.data.data.User.AccountStatus}`
        );
      }

      return response.data;
    } catch (error) {
      console.error("Failed to restore guard:", error);
      throw this.handleError(error);
    }
  },

  // Delete guard (permanent)
  async deleteGuard(id) {
    try {
      console.log(`Deleting guard ${id}...`);
      const response = await api.delete(`/guard-profiles/${id}`);
      console.log("Guard deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to delete guard:", error);
      throw this.handleError(error);
    }
  },

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data);

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
          return new Error("Guard not found");
        case 422:
          if (data.errors) {
            const errorMessages = Object.entries(data.errors)
              .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
              .join("; ");
            return new Error(`Validation failed: ${errorMessages}`);
          }
          return new Error(data.message || "Validation failed");
        case 500:
          console.error("500 Server Error Details:", data);
          return new Error(data.message || "Something went wrong");
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

export default guardService;
