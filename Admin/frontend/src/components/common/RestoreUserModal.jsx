// RestoreUserModal.jsx
import React, { useState } from "react";
import BaseModal from "../BaseModal";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";

export default function RestoreUserModal({
  isOpen = false,
  onClose = () => {},
  user = null,
  userType = "User", // "Teacher", "Guard", "Registrar", "Admin"
  onRestoreConfirm = async (user) => {
    console.log("Restoring:", user?.id);
    return { success: true };
  },
  onRestoreDone = () => {},
  darkMode = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset state when modal closes
  const handleClose = () => {
    setIsLoading(false);
    setError(null);
    setShowSuccess(false);
    onClose();
  };

  const handleConfirmRestore = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onRestoreConfirm(user);

      if (result.success) {
        setShowSuccess(true);
      } else {
        setError(
          result.message || `Failed to restore ${userType.toLowerCase()}`
        );
      }
    } catch (error) {
      console.error(`Error restoring ${userType.toLowerCase()}:`, error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleDone = () => {
    handleClose();
    onRestoreDone();
  };

  // Success State
  if (showSuccess) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleDone}
        title="Restore Successful"
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
            className={`text-lg font-semibold mb-2 font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Successfully Restored!
          </h3>
          <p
            className={`mb-6 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="font-semibold">{user?.name}</span> has been
            successfully restored and is now active again.
          </p>

          {/* Done Button */}
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

  // Error State
  if (error) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Restore Failed"
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
            className={`text-lg font-semibold mb-2 font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Restore Failed
          </h3>
          <p
            className={`mb-4 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error ||
              `Failed to restore ${userType.toLowerCase()}. Please try again.`}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors font-kumbh"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors font-kumbh ${
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
  }

  // Default Confirmation State
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Restore ${userType}`}
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-green-900" : "bg-green-100"
            }`}
          >
            <RotateCcw
              className={`w-8 h-8 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
        </div>

        {/* Confirmation Message */}
        <h3
          className={`text-lg font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Restore {userType}?
        </h3>
        <p
          className={`mb-6 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to restore{" "}
          <span className="font-semibold">{user?.name}</span>? This will make
          the {userType.toLowerCase()} active again.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors font-kumbh disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRestore}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center gap-2 font-kumbh disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Yes, Restore
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
