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

export const teacherService = {
  async getTeachers(params = {}) {
    try {
      const response = await api.get("/teacher-profiles", { params });

      if (response.data && Array.isArray(response.data.data)) {
        const transformedData = response.data.data.map((teacher) => {
          const isArchived = teacher.User?.IsArchived === true;

          console.log(
            `Teacher ${teacher.Profile?.FirstName} ${teacher.Profile?.LastName}:`,
            {
              id: teacher.TeacherProfileID,
              archived: isArchived,
              IsArchived: teacher.User?.IsArchived,
              userObject: teacher.User,
            }
          );

          const userTypeForDisplay =
            teacher.User?.UserType === "HeadTeacher"
              ? "Head Teacher"
              : "Teacher";

          return {
            id: teacher.TeacherProfileID?.toString(),
            teacherId: teacher.EmployeeNumber,
            name: `${teacher.Profile?.FirstName || ""} ${
              teacher.Profile?.LastName || ""
            }`.trim(),
            email: teacher.User?.EmailAddress || "",
            subject: teacher.Specialization || "",
            sex: teacher.Profile?.Sex || "N/A",
            archived: isArchived,
            accountStatus: teacher.User?.AccountStatus || "Active",
            profilePicture: teacher.Profile?.ProfilePictureURL || "",
            userType: userTypeForDisplay,
            rawData: teacher,
          };
        });

        console.log(
          `Transformed teachers - Total: ${transformedData.length}, Archived: ${
            transformedData.filter((t) => t.archived).length
          }`
        );

        return {
          teachers: transformedData,
          total: transformedData.length,
        };
      }

      return { teachers: [], total: 0 };
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      throw this.handleError(error);
    }
  },

  async getTeacherById(id) {
    try {
      console.log(`Fetching teacher with ID: ${id}`);
      const response = await api.get(`/teacher-profiles/${id}`);
      console.log("Teacher fetched successfully:", response.data);

      const teacher = response.data.data || response.data;

      if (teacher) {
        const userTypeForDisplay =
          teacher.User?.UserType === "HeadTeacher" ? "Head Teacher" : "Teacher";

        return {
          id: teacher.TeacherProfileID?.toString() || id,
          teacherId: teacher.EmployeeNumber,
          name: `${teacher.Profile?.FirstName || ""} ${
            teacher.Profile?.LastName || ""
          }`.trim(),
          email: teacher.User?.EmailAddress || "",
          subject: teacher.Specialization || "",
          sex: teacher.Profile?.Sex || "N/A",
          firstName: teacher.Profile?.FirstName || "",
          lastName: teacher.Profile?.LastName || "",
          middleName: teacher.Profile?.MiddleName || "",
          phone: teacher.Profile?.PhoneNumber || "",
          address: teacher.Profile?.Address || "",
          archived: teacher.User?.IsArchived === true,
          accountStatus: teacher.User?.AccountStatus || "Active",
          userType: userTypeForDisplay,
          profilePicture: teacher.Profile?.ProfilePictureURL || null,
          ...teacher,
        };
      }

      return teacher;
    } catch (error) {
      console.error(`Failed to fetch teacher ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Create new teacher
  async createTeacher(teacherData) {
    try {
      const isFormData = teacherData instanceof FormData;

      const config = isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

      const response = await api.post("/teacher-profiles", teacherData, config);
      console.log("Teacher created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create teacher:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw this.handleError(error);
    }
  },

  // Update teacher
  async updateTeacher(id, updateData) {
    try {
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
        formData.append("Specialization", updateData.Specialization);
        formData.append("ProfilePicture", updateData.ProfilePicture);
        formData.append("_method", "PUT");

        const response = await api.post(`/teacher-profiles/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        // Regular JSON update without file
        const response = await api.put(`/teacher-profiles/${id}`, updateData);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to update teacher:", error);
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

  // Archive teacher
  async archiveTeacher(teacherId, accountStatus = "Inactive") {
    try {
      console.log(
        `Archiving teacher ${teacherId} with status: ${accountStatus}`
      );
      const response = await api.patch(
        `/teacher-profiles/${teacherId}/archive`,
        {
          AccountStatus: accountStatus,
        }
      );
      console.log("Teacher archived successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to archive teacher:", error);
      throw this.handleError(error);
    }
  },

  // Restore teacher
  async restoreTeacher(id) {
    try {
      const response = await api.patch(`/teacher-profiles/${id}/unarchive`);

      if (response.data.data?.User?.AccountStatus) {
        console.log(
          `Teacher AccountStatus set to: ${response.data.data.User.AccountStatus}`
        );
      }

      return response.data;
    } catch (error) {
      console.error("Failed to restore teacher:", error);
      throw this.handleError(error);
    }
  },
  // Delete teacher (permanent)
  async deleteTeacher(id) {
    try {
      console.log(`Deleting teacher ${id}...`);
      const response = await api.delete(`/teacher-profiles/${id}`);
      console.log("Teacher deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to delete teacher:", error);
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
          return new Error("Teacher not found");
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

export default teacherService;
