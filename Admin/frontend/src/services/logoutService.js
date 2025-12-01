// src/services/logoutService.js
const API_BASE_URL = "http://localhost/SMS-GCA-3H/student/backend/api/auth";

export const logoutService = {
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout.php`, {
        method: "POST",
        credentials: "include", // Important for session cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Clear any client-side tokens or storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userData");

        // Redirect to login page
        window.location.href = "http://localhost:5173/login";
        return { success: true };
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Even if the API call fails, clear client-side data and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");

      window.location.href = "http://localhost:5173/login";
      return { success: false, error: error.message };
    }
  },
};

export default logoutService;
