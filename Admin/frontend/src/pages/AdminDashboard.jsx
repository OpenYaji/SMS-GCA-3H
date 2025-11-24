import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import Banner from "../components/dashboard/Banner";
import StatCard from "../components/dashboard/StatCard";
import StudentStats from "../components/dashboard/StudentStats";
import NoticeBoard from "../components/dashboard/NoticeBoard";
import FeeStatus from "../components/dashboard/FeeStatus";
import FeeCollectionChart from "../components/dashboard/FeeCollectionChart";
import { dashboardService } from "../services/dashboardService";
import "../assets/css/dashboard.css";

export default function AdminDashboard() {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [userStats, setUserStats] = useState(null);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [feeStatus, setFeeStatus] = useState(null);
  const [feesCollection, setFeesCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          userStatsData,
          pinnedAnnouncementsData,
          feeStatusData,
          feesCollectionData,
        ] = await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getPinnedAnnouncements(),
          dashboardService.getFeeStatus(),
          dashboardService.getFeesCollection(),
        ]);
        setUserStats(userStatsData);
        setPinnedAnnouncements(pinnedAnnouncementsData);
        setFeeStatus(feeStatusData);
        setFeesCollection(feesCollectionData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate stats array from API data
  const stats = userStats
    ? [
        {
          number: userStats.StudentCount.Total,
          label: "Students",
          color: "text-gray-500",
        },
        {
          number: userStats.TeacherCount,
          label: "Teachers",
          color: "text-gray-500",
        },
        {
          number: userStats.GuardCount,
          label: "Guards",
          color: "text-gray-500",
        },
        {
          number: userStats.RegistrarCount,
          label: "Registrars",
          color: "text-gray-500",
        },
        {
          number: userStats.AdminCount,
          label: "Admins",
          color: "text-gray-500",
        },
      ]
    : [];

  // Transform fee status data for FeeStatus component
  const feeStatusData = feeStatus
    ? [
        {
          amount: feeStatus.Paid || 0,
          status: "Paid",
          color: "paid",
        },
        {
          amount: feeStatus.Pending || 0,
          status: "Pending",
          color: "pending",
        },
        {
          amount: feeStatus.Due || 0,
          status: "Overdue",
          color: "overdue",
        },
      ]
    : [];

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-[whitesmoke]"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? "text-white" : "text-gray-600"}`}>
            Loading Dashboard, please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-[whitesmoke]"
        }`}
      >
        <div className="text-center">
          <p
            className={`text-red-500 mb-4 ${
              isDarkMode ? "text-white" : "text-gray-600"
            }`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 min-h-screen pl-6 pr-6 pb-6 pt-4 ${
        isDarkMode ? "bg-gray-900" : "bg-[whitesmoke]"
      }`}
    >
      <Banner darkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} darkMode={isDarkMode} />
        ))}
      </div>

      <div className="dashboard-grid">
        <StudentStats
          darkMode={isDarkMode}
          studentData={userStats?.StudentCount}
        />
        <NoticeBoard
          announcements={pinnedAnnouncements}
          darkMode={isDarkMode}
        />
        <FeeStatus fees={feeStatusData} darkMode={isDarkMode} />
      </div>

      <FeeCollectionChart
        feesCollection={feesCollection}
        darkMode={isDarkMode}
      />
    </div>
  );
}
