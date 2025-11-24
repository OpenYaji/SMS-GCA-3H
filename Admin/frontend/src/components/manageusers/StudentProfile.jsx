import { useState, useEffect } from "react";
import ArchiveStudentModal from "./modals/students/ArchiveStudentModal";
import RestoreStudentModal from "./modals/students/RestoreStudentModal";
import StudentInformationModal from "./modals/students/StudentInformationModal";
import BulkArchiveModal from "./modals/students/BulkArchiveModal";
import ErrorModal from "./modals/teachers/ErrorModal";
import SuccessModal from "./modals/teachers/SuccessModal";
import studentService from "../../services/studentService";

export default function StudentProfile({
  student,
  onStudentArchived,
  onStudentRestored,
  onStudentInfoUpdated,
  darkMode,
  currentView = "All Students",
  selectedStudents = [],
  onBulkAccountCreation,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBulkArchiveModal, setShowBulkArchiveModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isCreatingBulkAccounts, setIsCreatingBulkAccounts] = useState(false);
  const [isArchivingBulkAccounts, setIsArchivingBulkAccounts] = useState(false);

  // New states for bulk archive modal
  const [bulkArchiveStatus, setBulkArchiveStatus] = useState(null); // 'success', 'error', or null
  const [bulkArchiveMessage, setBulkArchiveMessage] = useState("");

  // NEW: Reset profile when currentView changes
  useEffect(() => {
    // Reset all modal states when view changes
    setShowArchiveModal(false);
    setShowRestoreModal(false);
    setShowInfoModal(false);
    setShowBulkArchiveModal(false);
    setShowErrorModal(false);
    setShowSuccessModal(false);
    setModalMessage({ title: "", message: "" });
    setIsCreatingAccount(false);
    setIsCreatingBulkAccounts(false);
    setIsArchivingBulkAccounts(false);
    setBulkArchiveStatus(null);
    setBulkArchiveMessage("");
  }, [currentView]);

  // Format name for avatar initials
  const getStudentInitials = (student) => {
    if (!student || !student.name) return "";

    const nameParts = student.name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (
        nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }
  };

  // UPDATED ARCHIVE HANDLER - Now supports three archive types
  const handleArchiveStudent = async (
    studentToArchive,
    archiveType,
    recordReason,
    accountReason
  ) => {
    try {
      let result;
      const studentId =
        studentToArchive.studentProfileId || studentToArchive.id;

      switch (archiveType) {
        case "record":
          result = await studentService.archiveStudentRecord(
            studentId,
            recordReason
          );
          break;
        case "account":
          result = await studentService.archiveStudentAccount(
            studentId,
            accountReason
          );
          break;
        case "both":
          result = await studentService.archiveStudentBoth(
            studentId,
            recordReason,
            accountReason
          );
          break;
        default:
          throw new Error("Invalid archive type");
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error archiving student:", error);
      setModalMessage({
        title: "Archive Failed",
        message:
          error.message || "Failed to archive student. Please try again.",
      });
      setShowErrorModal(true);
      return { success: false, message: error.message };
    }
  };

  // UPDATED RESTORE HANDLER - Now supports different restore types
  const handleRestoreStudent = async (studentToRestore, restoreType) => {
    try {
      const studentId =
        studentToRestore.studentProfileId || studentToRestore.id;
      let result;

      console.log("Restoring student:", studentId, "Type:", restoreType);

      switch (restoreType) {
        case "record":
          result = await studentService.restoreStudent(studentId);
          break;
        case "account":
          result = await studentService.restoreStudentAccount(studentId);
          break;
        case "both":
          result = await studentService.restoreStudentBoth(studentId);
          break;
        default:
          throw new Error("Invalid restore type");
      }

      console.log("Restore successful:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error restoring student:", error);
      setModalMessage({
        title: "Restore Failed",
        message:
          error.message || "Failed to restore student. Please try again.",
      });
      setShowErrorModal(true);
      return { success: false, message: error.message };
    }
  };

  // CREATE STUDENT ACCOUNT HANDLER
  const handleCreateStudentAccount = async () => {
    if (!student) return;

    setIsCreatingAccount(true);
    try {
      await studentService.activateStudentAccount(
        student.studentProfileId || student.id
      );

      setModalMessage({
        title: "Account Created Successfully",
        message: `Student account for ${student.name} has been created successfully. The student can now login with their credentials.`,
      });
      setShowSuccessModal(true);

      // Trigger table refresh after account creation
      if (onStudentInfoUpdated) {
        onStudentInfoUpdated();
      }
    } catch (error) {
      console.error("Error creating student account:", error);
      setModalMessage({
        title: "Account Creation Failed",
        message:
          error.message ||
          "Failed to create student account. Please try again.",
      });
      setShowErrorModal(true);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // FIXED: BULK CREATE STUDENT ACCOUNTS HANDLER - Now properly shows modals
  const handleBulkCreateStudentAccounts = async () => {
    if (!selectedStudents || selectedStudents.length === 0) return;

    const studentCount = selectedStudents.length;
    setIsCreatingBulkAccounts(true);

    try {
      const result = await studentService.bulkActivateAccounts(
        selectedStudents
      );

      setModalMessage({
        title: "Accounts Created Successfully",
        message: `Successfully created accounts for ${studentCount} students. They can now login with their credentials.`,
      });
      setShowSuccessModal(true);

      // Trigger table refresh after successful bulk creation
      setTimeout(() => {
        if (onBulkAccountCreation) {
          onBulkAccountCreation([], []);
        }

        if (onStudentInfoUpdated) {
          onStudentInfoUpdated();
        }
      }, 100);
    } catch (error) {
      console.error("Error in bulk account activation:", error);
      setModalMessage({
        title: "Bulk Creation Failed",
        message:
          error.message ||
          "Failed to create student accounts. Please try again.",
      });
      setShowErrorModal(true);
    } finally {
      setIsCreatingBulkAccounts(false);
    }
  };

  // BULK ARCHIVE STUDENT ACCOUNTS HANDLER
  const handleBulkArchiveStudentAccounts = async (accountStatus) => {
    if (!selectedStudents || selectedStudents.length === 0) return;

    const studentCount = selectedStudents.length;
    setIsArchivingBulkAccounts(true);

    try {
      const result = await studentService.bulkArchiveAccounts(
        selectedStudents,
        accountStatus
      );

      // Set success state for BulkArchiveModal
      setBulkArchiveStatus("success");
      setBulkArchiveMessage(
        `Successfully archived accounts for ${studentCount} students with status: ${accountStatus}.`
      );

      // Trigger table refresh after successful bulk archival
      setTimeout(() => {
        if (onBulkAccountCreation) {
          onBulkAccountCreation([], []);
        }

        if (onStudentInfoUpdated) {
          onStudentInfoUpdated();
        }
      }, 100);
    } catch (error) {
      console.error("Error in bulk account archival:", error);

      // Set error state for BulkArchiveModal
      setBulkArchiveStatus("error");
      setBulkArchiveMessage(
        error.message || "Failed to archive student accounts. Please try again."
      );
    } finally {
      setIsArchivingBulkAccounts(false);
    }
  };

  // Close handlers
  const handleArchiveModalClose = () => setShowArchiveModal(false);
  const handleRestoreModalClose = () => setShowRestoreModal(false);
  const handleErrorModalClose = () => setShowErrorModal(false);
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setModalMessage({ title: "", message: "" });
    setIsCreatingBulkAccounts(false);
    setIsArchivingBulkAccounts(false);
  };

  // Updated Bulk Archive Modal close handler
  const handleBulkArchiveModalClose = () => {
    setShowBulkArchiveModal(false);
    // Reset status when closing modal
    setBulkArchiveStatus(null);
    setBulkArchiveMessage("");
  };

  // Archive done handler
  const handleArchiveDone = () => {
    console.log("Archive done, triggering refresh for student:", student.id);
    if (onStudentArchived) {
      onStudentArchived(student.id);
    }
  };

  // Restore done handler
  const handleRestoreDone = () => {
    console.log("Restore done, triggering refresh for student:", student.id);
    if (onStudentRestored) {
      onStudentRestored(student.id);
    }
  };

  const handleStudentInfoUpdated = (updatedStudent) => {
    if (onStudentInfoUpdated) {
      onStudentInfoUpdated(updatedStudent);
    }
  };

  // Helper function to determine if student can be archived
  const canArchiveStudent = () => {
    if (!student) return false;

    // Student can be archived if either record or account is not archived
    return !student.isRecordArchived || !student.isAccountArchived;
  };

  // FIXED: Helper function to determine which archive types are available - Added null check
  const getAvailableArchiveTypes = () => {
    if (!student) return [];

    const availableTypes = [];

    if (!student.isRecordArchived) {
      availableTypes.push("record");
    }

    if (!student.isAccountArchived) {
      availableTypes.push("account");
    }

    // Only show "both" if neither is archived
    if (!student.isRecordArchived && !student.isAccountArchived) {
      availableTypes.push("both");
    }

    return availableTypes;
  };

  //  Determine if lalabas ba restore button based on current view and student status
  const shouldShowRestoreButton = () => {
    if (!student) return false;

    // Always show restore if student has any archive
    if (student.isRecordArchived || student.isAccountArchived) return true;

    if (
      currentView === "Archived Students Account" ||
      currentView === "Archived Student Records" ||
      currentView === "Students Fully Archived"
    ) {
      return true;
    }

    return false;
  };

  // Determine if lalabas ba archive button based on current view AND student account status
  const shouldShowArchiveButton = () => {
    if (!student) return false;

    // Don't show archive in any archived views
    if (
      currentView === "Archived Students Account" ||
      currentView === "Archived Student Records" ||
      currentView === "Students Fully Archived"
    ) {
      return false;
    }

    // Only show archive button if student has an account AND the account is not archived
    // AND the student can be archived (either record or account is not archived)
    const hasActiveAccount = student.hasAccount && !student.isAccountArchived;
    return hasActiveAccount && canArchiveStudent();
  };

  const shouldShowBulkAccountCreation = () => {
    return currentView === "Students with No Accounts";
  };

  const shouldShowBulkAccountArchival = () => {
    return (
      currentView !== "Students with No Accounts" &&
      currentView !== "Archived Students Account" &&
      currentView !== "Archived Student Records" &&
      currentView !== "Students Fully Archived"
    );
  };

  // FIXED: Determine what to show based on selection state
  const hasValidStudent = student && (student.id || student.studentProfileId);
  const showBulkActions =
    selectedStudents && selectedStudents.length > 0 && !hasValidStudent;
  const showIndividualStudent = hasValidStudent;

  const shouldShowEmptyState =
    !showIndividualStudent &&
    !showBulkActions &&
    !showSuccessModal &&
    !showErrorModal;

  // FIXED: Safe student data access
  const safeStudent = student || {};
  const studentInitials = getStudentInitials(safeStudent);
  const availableArchiveTypes = getAvailableArchiveTypes();
  const showArchiveButton = shouldShowArchiveButton();
  const showRestoreButton = shouldShowRestoreButton();

  if (shouldShowEmptyState) {
    return (
      <>
        <div
          className={`rounded-xl shadow-md p-6 text-center flex items-center justify-center font-kumbh ${
            darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
          }`}
        >
          Select a student to view details
        </div>

        {/* Modals always rendered */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          title={modalMessage.title}
          message={modalMessage.message}
          darkMode={darkMode}
          type="success"
        />

        <ErrorModal
          isOpen={showErrorModal}
          onClose={handleErrorModalClose}
          title={modalMessage.title}
          message={modalMessage.message}
          darkMode={darkMode}
          type="error"
        />

        {/* BulkArchiveModal with status handling */}
        <BulkArchiveModal
          isOpen={showBulkArchiveModal}
          onClose={handleBulkArchiveModalClose}
          onConfirm={handleBulkArchiveStudentAccounts}
          isLoading={isArchivingBulkAccounts}
          studentCount={selectedStudents.length}
          darkMode={darkMode}
          operationStatus={bulkArchiveStatus}
          operationMessage={bulkArchiveMessage}
        />
      </>
    );
  }

  if (!showIndividualStudent && showBulkActions) {
    return (
      <>
        {/* Bulk actions panel */}
        {!showIndividualStudent && showBulkActions && (
          <div
            className={`rounded-xl shadow-md p-6 font-kumbh ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl font-semibold mb-2 font-kumbh ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Bulk Actions
              </h3>
              <p
                className={`text-sm font-kumbh ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {selectedStudents.length} student
                {selectedStudents.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            <div className="space-y-3">
              {/* Bulk Account Creation - Only show in "Students with No Accounts" view */}
              {shouldShowBulkAccountCreation() && (
                <button
                  onClick={handleBulkCreateStudentAccounts}
                  disabled={isCreatingBulkAccounts}
                  className={`w-full py-3 rounded-lg transition font-medium font-kumbh flex items-center justify-center gap-2 shadow-sm ${
                    isCreatingBulkAccounts
                      ? "bg-green-600 text-white opacity-70 cursor-not-allowed"
                      : "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                  }`}
                >
                  {isCreatingBulkAccounts ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        Creating {selectedStudents.length} Account
                        {selectedStudents.length !== 1 ? "s" : ""}...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>
                        Create {selectedStudents.length} Student Account
                        {selectedStudents.length !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* Bulk Account Archival - Show in All Students and other non-archived views */}
              {shouldShowBulkAccountArchival() && (
                <button
                  onClick={() => setShowBulkArchiveModal(true)}
                  disabled={isArchivingBulkAccounts}
                  className={`w-full py-3 rounded-lg transition font-medium font-kumbh flex items-center justify-center gap-2 shadow-sm ${
                    isArchivingBulkAccounts
                      ? "bg-red-600 text-white opacity-70 cursor-not-allowed"
                      : "bg-red-700 text-white hover:bg-red-800 hover:shadow-md"
                  }`}
                >
                  {isArchivingBulkAccounts ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        Archiving {selectedStudents.length} Account
                        {selectedStudents.length !== 1 ? "s" : ""}...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      <span>
                        Archive {selectedStudents.length} Student Account
                        {selectedStudents.length !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </button>
              )}

              <div
                className={`text-xs text-center px-4 py-3 rounded-lg font-kumbh ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                <p className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {shouldShowBulkAccountCreation()
                    ? "This will create portal accounts for all selected students"
                    : "This will archive accounts for all selected students"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Individual student profile */}
        {showIndividualStudent && (
          <div
            className={`rounded-xl shadow-md p-6 text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-md overflow-hidden relative">
              {safeStudent.profilePictureURL || safeStudent.profilePicture ? (
                <img
                  src={
                    safeStudent.profilePictureURL || safeStudent.profilePicture
                  }
                  alt={safeStudent.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center ${
                  darkMode ? "bg-yellow-600" : "bg-yellow-400"
                } ${
                  safeStudent.profilePictureURL || safeStudent.profilePicture
                    ? "hidden"
                    : ""
                }`}
              >
                {studentInitials}
              </div>
            </div>

            <p
              className={`text-sm font-kumbh ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {safeStudent.studentNumber || safeStudent.id}
            </p>
            <h3
              className={`text-lg font-semibold mt-1 font-kumbh ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {safeStudent.name}
            </h3>
            <p
              className={`text-sm mb-4 font-kumbh ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Section{" "}
              {safeStudent.section || safeStudent.sectionName || "Not Assigned"}
            </p>

            <div className="flex justify-around mb-4 text-left font-kumbh">
              <div>
                <h4
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Grade
                </h4>
                <p
                  className={`text-base ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {safeStudent.grade || "Not Assigned"}
                </p>
              </div>
              <div>
                <h4
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Sex
                </h4>
                <p
                  className={`text-base ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {safeStudent.sex}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-col gap-2 mb-4">
              {safeStudent.isRecordArchived && (
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium font-kumbh ${
                    darkMode
                      ? "bg-red-900 text-red-200"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Record Archived{" "}
                  {safeStudent.status ? `(${safeStudent.status})` : ""}
                </span>
              )}
              {safeStudent.isAccountArchived && (
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    darkMode
                      ? "bg-orange-900 text-orange-200"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  Account Archived{" "}
                  {safeStudent.accountStatus
                    ? `(${safeStudent.accountStatus})`
                    : ""}
                </span>
              )}
              {!safeStudent.isRecordArchived &&
                !safeStudent.isAccountArchived && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      darkMode
                        ? "bg-green-900 text-green-200"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    Active
                  </span>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-8">
              <button
                onClick={() => setShowInfoModal(true)}
                className={`py-2 rounded-md transition font-medium font-kumbh ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                More Information
              </button>

              {showArchiveButton && (
                <button
                  onClick={() => setShowArchiveModal(true)}
                  className="bg-red-700 text-white py-2 font-medium rounded-md hover:bg-red-800 transition font-kumbh"
                >
                  Archive Student
                </button>
              )}

              {showRestoreButton && (
                <button
                  onClick={() => setShowRestoreModal(true)}
                  className="bg-yellow-400 text-gray-800 py-2 font-medium rounded-md hover:bg-yellow-500 transition font-kumbh"
                >
                  Restore Student
                </button>
              )}

              {!safeStudent.isAccountArchived &&
                !safeStudent.hasAccount &&
                currentView !== "Archived Students Account" && (
                  <button
                    onClick={handleCreateStudentAccount}
                    disabled={isCreatingAccount}
                    className={`py-2 rounded-md transition font-kumbh flex items-center justify-center gap-2 ${"bg-green-700 text-white hover:bg-green-800"} ${
                      isCreatingAccount ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isCreatingAccount ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Student Account"
                    )}
                  </button>
                )}
            </div>

            {/* Archive Modal */}
            <ArchiveStudentModal
              isOpen={showArchiveModal}
              onClose={handleArchiveModalClose}
              student={safeStudent}
              onArchiveConfirm={handleArchiveStudent}
              onArchiveDone={handleArchiveDone}
              darkMode={darkMode}
              currentView={currentView}
            />

            {/* Restore Modal */}
            <RestoreStudentModal
              isOpen={showRestoreModal}
              onClose={handleRestoreModalClose}
              student={safeStudent}
              onRestoreConfirm={handleRestoreStudent}
              onRestoreDone={handleRestoreDone}
              darkMode={darkMode}
            />

            {/* Student Information Modal */}
            <StudentInformationModal
              isOpen={showInfoModal}
              onClose={() => setShowInfoModal(false)}
              student={safeStudent}
              onStudentInfoUpdated={handleStudentInfoUpdated}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* BulkArchiveModal with status handling */}
        <BulkArchiveModal
          isOpen={showBulkArchiveModal}
          onClose={handleBulkArchiveModalClose}
          onConfirm={handleBulkArchiveStudentAccounts}
          isLoading={isArchivingBulkAccounts}
          studentCount={selectedStudents.length}
          darkMode={darkMode}
          operationStatus={bulkArchiveStatus}
          operationMessage={bulkArchiveMessage}
        />

        {/* Global Success Modal - Always rendered */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          title={modalMessage.title}
          message={modalMessage.message}
          darkMode={darkMode}
          type="success"
        />

        {/* Global Error Modal - Always rendered */}
        <ErrorModal
          isOpen={showErrorModal}
          onClose={handleErrorModalClose}
          title={modalMessage.title}
          message={modalMessage.message}
          darkMode={darkMode}
          type="error"
        />
      </>
    );
  }

  // Show individual student profile
  return (
    <>
      <div
        className={`rounded-xl shadow-md p-6 text-center ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-md overflow-hidden relative">
          {safeStudent.profilePictureURL || safeStudent.profilePicture ? (
            <img
              src={safeStudent.profilePictureURL || safeStudent.profilePicture}
              alt={safeStudent.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center ${
              darkMode ? "bg-yellow-600" : "bg-yellow-400"
            } ${
              safeStudent.profilePictureURL || safeStudent.profilePicture
                ? "hidden"
                : ""
            }`}
          >
            {studentInitials}
          </div>
        </div>

        <p
          className={`text-sm font-kumbh ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {safeStudent.studentNumber || safeStudent.id}
        </p>
        <h3
          className={`text-lg font-semibold mt-1 font-kumbh ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {safeStudent.name}
        </h3>
        <p
          className={`text-sm mb-4 font-kumbh ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Section{" "}
          {safeStudent.section || safeStudent.sectionName || "Not Assigned"}
        </p>

        <div className="flex justify-around mb-4 text-left font-kumbh">
          <div>
            <h4
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Grade
            </h4>
            <p
              className={`text-base ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {safeStudent.grade || "Not Assigned"}
            </p>
          </div>
          <div>
            <h4
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Sex
            </h4>
            <p
              className={`text-base ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {safeStudent.sex}
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col gap-2 mb-4">
          {safeStudent.isRecordArchived && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium font-kumbh ${
                darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
              }`}
            >
              Record Archived{" "}
              {safeStudent.status ? `(${safeStudent.status})` : ""}
            </span>
          )}
          {safeStudent.isAccountArchived && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode
                  ? "bg-orange-900 text-orange-200"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              Account Archived{" "}
              {safeStudent.accountStatus
                ? `(${safeStudent.accountStatus})`
                : ""}
            </span>
          )}
          {!safeStudent.isRecordArchived && !safeStudent.isAccountArchived && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode
                  ? "bg-green-900 text-green-200"
                  : "bg-green-100 text-green-800"
              }`}
            >
              Active
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-8">
          <button
            onClick={() => setShowInfoModal(true)}
            className={`py-2 rounded-md transition font-medium font-kumbh ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            More Information
          </button>

          {/* Show Archive or Restore button based on student status and current view */}
          {showArchiveButton && (
            <button
              onClick={() => setShowArchiveModal(true)}
              className="bg-red-700 text-white py-2 font-medium rounded-md hover:bg-red-800 transition font-kumbh"
            >
              Archive Student
            </button>
          )}

          {showRestoreButton && (
            <button
              onClick={() => setShowRestoreModal(true)}
              className="bg-yellow-400 text-gray-800 py-2 font-medium rounded-md hover:bg-yellow-500 transition font-kumbh"
            >
              Restore Student
            </button>
          )}

          {/* Only show Create Student Account button if student account is NOT archived and doesn't have active account */}
          {!safeStudent.isAccountArchived &&
            !safeStudent.hasAccount &&
            currentView !== "Archived Students Account" && (
              <button
                onClick={handleCreateStudentAccount}
                disabled={isCreatingAccount}
                className={`py-2 rounded-md transition font-kumbh flex items-center justify-center gap-2 ${"bg-green-700 text-white hover:bg-green-800"} ${
                  isCreatingAccount ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isCreatingAccount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Student Account"
                )}
              </button>
            )}
        </div>
      </div>

      {/* Archive Modal */}
      <ArchiveStudentModal
        isOpen={showArchiveModal}
        onClose={handleArchiveModalClose}
        student={safeStudent}
        onArchiveConfirm={handleArchiveStudent}
        onArchiveDone={handleArchiveDone}
        darkMode={darkMode}
        currentView={currentView}
      />

      {/* Restore Modal */}
      <RestoreStudentModal
        isOpen={showRestoreModal}
        onClose={handleRestoreModalClose}
        student={safeStudent}
        onRestoreConfirm={handleRestoreStudent}
        onRestoreDone={handleRestoreDone}
        darkMode={darkMode}
      />

      {/* Student Information Modal */}
      <StudentInformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        student={safeStudent}
        onStudentInfoUpdated={handleStudentInfoUpdated}
        darkMode={darkMode}
      />

      {/* BulkArchiveModal with status handling */}
      <BulkArchiveModal
        isOpen={showBulkArchiveModal}
        onClose={handleBulkArchiveModalClose}
        onConfirm={handleBulkArchiveStudentAccounts}
        isLoading={isArchivingBulkAccounts}
        studentCount={selectedStudents.length}
        darkMode={darkMode}
        operationStatus={bulkArchiveStatus}
        operationMessage={bulkArchiveMessage}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={modalMessage.title}
        message={modalMessage.message}
        darkMode={darkMode}
        type="success"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title={modalMessage.title}
        message={modalMessage.message}
        darkMode={darkMode}
        type="error"
      />
    </>
  );
}
