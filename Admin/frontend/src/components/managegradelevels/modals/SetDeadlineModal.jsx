// SetDeadlineModal.jsx
import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModel";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";

const SetDeadlineModal = ({ isOpen, onClose, onSetDeadline }) => {
  const [quarter, setQuarter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const quarters = [
    { value: "1", label: "Quarter 1" },
    { value: "2", label: "Quarter 2" },
    { value: "3", label: "Quarter 3" },
    { value: "4", label: "Quarter 4" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const deadlineData = {
        quarter: quarter,
        startDate: startDate,
        endDate: endDate,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSetDeadline) {
        await onSetDeadline(deadlineData);
      }

      setIsSuccess(true);
    } catch (error) {
      setError(
        error.message || "Failed to set grade deadline. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setQuarter("");
    setStartDate("");
    setEndDate("");
    setError("");
    setIsLoading(false);
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const renderSuccessContent = () => (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-kumbh">
        Success!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        Grade deadline has been set successfully.
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
        Setting Deadline
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        Please wait while we set the grade deadline...
      </p>
    </div>
  );

  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6 font-kumbh">
      {/* Quarter Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
          Quarter
        </label>
        <select
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        >
          <option value="">Select Quarter</option>
          {quarters.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>
      </div>

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

      {/* End Date Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-kumbh font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-kumbh font-medium flex items-center justify-center min-w-[80px]"
          disabled={isLoading}
        >
          {isLoading ? "Setting..." : "Set Deadline"}
        </button>
      </div>
    </form>
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
          ? "Setting Deadline"
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
