import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("🔒 Admin ProtectedRoute - User:", user);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log("❌ No user found, redirecting to student login...");
    const loginUrl = `http://localhost:5173?redirect=${encodeURIComponent(
      window.location.href
    )}`;
    window.location.href = loginUrl;
    return null;
  }

  // Check user type if required
  if (requiredUserType) {
    const userType = user.userType;

    if (!userType || userType === "Unknown") {
      console.log("No valid userType found");
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg text-center">
            <div className="text-2xl font-bold mb-2">Authentication Error</div>
            <div>Unable to verify user type. Please login again.</div>
          </div>
        </div>
      );
    }

    if (userType !== requiredUserType) {
      console.log("User type mismatch - redirecting to appropriate dashboard");

      // Redirect to appropriate dashboard based on user type
      const dashboards = {
        Student: "http://localhost:5173/student-dashboard",
        Teacher: "http://localhost:5177/teacher-dashboard",
        Registrar: "http://localhost:5174/registrar-dashboard",
        Guard: "http://localhost:5176/guard-dashboard",
        Admin: "http://localhost:5175/dashboard",
      };

      const redirectUrl = dashboards[userType] || "http://localhost:5173";
      window.location.href = redirectUrl;
      return null;
    }
  }

  console.log("Access granted to admin protected route");
  return children;
};

export default ProtectedRoute;
