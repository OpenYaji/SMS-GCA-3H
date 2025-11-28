// SetDeadlineModal.jsx
import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModel";
import { CheckCircle, AlertTriangle, Loader, Edit, Ban } from "lucide-react";
import manageGradeLevelsService from "../../../services/manageGradeLevelsService";

const SetDeadlineModal = ({
  isOpen,
  onClose,
  onSetDeadline,
  currentSchoolYear,
}) => {
  const [quarter, setQuarter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingDeadlines, setExistingDeadlines] = useState([]);
  const [editingDeadline, setEditingDeadline] = useState(null);

  const quarters = [
    { value: "First Quarter", label: "First Quarter" },
    { value: "Second Quarter", label: "Second Quarter" },
    { value: "Third Quarter", label: "Third Quarter" },
    { value: "Fourth Quarter", label: "Fourth Quarter" },
  ];

  // Fetch existing deadlines when modal opens
  useEffect(() => {
    if (isOpen && currentSchoolYear) {
      fetchExistingDeadlines();
    }
  }, [isOpen, currentSchoolYear]);

  const fetchExistingDeadlines = async () => {
    try {
      if (currentSchoolYear) {
        const deadlines =
          await manageGradeLevelsService.getGradeSubmissionDeadlines(
            currentSchoolYear.id
          );
        setExistingDeadlines(deadlines);
      }
    } catch (error) {
      console.error("Error fetching existing deadlines:", error);
    }
  };

  // Check if a quarter already has a deadline
  const isQuarterDisabled = (quarterValue) => {
    return existingDeadlines.some(
      (deadline) =>
        deadline.quarter === quarterValue &&
        deadline.id !== (editingDeadline?.id || null)
    );
  };

  // Get available quarters (not yet set)
  const getAvailableQuarters = () => {
    return quarters.filter((q) => !isQuarterDisabled(q.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate dates
    if (new Date(startDate) > new Date(deadlineDate)) {
      setError("Start date cannot be after deadline date");
      setIsLoading(false);
      return;
    }

    try {
      const deadlineData = {
        SchoolYearID: parseInt(currentSchoolYear.id),
        Quarter: quarter,
        StartDate: startDate,
        DeadlineDate: deadlineDate,
      };

      if (editingDeadline) {
        // Update existing deadline
        await manageGradeLevelsService.updateGradeSubmissionDeadline(
          editingDeadline.id,
          {
            StartDate: startDate,
            DeadlineDate: deadlineDate,
          }
        );
      } else {
        // Create new deadline
        await manageGradeLevelsService.createGradeSubmissionDeadline(
          deadlineData
        );
      }

      if (onSetDeadline) {
        await onSetDeadline(deadlineData);
      }

      setIsSuccess(true);
      await fetchExistingDeadlines(); // Refresh the list
    } catch (error) {
      setError(
        error.message || "Failed to set grade deadline. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDeadline = (deadline) => {
    setEditingDeadline(deadline);
    setQuarter(deadline.quarter);
    setStartDate(deadline.startDate.split(" ")[0]); // Remove time part if exists
    setDeadlineDate(deadline.deadlineDate.split(" ")[0]); // Remove time part if exists
    setError("");
  };

  const handleCreateNew = () => {
    setEditingDeadline(null);
    setQuarter("");
    setStartDate("");
    setDeadlineDate("");
    setError("");
  };

  const handleDone = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setQuarter("");
    setStartDate("");
    setDeadlineDate("");
    setError("");
    setIsLoading(false);
    setIsSuccess(false);
    setEditingDeadline(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderSuccessContent = () => (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-kumbh">
        Success!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        {editingDeadline
          ? "Grade deadline has been updated successfully."
          : "Grade deadline has been set successfully."}
      </p>
      <div className="mt-6">
        <button
          onClick={handleDone}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-kumbh font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );

  const renderErrorContent = () => (
    <div className="text-center py-4">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-kumbh">
        Error
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh mb-4">
        {error}
      </p>
      <button
        onClick={() => setError("")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-kumbh font-medium"
      >
        Try Again
      </button>
    </div>
  );

  const renderLoadingContent = () => (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        <Loader className="h-12 w-12 text-yellow-500 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-kumbh">
        {editingDeadline ? "Updating Deadline" : "Setting Deadline"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        Please wait while we {editingDeadline ? "update" : "set"} the grade
        deadline...
      </p>
    </div>
  );

  const renderExistingDeadlines = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-kumbh">
        Existing Deadlines
      </h3>
      {existingDeadlines.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm font-kumbh">
          No deadlines set for this school year.
        </p>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {existingDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white font-kumbh">
                  {deadline.quarter}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                  {formatDisplayDate(deadline.startDate)} -{" "}
                  {formatDisplayDate(deadline.deadlineDate)}
                </p>
              </div>
              <button
                onClick={() => handleEditDeadline(deadline)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Edit deadline"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuarterDropdown = () => {
    const availableQuarters = getAvailableQuarters();
    const allQuartersDisabled =
      availableQuarters.length === 0 && !editingDeadline;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
          Quarter
        </label>
        <select
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          required
          disabled={!!editingDeadline || allQuartersDisabled}
        >
          <option value="">
            {allQuartersDisabled
              ? "All quarters have deadlines"
              : "Select Quarter"}
          </option>
          {quarters.map((q) => {
            const isDisabled = isQuarterDisabled(q.value);
            return (
              <option
                key={q.value}
                value={q.value}
                disabled={isDisabled && !editingDeadline}
                className={
                  isDisabled && !editingDeadline
                    ? "bg-gray-100 text-gray-400"
                    : ""
                }
              >
                {q.label}
                {isDisabled && !editingDeadline && " (Already set)"}
              </option>
            );
          })}
        </select>

        {allQuartersDisabled && !editingDeadline && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <Ban className="h-4 w-4" />
            <span>
              All quarters already have deadlines. Edit an existing one or
              create a new school year.
            </span>
          </div>
        )}

        {!allQuartersDisabled && existingDeadlines.length > 0 && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Available quarters:{" "}
              {availableQuarters.map((q) => q.label).join(", ")}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFormContent = () => (
    <div className="space-y-6">
      {renderExistingDeadlines()}

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-kumbh">
          {editingDeadline
            ? `Edit ${editingDeadline.quarter} Deadline`
            : "Set New Deadline"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 font-kumbh">
          {/* Quarter Dropdown */}
          {renderQuarterDropdown()}

          {/* Start Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Deadline Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
              Deadline Date
            </label>
            <input
              type="date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-3 pt-4">
            <div>
              {editingDeadline && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-kumbh font-medium"
                >
                  Create New
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-kumbh font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-kumbh font-medium flex items-center justify-center min-w-[100px] disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={
                  isLoading ||
                  (getAvailableQuarters().length === 0 && !editingDeadline)
                }
              >
                {isLoading
                  ? editingDeadline
                    ? "Updating..."
                    : "Setting..."
                  : editingDeadline
                  ? "Update Deadline"
                  : "Set Deadline"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isSuccess
          ? "Success"
          : error
          ? "Error"
          : isLoading
          ? editingDeadline
            ? "Updating Deadline"
            : "Setting Deadline"
          : "Set Grade Deadline"
      }
      width="max-w-md"
      darkBackground={true}
    >
      <div className="font-kumbh">
        {isSuccess && renderSuccessContent()}
        {error && renderErrorContent()}
        {isLoading && renderLoadingContent()}
        {!isSuccess && !error && !isLoading && renderFormContent()}
      </div>
    </BaseModal>
  );
};

export default SetDeadlineModal;
