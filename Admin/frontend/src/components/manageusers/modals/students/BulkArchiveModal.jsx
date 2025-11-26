import React, { useState, useEffect } from "react";
import { Archive, CheckCircle, XCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
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

export default function BulkArchiveModal({
  darkMode = false,
  isOpen = false,
  onClose = () => {},
  onConfirm = (accountStatus) => {},
  isLoading = false,
  studentCount = 0,
  operationStatus = null, // 'success', 'error', or null
  operationMessage = "",
}) {
  const [accountStatus, setAccountStatus] = useState("Suspended");
  const [internalOperationStatus, setInternalOperationStatus] = useState(null);
  const [internalOperationMessage, setInternalOperationMessage] = useState("");

  // Sync with external operation status
  useEffect(() => {
    if (operationStatus) {
      setInternalOperationStatus(operationStatus);
      setInternalOperationMessage(operationMessage);
    }
  }, [operationStatus, operationMessage]);

  const handleConfirm = () => {
    // Reset internal states when starting new operation
    setInternalOperationStatus(null);
    setInternalOperationMessage("");

    // Just pass the selected status to parent and close modal
    // Parent will handle the actual archiving
    onConfirm(accountStatus);
  };

  const handleClose = () => {
    setAccountStatus("Suspended");
    setInternalOperationStatus(null);
    setInternalOperationMessage("");
    onClose();
  };

  const handleDone = () => {
    handleClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setAccountStatus("Suspended");
      setInternalOperationStatus(null);
      setInternalOperationMessage("");
    }
  }, [isOpen]);

  // Success state
  if (internalOperationStatus === "success") {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Archive Successful"
        width="max-w-md"
        darkMode={darkMode}
      >
        <div className="text-center py-6">
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
            Archive Completed
          </h3>
          <p
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {internalOperationMessage ||
              `Successfully archived ${studentCount} student account${
                studentCount !== 1 ? "s" : ""
              }.`}
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
  }

  // Error state
  if (internalOperationStatus === "error") {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Archive Failed"
        width="max-w-md"
        darkMode={darkMode}
      >
        <div className="text-center py-6">
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
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {internalOperationMessage ||
              `Failed to archive ${studentCount} student account${
                studentCount !== 1 ? "s" : ""
              }. Please try again.`}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-kumbh"
            >
              <Archive className="w-4 h-4" />
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
  }

  // Default archive confirmation state
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Archive Accounts"
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
            <Archive
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
          Archive {studentCount} Account{studentCount !== 1 ? "s" : ""}?
        </h3>
        <p
          className={`mb-4 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to archive {studentCount} student account
          {studentCount !== 1 ? "s" : ""}? This action will set the account
          status for all selected students.
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
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
              disabled={isLoading}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none pr-10 font-kumbh disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
            <svg
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <p
            className={`text-xs mt-2 text-left font-kumbh ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Select the account status for all archived accounts
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors font-kumbh disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-kumbh"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Archiving...
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                Confirm Archive
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
