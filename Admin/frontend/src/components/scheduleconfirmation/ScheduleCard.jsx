import React, { useState } from "react";
import ProposedScheduleModal from "./modals/ProposedScheduleModal";

const ScheduleCard = ({ schedule, onApprove, onDecline }) => {
  const [showProposalModal, setShowProposalModal] = useState(false);

  const handleViewProposal = () => {
    setShowProposalModal(true);
  };

  const handleCloseModal = () => {
    setShowProposalModal(false);
  };

  // Handle approve click
  const handleApproveClick = () => {
    if (onApprove && typeof onApprove === "function") {
      onApprove(schedule);
    }
  };

  // Handle decline click
  const handleDeclineClick = () => {
    if (onDecline && typeof onDecline === "function") {
      onDecline(schedule);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex items-center gap-6">
        {/* Profile Image */}
        <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-4 border-yellow-400 dark:border-yellow-600">
          <img
            src={schedule.avatar || "https://via.placeholder.com/80"}
            alt={schedule.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold font-kumbh text-gray-900 dark:text-white">
              {schedule.name}
            </h3>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full">
              Head Teacher
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-kumbh text-sm mb-1">
            {schedule.position}
            <br />
            ID: {schedule.idNumber}
          </p>

          <p className="text-gray-500 dark:text-gray-400 font-kumbh text-sm mt-2">
            Proposed by: {schedule.proposedBy}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <button
            onClick={handleApproveClick}
            className="px-6 py-1.5 bg-green-700 hover:bg-green-600 text-white text-s font-kumbh rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-green-200 dark:shadow-green-800 flex items-center justify-center gap-2"
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
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Approve Proposal
          </button>
          <button
            onClick={handleDeclineClick}
            className="px-6 py-1.5 bg-red-800 hover:bg-red-700 text-white text-s font-kumbh rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-red-200 dark:shadow-red-800 flex items-center justify-center gap-2"
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Decline Proposal
          </button>
          <button
            onClick={handleViewProposal}
            className="px-6 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-s font-kumbh rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-blue-200 dark:shadow-blue-800 flex items-center justify-center gap-2"
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
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Schedules
          </button>
        </div>
      </div>

      {/* Proposed Schedule Modal */}
      <ProposedScheduleModal
        isOpen={showProposalModal}
        onClose={handleCloseModal}
        proposal={schedule}
      />
    </>
  );
};

export default ScheduleCard;
