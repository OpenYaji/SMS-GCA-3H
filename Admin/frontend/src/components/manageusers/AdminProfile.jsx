import { useState } from "react";
import ArchiveUserModal from "../common/ArchiveUserModal";
import RestoreUserModal from "../common/RestoreUserModal";
import AdminInformationModal from "./modals/admins/AdminInformationModal";
import ErrorModal from "./modals/teachers/ErrorModal";
import adminService from "../../services/adminService";

export default function AdminProfile({
  admin,
  onAdminArchived,
  onAdminRestored,
  onAdminInfoUpdated,
  darkMode,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });

  // Format name with middle initial
  const formatName = (admin) => {
    if (!admin) return "";

    // If we have separate name fields from detailed data, use them
    if (admin.firstName || admin.lastName) {
      const firstName = admin.firstName || "";
      const middleName = admin.middleName || "";
      const lastName = admin.lastName || "";
      const suffix = admin.suffix || "";

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
    return admin.name || "";
  };

  // Get profile picture URL with fallback to initials
  const getProfilePicture = (admin) => {
    if (!admin) return null;

    return (
      admin.profilePicture ||
      admin.rawData?.Profile?.ProfilePicture ||
      admin.rawData?.Profile?.ProfilePictureURL ||
      null
    );
  };

  // Get avatar initials
  const getAvatarInitials = (admin) => {
    if (!admin) return "AM";

    const name = formatName(admin);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ARCHIVE HANDLER
  const handleArchiveConfirm = async (admin, accountStatus) => {
    try {
      console.log(`Archiving admin ${admin.id} with status: ${accountStatus}`);

      await adminService.archiveAdmin(admin.id, accountStatus);

      return { success: true };
    } catch (error) {
      console.error("Error archiving admin:", error);
      return {
        success: false,
        message: error.message || "Failed to archive admin. Please try again.",
      };
    }
  };

  // RESTORE HANDLER
  const handleRestoreConfirm = async (admin) => {
    try {
      console.log(`Restoring admin ${admin.id}`);

      await adminService.restoreAdmin(admin.id);

      return { success: true };
    } catch (error) {
      console.error("Error restoring admin:", error);
      return {
        success: false,
        message: error.message || "Failed to restore admin. Please try again.",
      };
    }
  };

  // Archive done handler
  const handleArchiveDone = () => {
    console.log("Archive done, triggering refresh for admin:", admin.id);
    if (onAdminArchived) {
      onAdminArchived(admin.id);
    }
  };

  // Restore done handler
  const handleRestoreDone = () => {
    console.log("Restore done, triggering refresh for admin:", admin.id);
    if (onAdminRestored) {
      onAdminRestored(admin.id);
    }
  };

  // ADMIN UPDATE HANDLER
  const handleAdminUpdate = async (updatedAdmin) => {
    console.log(
      "Admin updated in AdminProfile, refreshing data...",
      updatedAdmin
    );

    // Call the parent handler to refresh table data and update profile
    if (onAdminInfoUpdated) {
      onAdminInfoUpdated(updatedAdmin);
    }
  };

  // Close handlers
  const handleArchiveModalClose = () => setShowArchiveModal(false);
  const handleRestoreModalClose = () => setShowRestoreModal(false);
  const handleErrorModalClose = () => setShowErrorModal(false);

  if (!admin) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-center text-gray-500 dark:text-gray-400 font-kumbh text-sm">
        Select an admin to view details
      </div>
    );
  }

  const profilePicture = getProfilePicture(admin);
  const avatarInitials = getAvatarInitials(admin);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 font-kumbh">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md overflow-hidden">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={formatName(admin)}
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
            {formatName(admin)}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {admin.adminId || admin.id}
          </p>
          {admin.archived && (
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
            {admin.email}
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
          {admin.archived ? (
            <button
              onClick={() => setShowRestoreModal(true)}
              className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-kumbh font-medium"
            >
              Restore Admin
            </button>
          ) : (
            <button
              onClick={() => setShowArchiveModal(true)}
              className="bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-kumbh font-medium"
            >
              Archive Admin
            </button>
          )}
        </div>
      </div>

      {/* Archive Modal - Using Reusable Component */}
      <ArchiveUserModal
        isOpen={showArchiveModal}
        onClose={handleArchiveModalClose}
        user={admin}
        userType="Admin"
        onArchiveConfirm={handleArchiveConfirm}
        onArchiveDone={handleArchiveDone}
        darkMode={darkMode}
      />

      {/* Restore Modal - Using Reusable Component */}
      <RestoreUserModal
        isOpen={showRestoreModal}
        onClose={handleRestoreModalClose}
        user={admin}
        userType="Admin"
        onRestoreConfirm={handleRestoreConfirm}
        onRestoreDone={handleRestoreDone}
        darkMode={darkMode}
      />

      {/* Info Modal */}
      <AdminInformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        admin={admin}
        onAdminUpdate={handleAdminUpdate}
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
