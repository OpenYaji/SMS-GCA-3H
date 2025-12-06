import React, { useState, useEffect } from "react";
import { useSchedules } from "../components/scheduleconfirmation/utils/useSchedules";
import useSearch from "/src/components/utils/useSearch";
import useSortCards from "/src/components/utils/useSortCards";
import SortDropdown from "../components/scheduleconfirmation/SortDropdown";
import ScheduleCard from "../components/scheduleconfirmation/ScheduleCard";
import ScheduleActionModal from "../components/scheduleconfirmation/ScheduleActionModal";
import ProposedScheduleModal from "../components/scheduleconfirmation/modals/ProposedScheduleModal";
import { Calendar, AlertCircle, RefreshCw } from "lucide-react";

const ScheduleConfirmation = () => {
  const {
    schedules,
    loading,
    error,
    approveSchedule,
    declineSchedule,
    refetch,
  } = useSchedules();
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [hasData, setHasData] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Single modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: null, // 'approve', 'decline-confirm', 'view'
    currentSchedule: null,
  });

  // Check if we have data
  useEffect(() => {
    const hasSchedules = schedules && schedules.length > 0;
    setHasData(hasSchedules);
  }, [schedules]);

  const searchedData = useSearch(schedules, search, [
    "name",
    "position",
    "idNumber",
  ]);
  const sortedData = useSortCards(searchedData, sortOption);

  const openModal = (actionType, schedule) => {
    setModalState({
      isOpen: true,
      actionType,
      currentSchedule: schedule,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      actionType: null,
      currentSchedule: null,
    });
  };

  const handleApprove = (schedule) => {
    openModal("approve", schedule);
  };

  const handleDecline = (schedule) => {
    openModal("decline-confirm", schedule);
  };

  const handleViewSchedule = (schedule) => {
    openModal("view", schedule);
  };

  const handleActionConfirm = async () => {
    const { actionType, currentSchedule } = modalState;

    try {
      if (actionType === "approve") {
        const result = await approveSchedule(
          currentSchedule?.proposalData || {}
        );
        setSuccessMessage(
          result?.data?.Message ||
            "All schedules have been approved successfully!"
        );
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else if (actionType === "decline-confirm") {
        const result = await declineSchedule(
          currentSchedule?.proposalData || {}
        );
        setSuccessMessage(
          result?.data?.Message || "All schedules have been declined."
        );
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }
      return { success: true };
    } catch (error) {
      console.error(
        `Error ${
          actionType === "approve" ? "approving" : "declining"
        } schedules:`,
        error
      );
      throw error;
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading proposed schedules...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-[whitesmoke] dark:bg-gray-900  pl-6 pr-6 pb-6 pt-4 font-kumbh transition-colors duration-300">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 dark:text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-800 dark:text-green-200 font-medium">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="rounded-3xl px-8 py-3 mb-6 shadow-md bg-[linear-gradient(135deg,#ffbc0d_0%,#f59e0b_100%)] dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
              Schedule Proposals
            </h1>
            <p className="text-white font-semibold font-spartan text-[1.1em] [text-shadow:2px_1px_2px_rgba(0,0,0,0.5)]">
              Review and manage proposed teacher schedules from head teachers
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar - Only show when we have data */}
      {hasData && (
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search head teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:focus:ring-blue-400 focus:border-yellow-400 dark:focus:border-blue-400 outline-none font-kumbh bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10"
            />
            <svg
              className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <SortDropdown onSortChange={setSortOption} currentSort={sortOption} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {hasData ? (
          sortedData.length > 0 ? (
            sortedData.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onViewSchedule={handleViewSchedule}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 text-center shadow-sm transition-colors duration-300">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-league-spartan text-xl mb-2">
                No head teachers match your search
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Try adjusting your search terms
              </p>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 text-center shadow-sm transition-colors duration-300">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 font-league-spartan text-xl mb-2">
              No Pending Schedule Proposals
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm max-w-md mx-auto">
              {schedules[0]?.message ||
                "All schedule proposals have been reviewed. Head teachers will appear here when they submit new schedule proposals."}
            </p>
          </div>
        )}
      </div>

      {/* Single Modal for All Actions */}
      <ScheduleActionModal
        isOpen={modalState.isOpen && modalState.actionType !== "view"}
        onClose={closeModal}
        actionType={modalState.actionType}
        schedule={modalState.currentSchedule}
        onActionConfirm={handleActionConfirm}
      />

      {/* Proposed Schedule Modal for Viewing */}
      <ProposedScheduleModal
        isOpen={modalState.isOpen && modalState.actionType === "view"}
        onClose={closeModal}
        proposal={modalState.currentSchedule}
      />
    </div>
  );
};

export default ScheduleConfirmation;
