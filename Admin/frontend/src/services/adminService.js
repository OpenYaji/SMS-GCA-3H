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

export const adminService = {
  async getAdmins(params = {}) {
    try {
      const response = await api.get("/admin-profiles", { params });
      console.log("Raw API response for admins:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const transformedData = response.data.data.map((admin) => {
          const isArchived =
            admin.User?.IsArchived === true ||
            admin.is_archived === true ||
            admin.archived === true ||
            admin.User?.archived === true;

          console.log(
            `Admin ${admin.Profile?.FirstName} ${admin.Profile?.LastName}:`,
            {
              id: admin.AdminProfileID,
              archived: isArchived,
              IsArchived: admin.User?.IsArchived,
              is_archived: admin.is_archived,
              userObject: admin.User,
            }
          );

          return {
            id: admin.AdminProfileID?.toString(),
            adminId: admin.EmployeeNumber,
            name: `${admin.Profile?.FirstName || ""} ${
              admin.Profile?.LastName || ""
            }`.trim(),
            firstName: admin.Profile?.FirstName || "",
            lastName: admin.Profile?.LastName || "",
            middleName: admin.Profile?.MiddleName || "",
            email: admin.User?.EmailAddress || "",
            archived: isArchived,
            accountStatus: admin.User?.AccountStatus || "Active",
            profilePicture:
              admin.Profile?.ProfilePicture ||
              admin.Profile?.ProfilePictureURL ||
              "",
            rawData: admin,
          };
        });

        console.log(
          `Transformed admins - Total: ${transformedData.length}, Archived: ${
            transformedData.filter((r) => r.archived).length
          }`
        );

        return {
          admins: transformedData,
          total: transformedData.length,
        };
      }

      return { admins: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      throw this.handleError(error);
    }
  },

  async getArchivedAdmins() {
    try {
      console.log("Fetching archived admins...");
      const response = await api.get("/admin-profiles", {
        params: { archived: true },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const archivedAdmins = response.data.data.filter(
          (admin) =>
            admin.User?.IsArchived === true || admin.is_archived === true
        );

        const transformedData = archivedAdmins.map((admin) => {
          return {
            id: admin.AdminProfileID?.toString(),
            adminId: admin.EmployeeNumber,
            name: `${admin.Profile?.FirstName || ""} ${
              admin.Profile?.LastName || ""
            }`.trim(),
            firstName: admin.Profile?.FirstName || "",
            lastName: admin.Profile?.LastName || "",
            middleName: admin.Profile?.MiddleName || "",
            email: admin.User?.EmailAddress || "",
            profilePicture: admin.Profile?.ProfilePicture || "",
            archived: true,
            accountStatus: admin.User?.AccountStatus || "Inactive",
            rawData: admin,
          };
        });

        console.log(`Found ${transformedData.length} archived admins`);
        return {
          admins: transformedData,
          total: transformedData.length,
        };
      }

      return { admins: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch archived admins:", error);
      throw this.handleError(error);
    }
  },

  async getAdminById(id) {
    try {
      const response = await api.get(`/admin-profiles/${id}`);
      const admin = response.data.data || response.data;

      if (admin) {
        const isArchived =
          admin.User?.IsArchived === true || admin.is_archived === true;

        return {
          id: admin.AdminProfileID?.toString() || id,
          adminId: admin.EmployeeNumber,
          name: `${admin.Profile?.FirstName || ""} ${
            admin.Profile?.LastName || ""
          }`.trim(),
          email: admin.User?.EmailAddress || "",
          firstName: admin.Profile?.FirstName || "",
          lastName: admin.Profile?.LastName || "",
          middleName: admin.Profile?.MiddleName || "",
          phone: admin.Profile?.PhoneNumber || "",
          address: admin.Profile?.Address || "",
          nationality: admin.Profile?.Nationality || "",
          profilePicture: admin.Profile?.ProfilePicture || "",
          archived: isArchived,
          accountStatus: admin.User?.AccountStatus || "Active",
          ...admin,
        };
      }

      return admin;
    } catch (error) {
      console.error(`Failed to fetch admin ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Create new admin
  async createAdmin(adminData) {
    try {
      const isFormData = adminData instanceof FormData;

      const config = isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

      const response = await api.post("/admin-profiles", adminData, config);
      console.log("Admin created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create Admin:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw this.handleError(error);
    }
  },

  // Update admin
  async updateAdmin(id, updateData) {
    try {
      console.log(`Updating admin ${id}...`);
      console.log("Update data:", updateData);

      // Check if we have a file upload
      const hasFile =
        updateData instanceof FormData ||
        updateData.ProfilePicture instanceof File;

      if (hasFile && !(updateData instanceof FormData)) {
        const formData = new FormData();
        Object.keys(updateData).forEach((key) => {
          if (key === "ProfilePicture") {
            formData.append(key, updateData[key]);
          } else {
            formData.append(key, updateData[key]);
          }
        });
        formData.append("_method", "PUT");

        const response = await api.post(`/admin-profiles/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Admin updated successfully:", response.data);
        return response.data;
      } else if (updateData instanceof FormData) {
        updateData.append("_method", "PUT");
        const response = await api.post(`/admin-profiles/${id}`, updateData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Admin updated successfully:", response.data);
        return response.data;
      } else {
        // Regular JSON update without file
        const response = await api.put(`/admin-profiles/${id}`, updateData);
        console.log("Admin updated successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to update admin:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);

        if (error.response.status === 422) {
          console.error("VALIDATION ERRORS DETAIL:");
          console.error("Field errors:", error.response.data.errors);
        }
      }
      throw this.handleError(error);
    }
  },

  // Archive admin
  async archiveAdmin(adminId, accountStatus = "Inactive") {
    try {
      console.log(`Archiving admin ${adminId} with status: ${accountStatus}`);
      const response = await api.patch(`/admin-profiles/${adminId}/archive`, {
        AccountStatus: accountStatus,
      });
      console.log("Admin archived successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to archive admin:", error);
      throw this.handleError(error);
    }
  },

  // Restore admin
  async restoreAdmin(adminId) {
    try {
      const response = await api.patch(`/admin-profiles/${adminId}/unarchive`);

      // Verify AccountStatus is set to Active
      if (response.data.data?.User?.AccountStatus) {
        console.log(
          `Admin AccountStatus set to: ${response.data.data.User.AccountStatus}`
        );
      }

      return response.data;
    } catch (error) {
      console.error("Failed to restore admin:", error);
      throw this.handleError(error);
    }
  },

  // Delete admin (permanent)
  async deleteAdmin(id) {
    try {
      console.log(`Deleting admin ${id}...`);
      const response = await api.delete(`/admin-profiles/${id}`);
      console.log("Admin deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to delete admin:", error);
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
          return new Error("Admin not found");
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

export default adminService;
