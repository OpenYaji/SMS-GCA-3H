import { useState, useEffect } from "react";
import ArchiveUserModal from "../common/ArchiveUserModal";
import RestoreUserModal from "../common/RestoreUserModal";
import GuardInformationModal from "./modals/guards/GuardInformationModal";
import ErrorModal from "./modals/teachers/ErrorModal";
import guardService from "../../services/guardService";

const formatNameWithMiddleInitial = (guard) => {
  if (!guard) return "";

  // If we have separate name fields, use them
  if (guard.firstName || guard.lastName) {
    const firstName = guard.firstName || "";
    const middleName = guard.middleName || "";
    const lastName = guard.lastName || "";

    if (middleName) {
      const middleInitial = middleName.charAt(0).toUpperCase() + ".";
      return `${firstName} ${middleInitial} ${lastName}`.trim();
    }
    return `${firstName} ${lastName}`.trim();
  }

  // Fallback to original name parsing
  const nameParts = guard.name
    ? guard.name.split(" ").filter((part) => part.trim())
    : [];
  if (nameParts.length >= 3) {
    // Assume format: First Middle Last
    const firstName = nameParts[0];
    const middleInitial = nameParts[1].charAt(0).toUpperCase() + ".";
    const lastName = nameParts.slice(2).join(" ");
    return `${firstName} ${middleInitial} ${lastName}`;
  }

  return guard.name || "";
};

// Helper function to get initials for avatar
const getInitials = (guard) => {
  if (!guard) return "GM";

  if (guard.firstName && guard.lastName) {
    return `${guard.firstName.charAt(0)}${guard.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  // Fallback to original logic
  return (
    guard.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GM"
  );
};

// Get profile picture URL with proper fallback
const getProfilePicture = (guard) => {
  if (!guard) return null;

  return (
    guard.profilePicture ||
    guard.rawData?.Profile?.ProfilePictureURL ||
    guard.Profile?.ProfilePictureURL ||
    null
  );
};

export default function GuardProfile({
  guard,
  onGuardArchived,
  onGuardRestored,
  onGuardInfoUpdated,
  darkMode,
}) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [currentGuard, setCurrentGuard] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Reset image error when guard changes
  useEffect(() => {
    setImageError(false);
  }, [guard]);

  // Update local guard state when prop changes
  useEffect(() => {
    if (guard) {
      setCurrentGuard(guard);
      setImageError(false); // Reset image error when guard changes
    }
  }, [guard]);

  // ARCHIVE HANDLER
  const handleArchiveConfirm = async (guard, accountStatus) => {
    try {
      await guardService.archiveGuard(guard.id, accountStatus);
      return { success: true };
    } catch (error) {
      console.error("Error archiving guard:", error);
      return {
        success: false,
        message: error.message || "Failed to archive guard. Please try again.",
      };
    }
  };

  // RESTORE HANDLER
  const handleRestoreConfirm = async (guard) => {
    try {
      await guardService.restoreGuard(guard.id);
      return { success: true };
    } catch (error) {
      console.error("Error restoring guard:", error);
      return {
        success: false,
        message: error.message || "Failed to restore guard. Please try again.",
      };
    }
  };

  // Archive done handler
  const handleArchiveDone = () => {
    if (onGuardArchived) {
      onGuardArchived(guard.id);
    }
  };

  // Restore done handler
  const handleRestoreDone = () => {
    if (onGuardRestored) {
      onGuardRestored(guard.id);
    }
  };

  const handleGuardInfoUpdated = async (updatedGuard) => {
    try {
      // Fetch fresh guard data to get updated profile picture
      const response = await guardService.getGuardById(
        updatedGuard.id || guard.id
      );
      const freshGuardData = response.guard || response.data || response;

      console.log("Fresh guard data after update:", freshGuardData);

      // Extract profile picture from various possible locations
      const updatedProfilePicture =
        freshGuardData.profilePicture ||
        freshGuardData.Profile?.ProfilePictureURL ||
        freshGuardData.rawData?.Profile?.ProfilePictureURL ||
        updatedGuard.profilePicture;

      const enhancedGuardData = {
        ...freshGuardData,
        profilePicture: updatedProfilePicture,
        // Ensure we have the basic fields
        id: freshGuardData.id || updatedGuard.id,
        name: formatNameWithMiddleInitial(freshGuardData) || updatedGuard.name,
        email: freshGuardData.email || updatedGuard.email,
        guardId: freshGuardData.guardId || updatedGuard.guardId,
        archived: freshGuardData.archived || updatedGuard.archived,
      };

      setCurrentGuard(enhancedGuardData);
      setImageError(false); // Reset image error after update

      if (onGuardInfoUpdated) {
        onGuardInfoUpdated(enhancedGuardData);
      }
    } catch (error) {
      console.error("Error fetching updated guard data:", error);
      // Fallback to the updated guard data we received
      setCurrentGuard(updatedGuard);
      setImageError(false); // Reset image error after update
      if (onGuardInfoUpdated) {
        onGuardInfoUpdated(updatedGuard);
      }
    }
  };

  // Close handlers
  const handleArchiveModalClose = () => setShowArchiveModal(false);
  const handleRestoreModalClose = () => setShowRestoreModal(false);
  const handleErrorModalClose = () => setShowErrorModal(false);

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Use currentGuard instead of guard prop for display
  const displayGuard = currentGuard || guard;

  if (!displayGuard) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-center text-gray-500 dark:text-gray-400 font-kumbh text-sm">
        Select a guard to view details
      </div>
    );
  }

  const profilePicture = getProfilePicture(displayGuard);
  const avatarInitials = getInitials(displayGuard);
  const formattedName = formatNameWithMiddleInitial(displayGuard);

  // Determine whether to show image or initials
  const shouldShowImage = profilePicture && !imageError;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 font-kumbh">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-24 h-24 rounded-full mb-3 shadow-md overflow-hidden flex-shrink-0 relative">
            {shouldShowImage ? (
              <img
                src={profilePicture}
                alt={formattedName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-white text-3xl font-bold ${
                  darkMode ? "bg-yellow-600" : "bg-yellow-400"
                }`}
              >
                {avatarInitials}
              </div>
            )}
          </div>

          <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
            {formattedName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {displayGuard.guardId || displayGuard.id}
          </p>
          {displayGuard.archived && (
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
            {displayGuard.email}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-20 flex flex-col gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition font-kumbh"
          >
            More Information
          </button>
          {displayGuard.archived ? (
            <button
              onClick={() => setShowRestoreModal(true)}
              className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-kumbh"
            >
              Restore Guard
            </button>
          ) : (
            <button
              onClick={() => setShowArchiveModal(true)}
              className="bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-kumbh"
            >
              Archive Guard
            </button>
          )}
        </div>
      </div>

      {/* Archive Modal */}
      <ArchiveUserModal
        isOpen={showArchiveModal}
        onClose={handleArchiveModalClose}
        user={displayGuard}
        userType="Guard"
        onArchiveConfirm={handleArchiveConfirm}
        onArchiveDone={handleArchiveDone}
        darkMode={darkMode}
      />

      {/* Restore Modal */}
      <RestoreUserModal
        isOpen={showRestoreModal}
        onClose={handleRestoreModalClose}
        user={displayGuard}
        userType="Guard"
        onRestoreConfirm={handleRestoreConfirm}
        onRestoreDone={handleRestoreDone}
        darkMode={darkMode}
      />

      {/* Info Modal */}
      <GuardInformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        guard={displayGuard}
        onGuardUpdate={handleGuardInfoUpdated}
        darkMode={darkMode}
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
