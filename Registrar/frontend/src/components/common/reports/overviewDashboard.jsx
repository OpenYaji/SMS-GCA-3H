import React, { useState, useEffect } from "react";

const OverviewDashboard = ({ darkMode = false }) => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    newEnrollments: 0,
    attendanceRate: 0,
    financialHolds: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme classes
  const bgPrimary = darkMode ? "bg-slate-900" : "bg-white";
  const bgSecondary = darkMode ? "bg-slate-800" : "bg-gray-50";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = darkMode ? "border-slate-700" : "border-gray-200";
  const hoverBg = darkMode ? "hover:bg-slate-700" : "hover:bg-gray-50";

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost/SMS-GCA-3H/Registrar/backend/api/reports/overviewDashboard.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className={`space-y-6 animate-fadeIn ${darkMode ? "dark" : ""}`}>
        <div className={`${bgPrimary} rounded-xl shadow-lg border ${borderColor} p-6`}>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-500">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 animate-fadeIn ${darkMode ? "dark" : ""}`}>
        <div className={`${bgPrimary} rounded-xl shadow-lg border ${borderColor} p-6`}>
          <div className="flex justify-center items-center h-64 flex-col">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 animate-fadeIn ${darkMode ? "dark" : ""}`}>
      <div
        className={`${bgPrimary} rounded-xl shadow-lg border ${borderColor} p-6 transition-all duration-300`}
      >
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-3xl font-bold ${textPrimary} mb-6 tracking-tight`}
            >
              Registrar Performance Overview
            </h2>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className={`flex items-center gap-2 px-4 py-2 ${
                  darkMode
                    ? "bg-slate-700 text-white"
                    : "bg-white text-gray-700"
                } border ${borderColor} rounded-lg ${hoverBg} hover:shadow-xl text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
              >
                <span className="text-lg">🔄</span>
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <span className="text-lg">📊</span>
                Export Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Total Students Card */}
          <div
            className={`${
              darkMode
                ? "bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50"
                : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            } border-2 rounded-xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer group`}
          >
            <div
              className={`text-5xl font-bold ${textPrimary} mb-2 animate-countUp group-hover:scale-110 transition-transform`}
            >
              {dashboardData.totalStudents.toLocaleString()}
            </div>
            <div
              className={`text-sm ${textSecondary} font-semibold mb-2 tracking-wide`}
            >
              Total Students
            </div>
          </div>

          {/* New Enrollments Card */}
          <div
            className={`${
              darkMode
                ? "bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50"
                : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            } border-2 rounded-xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer group`}
          >
            <div
              className={`text-5xl font-bold ${textPrimary} mb-2 animate-countUp group-hover:scale-110 transition-transform`}
            >
              {dashboardData.newEnrollments}
            </div>
            <div
              className={`text-sm ${textSecondary} font-semibold mb-2 tracking-wide`}
            >
              New Enrollments
            </div>
          </div>

          {/* Attendance Rate Card */}
          <div
            className={`${
              darkMode
                ? "bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50"
                : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            } border-2 rounded-xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer group`}
          >
            <div
              className={`text-5xl font-bold ${textPrimary} mb-2 animate-countUp group-hover:scale-110 transition-transform`}
            >
              {dashboardData.attendanceRate}%
            </div>
            <div
              className={`text-sm ${textSecondary} font-semibold mb-2 tracking-wide`}
            >
              Attendance Rate
            </div>
          </div>

          {/* Financial Holds Card */}
          <div
            className={`${
              darkMode
                ? "bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700/50"
                : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            } border-2 rounded-xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer group`}
          >
            <div
              className={`text-5xl font-bold ${textPrimary} mb-2 animate-countUp group-hover:scale-110 transition-transform`}
            >
              {dashboardData.financialHolds}
            </div>
            <div
              className={`text-sm ${textSecondary} font-semibold mb-2 tracking-wide`}
            >
              Financial Holds
            </div>
          </div>
        </div>

        {/* The rest of your component (charts, etc.) remains unchanged */}
        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Enrollment Trends Chart */}
          <div
            className={`${bgPrimary} border-2 ${borderColor} rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
          >
            <h3
              className={`text-lg font-bold ${textPrimary} mb-4 tracking-tight`}
            >
              Enrollment Trends
            </h3>
            <div
              className={`h-64 ${
                darkMode
                  ? "bg-gradient-to-br from-slate-800 to-slate-700"
                  : "bg-gradient-to-br from-blue-50 to-blue-100"
              } rounded-xl flex items-end justify-around p-4 gap-2 shadow-inner`}
            >
              {/* Chart bars remain as static content */}
              <div className="flex flex-col items-center gap-2 flex-1 group">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 animate-growUp shadow-lg group-hover:shadow-2xl"
                  style={{ height: "40%" }}
                ></div>
                <span className={`text-xs ${textSecondary} font-bold`}>
                  Jun
                </span>
              </div>
              {/* ... other chart bars */}
            </div>
          </div>

          {/* Student Distribution Pie Chart */}
          <div
            className={`${bgPrimary} border-2 ${borderColor} rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
          >
            <h3
              className={`text-lg font-bold ${textPrimary} mb-4 tracking-tight`}
            >
              Student Distribution by Grade
            </h3>
            <div className="h-64 flex items-center justify-center">
              {/* Pie chart SVG remains as static content */}
              <div className="relative w-56 h-56">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Pie chart segments */}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-6">
          {/* Performance metrics cards remain as static content */}
          {[
            {
              title: "Application Conversion Rate",
              value: "78.5%",
              target: "Target: 80%",
              progress: 78.5,
              result: "98.1%",
            },
            // ... other metrics
          ].map((metric, index) => (
            <div
              key={index}
              className={`${bgPrimary} border-2 ${borderColor} rounded-xl p-5 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group`}
            >
              {/* Metric content */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;