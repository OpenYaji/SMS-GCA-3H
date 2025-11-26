import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// Create axios instance with base configuration
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

// Mock data for activity settings
// const mockActivitySettings = [
//   {
//     category: "General",
//     settings: [
//       {
//         id: "general_profile_updates",
//         name: "Profile Info Updates",
//         description: "When users update their profile information",
//         enabled: true,
//       },
//       {
//         id: "general_medical_updates",
//         name: "Medical Info Updates",
//         description: "When users update their medical information",
//         enabled: true,
//       },
//     ],
//   },
//   {
//     category: "Student",
//     settings: [
//       {
//         id: "student_promoted",
//         name: "Promoted to Higher Grade Level",
//         description: "When students are promoted to the next grade",
//         enabled: true,
//       },
//       {
//         id: "student_created",
//         name: "Student Account Created",
//         description: "When new student accounts are created",
//         enabled: true,
//       },
//     ],
//   },
//   {
//     category: "Parent",
//     settings: [
//       {
//         id: "parent_payment",
//         name: "Payment Activities",
//         description: "Payment transactions and updates",
//         enabled: true,
//       },
//     ],
//   },
//   {
//     category: "Registrar",
//     settings: [
//       {
//         id: "registrar_schedule_proposal",
//         name: "Submitted Schedule Proposals",
//         description: "When registrars submit new schedule proposals",
//         enabled: true,
//       },
//       {
//         id: "registrar_accepted_students",
//         name: "Accepted Students",
//         description: "Number of students accepted and their grades",
//         enabled: true,
//       },
//     ],
//   },
//   {
//     category: "Teacher",
//     settings: [
//       {
//         id: "teacher_class_adjustments",
//         name: "Class Dismissal Adjustments",
//         description: "Changes to class dismissal schedules",
//         enabled: true,
//       },
//     ],
//   },
//   {
//     category: "Admin",
//     settings: [
//       {
//         id: "admin_account_created",
//         name: "Created User Accounts",
//         description: "When admin creates new user accounts",
//         enabled: true,
//       },
//       {
//         id: "admin_record_created",
//         name: "Created Records and Accounts",
//         description: "Details of who created which records",
//         enabled: true,
//       },
//       {
//         id: "admin_account_updated",
//         name: "Updated User Accounts",
//         description: "When admin updates user account information",
//         enabled: true,
//       },
//       {
//         id: "admin_account_archived",
//         name: "Archived User Accounts",
//         description: "When admin archives user accounts",
//         enabled: true,
//       },
//       {
//         id: "admin_account_restored",
//         name: "Restored User Accounts",
//         description: "When admin restores archived accounts",
//         enabled: true,
//       },
//       {
//         id: "admin_announcement_posted",
//         name: "Posted Announcements",
//         description: "When admin posts new announcements",
//         enabled: true,
//       },
//       {
//         id: "admin_announcement_updated",
//         name: "Updated Announcements",
//         description: "When admin updates existing announcements",
//         enabled: true,
//       },
//       {
//         id: "admin_announcement_archived",
//         name: "Archived Announcements",
//         description: "When admin archives announcements",
//         enabled: true,
//       },
//     ],
//   },
// ];

// Simulate API calls with real API integration
export const activitySettingsService = {
  getActivitySettings: async () => {
    try {
      // Try to fetch from real API first
      const response = await api.get("/activity-settings");

      if (!response.data) throw new Error("Empty API response");

      console.log("Using real API data for activity settings");
      return response.data.data || response.data;
    } catch (err) {
      // Fallback to empty array instead of mock data
      console.error("Failed to fetch activity settings from API:", err.message);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // return mockActivitySettings;

      return [];
    }
  },

  saveActivitySettings: async (settings) => {
    try {
      // Try to save to real API
      const response = await api.post("/activity-settings", { settings });

      if (!response.data) throw new Error("Failed to save settings");

      console.log("Settings saved via real API");
      return response.data;
    } catch (err) {
      // Fallback to mock save (commented out)
      console.error("Failed to save activity settings via API:", err.message);
      // await new Promise((resolve) => setTimeout(resolve, 300));
      // console.log("Settings to be saved:", settings);
      // return { success: true, message: "Settings saved successfully" };

      throw err;
    }
  },
};
