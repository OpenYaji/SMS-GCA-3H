import React, { useState, useRef, useEffect, useCallback } from "react";
import { useActivityLog } from "../../hooks/useActivityLog";
import useSearch from "../utils/useSearch";
import useSort from "../utils/useSort";
// import ActivityLogSettingsModal from "./modals/ActivityLogSettingsModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import SuccessModal from "./modals/SuccessModal";

const ActivityLog = () => {
  const [userRoleFilter, setUserRoleFilter] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  // const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Use the hook that now connects to real API
  const { activities, loading, error, refreshActivities } = useActivityLog();

  const sortOptions = [
    { value: "All Roles", label: "All Roles" },
    { value: "admin", label: "Admins" },
    { value: "teacher", label: "Teachers" },
    { value: "student", label: "Students" },
    { value: "parent", label: "Parents" },
    { value: "registrar", label: "Registrars" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === userRoleFilter) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time refresh effect
  useEffect(() => {
    // Refresh activities every 30 seconds for real-time updates
    const interval = setInterval(() => {
      refreshActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshActivities]);

  const handleOptionClick = (option) => {
    setUserRoleFilter(option.value);
    setIsOpen(false);
    setDisplayCount(20);
  };

  const filteredByRole =
    userRoleFilter === "All Roles"
      ? activities
      : activities.filter((activity) => activity.userRole === userRoleFilter);

  const searched = useSearch(filteredByRole, searchTerm, [
    "user",
    "action",
    "description",
    "targetUser",
  ]);

  // FIXED: Sort by newest first (LIFO - Last In, First Out)
  const sorted = useSort(searched, "newest");

  // FIXED: Ensure activities are in descending order by timestamp (most recent first)
  const sortedActivities = [...sorted].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA; // Descending order (newest first)
  });

  const displayedActivities = sortedActivities.slice(0, displayCount);

  // FIXED: Improved scroll handler with better detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when user scrolls 80% down
    if (scrollPercentage > 0.8 && displayCount < sortedActivities.length) {
      setDisplayCount((prev) => Math.min(prev + 20, sortedActivities.length));
    }
  }, [displayCount, sortedActivities.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    setDisplayCount(20);
  }, [searchTerm]);

  // const handleSaveSettings = () => {
  //   setShowSettingsModal(false);
  //   setShowConfirmationModal(true);
  // };

  // const handleConfirmSettings = () => {
  //   setShowConfirmationModal(false);
  //   setShowSuccessModal(true);
  // };

  const getActivityIcon = (type) => {
    switch (type) {
      case "student_account_created":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-green-500"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        );
      case "payment_activity":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-blue-500"
          >
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
        );
      case "schedule_proposal":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-500"
          >
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h5v5H7z" />
          </svg>
        );
      case "student_accepted":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-teal-500"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "class_dismissal":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-orange-500"
          >
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        );
      case "user_account_created":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-indigo-500"
          >
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        );
      case "record_created":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-amber-500"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-gray-500"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        );
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 font-kumbh transition-colors duration-300">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading activities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 font-kumbh transition-colors duration-300">
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-red-500">
            <p>Error loading activities: {error}</p>
            <button
              onClick={refreshActivities}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg font-kumbh transition-colors duration-300 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-600 dark:text-yellow-400"
              >
                <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshActivities}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Refresh activities"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={loading ? "animate-spin" : ""}
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-1 gap-3 items-center flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-regular font-kumbh min-w-[140px] transition-colors text-gray-900 dark:text-white"
              >
                <span className="flex-1 text-left">{currentOption.label}</span>
                <span
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1">
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 font-kumbh text-xs ${
                        userRoleFilter === option.value
                          ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Scrollable container - properly contained */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-8">
        <div className="py-4">
          {displayedActivities.length > 0 ? (
            <>
              {displayedActivities.map((activity, index) => (
                <div
                  key={`${activity.id}-${index}`}
                  className="flex items-start gap-3 p-4 mb-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {activity.user}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {activity.action}
                      </span>
                      {activity.targetUser && (
                        <span className="font-semibold text-gray-900 dark:text-white">
                          @{activity.targetUser}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="mt-2">Loading more activities...</p>
                </div>
              )}

              {displayedActivities.length === sortedActivities.length &&
                sortedActivities.length > 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    All activities loaded ({sortedActivities.length} total)
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No activities found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      {displayedActivities.length > 0 && (
        <div className="flex-shrink-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Showing {displayedActivities.length} of {sortedActivities.length}{" "}
            activities
            {displayedActivities.length < sortedActivities.length &&
              " (scroll to load more)"}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
