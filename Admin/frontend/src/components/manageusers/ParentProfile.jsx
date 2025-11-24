import { useState } from "react";
import ArchiveParentModal from "./modals/parents/ArchiveParentModal";
import ParentInformationModal from "./modals/parents/ParentInformationModal";

export default function ParentProfile({ parent, onParentUpdate, darkMode }) {
  // Add onParentUpdate prop
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Archive handler - SIMPLIFIED for frontend-only use
  const handleArchiveParent = async (parentToArchive) => {
    try {
      // TODO: Replace with actual backend API call when available
      // For now, we'll simulate a successful archive after a short delay
      console.log("Attempting to archive parent:", parentToArchive.id);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful response
      return { success: true, message: "Parent archived successfully" };
    } catch (error) {
      console.error("Error archiving parent:", error);
      throw error;
    }
  };

  // Handle when parent information is updated in the modal
  const handleParentUpdate = (updatedParent) => {
    if (onParentUpdate) {
      onParentUpdate(updatedParent);
    }
  };

  // if no parent is selected, show placeholder
  if (!parent)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-center text-gray-500 dark:text-gray-400 font-kumbh text-sm h-full">
        Select a parent to view details
      </div>
    );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 font-kumbh h-full flex flex-col">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-4">
          {/* Avatar */}
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md">
            {parent.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          {/* Parent Info */}
          <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
            {parent.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {parent.id}
          </p>
        </div>

        {/* Contact & Child Info */}
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">
              Email:
            </span>{" "}
            {parent.email}
          </p>
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">
              Child's Name:
            </span>{" "}
            {parent.child}
          </p>
          {/* Add Balance Information */}
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">
              Balance Status:
            </span>{" "}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                parent.paymentStatus === "fully_paid"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : parent.paymentStatus === "partially_paid"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
              }`}
            >
              {parent.paymentStatus === "fully_paid"
                ? "Paid"
                : parent.paymentStatus === "partially_paid"
                ? "Partial"
                : "Pending"}
            </span>
          </p>
          {parent.outstandingBalance > 0 && (
            <p>
              <span className="font-semibold text-gray-800 dark:text-white">
                Outstanding Balance:
              </span>{" "}
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(parent.outstandingBalance)}
            </p>
          )}
        </div>

        {/* Actions - Push to bottom */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition font-kumbh font-medium"
          >
            More Information
          </button>
          <button
            onClick={() => setShowArchiveModal(true)}
            className="bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-kumbh font-medium"
          >
            Archive Parent
          </button>
        </div>
      </div>

      {/* Parent Information Modal */}
      <ParentInformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        parent={parent}
        onParentUpdate={handleParentUpdate}
        darkMode={darkMode}
      />

      {/* Archive Modal */}
      <ArchiveParentModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        parent={parent}
        onArchiveConfirm={handleArchiveParent}
        darkMode={darkMode}
      />
    </>
  );
}
