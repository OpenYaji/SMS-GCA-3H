// registrarService.js
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

export const registrarService = {
  async getRegistrars(params = {}) {
    try {
      const response = await api.get("/registrar-profiles", { params });
      console.log("Raw API response for registrars:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const transformedData = response.data.data.map((registrar) => {
          const isArchived =
            registrar.User?.IsArchived === true ||
            registrar.is_archived === true ||
            registrar.archived === true ||
            registrar.User?.archived === true;

          console.log(
            `Registrar ${registrar.Profile?.FirstName} ${registrar.Profile?.LastName}:`,
            {
              id: registrar.RegistrarProfileID,
              archived: isArchived,
              IsArchived: registrar.User?.IsArchived,
              is_archived: registrar.is_archived,
              userObject: registrar.User,
            }
          );

          return {
            id: registrar.RegistrarProfileID?.toString(),
            registrarId: registrar.EmployeeNumber,
            name: `${registrar.Profile?.FirstName || ""} ${
              registrar.Profile?.LastName || ""
            }`.trim(),
            // ADDED: Individual name fields
            firstName: registrar.Profile?.FirstName || "",
            lastName: registrar.Profile?.LastName || "",
            middleName: registrar.Profile?.MiddleName || "",
            email: registrar.User?.EmailAddress || "",
            archived: isArchived,
            accountStatus: registrar.User?.AccountStatus || "Active",
            profilePicture:
              registrar.Profile?.ProfilePicture ||
              registrar.Profile?.ProfilePictureURL ||
              "",
            rawData: registrar,
          };
        });

        console.log(
          `Transformed registrars - Total: ${
            transformedData.length
          }, Archived: ${transformedData.filter((r) => r.archived).length}`
        );

        return {
          registrars: transformedData,
          total: transformedData.length,
        };
      }

      return { registrars: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch registrars:", error);
      throw this.handleError(error);
    }
  },

  async getArchivedRegistrars() {
    try {
      console.log("Fetching archived registrars...");
      const response = await api.get("/registrar-profiles", {
        params: { archived: true },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const archivedRegistrars = response.data.data.filter(
          (registrar) =>
            registrar.User?.IsArchived === true ||
            registrar.is_archived === true
        );

        const transformedData = archivedRegistrars.map((registrar) => {
          return {
            id: registrar.RegistrarProfileID?.toString(),
            registrarId: registrar.EmployeeNumber,
            name: `${registrar.Profile?.FirstName || ""} ${
              registrar.Profile?.LastName || ""
            }`.trim(),
            firstName: registrar.Profile?.FirstName || "",
            lastName: registrar.Profile?.LastName || "",
            middleName: registrar.Profile?.MiddleName || "",
            email: registrar.User?.EmailAddress || "",
            profilePicture: registrar.Profile?.ProfilePicture || "",
            archived: true,
            accountStatus: registrar.User?.AccountStatus || "Inactive",
            rawData: registrar,
          };
        });

        console.log(`Found ${transformedData.length} archived registrars`);
        return {
          registrars: transformedData,
          total: transformedData.length,
        };
      }

      return { registrars: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch archived registrars:", error);
      throw this.handleError(error);
    }
  },

  async getRegistrarById(id) {
    try {
      const response = await api.get(`/registrar-profiles/${id}`);
      const registrar = response.data.data || response.data;

      if (registrar) {
        const isArchived =
          registrar.User?.IsArchived === true || registrar.is_archived === true;

        return {
          id: registrar.RegistrarProfileID?.toString() || id,
          registrarId: registrar.EmployeeNumber,
          name: `${registrar.Profile?.FirstName || ""} ${
            registrar.Profile?.LastName || ""
          }`.trim(),
          email: registrar.User?.EmailAddress || "",
          firstName: registrar.Profile?.FirstName || "",
          lastName: registrar.Profile?.LastName || "",
          middleName: registrar.Profile?.MiddleName || "",
          phone: registrar.Profile?.PhoneNumber || "",
          address: registrar.Profile?.Address || "",
          nationality: registrar.Profile?.Nationality || "",
          profilePicture: registrar.Profile?.ProfilePicture || "",
          archived: isArchived,
          accountStatus: registrar.User?.AccountStatus || "Active",
          ...registrar,
        };
      }

      return registrar;
    } catch (error) {
      console.error(`Failed to fetch registrar ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Create new registrar
  async createRegistrar(registrarData) {
    try {
      const isFormData = registrarData instanceof FormData;

      const config = isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

      const response = await api.post(
        "/registrar-profiles",
        registrarData,
        config
      );
      console.log("Registrar created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create Registrar:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw this.handleError(error);
    }
  },

  // Update registrar
  async updateRegistrar(id, updateData) {
    try {
      console.log(`Updating registrar ${id}...`);
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

        const response = await api.post(`/registrar-profiles/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Registrar updated successfully:", response.data);
        return response.data;
      } else if (updateData instanceof FormData) {
        updateData.append("_method", "PUT");
        const response = await api.post(
          `/registrar-profiles/${id}`,
          updateData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Registrar updated successfully:", response.data);
        return response.data;
      } else {
        // Regular JSON update without file
        const response = await api.put(`/registrar-profiles/${id}`, updateData);
        console.log("Registrar updated successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to update registrar:", error);
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

  // Archive registrar
  async archiveRegistrar(registrarId, accountStatus = "Inactive") {
    try {
      console.log(
        `Archiving registrar ${registrarId} with status: ${accountStatus}`
      );
      const response = await api.patch(
        `/registrar-profiles/${registrarId}/archive`,
        { AccountStatus: accountStatus }
      );
      console.log("Registrar archived successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to archive registrar:", error);
      throw this.handleError(error);
    }
  },

  // Restore registrar
  async restoreRegistrar(registrarId) {
    try {
      const response = await api.patch(
        `/registrar-profiles/${registrarId}/unarchive`
      );

      if (response.data.data?.User?.AccountStatus) {
        console.log(
          `Registrar AccountStatus set to: ${response.data.data.User.AccountStatus}`
        );
      }

      return response.data;
    } catch (error) {
      console.error("Failed to restore registrar:", error);
      throw this.handleError(error);
    }
  },

  // Delete registrar (permanent)
  async deleteRegistrar(id) {
    try {
      console.log(`Deleting registrar ${id}...`);
      const response = await api.delete(`/registrar-profiles/${id}`);
      console.log("Registrar deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to delete registrar:", error);
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
          return new Error("Registrar not found");
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

export default registrarService;
