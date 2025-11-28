import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const formatTeacherName = (teacher) => {
  if (!teacher) return "Not Assigned";

  const firstName = teacher.FirstName || teacher.firstName || "";
  const middleName = teacher.MiddleName || teacher.middleName || "";
  const lastName = teacher.LastName || teacher.lastName || "";

  if (firstName && lastName) {
    if (middleName) {
      const middleInitial = middleName.charAt(0).toUpperCase() + ".";
      return `${firstName} ${middleInitial} ${lastName}`;
    }
    return `${firstName} ${lastName}`;
  }

  return firstName || lastName || "Not Assigned";
};

export const manageGradeLevelsService = {
  async createSchoolYear(schoolYearData) {
    try {
      const response = await api.post("/school-years", schoolYearData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getSchoolYears(params = {}) {
    try {
      const response = await api.get("/school-years", { params });

      let schoolYearsData = [];

      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          schoolYearsData = response.data.data;
        } else if (typeof response.data.data === "object") {
          schoolYearsData = [response.data.data];
        }
      }
      if (schoolYearsData.length > 0) {
        const transformedData = schoolYearsData.map((schoolYear) => {
          const gradeLevels =
            schoolYear.GradeLevels?.map((gradeLevel) => {
              const sections =
                gradeLevel.Sections?.map((section) => {
                  let adviserName = "Not Assigned";
                  let adviserId = null;
                  let specialization = "Not Specified";
                  let profilePictureURL = null;

                  if (section.Adviser) {
                    adviserName = formatTeacherName(section.Adviser);
                    adviserId = section.Adviser.EmployeeNumber;
                    specialization =
                      section.Adviser.Specialization || "Not Specified";
                    profilePictureURL = section.Adviser.ProfilePictureURL;
                  } else if (section.AdviserTeacher) {
                    adviserName = formatTeacherName(section.AdviserTeacher);
                    adviserId = section.AdviserTeacher.EmployeeNumber;
                    specialization =
                      section.AdviserTeacher.Specialization || "Not Specified";
                    profilePictureURL =
                      section.AdviserTeacher.ProfilePictureURL;
                  } else if (section.Teacher) {
                    adviserName = formatTeacherName(section.Teacher);
                    adviserId = section.Teacher.EmployeeNumber;
                    specialization =
                      section.Teacher.Specialization || "Not Specified";
                    profilePictureURL = section.Teacher.ProfilePictureURL;
                  } else if (section.AdviserName) {
                    adviserName = section.AdviserName;
                  }

                  if (!adviserId) {
                    adviserId =
                      section.AdviserTeacherID ||
                      section.AdviserID ||
                      section.TeacherID;
                  }

                  return {
                    ...section,
                    AdviserName: adviserName,
                    AdviserID: adviserId,
                    Specialization: specialization,
                    ProfilePictureURL: profilePictureURL,
                    Students: section.Students,
                    StudentsURL: section.Students,
                    Attendance: section.Attendance,
                  };
                }) || [];

              return {
                id: gradeLevel.GradeLevelID?.toString(),
                levelName: gradeLevel.LevelName || "",
                sortOrder: gradeLevel.SortOrder || 0,
                sections: sections,
              };
            }) || [];

          return {
            id: schoolYear.SchoolYearID?.toString(),
            yearName: schoolYear.YearName || "",
            startDate: schoolYear.StartDate || "",
            endDate: schoolYear.EndDate || "",
            isActive: schoolYear.IsActive === true,
            gradeLevels: gradeLevels.sort((a, b) => a.sortOrder - b.sortOrder),
            rawData: schoolYear,
          };
        });

        return {
          schoolYears: transformedData,
          total: transformedData.length,
          pagination: response.data.pagination || null, // Return pagination data
        };
      }

      console.log("No school years found in the response");
      return {
        schoolYears: [],
        total: 0,
        pagination: null,
      };
    } catch (error) {
      console.error("Error in getSchoolYears:", error);
      throw this.handleError(error);
    }
  },

  async getSchoolYearById(id) {
    try {
      const response = await api.get(`/school-years/${id}`);
      const schoolYear = response.data.data || response.data;

      if (schoolYear) {
        const gradeLevels =
          schoolYear.GradeLevels?.map((gradeLevel) => {
            const sections =
              gradeLevel.Sections?.map((section) => {
                let adviserName = "Not Assigned";
                let adviserId = null;

                if (section.Adviser) {
                  adviserName = formatTeacherName(section.Adviser);
                  adviserId =
                    section.Adviser.AdviserTeacherID || section.Adviser.id;
                } else if (section.AdviserTeacher) {
                  adviserName = formatTeacherName(section.AdviserTeacher);
                  adviserId =
                    section.AdviserTeacher.AdviserTeacherID ||
                    section.AdviserTeacher.id;
                } else if (section.AdviserName) {
                  adviserName = section.AdviserName;
                }

                if (!adviserId) {
                  adviserId = section.AdviserTeacherID || section.AdviserID;
                }

                return {
                  ...section,
                  AdviserName: adviserName,
                  AdviserID: adviserId,
                  Students: section.Students,
                  StudentsURL: section.Students,
                  Attendance: section.Attendance,
                };
              }) || [];

            return {
              id: gradeLevel.GradeLevelID?.toString(),
              levelName: gradeLevel.LevelName || "",
              sortOrder: gradeLevel.SortOrder || 0,
              sections: sections,
            };
          }) || [];

        return {
          id: schoolYear.SchoolYearID?.toString() || id,
          yearName: schoolYear.YearName || "",
          startDate: schoolYear.StartDate || "",
          endDate: schoolYear.EndDate || "",
          isActive: schoolYear.IsActive === true,
          gradeLevels: gradeLevels.sort((a, b) => a.sortOrder - b.sortOrder),
          rawData: schoolYear,
        };
      }

      return schoolYear;
    } catch (error) {
      console.error("Error in getSchoolYearById:", error);
      throw this.handleError(error);
    }
  },

  // GET SCHEDULE OF THAT SPECIFIC SECTION
  async getSectionSchedule(sectionId) {
    try {
      const response = await api.get(`/sections/${sectionId}/schedule`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule for section ${sectionId}:`, error);

      if (error.response?.status === 404) {
        console.log(`No schedule found for section ${sectionId}`);
        return { data: [], message: "No schedule found for this section" };
      }

      throw this.handleError(error);
    }
  },

  // GET ATTENDANCE OF THAT SPECIFIC SECTION
  async getSectionAttendance(sectionId) {
    try {
      const response = await api.get(`/sections/${sectionId}/attendance`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching attendance for section ${sectionId}:`,
        error
      );

      if (error.response?.status === 404) {
        console.log(`No attendance found for section ${sectionId}`);
        return {
          data: {
            Section: {
              SectionID: sectionId,
              SectionName: "",
              GradeLevel: "",
              SchoolYear: "",
              Adviser: {},
            },
            AttendanceByDate: [],
            Summary: {
              TotalDays: 0,
              TotalAttendanceRecords: 0,
              AttendanceBreakdown: {
                Present: 0,
                Late: 0,
                Absent: 0,
                Excused: 0,
              },
              UniqueStudents: 0,
            },
          },
          message: "No attendance records found for this section",
        };
      }

      throw this.handleError(error);
    }
  },

  async getAttendanceByURL(attendanceURL) {
    try {
      if (!attendanceURL) {
        return { data: [] };
      }
      let cleanPath;
      if (attendanceURL.startsWith("http")) {
        const url = new URL(attendanceURL);
        cleanPath = url.pathname + url.search;
      } else {
        cleanPath = attendanceURL;
      }
      cleanPath = cleanPath.replace("/api/v1", "");

      const response = await api.get(cleanPath);

      if (response.data && response.data.data) {
        return { data: response.data.data };
      } else if (Array.isArray(response.data)) {
        return { data: response.data };
      } else {
        return { data: response.data };
      }
    } catch (error) {
      console.error(`Error fetching attendance from URL:`, error);

      if (error.response?.status === 404) {
        console.log("No attendance found (404)");
        return {
          data: {
            Section: {},
            AttendanceByDate: [],
            Summary: {
              TotalDays: 0,
              TotalAttendanceRecords: 0,
              AttendanceBreakdown: {
                Present: 0,
                Late: 0,
                Absent: 0,
                Excused: 0,
              },
              UniqueStudents: 0,
            },
          },
        };
      }

      throw this.handleError(error);
    }
  },

  async getScheduleByURL(scheduleURL) {
    try {
      if (!scheduleURL) {
        return { data: [] };
      }
      let cleanPath;
      if (scheduleURL.startsWith("http")) {
        const url = new URL(scheduleURL);
        cleanPath = url.pathname + url.search;
      } else {
        cleanPath = scheduleURL;
      }
      cleanPath = cleanPath.replace("/api/v1", "");

      const response = await api.get(cleanPath);

      if (response.data && response.data.data) {
        return { data: response.data.data };
      } else if (Array.isArray(response.data)) {
        return { data: response.data };
      } else {
        return { data: [] };
      }
    } catch (error) {
      console.error(`Error fetching schedule from URL:`, error);

      if (error.response?.status === 404) {
        console.log("No schedule found (404)");
        return { data: [] };
      }

      throw this.handleError(error);
    }
  },

  async getSectionStudents(sectionId) {
    try {
      const response = await api.get(`/sections/${sectionId}/students`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching students for section ${sectionId}:`, error);

      if (error.response?.status === 404) {
        console.log(
          `No students found for section ${sectionId} (this is normal if section is empty)`
        );
        return { data: [], message: "No students found in this section" };
      }

      throw this.handleError(error);
    }
  },

  // Add this method to manageGradeLevelsService
  async getStudentsByURL(studentsURL) {
    try {
      if (!studentsURL) {
        return { data: [] };
      }
      let cleanPath;
      if (studentsURL.startsWith("http")) {
        const url = new URL(studentsURL);
        cleanPath = url.pathname + url.search;
      } else {
        cleanPath = studentsURL;
      }
      cleanPath = cleanPath.replace("/api/v1", "");

      const response = await api.get(cleanPath);

      if (response.data && response.data.data) {
        return { data: response.data.data };
      } else if (Array.isArray(response.data)) {
        return { data: response.data };
      } else {
        return { data: [] };
      }
    } catch (error) {
      console.error(`Error fetching students from URL:`, error);

      if (error.response?.status === 404) {
        console.log("No students found (404)");
        return { data: [] };
      }

      throw this.handleError(error);
    }
  },

  async getStudentCount(studentsURL) {
    try {
      if (!studentsURL) {
        console.log("No students URL provided");
        return 0;
      }

      const url = new URL(studentsURL);
      const path = url.pathname + url.search;
      const cleanPath = path.replace("/api/v1", "");
      const response = await api.get(cleanPath);

      if (response.data?.data && Array.isArray(response.data.data)) {
        console.log(`Found ${response.data.data.length} students`);
        return response.data.data.length;
      }

      if (Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} students (direct array)`);
        return response.data.length;
      }

      console.warn(
        "Could not determine student count from response:",
        response.data
      );
      return 0;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("No students found (404)");
        return 0;
      }
      console.error("Error fetching student count:", error.message);
      return 0;
    }
  },

  async updateSchoolYear(id, schoolYearData) {
    try {
      const response = await api.put(`/school-years/${id}`, schoolYearData);
      return response.data;
    } catch (error) {
      console.error("Error updating school year:", error);
      throw this.handleError(error);
    }
  },

  async createSection(sectionData) {
    try {
      const response = await api.post("/sections", sectionData);
      return response.data;
    } catch (error) {
      console.error("Error creating section:", error);
      throw this.handleError(error);
    }
  },

  async autoCreateSections(gradeLevelId, schoolYearId) {
    try {
      const response = await api.post("/sections/auto-create", {
        gradeLevelId,
        schoolYearId,
      });
      return response.data;
    } catch (error) {
      console.error("Error auto-creating sections:", error);
      throw this.handleError(error);
    }
  },

  async updateSection(sectionId, sectionData) {
    try {
      const response = await api.put(`/sections/${sectionId}`, sectionData);
      return response.data;
    } catch (error) {
      console.error("Error updating section:", error);
      throw this.handleError(error);
    }
  },

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

export default manageGradeLevelsService;
