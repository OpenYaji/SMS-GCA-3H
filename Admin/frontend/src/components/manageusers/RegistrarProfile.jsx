import { useState } from "react";
import ArchiveUserModal from "../common/ArchiveUserModal";
import RestoreUserModal from "../common/RestoreUserModal";
import RegistrarInformationModal from "./modals/registrars/RegistrarInformationModal";
import ErrorModal from "./modals/teachers/ErrorModal";
import registrarService from "../../services/registrarService";

export default function RegistrarProfile({
  registrar,
  onRegistrarArchived,
  onRegistrarRestored,
  onRegistrarInfoUpdated,
  darkMode,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });

  // Format name with middle initial
  const formatName = (registrar) => {
    if (!registrar) return "";

    // If we have separate name fields from detailed data, use them
    if (registrar.firstName || registrar.lastName) {
      const firstName = registrar.firstName || "";
      const middleName = registrar.middleName || "";
      const lastName = registrar.lastName || "";
      const suffix = registrar.suffix || "";

      let formattedName = firstName;
      if (middleName) {
        formattedName += ` ${middleName.charAt(0)}.`;
      }
      formattedName += ` ${lastName}`;
      if (suffix) {
        formattedName += ` ${suffix}`;
      }
      return formattedName.trim();
    }

    // Fallback to the existing name field
    return registrar.name || "";
  };

  // Get profile picture URL with fallback to initials
  const getProfilePicture = (registrar) => {
    if (!registrar) return null;

    return (
      registrar.profilePicture ||
      registrar.rawData?.Profile?.ProfilePicture ||
      registrar.rawData?.Profile?.ProfilePictureURL ||
      null
    );
  };

  // Get avatar initials
  const getAvatarInitials = (registrar) => {
    if (!registrar) return "AM";

    const name = formatName(registrar);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ARCHIVE HANDLER - Updated to accept accountStatus
  const handleArchiveConfirm = async (registrar, accountStatus) => {
    try {
      console.log(
        `Archiving registrar ${registrar.id} with status: ${accountStatus}`
      );

      // Call service with accountStatus
      await registrarService.archiveRegistrar(registrar.id, accountStatus);

      return { success: true };
    } catch (error) {
      console.error("Error archiving registrar:", error);
      return {
        success: false,
        message:
          error.message || "Failed to archive registrar. Please try again.",
      };
    }
  };

  // RESTORE HANDLER
  const handleRestoreConfirm = async (registrar) => {
    try {
      console.log(`Restoring registrar ${registrar.id}`);

      await registrarService.restoreRegistrar(registrar.id);

      return { success: true };
    } catch (error) {
      console.error("Error restoring registrar:", error);
      return {
        success: false,
        message:
          error.message || "Failed to restore registrar. Please try again.",
      };
    }
  };

  // Archive done handler
  const handleArchiveDone = () => {
    console.log("Archive completed, notifying parent component");
    if (onRegistrarArchived) {
      onRegistrarArchived(registrar.id);
    }
  };

  // Restore done handler
  const handleRestoreDone = () => {
    console.log("Restore completed, notifying parent component");
    if (onRegistrarRestored) {
      onRegistrarRestored(registrar.id);
    }
  };

  // REGISTRAR UPDATE HANDLER
  const handleRegistrarUpdate = async (updatedRegistrar) => {
    console.log(
      "Registrar updated in RegistrarProfile, refreshing data...",
      updatedRegistrar
    );

    // Call the parent handler to refresh table data and update profile
    if (onRegistrarInfoUpdated) {
      onRegistrarInfoUpdated(updatedRegistrar);
    }
  };

  // Close handlers
  const handleArchiveModalClose = () => setShowArchiveModal(false);
  const handleRestoreModalClose = () => setShowRestoreModal(false);
  const handleErrorModalClose = () => setShowErrorModal(false);

  if (!registrar) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-center text-gray-500 dark:text-gray-400 font-kumbh text-sm">
        Select an registrar to view details
      </div>
    );
  }

  const profilePicture = getProfilePicture(registrar);
  const avatarInitials = getAvatarInitials(registrar);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 font-kumbh">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md overflow-hidden">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={formatName(registrar)}
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
                profilePicture ? "hidden" : ""
              } ${darkMode ? "bg-yellow-600" : "bg-yellow-500"}`}
            >
              {avatarInitials}
            </div>
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
            {formatName(registrar)}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {registrar.registrarId || registrar.id}
          </p>
          {registrar.archived && (
            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-3 py-1 rounded-full font-medium mt-2">
              Archived
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">
              Email:
            </span>{" "}
            {registrar.email}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-20 flex flex-col gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition font-kumbh font-medium"
          >
            More Information
          </button>
          {registrar.archived ? (
            <button
              onClick={() => setShowRestoreModal(true)}
              className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-kumbh font-medium"
            >
              Restore Registrar
            </button>
          ) : (
            <button
              onClick={() => setShowArchiveModal(true)}
              className="bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-kumbh font-medium"
            >
              Archive Registrar
            </button>
          )}
        </div>
      </div>

      {/* Archive Modal */}
      <ArchiveUserModal
        isOpen={showArchiveModal}
        onClose={handleArchiveModalClose}
        user={registrar}
        userType="Registrar"
        onArchiveConfirm={handleArchiveConfirm}
        onArchiveDone={handleArchiveDone}
        darkMode={darkMode}
      />

      {/* Restore Modal */}
      <RestoreUserModal
        isOpen={showRestoreModal}
        onClose={handleRestoreModalClose}
        user={registrar}
        userType="Registrar"
        onRestoreConfirm={handleRestoreConfirm}
        onRestoreDone={handleRestoreDone}
        darkMode={darkMode}
      />

      {/* Info Modal */}
      <RegistrarInformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        registrar={registrar}
        onRegistrarUpdate={handleRegistrarUpdate}
        darkMode={darkMode}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title={modalMessage.title}
        message={modalMessage.message}
        type="error"
      />
    </>
  );
}
