import { useState } from "react";
import ArchiveParentModal from "./modals/parents/ArchiveParentModal";
import ParentInformationModal from "./modals/parents/ParentInformationModal";
import BaseModal from "./modals/BaseModal";

export default function ParentProfile({ parent, onParentUpdate, darkMode }) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Archive handler
  const handleArchiveParent = async (parentToArchive) => {
    try {
      console.log("Attempting to archive parent:", parentToArchive.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: "Parent archived successfully" };
    } catch (error) {
      console.error("Error archiving parent:", error);
      throw error;
    }
  };

  // Accept handler
  const handleAcceptParent = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to accept parent:", parent.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: "Parent accepted successfully" };
    } catch (error) {
      console.error("Error accepting parent:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Decline handler
  const handleDeclineParent = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to decline parent:", parent.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: "Parent declined successfully" };
    } catch (error) {
      console.error("Error declining parent:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle when parent information is updated in the modal
  const handleParentUpdate = (updatedParent) => {
    if (onParentUpdate) {
      onParentUpdate(updatedParent);
    }
  };

  // Handle accept confirmation
  const handleAcceptConfirm = async () => {
    const result = await handleAcceptParent();
    if (result.success) {
      setShowAcceptModal(false);
    }
  };

  // Handle decline confirmation
  const handleDeclineConfirm = async () => {
    const result = await handleDeclineParent();
    if (result.success) {
      setShowDeclineModal(false);
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
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">
              Relationship:
            </span>{" "}
            {parent.relationship || "Parent"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition font-kumbh font-medium"
          >
            More Information
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAcceptModal(true)}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-kumbh font-medium"
            >
              Accept
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-kumbh font-medium"
            >
              Decline
            </button>
          </div>
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

      {/* Accept Parent Modal */}
      <BaseModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Parent"
        width="max-w-md"
        darkMode={darkMode}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                darkMode ? "bg-green-900/50" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h3
            className={`text-lg font-semibold mb-2 font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Accept Parent?
          </h3>
          <p
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to accept{" "}
            <span className="font-semibold">{parent?.name}</span>? This will
            approve their registration and grant them full access.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowAcceptModal(false)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-kumbh ${
                darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-kumbh"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Accepting...
                </>
              ) : (
                "Yes, Accept"
              )}
            </button>
          </div>
        </div>
      </BaseModal>

      {/* Decline Parent Modal */}
      <BaseModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title="Decline Parent"
        width="max-w-md"
        darkMode={darkMode}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                darkMode ? "bg-red-900/50" : "bg-red-100"
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
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
            </div>
          </div>

          <h3
            className={`text-lg font-semibold mb-2 font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Decline Parent?
          </h3>
          <p
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to decline{" "}
            <span className="font-semibold">{parent?.name}</span>? This action
            will reject their registration request.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeclineModal(false)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-kumbh ${
                darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDeclineConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-kumbh"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Declining...
                </>
              ) : (
                "Yes, Decline"
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
