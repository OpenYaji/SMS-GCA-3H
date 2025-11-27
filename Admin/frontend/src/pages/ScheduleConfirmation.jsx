import React, { useState, useEffect } from "react";
import { useSchedules } from "../components/scheduleconfirmation/utils/useSchedules";
import useSearch from "/src/components/utils/useSearch";
import useSortCards from "/src/components/utils/useSortCards";
import SortDropdown from "../components/scheduleconfirmation/SortDropdown";
import ScheduleCard from "../components/scheduleconfirmation/ScheduleCard";
import ScheduleActionModal from "../components/scheduleconfirmation/ScheduleActionModal";
import ProposedScheduleModal from "../components/scheduleconfirmation/modals/ProposedScheduleModal";
import { Calendar } from "lucide-react";

const ScheduleConfirmation = () => {
  const { schedules, loading, approveSchedule, declineSchedule } =
    useSchedules();
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [hasData, setHasData] = useState(false);

  // Single modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: null, // 'approve', 'decline-confirm', 'view'
    currentSchedule: null,
  });

  // Check if we have data (either from API or mock data)
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
        // Pass the proposal data to the API call
        await approveSchedule(currentSchedule?.proposalData || {});
        return { success: true };
      } else if (actionType === "decline-confirm") {
        // Pass the proposal data to the API call
        await declineSchedule(currentSchedule?.proposalData || {});
        return { success: true };
      }
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

  if (loading && !hasData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-[whitesmoke] dark:bg-gray-900  pl-6 pr-6 pb-6 pt-4 font-kumbh transition-colors duration-300">
      {/* Page Header - Updated to match Admin Dashboard banner */}
      <div className="rounded-3xl px-8 py-3 mb-6 shadow-md bg-[linear-gradient(135deg,#ffbc0d_0%,#f59e0b_100%)] dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
              Proposed Schedules
            </h1>
            <p className="text-white font-semibold font-spartan text-[1.1em] [text-shadow:2px_1px_2px_rgba(0,0,0,0.5)]">
              Here are the proposed schedules at Gymnazo Christian Academy -
              Novaliches now
            </p>
          </div>
        </div>
      </div>

      {/* Search and Sort Bar - Only show when we have data */}
      {hasData && (
        <div className="flex gap-4 mb-8">
          <SortDropdown onSortChange={setSortOption} currentSort={sortOption} />
          <input
            type="text"
            placeholder="Search for a schedule by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:focus:ring-blue-400 focus:border-yellow-400 dark:focus:border-blue-400 outline-none font-kumbh bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {/* Schedules Container */}
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
              <p className="text-gray-500 dark:text-gray-400 font-league-spartan text-xl">
                No schedules match your search criteria
              </p>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 text-center shadow-sm transition-colors duration-300">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 font-league-spartan text-xl">
              No proposed schedules at this time
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
