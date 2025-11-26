import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Make sure AuthContext exists in Registrar too

const ProtectedRoute = ({ children, allowedRoles = ['Registrar'] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 1. Not logged in? Go to main login (Student Portal / Main Landing)
  // Assuming your main login is on the Student port (5173)
  if (!user) {
    // Force redirect to the main login page on port 5173
    window.location.href = 'http://192.168.0.110:5173/';
    return null;
  }

  // 2. Check Role
  if (!allowedRoles.includes(user.UserType)) {
    const dashboardPorts = {
      'Student': '5173',
      'Registrar': '5174',
      'Admin': '5175',
      'Guard': '5176',
      'Teacher': '5177'
    };

    const targetPort = dashboardPorts[user.UserType];
    
    // Redirect to the correct dashboard for their role
    if (targetPort) {
        const targetPath = `/${user.UserType.toLowerCase()}-dashboard`;
        window.location.href = `http://192.168.0.110:${targetPort}${targetPath}`;
        return null;
    }

    return <div>Unauthorized Access</div>;
  }

  return children;
};

export default ProtectedRoute;