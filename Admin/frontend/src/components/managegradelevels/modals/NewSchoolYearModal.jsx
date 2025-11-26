import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModel";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";
import manageGradeLevelsService from "../../../services/manageGradeLevelsService";

const NewSchoolYearModal = ({ isOpen, onClose, onAddSchoolYear }) => {
  const [academicYear, setAcademicYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const schoolYearData = {
        YearName: academicYear,
        StartDate: startDate,
        EndDate: endDate,
      };

      const response = await manageGradeLevelsService.createSchoolYear(
        schoolYearData
      );

      setIsSuccess(true);

      if (onAddSchoolYear) {
        await onAddSchoolYear(response.data || response);
      }
    } catch (error) {
      setError(
        error.message || "Failed to create school year. Please try again."
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
    setAcademicYear("");
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
        School year has been created successfully.
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

  // Error State Content
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

  // Loading State Content
  const renderLoadingContent = () => (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        <Loader className="h-12 w-12 text-yellow-500 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-kumbh">
        Creating School Year
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        Please wait while we create the new school year...
      </p>
    </div>
  );

  // Form Content
  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6 font-kumbh">
      {/* Academic Year Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-kumbh">
          Academic Year
        </label>
        <input
          type="text"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          placeholder="Academic Year (e.g., 2024-2025)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
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
          {isLoading ? "Creating..." : "Create"}
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
          ? "Creating School Year"
          : "Add New School Year"
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

export default NewSchoolYearModal;
