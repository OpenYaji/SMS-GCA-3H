import React, { useState } from "react";
import BaseModal from "../BaseModal";
import { CheckCircle, AlertTriangle, ChevronDown, XCircle } from "lucide-react";

export default function ArchiveUserModal({
  isOpen = false,
  onClose = () => {},
  user = null,
  userType = "User", // "Teacher", "Guard", "Registrar", "Admin"
  onArchiveConfirm = async (user, accountStatus) => ({ success: true }),
  onArchiveDone = () => {},
  darkMode = false,
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: confirmation, 2: status, 3: success, 4: error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountStatus, setAccountStatus] = useState("");

  const accountStatusOptions = [
    { value: "Inactive", label: "Inactive" },
    { value: "Suspended", label: "Suspended" },
  ];

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
    setAccountStatus("");
    onClose();
  };

  const handleConfirmArchive = async () => {
    if (!user) return;
    setCurrentStep(2);
  };

  const handleSubmitWithStatus = async () => {
    if (!accountStatus) {
      setError("Please select an account status");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await onArchiveConfirm(user, accountStatus);

      if (result.success) {
        setCurrentStep(3);
      } else {
        setError(
          result.message || `Failed to archive ${userType.toLowerCase()}`
        );
        setCurrentStep(4);
      }
    } catch (error) {
      console.error(`Error archiving ${userType.toLowerCase()}:`, error);
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
      title={`Archive ${userType}`}
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-yellow-900" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              className={`w-8 h-8 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
          </div>
        </div>

        {/* Confirmation Message */}
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Archive {userType}?
        </h3>
        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Are you sure you want to archive{" "}
          <span className="font-semibold">{user?.name}</span>? This action will
          move the {userType.toLowerCase()}'s record and account to the
          archives.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmArchive}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2"
          >
            Yes, Archive
          </button>
        </div>
      </div>
    </BaseModal>
  );

  // Step 2: Status Selection Modal
  const renderStatusStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 2}
      onClose={handleClose}
      title="Select Account Status"
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-yellow-900" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              className={`w-8 h-8 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
          </div>
        </div>

        {/* Status Selection Message */}
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Select Account Status
        </h3>
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Please select the account status for{" "}
          <span className="font-semibold">{user?.name}</span>.
        </p>

        {/* Status Dropdown */}
        <div className="mb-6">
          <label
            className={`block text-left mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Account Status
          </label>
          <div className="relative">
            <select
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none pr-10 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">Select a status</option>
              {accountStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`mb-4 p-3 border rounded-lg ${
              darkMode
                ? "bg-red-900/20 border-red-800"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setCurrentStep(1)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleSubmitWithStatus}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-green-900" : "bg-green-100"
            }`}
          >
            <CheckCircle
              className={`w-8 h-8 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
        </div>

        {/* Success Message */}
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Successfully Archived!
        </h3>
        <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          <span className="font-semibold">{user?.name}</span> has been
          successfully moved to archives.
        </p>
        <p
          className={`text-sm mb-6 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Status: <span className="font-medium">{accountStatus}</span>
        </p>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors"
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
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-red-900" : "bg-red-100"
            }`}
          >
            <XCircle
              className={`w-8 h-8 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            />
          </div>
        </div>

        {/* Error Message */}
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Archive Failed
        </h3>
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          {error ||
            `Failed to archive ${userType.toLowerCase()}. Please try again.`}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
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
      {renderStatusStep()}
      {renderSuccessStep()}
      {renderErrorStep()}
    </>
  );
}
