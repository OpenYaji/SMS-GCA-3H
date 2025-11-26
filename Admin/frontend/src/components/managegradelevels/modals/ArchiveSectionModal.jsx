import React, { useState } from "react";
import BaseModal from "./BaseModel";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function ArchiveSectionModal({
  isOpen = false,
  onClose = () => {},
  section = null,
  onArchiveConfirm = async (section) => {
    // Mock successful archive for now
    console.log("Archiving section:", section?.id);
    return { success: true };
  },
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: confirmation, 2: success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
    onClose();
  };

  const handleConfirmArchive = async () => {
    if (!section) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onArchiveConfirm(section);

      if (result.success) {
        setCurrentStep(2); // Show success step
      } else {
        setError(result.message || "Failed to archive section");
      }
    } catch (error) {
      console.error("Error archiving section:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    handleClose();
  };

  // Step 1: Confirmation Modal
  const renderConfirmationStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 1}
      onClose={handleClose}
      title="Archive Section"
      width="max-w-md"
      darkBackground={true}
    >
      <div className="text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Confirmation Message */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Archive Section?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to archive{" "}
          <span className="font-semibold">{section?.name}</span>? This action
          will move the section's record to the archives.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmArchive}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Archiving...
              </>
            ) : (
              "Yes, Archive"
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );

  // Step 2: Success Modal
  const renderSuccessStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 2}
      onClose={handleDone}
      title="Archive Successful"
      width="max-w-md"
      darkBackground={true}
    >
      <div className="text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Successfully Archived!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          <span className="font-semibold">{section?.name}</span> has been
          successfully moved to archives.
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

  return (
    <>
      {renderConfirmationStep()}
      {renderSuccessStep()}
    </>
  );
}
