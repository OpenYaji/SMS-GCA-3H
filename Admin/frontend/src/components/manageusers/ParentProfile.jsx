import { useState } from "react";
import ArchiveParentModal from "./modals/parents/ArchiveParentModal";
import ParentInformationModal from "./modals/parents/ParentInformationModal";
import BaseModal from "./modals/BaseModal";
import { authorizedEscortsService } from "../../services/authorizedEscortsService";

export default function ParentProfile({
  parent,
  onParentUpdate,
  darkMode,
  onParentArchived,
  onParentTableRefresh,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [operationType, setOperationType] = useState(""); // "accept" or "decline"

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
  const handleAcceptConfirm = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to accept parent:", parent.id);
      await authorizedEscortsService.approveEscort(parent.id);
      return { success: true, message: "Escort accepted successfully" };
    } catch (error) {
      console.error("Error accepting parent:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Decline handler
  const handleDeclineConfirm = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to decline parent:", parent.id);
      await authorizedEscortsService.rejectEscort(parent.id);
      return { success: true, message: "Escort declined successfully" };
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

  // Handle accept operation
  const handleAcceptOperation = async () => {
    try {
      const result = await handleAcceptConfirm();
      if (result.success) {
        setModalMessage({
          title: "Success!",
          message: `${parent.name} has been successfully accepted.`,
        });
        setShowAcceptModal(false);
        setShowSuccessModal(true);
        // Refresh parent data or update status
        if (onParentUpdate) {
          onParentUpdate({ ...parent, status: "Approved" });
        }
        // Refresh the parent table
        if (onParentTableRefresh) {
          onParentTableRefresh();
        }
      }
    } catch (error) {
      setModalMessage({
        title: "Error",
        message: error.message || "Failed to accept escort. Please try again.",
      });
      setShowAcceptModal(false);
      setShowErrorModal(true);
    }
  };

  // Handle decline operation
  const handleDeclineOperation = async () => {
    try {
      const result = await handleDeclineConfirm();
      if (result.success) {
        setModalMessage({
          title: "Success!",
          message: `${parent.name} has been successfully declined.`,
        });
        setShowDeclineModal(false);
        setShowSuccessModal(true);
        // Refresh parent data or update status
        if (onParentUpdate) {
          onParentUpdate({ ...parent, status: "Rejected" });
        }
        // Refresh the parent table
        if (onParentTableRefresh) {
          onParentTableRefresh();
        }
      }
    } catch (error) {
      setModalMessage({
        title: "Error",
        message: error.message || "Failed to decline escort. Please try again.",
      });
      setShowDeclineModal(false);
      setShowErrorModal(true);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setModalMessage({ title: "", message: "" });
  };

  // Handle error modal close
  const handleErrorClose = () => {
    setShowErrorModal(false);
    setModalMessage({ title: "", message: "" });
  };

  // Check if parent is pending - for conditional button rendering
  const isPending = parent?.status === "Pending";

  // if no parent is selected, show placeholder
  if (!parent)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-center text-gray-500 dark:text-gray-400 font-kumbh text-sm h-full w-[300px]">
        Select an escort to view details
      </div>
    );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 font-kumbh h-full flex flex-col w-[300px]">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full mb-3 shadow-md overflow-hidden flex-shrink-0">
            <div
              className={`w-full h-full flex items-center justify-center text-white text-3xl font-bold ${
                darkMode ? "bg-yellow-600" : "bg-yellow-400"
              }`}
            >
              {parent.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>

          {/* Parent Info */}
          <h3
            className={`text-lg font-semibold font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {parent.name}
          </h3>
          <p
            className={`text-sm font-kumbh ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            ID: {parent.id}
          </p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
              parent.status === "Approved"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : parent.status === "Pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {parent.status}
          </span>
        </div>

        {/* Contact & Child Info */}
        <div
          className={`space-y-3 text-sm font-kumbh text-left ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <p>
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Contact Number:
            </span>{" "}
            {parent.contactNumber}
          </p>
          <p>
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Student's Name:
            </span>{" "}
            {parent.student}
          </p>
          <p>
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Relationship:
            </span>{" "}
            {parent.relationship}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className={`py-2 rounded-md transition font-kumbh font-medium ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            More Information
          </button>

          {/* Conditionally render Accept/Decline buttons only for pending escorts */}
          {isPending && (
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
          )}

          {/* <button
            onClick={() => setShowArchiveModal(true)}
            className="bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-kumbh font-medium"
          >
            Archive Escort
          </button> */}
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

      {/* Accept Confirmation Modal*/}
      {isPending && (
        <BaseModal
          isOpen={showAcceptModal}
          onClose={() => setShowAcceptModal(false)}
          title="Accept Escort"
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
              Accept Escort?
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
                onClick={handleAcceptOperation}
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
      )}

      {/* Decline Confirmation Modal - Only render if parent is pending */}
      {isPending && (
        <BaseModal
          isOpen={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
          title="Decline Escort"
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
              Decline Escort?
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
                onClick={handleDeclineOperation}
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
      )}

      {/* Success Modal */}
      <BaseModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={modalMessage.title}
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
            {modalMessage.title}
          </h3>
          <p
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {modalMessage.message}
          </p>

          <button
            onClick={handleSuccessClose}
            className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors font-kumbh"
          >
            Done
          </button>
        </div>
      </BaseModal>

      {/* Error Modal */}
      <BaseModal
        isOpen={showErrorModal}
        onClose={handleErrorClose}
        title={modalMessage.title}
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
            {modalMessage.title}
          </h3>
          <p
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {modalMessage.message}
          </p>

          <button
            onClick={handleErrorClose}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors font-kumbh"
          >
            OK
          </button>
        </div>
      </BaseModal>
    </>
  );
}
