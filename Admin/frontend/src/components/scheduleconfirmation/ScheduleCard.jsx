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

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex items-center gap-6">
        {/* Profile Image */}
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0 overflow-hidden">
          <img
            src={schedule.avatar || "https://via.placeholder.com/80"}
            alt={schedule.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold font-kumbh text-gray-900 dark:text-white mb-1">
            {schedule.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-kumbh text-sm mb-1">
            {schedule.position}
            <br />
            {schedule.idNumber}
          </p>
          <p className="text-gray-400 dark:text-gray-500 font-league-spartan text-xs italic">
            Date Submitted: {schedule.dateSubmitted || schedule.dateProposed}
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-kumbh text-sm mt-2">
            Proposed by: {schedule.proposedBy}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <button
            onClick={() => onApprove(schedule)}
            className="px-6 py-1.5 bg-green-700 hover:bg-green-600 text-white text-s font-kumbh rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-green-200 dark:shadow-green-800"
          >
            Approve Proposal Request
          </button>
          <button
            onClick={() => onDecline(schedule)}
            className="px-6 py-1.5 bg-red-800 hover:bg-red-700 text-white text-s font-kumbh rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-red-200 dark:shadow-red-800"
          >
            Decline Proposal Request
          </button>
          <button
            onClick={handleViewProposal}
            className="px-6 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-s font-kumbh rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-blue-200 dark:shadow-blue-800"
          >
            View Proposal Request
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
