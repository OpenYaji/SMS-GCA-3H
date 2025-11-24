import React, { useState } from "react";
import { RotateCcw, CheckCircle, XCircle, ChevronDown } from "lucide-react";

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

export default function RestoreStudentModal({
  darkMode = false,
  isOpen = false,
  onClose = () => {},
  student = null,
  onRestoreConfirm = async (student, restoreType) => {
    console.log("Restoring:", student?.id, "Type:", restoreType);
    return { success: true };
  },
  onRestoreDone = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [restoreType, setRestoreType] = useState("");

  const handleClose = () => {
    setIsLoading(false);
    setError(null);
    setShowSuccess(false);
    setRestoreType("");
    onClose();
  };

  // Determine available restore types based on student's archive status
  const getAvailableRestoreTypes = () => {
    const types = [];

    if (!student) return types;

    // For fully archived students, show all three options
    if (student.isRecordArchived && student.isAccountArchived) {
      types.push(
        { value: "record", label: "Restore Student Record Only" },
        { value: "account", label: "Restore Student Account Only" },
        { value: "both", label: "Restore Both Record and Account" }
      );
    }
    // For only record archived
    else if (student.isRecordArchived && !student.isAccountArchived) {
      types.push({ value: "record", label: "Restore Student Record" });
    }
    // For only account archived
    else if (!student.isRecordArchived && student.isAccountArchived) {
      types.push({ value: "account", label: "Restore Student Account" });
    }

    return types;
  };

  const handleConfirmRestore = async () => {
    if (!student) return;

    // If only one option is available and restoreType is not set, auto-select it
    const availableTypes = getAvailableRestoreTypes();
    let finalRestoreType = restoreType;

    if (availableTypes.length === 1 && !restoreType) {
      finalRestoreType = availableTypes[0].value;
    } else if (!restoreType) {
      setError("Please select what you want to restore");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await onRestoreConfirm(student, finalRestoreType);

      if (result.success) {
        setShowSuccess(true);
      } else {
        setError(result.message || "Failed to restore student");
      }
    } catch (error) {
      console.error("Error restoring student:", error);
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

  const availableRestoreTypes = getAvailableRestoreTypes();
  const hasMultipleOptions = availableRestoreTypes.length > 1;
  const hasSingleOption = availableRestoreTypes.length === 1;

  // Auto-select the only available option
  React.useEffect(() => {
    if (hasSingleOption && !restoreType) {
      setRestoreType(availableRestoreTypes[0].value);
    }
  }, [hasSingleOption, restoreType, availableRestoreTypes]);

  // Success State
  if (showSuccess) {
    const getSuccessMessage = () => {
      switch (restoreType) {
        case "record":
          return "Student record has been successfully restored. The student will now appear in the 'Archived Students Account' view.";
        case "account":
          return "Student account has been successfully restored. The student will now appear in the 'Archived Student Records' view.";
        case "both":
          return "Student record and account have been successfully restored. The student will now appear in the 'All Students' view.";
        default:
          return "Student has been successfully restored.";
      }
    };

    const getNextView = () => {
      switch (restoreType) {
        case "record":
          return "Archived Students Account";
        case "account":
          return "Archived Student Records";
        case "both":
          return "All Students";
        default:
          return "All Students";
      }
    };

    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleDone}
        title="Restore Successful"
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
            Successfully Restored!
          </h3>
          <p
            className={`mb-4 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="font-semibold">{student?.name}</span>{" "}
            {getSuccessMessage()}
          </p>

          <div
            className={`mb-6 p-3 rounded-lg ${
              darkMode
                ? "bg-blue-900/50 border-blue-800"
                : "bg-blue-50 border-blue-200"
            } border`}
          >
            <p
              className={`text-sm font-kumbh ${
                darkMode ? "text-blue-200" : "text-blue-800"
              }`}
            >
              <strong>Note:</strong> The student will now appear in the{" "}
              <strong>"{getNextView()}"</strong> view.
            </p>
          </div>

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
            Restore Failed
          </h3>
          <p
            className={`mb-4 font-kumbh ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error || "Failed to restore student. Please try again."}
          </p>

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

  // Default Confirmation State
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Restore Student"
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
            <RotateCcw
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
          Restore Student?
        </h3>
        <p
          className={`mb-4 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to restore{" "}
          <span className="font-semibold">{student?.name}</span>?
        </p>

        {hasMultipleOptions && (
          <div className="mb-4">
            <label
              className={`block text-left mb-2 font-kumbh ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              What would you like to restore? *
            </label>
            <div className="relative">
              <select
                value={restoreType}
                onChange={(e) => setRestoreType(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none appearance-none pr-10 font-kumbh ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select restore type</option>
                {availableRestoreTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
        )}

        {hasSingleOption && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className={`text-sm font-kumbh text-green-800`}>
              <strong>Note:</strong> This will{" "}
              {availableRestoreTypes[0].label.toLowerCase()}.
            </p>
          </div>
        )}

        {!hasMultipleOptions && !hasSingleOption && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className={`text-sm font-kumbh text-red-800`}>
              <strong>Error:</strong> No archive found to restore.
            </p>
          </div>
        )}

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
            onClick={handleConfirmRestore}
            disabled={
              isLoading ||
              (!hasSingleOption && !restoreType) ||
              (!hasMultipleOptions && !hasSingleOption)
            }
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
