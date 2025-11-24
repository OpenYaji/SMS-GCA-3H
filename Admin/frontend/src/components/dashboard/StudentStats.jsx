import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardService";

export default function StudentStats({ darkMode, studentData }) {
  const [studentStats, setStudentStats] = useState(studentData);
  const [loading, setLoading] = useState(!studentData);

  useEffect(() => {
    if (!studentData) {
      const fetchStudentStats = async () => {
        try {
          const stats = await dashboardService.getStudentStats();
          setStudentStats(stats);
        } catch (error) {
          console.error("Error fetching student stats:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudentStats();
    } else {
      setStudentStats(studentData);
      setLoading(false);
    }
  }, [studentData]);

  if (loading) {
    return (
      <div className={`dashboard-card ${darkMode ? "dark" : ""}`}>
        <div className="card-header">
          <h3 className="card-title">Students</h3>
          <button className="card-menu">⋯</button>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!studentStats) {
    return (
      <div className={`dashboard-card ${darkMode ? "dark" : ""}`}>
        <div className="card-header">
          <h3 className="card-title">Students</h3>
          <button className="card-menu">⋯</button>
        </div>
        <div className="flex justify-center items-center h-32 text-red-500">
          Failed to load student data
        </div>
      </div>
    );
  }

  // Use uppercase properties to match the new API structure
  const totalStudents = studentStats.Total || studentStats.total || 0;
  const boysCount = studentStats.Male || studentStats.male || 0;
  const girlsCount = studentStats.Female || studentStats.female || 0;

  const boysPercentage =
    totalStudents > 0 ? Math.round((boysCount / totalStudents) * 100) : 0;
  const girlsPercentage =
    totalStudents > 0 ? Math.round((girlsCount / totalStudents) * 100) : 0;

  return (
    <div className={`dashboard-card ${darkMode ? "dark" : ""}`}>
      <div className="card-header">
        <h3 className="card-title">Students</h3>
        <button className="card-menu">⋯</button>
      </div>

      <div className="student-stats">
        <div className="stat-circle">
          <div className={`circle-bg ${darkMode ? "dark-boys" : ""}`}>
            <div className="circle-inner">
              <svg
                className={`gender-icon boy ${darkMode ? "dark" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m-1.5 5h3a2 2 0 0 1 2 2v5.5H14V22h-4v-7.5H8.5V9a2 2 0 0 1 2-2"
                />
              </svg>
              <div className="percentage">{boysPercentage}%</div>
            </div>
          </div>
          <div className="stat-info">
            <div className="stat-count">{boysCount} Boys</div>
          </div>
        </div>

        <div className="stat-circle">
          <div className={`circle-bg girls ${darkMode ? "dark-girls" : ""}`}>
            <div className="circle-inner">
              <svg
                className={`gender-icon girl ${darkMode ? "dark" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m-1.5 20v-6h-3l2.59-7.59C10.34 7.59 11.1 7 12 7s1.66.59 1.91 1.41L16.5 16h-3v6z"
                />
              </svg>
              <div className="percentage">{girlsPercentage}%</div>
            </div>
          </div>
          <div className="stat-info">
            <div className="stat-count">{girlsCount} Girls</div>
          </div>
        </div>
      </div>
    </div>
  );
}
