import React, { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronDown, XCircle } from "lucide-react";

// BaseModal Component
const BaseModal = ({
  isOpen,
  title,
  children,
  onClose,
  width = "max-w-lg",
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`rounded-2xl shadow-lg p-6 w-full ${width} relative animate-fadeIn font-kumbh ${
          darkMode ? "bg-gray-900 text-white" : "bg-white"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 text-2xl transition ${
            darkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          &times;
        </button>
        {title && (
          <h2
            className={`text-2xl font-semibold mb-4 font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default function ArchiveParentModal({
  darkMode = false,
  isOpen = false,
  onClose = () => {},
  parent = null,
  onArchiveConfirm = async (parent, reason) => ({ success: true }),
  onArchiveDone = () => {},
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [archiveReason, setArchiveReason] = useState("");

  const archiveReasons = [
    "Child Graduated",
    "Child Transferred",
    "Child Dropped Out",
    "Child Expelled",
    "No Longer Associated with School",
    "Requested Account Deletion",
  ];

  const handleClose = () => {
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
    setArchiveReason("");
    onClose();
  };

  const handleConfirmArchive = async () => {
    if (!parent) return;
    setCurrentStep(2);
  };

  const handleSubmitWithReason = async () => {
    if (!archiveReason) {
      setError("Please select an archive reason");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await onArchiveConfirm(parent, archiveReason);

      if (result.success) {
        setCurrentStep(3);
      } else {
        setError(result.message || "Failed to archive parent");
        setCurrentStep(4);
      }
    } catch (error) {
      console.error("Error archiving parent:", error);
      setError(error.message || "An unexpected error occurred");
      setCurrentStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    handleClose();
    onArchiveDone();
  };

  const handleRetry = () => {
    setCurrentStep(2);
    setError(null);
  };

  // Step 1: Confirmation Modal
  const renderConfirmationStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 1}
      onClose={handleClose}
      title="Archive Parent"
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-yellow-900/50" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              className={`w-8 h-8 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
          </div>
        </div>

        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Archive Parent?
        </h3>
        <p
          className={`mb-6 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to archive{" "}
          <span className="font-semibold">{parent?.name}</span>? This action
          will move the parent's record to the archives.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors font-kumbh ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmArchive}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2 font-kumbh"
          >
            Yes, Archive
          </button>
        </div>
      </div>
    </BaseModal>
  );

  // Step 2: Reason Selection Modal
  const renderReasonStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 2}
      onClose={handleClose}
      title="Select Archive Reason"
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-yellow-900/50" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              className={`w-8 h-8 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
          </div>
        </div>

        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Select Archive Reason
        </h3>
        <p
          className={`mb-4 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Please select the reason for archiving{" "}
          <span className="font-semibold">{parent?.name}</span>.
        </p>

        <div className="mb-6">
          <label
            className={`block text-left mb-2 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Account Status
          </label>
          <div className="relative">
            <select
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none pr-10 font-kumbh ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">Select a reason</option>
              {archiveReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        {error && (
          <div
            className={`mb-4 p-3 border rounded-lg font-kumbh ${
              darkMode
                ? "bg-red-900/50 border-red-800 text-red-200"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setCurrentStep(1)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-kumbh ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleSubmitWithReason}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-kumbh"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Archiving...
              </>
            ) : (
              "Confirm Archive"
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );

  // Step 3: Success Modal
  const renderSuccessStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 3}
      onClose={handleDone}
      title="Archive Successful"
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
            <CheckCircle
              className={`w-8 h-8 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
        </div>

        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Successfully Archived!
        </h3>
        <p
          className={`mb-2 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span className="font-semibold">{parent?.name}</span> has been
          successfully moved to archives.
        </p>
        <p
          className={`text-sm mb-6 font-kumbh ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Reason: <span className="font-medium">{archiveReason}</span>
        </p>

        <button
          onClick={handleDone}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors font-kumbh"
        >
          Done
        </button>
      </div>
    </BaseModal>
  );

  // Step 4: Error Modal
  const renderErrorStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 4}
      onClose={handleClose}
      title="Archive Failed"
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
            <XCircle
              className={`w-8 h-8 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            />
          </div>
        </div>

        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Archive Failed
        </h3>
        <p
          className={`mb-4 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {error || "Failed to archive parent. Please try again."}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors font-kumbh"
          >
            Try Again
          </button>
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors font-kumbh ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );

  return (
    <>
      {renderConfirmationStep()}
      {renderReasonStep()}
      {renderSuccessStep()}
      {renderErrorStep()}
    </>
  );
}
