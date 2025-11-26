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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Comprehensive transformation for all system modules and user types
const transformActivityData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];

  return apiData.map((activity, index) => {
    const {
      Action,
      TableName,
      FirstName,
      LastName,
      UserRole,
      AdditionalContext,
      TargetUserName,
      ...rest
    } = activity;

    const userFullName = `${FirstName} ${LastName}`.trim();

    // Comprehensive entity mapping for all system modules
    const entityNames = {
      // Student Management
      studentprofile: "student profile",
      studentrecords: "student record",
      studentapplications: "student application",
      studentacademics: "academic record",

      // Staff Management
      staffprofile: "staff profile",
      teacherprofile: "teacher profile",
      adminprofile: "administrator profile",
      registrarprofile: "registrar profile",

      // User Accounts
      useraccounts: "user account",
      userroles: "user role",
      userpermissions: "user permission",

      // Financial
      payments: "payment",
      tuitionfees: "tuition fee",
      invoices: "invoice",
      transactions: "transaction",
      paymentmethods: "payment method",

      // Academic
      schedules: "schedule",
      classes: "class",
      courses: "course",
      subjects: "subject",
      sections: "section",
      enrollments: "enrollment",
      grades: "grade",
      transcripts: "transcript",
      assignments: "assignment",
      exams: "exam",

      // Announcements & Communications
      announcements: "announcement",
      notifications: "notification",
      messages: "message",
      bulletins: "bulletin",

      // Attendance
      attendance: "attendance record",
      attendancelogs: "attendance log",

      // Medical
      medicalrecords: "medical record",
      healthforms: "health form",
      immunizations: "immunization record",

      // System & Settings
      systemsettings: "system setting",
      academicyears: "academic year",
      semesters: "semester",
      departments: "department",
      configurations: "configuration",
    };

    // Enhanced action mapping with context-aware descriptions
    const actionPhrases = {
      "Updated an entry in": {
        action: "updated",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          if (targetUser) return `updated ${entity} for ${targetUser}`;
          return `updated ${entity}`;
        },
      },
      "Created an entry in": {
        action: "created",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          switch (table) {
            case "studentprofile":
              return targetUser
                ? `registered new student ${targetUser}`
                : "registered a new student";
            case "staffprofile":
            case "teacherprofile":
            case "adminprofile":
            case "registrarprofile":
              return targetUser
                ? `added new staff member ${targetUser}`
                : "added new staff member";
            case "useraccounts":
              return targetUser
                ? `created user account for ${targetUser}`
                : "created new user account";
            case "announcements":
              return "posted new announcement";
            case "payments":
              return "processed new payment";
            case "schedules":
              return "created new schedule";
            case "classes":
              return "created new class";
            default:
              return targetUser
                ? `created ${entity} for ${targetUser}`
                : `created new ${entity}`;
          }
        },
      },
      "Deleted an entry in": {
        action: "deleted",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          if (targetUser) return `deleted ${entity} for ${targetUser}`;
          return `deleted ${entity}`;
        },
      },
      "Viewed an entry in": {
        action: "viewed",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          if (targetUser) return `accessed ${entity} for ${targetUser}`;
          return `accessed ${entity}`;
        },
      },
      "Approved an entry in": {
        action: "approved",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          switch (table) {
            case "studentapplications":
              return targetUser
                ? `approved student application for ${targetUser}`
                : "approved student application";
            case "payments":
              return "approved payment transaction";
            case "schedules":
              return "approved schedule proposal";
            default:
              return targetUser
                ? `approved ${entity} for ${targetUser}`
                : `approved ${entity}`;
          }
        },
      },
      "Rejected an entry in": {
        action: "rejected",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          if (targetUser) return `rejected ${entity} for ${targetUser}`;
          return `rejected ${entity}`;
        },
      },
      "Processed an entry in": {
        action: "processed",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          if (table === "payments") return "processed financial transaction";
          if (targetUser) return `processed ${entity} for ${targetUser}`;
          return `processed ${entity}`;
        },
      },
      "Confirmed an entry in": {
        action: "confirmed",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          switch (table) {
            case "schedules":
              return "confirmed schedule";
            case "enrollments":
              return targetUser
                ? `confirmed enrollment for ${targetUser}`
                : "confirmed student enrollment";
            case "transactions":
              return "confirmed transaction";
            default:
              return targetUser
                ? `confirmed ${entity} for ${targetUser}`
                : `confirmed ${entity}`;
          }
        },
      },
      "Submitted an entry in": {
        action: "submitted",
        description: (table, user, targetUser) => {
          const entity = entityNames[table] || table;
          switch (table) {
            case "schedules":
              return "submitted schedule proposal";
            case "studentapplications":
              return "submitted student application";
            default:
              return targetUser
                ? `submitted ${entity} for ${targetUser}`
                : `submitted ${entity}`;
          }
        },
      },
    };

    const actionData = actionPhrases[Action] || {
      action:
        Action?.toLowerCase().replace(" an entry in", "") || "performed action",
      description: (table, user, targetUser) => {
        const entity = entityNames[table] || table;
        if (targetUser) return `${Action} ${entity} for ${targetUser}`;
        return `${Action} ${entity}`;
      },
    };

    const description = actionData.description(
      TableName,
      userFullName,
      TargetUserName
    );
    const action = `${actionData.action} ${
      entityNames[TableName] || TableName
    }`;

    // Enhanced activity type determination
    const getActivityType = () => {
      // Financial activities
      if (
        ["payments", "tuitionfees", "invoices", "transactions"].includes(
          TableName
        )
      ) {
        return "payment_activity";
      }

      // Schedule activities
      if (["schedules", "classes", "courses", "sections"].includes(TableName)) {
        if (Action === "Confirmed an entry in") return "schedule_confirmation";
        if (Action === "Submitted an entry in") return "schedule_proposal";
        return "schedule_update";
      }

      // Student activities
      if (TableName === "studentprofile" && Action === "Created an entry in") {
        return "student_account_created";
      }
      if (["studentapplications", "enrollments"].includes(TableName)) {
        if (Action === "Approved an entry in") return "student_accepted";
        return "record_created";
      }

      // Staff activities
      if (
        [
          "staffprofile",
          "teacherprofile",
          "adminprofile",
          "registrarprofile",
        ].includes(TableName)
      ) {
        if (Action === "Created an entry in") return "user_account_created";
        return "record_created";
      }

      // Class activities
      if (TableName === "classes" && Action === "Updated an entry in") {
        return "class_dismissal";
      }

      // Announcement activities
      if (TableName === "announcements") {
        return "announcement_posted";
      }

      // Transaction confirmations
      if (TableName === "transactions" && Action === "Confirmed an entry in") {
        return "transaction_confirmed";
      }

      return "record_created";
    };

    // Determine user role from context or table
    const getUserRole = () => {
      if (UserRole) return UserRole;

      // Infer role from table context
      if (TableName === "teacherprofile") return "teacher";
      if (TableName === "adminprofile") return "admin";
      if (TableName === "registrarprofile") return "registrar";
      if (TableName === "staffprofile") return "staff";
      if (TableName === "studentprofile") return "student";

      return "system";
    };

    return {
      id: activity.id || activity.ActivityID || index + 1,
      user: userFullName || activity.user || "System",
      userRole: getUserRole(),
      action: action,
      description: description.charAt(0).toUpperCase() + description.slice(1),
      type: activity.type || getActivityType(),
      targetUser:
        TargetUserName || activity.targetUser || activity.TargetUser || null,
      timestamp:
        activity.timestamp ||
        activity.Timestamp ||
        activity.created_at ||
        new Date().toISOString(),
    };
  });
};

// Simulate API calls with real API integration
export const activityService = {
  getActivities: async () => {
    try {
      // Fetch from real API
      const response = await api.get("/profile/activity-logs");

      if (!response.data) throw new Error("Empty API response");

      console.log("Using real API data for activities");
      const transformedData = transformActivityData(
        response.data.data || response.data
      );
      return transformedData;
    } catch (err) {
      console.error("Failed to fetch activities from API:", err.message);
      return [];
    }
  },

  getActivitiesByRole: async (role) => {
    try {
      // Fetch from real API with role filter
      const response = await api.get("/profile/activity-logs", {
        params: { role },
      });

      if (!response.data) throw new Error("Empty API response");

      console.log("Using API data for activities by role:", role);
      const transformedData = transformActivityData(
        response.data.data || response.data
      );

      if (!role || role === "All Roles") return transformedData;
      return transformedData.filter((activity) => activity.userRole === role);
    } catch (err) {
      console.error(
        "Failed to fetch activities by role from API:",
        err.message
      );
      return [];
    }
  },

  getActivitiesByType: async (type) => {
    try {
      const response = await api.get("/profile/activity-logs", {
        params: { type },
      });

      if (!response.data) throw new Error("Empty API response");

      console.log("Using API data for activities by type:", type);
      const transformedData = transformActivityData(
        response.data.data || response.data
      );

      if (!type || type === "All Types") return transformedData;
      return transformedData.filter((activity) => activity.type === type);
    } catch (err) {
      console.error(
        "Failed to fetch activities by type from API:",
        err.message
      );
      return [];
    }
  },

  // Real-time activity monitoring
  subscribeToActivities: (callback) => {
    // For real-time updates, you can implement WebSocket or polling
    // This is a simple polling implementation
    let isSubscribed = true;

    const pollActivities = async () => {
      if (!isSubscribed) return;

      try {
        const response = await api.get("/profile/activity-logs");
        if (response.data) {
          const transformedData = transformActivityData(
            response.data.data || response.data
          );
          callback(transformedData);
        }
      } catch (error) {
        console.error("Error polling activities:", error);
      }

      // Poll every 10 seconds for new activities
      setTimeout(pollActivities, 10000);
    };

    // Start polling
    pollActivities();

    // Return unsubscribe function
    return () => {
      isSubscribed = false;
    };
  },

  // Additional methods that can be implemented when API is ready
  addActivity: async (activityData) => {
    try {
      const response = await api.post("/profile/activity-logs", activityData);

      if (!response.data) throw new Error("Failed to add activity");
      return response.data;
    } catch (err) {
      console.error("Could not add activity via API:", err.message);
      throw err;
    }
  },
};
