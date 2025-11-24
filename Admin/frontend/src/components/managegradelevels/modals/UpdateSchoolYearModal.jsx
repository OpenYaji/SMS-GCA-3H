import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModel";
import manageGradeLevelsService from "../../../services/manageGradeLevelsService";
import { CheckCircle, AlertTriangle, Loader, Edit } from "lucide-react";

const UpdateSchoolYearModal = ({
  isOpen,
  onClose,
  onUpdateSchoolYear,
  schoolYear,
}) => {
  const [academicYear, setAcademicYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (schoolYear) {
      setAcademicYear(schoolYear.yearName || "");
      setStartDate(
        schoolYear.startDate ? schoolYear.startDate.split("T")[0] : ""
      );
      setEndDate(schoolYear.endDate ? schoolYear.endDate.split("T")[0] : "");
    }
  }, [schoolYear, isOpen]);

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

      console.log("Updating school year with data:", schoolYearData);

      const response = await manageGradeLevelsService.updateSchoolYear(
        schoolYear.id,
        schoolYearData
      );

      console.log("School year updated successfully:", response);

      const updatedData = {
        ...response,
        data: {
          ...schoolYearData,
          id: schoolYear.id,
        },
      };

      setSuccessData(updatedData);
      setIsSuccess(true);

      if (onUpdateSchoolYear) {
        onUpdateSchoolYear(updatedData);
      }
    } catch (error) {
      setError(
        error.message || "Failed to update school year. Please try again."
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
    setError("");
    setIsLoading(false);
    setIsSuccess(false);
    setSuccessData(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Success State Content
  const renderSuccessContent = () => (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-kumbh">
        Success!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        School year has been updated successfully.
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
        Updating School Year
      </h3>
      <p className="text-gray-600 dark:text-gray-400 font-kumbh">
        Please wait while we update the school year...
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
          {isLoading ? "Updating..." : "Update"}
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
          ? "Updating School Year"
          : "Edit School Year"
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

export default UpdateSchoolYearModal;
