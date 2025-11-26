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

const formatStudentData = (student) => {
  if (!student) return null;

  const profile = student.Profile || {};
  const user = student.User || {};
  const medicalInfo = student.MedicalInfo || {};
  const emergencyContact = student.EmergencyContact || {};
  const guardians = student.Guardians || [];

  const calculateAge = (dob) => {
    if (!dob) return "";
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age.toString();
    } catch {
      return "";
    }
  };

  return {
    id: student.StudentProfileID?.toString() || student.StudentNumber,
    studentNumber: student.StudentNumber,
    studentProfileId: student.StudentProfileID,
    name:
      profile.FirstName && profile.LastName
        ? `${profile.FirstName} ${
            profile.MiddleName ? profile.MiddleName + " " : ""
          }${profile.LastName}`.trim()
        : "Unknown",
    email: user.EmailAddress || "",

    // Student Status
    status: student.StudentStatus || "Enrolled",
    hasAccount: user.AccountStatus === "Active",
    accountStatus: user.AccountStatus || "PendingVerification",
    lastLoginDate: user.LastLoginDate,

    // Personal Details
    firstName: profile.FirstName || "",
    middleName: profile.MiddleName || "",
    lastName: profile.LastName || "",
    birthday: student.DateOfBirth || "",
    age: calculateAge(student.DateOfBirth),
    sex: student.Gender || "",
    qrCodeId: student.QRCodeID || "",
    nationality: student.Nationality || "",
    phoneNumber: profile.PhoneNumber || "",
    address: profile.Address || "",
    profilePictureURL: profile.ProfilePictureURL || "",
    profilePicture: profile.ProfilePictureURL || "",
    weight: medicalInfo.Weight || "",
    height: medicalInfo.Height || "",
    allergies: medicalInfo.Allergies
      ? medicalInfo.Allergies.split(",").map((a) => a.trim())
      : [],
    medicalConditions: medicalInfo.MedicalConditions
      ? medicalInfo.MedicalConditions.split(",").map((m) => m.trim())
      : [],
    medications: medicalInfo.Medications || "",
    emergencyContactPerson: emergencyContact.ContactPerson || "",
    emergencyContactNumber: emergencyContact.ContactNumber || "",
    guardians: guardians.map((guardian) => ({
      relationship: guardian.Relationship || "",
      fullName: guardian.FullName || "",
      contactNumber: guardian.ContactNumber || "",
      email: guardian.Email || "",
    })),
    archiveDate: student.ArchiveDate,
    isRecordArchived: !!student.ArchiveDate,
    isAccountArchived: user.IsArchived || false,
    rawData: student,
  };
};

export const studentService = {
  /**
   * Get all students
   * @param {Object} params - Query parameters (optional)
   * @returns {Promise<Object>} - { students: Array, total: number }
   */
  async getStudents(params = {}) {
    try {
      const response = await api.get("/student-profiles", { params });

      let studentsData = [];

      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (typeof response.data.data === "object") {
          studentsData = [response.data.data];
        }
      }

      const transformedStudents = studentsData.map(formatStudentData);

      return {
        students: transformedStudents,
        total: transformedStudents.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get students with no accounts (AccountStatus is PendingVerification or no User object)
   * @returns {Promise<Object>} - { students: Array, total: number }
   */
  async getStudentsWithNoAccounts() {
    try {
      const response = await api.get("/student-profiles");

      let studentsData = [];

      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (typeof response.data.data === "object") {
          studentsData = [response.data.data];
        }
      }

      // Filter students with no accounts (PendingVerification status or no User object)
      const studentsWithNoAccounts = studentsData.filter((student) => {
        const user = student.User || {};
        // No account if User object doesn't exist or AccountStatus is PendingVerification
        return (
          !user || !user.UserID || user.AccountStatus === "PendingVerification"
        );
      });

      const transformedStudents = studentsWithNoAccounts.map(formatStudentData);

      return {
        students: transformedStudents,
        total: transformedStudents.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get students with archived accounts
   * @returns {Promise<Object>} - { students: Array, total: number }
   */
  async getArchivedAccountStudents() {
    try {
      const response = await api.get("/student-profiles?archived=account");

      let studentsData = [];

      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (typeof response.data.data === "object") {
          studentsData = [response.data.data];
        }
      }

      const transformedStudents = studentsData.map(formatStudentData);

      return {
        students: transformedStudents,
        total: transformedStudents.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get students with archived records
   * @returns {Promise<Object>} - { students: Array, total: number }
   */
  async getArchivedRecordStudents() {
    try {
      const response = await api.get("/student-profiles?archived=record");

      let studentsData = [];

      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (typeof response.data.data === "object") {
          studentsData = [response.data.data];
        }
      }

      const transformedStudents = studentsData.map(formatStudentData);

      return {
        students: transformedStudents,
        total: transformedStudents.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get students with both record and account archived
   * @returns {Promise<Object>} - { students: Array, total: number }
   */
  async getFullyArchivedStudents() {
    try {
      const response = await api.get("/student-profiles?archived=both");

      let studentsData = [];

      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (typeof response.data.data === "object") {
          studentsData = [response.data.data];
        }
      }

      const transformedStudents = studentsData.map(formatStudentData);

      return {
        students: transformedStudents,
        total: transformedStudents.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get a single student by ID
   * @param {string|number} id - Student Profile ID (numeric ID, NOT StudentNumber)
   * @returns {Promise<Object>} - Formatted student object
   */
  async getStudentById(id) {
    try {
      const response = await api.get(`/student-profiles/${id}`);
      const studentData = response.data.data || response.data;

      if (studentData) {
        return formatStudentData(studentData);
      }

      return null;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get student grades by ID
   * @param {string|number} id - Student Profile ID (numeric)
   * @returns {Promise<Object>} - Student grades data
   */
  async getStudentGrades(id) {
    try {
      const response = await api.get(`/student-profiles/${id}/grades`);
      const gradesData = response.data.data || response.data;

      if (gradesData) {
        return gradesData;
      }

      return null;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get student attendance by ID
   * @param {string|number} id - Student Profile ID (numeric)
   * @returns {Promise<Object>} - Student attendance data
   */
  async getStudentAttendance(id) {
    try {
      const response = await api.get(`/student-profiles/${id}/attendance`);
      const attendanceData = response.data.data || response.data;

      if (attendanceData) {
        return attendanceData;
      }

      return null;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Update student information
   * @param {string|number} id - Student Profile ID (numeric)
   * @param {Object} studentData - Updated student data
   * @returns {Promise<Object>} - Updated student object
   */
  async updateStudent(id, studentData) {
    try {
      const hasFile = studentData.ProfilePicture instanceof File;
      const hasGuardians =
        studentData.Guardians && Array.isArray(studentData.Guardians);

      // Helper function to format guardians data
      const formatGuardiansForAPI = (guardians) => {
        return guardians.map((guardian, index) => ({
          GuardianID: guardian.guardianID || guardian.GuardianID || null,
          FullName: guardian.fullName || guardian.FullName || "",
          PhoneNumber: guardian.phoneNumber || guardian.PhoneNumber || "",
          EmailAddress: guardian.emailAddress || guardian.EmailAddress || "",
          RelationshipType:
            guardian.relationshipType ||
            guardian.RelationshipType ||
            "Guardian",
          Occupation: guardian.occupation || guardian.Occupation || "",
          WorkAddress: guardian.workAddress || guardian.WorkAddress || "",
          IsPrimaryContact: Boolean(
            guardian.IsPrimaryContact === true ||
              guardian.isPrimaryContact === true
          ),
          IsEmergencyContact: Boolean(
            guardian.IsEmergencyContact === true ||
              guardian.isEmergencyContact === true
          ),
          IsAuthorizedPickup: Boolean(
            guardian.IsAuthorizedPickup !== false &&
              guardian.isAuthorizedPickup !== false
          ),
          SortOrder: Math.max(
            1,
            parseInt(guardian.SortOrder || guardian.sortOrder) || index + 1
          ),
        }));
      };

      // Use FormData for file upload OR when we have guardians
      // This ensures consistent handling
      if (hasFile || hasGuardians) {
        const formData = new FormData();

        // Append all regular fields
        const regularFields = [
          "FirstName",
          "MiddleName",
          "LastName",
          "PhoneNumber",
          "Address",
          "EmailAddress",
          "DateOfBirth",
          "Gender",
          "Nationality",
          "ContactPerson",
          "ContactNumber",
          "Height",
          "Weight",
          "Allergies",
          "MedicalConditions",
          "Medications",
          "Religion",
          "Birthplace",
          "MotherTongue",
        ];

        regularFields.forEach((field) => {
          if (studentData[field] !== undefined && studentData[field] !== null) {
            formData.append(field, studentData[field]);
          }
        });

        // Handle Guardians - append each field individually
        if (hasGuardians && studentData.Guardians.length > 0) {
          const formattedGuardians = formatGuardiansForAPI(
            studentData.Guardians
          );

          // Append each guardian field individually
          formattedGuardians.forEach((guardian, index) => {
            // Append GuardianID (can be null for new guardians)
            if (guardian.GuardianID !== null) {
              formData.append(
                `Guardians[${index}][GuardianID]`,
                guardian.GuardianID
              );
            }

            // Append all other fields
            formData.append(
              `Guardians[${index}][FullName]`,
              guardian.FullName || ""
            );
            formData.append(
              `Guardians[${index}][PhoneNumber]`,
              guardian.PhoneNumber || ""
            );
            formData.append(
              `Guardians[${index}][EmailAddress]`,
              guardian.EmailAddress || ""
            );
            formData.append(
              `Guardians[${index}][RelationshipType]`,
              guardian.RelationshipType || "Guardian"
            );
            formData.append(
              `Guardians[${index}][Occupation]`,
              guardian.Occupation || ""
            );
            formData.append(
              `Guardians[${index}][WorkAddress]`,
              guardian.WorkAddress || ""
            );
            formData.append(
              `Guardians[${index}][IsPrimaryContact]`,
              guardian.IsPrimaryContact ? "1" : "0"
            );
            formData.append(
              `Guardians[${index}][IsEmergencyContact]`,
              guardian.IsEmergencyContact ? "1" : "0"
            );
            formData.append(
              `Guardians[${index}][IsAuthorizedPickup]`,
              guardian.IsAuthorizedPickup ? "1" : "0"
            );
            formData.append(
              `Guardians[${index}][SortOrder]`,
              guardian.SortOrder
            );
          });
        }

        // Add file if present
        if (hasFile) {
          formData.append("ProfilePicture", studentData.ProfilePicture);
        }
        // Use POST with _method for PUT to handle file uploads
        formData.append("_method", "PUT");

        const response = await api.post(`/student-profiles/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const updatedStudent = response.data.data || response.data;
        return formatStudentData(updatedStudent);
      } else {
        const updateData = { ...studentData };
        const response = await api.put(`/student-profiles/${id}`, updateData);
        const updatedStudent = response.data.data || response.data;
        return formatStudentData(updatedStudent);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Change student section
   * @param {string|number} id - Student Profile ID (numeric)
   * @param {string|number} sectionId - New Section ID
   * @returns {Promise<Object>} - Change section response
   */
  async changeSection(id, sectionId) {
    try {
      const response = await api.patch(
        `/student-profiles/${id}/change-section`,
        {
          NewSectionID: sectionId,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Archive student record only
   * @param {string|number} id - Student Profile ID (numeric)
   * @param {string} reason - Archive reason (Withdrawn, Graduated, On Leave)
   * @returns {Promise<Object>} - Archive response
   */
  async archiveStudentRecord(id, reason) {
    try {
      const response = await api.patch(
        `/student-profiles/${id}/archive-record`,
        {
          StudentStatus: reason,
          archiveDate: new Date().toISOString().split("T")[0],
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Archive student account only
   * @param {string|number} id - Student Profile ID (numeric)
   * @param {string} reason - Archive reason (Inactive, Suspended)
   * @returns {Promise<Object>} - Archive response
   */
  async archiveStudentAccount(id, reason) {
    try {
      const response = await api.patch(
        `/student-profiles/${id}/archive-account`,
        {
          AccountStatus: reason,
          archiveDate: new Date().toISOString().split("T")[0],
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Archive both student record and account
   * @param {string|number} id - Student Profile ID (numeric)
   * @param {string} recordReason - Record archive reason (Withdrawn, Graduated, On Leave)
   * @param {string} accountReason - Account archive reason (Inactive, Suspended)
   * @returns {Promise<Object>} - Archive response
   */
  async archiveStudentBoth(id, recordReason, accountReason) {
    try {
      const response = await api.patch(`/student-profiles/${id}/archive`, {
        StudentStatus: recordReason,
        AccountStatus: accountReason,
        archiveDate: new Date().toISOString().split("T")[0],
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Restore an archived student record only
   * @param {string|number} id - Student Profile ID (numeric)
   * @returns {Promise<Object>} - Restore response
   */
  async restoreStudent(id) {
    try {
      const response = await api.patch(
        `/student-profiles/${id}/unarchive-record`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Restore archived student account only
   * @param {string|number} id - Student Profile ID (numeric)
   * @returns {Promise<Object>} - Restore response
   */
  async restoreStudentAccount(id) {
    try {
      const response = await api.patch(
        `/student-profiles/${id}/unarchive-account`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Restore both student record and account
   * @param {string|number} id - Student Profile ID (numeric)
   * @returns {Promise<Object>} - Restore response
   */
  async restoreStudentBoth(id) {
    try {
      const response = await api.patch(`/student-profiles/${id}/unarchive`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Activate student account or CREATE STUDENT PORTAL ACCOUNT
   * @param {string|number} id - Student Profile ID (numeric)
   * @returns {Promise<Object>} - Activation response
   */
  async activateStudentAccount(id) {
    try {
      const response = await api.post(
        `/student-profiles/${id}/activate-account`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Bulk activate student accounts
   * @param {Array} studentProfileIDs - Array of student profile IDs
   * @returns {Promise<Object>} - Bulk activation response
   */
  async bulkActivateAccounts(studentProfileIDs) {
    try {
      const response = await api.post(
        "/student-profiles/bulk-activate-accounts",
        {
          StudentProfileIDs: studentProfileIDs,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Bulk archive student accounts
   * @param {Array} studentProfileIDs - Array of student profile IDs
   * @param {string} accountStatus - Account status (Suspended, Inactive)
   * @returns {Promise<Object>} - Bulk archive response
   */
  async bulkArchiveAccounts(studentProfileIDs, accountStatus) {
    try {
      const response = await api.post(
        "/student-profiles/bulk-archive-accounts",
        {
          StudentProfileIDs: studentProfileIDs,
          AccountStatus: accountStatus,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;

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
          return new Error("Resource not found");
        case 422:
          if (data.errors) {
            const errorMessages = Object.entries(data.errors)
              .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
              .join("; ");
            return new Error(`Validation failed: ${errorMessages}`);
          }
          return new Error(data.message || "Validation failed");
        case 500:
          return new Error(
            data.message || "Server error - Please try again later"
          );
        default:
          return new Error(data.message || "An unexpected error occurred");
      }
    } else if (error.request) {
      return new Error("Network error - Please check your connection");
    } else {
      return new Error(error.message || "An unexpected error occurred");
    }
  },
};

export default studentService;
