import { useState } from "react";
import ArchiveUserModal from "../common/ArchiveUserModal";
import RestoreUserModal from "../common/RestoreUserModal";
import TeacherInformationModal from "./modals/teachers/TeacherInformationModal";
import SuccessModal from "./modals/teachers/SuccessModal";
import ErrorModal from "./modals/teachers/ErrorModal";
import teacherService from "../../services/teacherService";

export default function TeacherProfile({
  teacher,
  onTeacherArchived,
  onTeacherInfoUpdated,
  darkMode,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [hasShownModal, setHasShownModal] = useState(false);

  const formatName = (teacher) => {
    if (!teacher) return "";

    if (teacher.firstName || teacher.lastName) {
      const firstName = teacher.firstName || "";
      const middleName = teacher.middleName || "";
      const lastName = teacher.lastName || "";
      const suffix = teacher.suffix || "";

      let formattedName = firstName;
      if (middleName && middleName.trim() !== "") {
        formattedName += ` ${middleName.charAt(0)}.`;
      }
      formattedName += ` ${lastName}`;
      if (suffix && suffix.trim() !== "") {
        formattedName += ` ${suffix}`;
      }
      return formattedName.trim();
    }

    if (teacher.rawData?.Profile) {
      const profile = teacher.rawData.Profile;
      const firstName = profile.FirstName || "";
      const middleName = profile.MiddleName || "";
      const lastName = profile.LastName || "";
      const suffix = profile.Suffix || "";

      let formattedName = firstName;
      if (middleName && middleName.trim() !== "") {
        formattedName += ` ${middleName.charAt(0)}.`;
      }
      formattedName += ` ${lastName}`;
      if (suffix && suffix.trim() !== "") {
        formattedName += ` ${suffix}`;
      }
      return formattedName.trim();
    }

    return teacher.name || "";
  };

  // ARCHIVE HANDLER
  const handleArchiveConfirm = async (teacher, accountStatus) => {
    try {
      console.log(
        `Archiving teacher ${teacher.id} with status: ${accountStatus}`
      );

      // Call service with accountStatus
      await teacherService.archiveTeacher(teacher.id, accountStatus);

      return { success: true };
    } catch (error) {
      console.error("Error archiving teacher:", error);
      return {
        success: false,
        message:
          error.message || "Failed to archive teacher. Please try again.",
      };
    }
  };

  // RESTORE HANDLER
  const handleRestoreConfirm = async (teacher) => {
    try {
      console.log(`Restoring teacher ${teacher.id}`);

      await teacherService.restoreTeacher(teacher.id);

      return { success: true };
    } catch (error) {
      console.error("Error restoring teacher:", error);
      return {
        success: false,
        message:
          error.message || "Failed to restore teacher. Please try again.",
      };
    }
  };

  // Archive done handler
  const handleArchiveDone = () => {
    if (onTeacherArchived) {
      onTeacherArchived(teacher.id);
    }
  };

  // Restore done handler
  const handleRestoreDone = () => {
    if (onTeacherArchived) {
      onTeacherArchived(teacher.id);
    }
  };

  // Handler for when teacher information is updated
  const handleTeacherInfoUpdated = (updatedTeacher) => {
    if (onTeacherInfoUpdated) {
      onTeacherInfoUpdated(updatedTeacher);
    }
  };

  //Close handlers
  const handleArchiveModalClose = () => setShowArchiveModal(false);
  const handleRestoreModalClose = () => setShowRestoreModal(false);
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setHasShownModal(false);
  };
  const handleErrorModalClose = () => setShowErrorModal(false);

  if (!teacher) {
    return (
      <div
        className={`rounded-xl shadow-md p-6 text-center flex items-center justify-center font-kumbh ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
        }`}
      >
        Select a teacher to view details
      </div>
    );
  }

  const formattedName = formatName(teacher);

  return (
    <>
      <div
        className={`rounded-xl shadow-md p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-24 h-24 rounded-full mb-3 shadow-md overflow-hidden flex-shrink-0">
            {teacher.profilePicture ? (
              <img
                src={teacher.profilePicture}
                alt={formattedName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center text-white text-3xl font-bold ${
                darkMode ? "bg-yellow-600" : "bg-yellow-400"
              } ${teacher.profilePicture ? "hidden" : ""}`}
            >
              {formattedName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>

          <h3
            className={`text-lg font-semibold font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {formattedName}
          </h3>
          <p
            className={`text-sm font-kumbh ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {teacher.teacherId || teacher.id}
          </p>
          <p
            className={`text-sm font-kumbh ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {teacher.subject}
          </p>

          {teacher.archived && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium mt-2 ${
                darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
              }`}
            >
              Archived
            </span>
          )}
        </div>

        {/* Contact Info - Changed from centered to left-aligned */}
        <div
          className={`space-y-3 text-sm font-kumbh text-left ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <p>
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Email:
            </span>{" "}
            {teacher.email}
          </p>
          <p>
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Subject:
            </span>{" "}
            {teacher.subject}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-20 flex flex-col gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className={`py-2 rounded-md transition font-kumbh font-medium ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            More Information
          </button>

          {teacher.archived ? (
            <button
              onClick={() => setShowRestoreModal(true)}
              className="bg-yellow-400 text-gray-800 py-2 rounded-md hover:bg-yellow-500 transition font-kumbh font-medium"
            >
              Restore Teacher
            </button>
          ) : (
            <button
              onClick={() => setShowArchiveModal(true)}
              className="bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-kumbh font-medium"
            >
              Archive Teacher
            </button>
          )}
        </div>
      </div>

      {/* Archive Modal - Using Reusable Component */}
      <ArchiveUserModal
        isOpen={showArchiveModal}
        onClose={handleArchiveModalClose}
        user={teacher}
        userType="Teacher"
        onArchiveConfirm={handleArchiveConfirm}
        onArchiveDone={handleArchiveDone}
        darkMode={darkMode}
      />

      {/* Restore Modal - Using Reusable Component */}
      <RestoreUserModal
        isOpen={showRestoreModal}
        onClose={handleRestoreModalClose}
        user={teacher}
        userType="Teacher"
        onRestoreConfirm={handleRestoreConfirm}
        onRestoreDone={handleRestoreDone}
        darkMode={darkMode}
      />

      {/* Info Modal */}
      <TeacherInformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        teacher={teacher}
        onTeacherUpdate={handleTeacherInfoUpdated}
        darkMode={darkMode}
      />

      {/*Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={modalMessage.title}
        message={modalMessage.message}
        darkMode={darkMode}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title={modalMessage.title}
        message={modalMessage.message}
        type="error"
        darkMode={darkMode}
      />
    </>
  );
}
