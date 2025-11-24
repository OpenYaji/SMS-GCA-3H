import React, { useState } from "react";
import BaseModal from "./shared/BaseModal";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  Calendar,
  Users,
} from "lucide-react";

const ScheduleActionModal = ({
  isOpen,
  onClose,
  actionType,
  schedule,
  onActionConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    setConflicts([]);
    try {
      await onActionConfirm();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error performing action:", err);

      // Extract error message and conflicts
      const errorMessage =
        err.originalMessage ||
        err.response?.data?.Message ||
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again.";

      setError(errorMessage);

      // Set conflicts if available - handle both formats
      let conflictData = [];

      if (err.conflicts && Array.isArray(err.conflicts)) {
        conflictData = err.conflicts;
      } else if (err.response?.data?.Conflicts) {
        conflictData = err.response.data.Conflicts;
      } else if (err.response?.data?.conflicts) {
        conflictData = err.response.data.conflicts;
      }

      // Ensure teachers array is properly handled
      const conflictsWithTeachers = conflictData.map((conflict) => ({
        ...conflict,
        Teachers: Array.isArray(conflict.Teachers)
          ? conflict.Teachers
          : conflict.teachers
          ? Array.isArray(conflict.teachers)
            ? conflict.teachers
            : [conflict.teachers]
          : [],
      }));

      setConflicts(conflictsWithTeachers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    onClose();
    setShowSuccess(false);
    setError(null);
    setConflicts([]);
  };

  const handleModalClose = () => {
    onClose();
    setError(null);
    setConflicts([]);
  };

  // Format time from "08:00:00" to "8:00 AM"
  const formatTime = (timeString) => {
    if (!timeString) return "";

    // Handle both "08:00:00" and "@8:00:00" formats
    const cleanTime = timeString.replace("@", "");
    const [hours, minutes] = cleanTime.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Format day of week
  const formatDay = (day) => {
    if (!day) return "";
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  const LightBulbIcon = ({ className = "w-4 h-4" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 512 512"
      className={className}
    >
      <path
        fill="#FFE46A"
        d="M411.111 183.926c0-87.791-68.91-158.959-153.914-158.959S103.283 96.136 103.283 183.926c0 39.7 14.093 75.999 37.392 103.856h-.001l33.666 61.027c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.857 37.393-64.156 37.393-103.856"
      />
      <path
        fill="#FFF0B7"
        d="M112.805 203.285c0-90.721 68.378-165.701 157.146-177.719a151 151 0 0 0-13.319-.599c-85.004 0-153.914 71.169-153.914 158.959c0 28.89 7.469 55.974 20.512 79.319c-6.75-18.749-10.425-38.932-10.425-59.96"
      />
      <path
        fill="#FFDA00"
        d="M411.111 184.266c0-31.445-8.843-60.755-24.097-85.428a160.4 160.4 0 0 1 4.917 39.416c0 104.454-101.138 189.522-227.481 192.967l9.89 17.929c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.858 37.393-64.157 37.393-103.857"
      />
      <path
        fill="#FAAF63"
        d="M321.905 211.203c.149-.131.297-.251.447-.395c2.787-2.667 5.082-6.921 3.161-10.867c-7.879-16.176-31.97-21.308-49.524-15.951q-1.333.406-2.588.885c-9.562-5.583-21.434-6.925-32.001-3.569a35 35 0 0 0-3.678 1.394c-5.785-3.38-12.552-5.066-19.294-4.414c-14.112 1.365-26.375 12.81-28.805 26.752l-1.112.688c9.617 15.541 34.93 60.071 36.552 79.233c2.045 24.174.002 89.793-.019 90.453l11.994.379c.086-2.723 2.086-66.978-.019-91.844c-.938-11.087-7.722-28.758-20.164-52.521c-5.807-11.092-11.445-20.83-14.858-26.576c2.36-7.646 9.61-13.848 17.586-14.619c2.429-.235 4.893.037 7.251.729a22.7 22.7 0 0 0-2.32 3.638c-4.047 7.935-2.356 17.898 3.933 23.176c3.725 3.125 9.137 4.276 14.127 3c4.647-1.188 8.239-4.242 9.854-8.379c1.451-3.718 1.328-8.01-.367-12.756a30.7 30.7 0 0 0-4.05-7.655a28.1 28.1 0 0 1 13.61.744c-1.715 1.975-3.027 4.173-3.89 6.556c-1.844 5.101-1.029 11.163 2.128 15.822c2.721 4.016 6.856 6.403 11.348 6.551q.226.008.45.008c3.935 0 7.67-1.692 10.562-4.797c3.397-3.647 5.126-8.71 4.624-13.544c-.319-3.073-1.412-6.079-3.172-8.867c12.236-2.223 24.205 1.911 29.383 8.186c-3.125 5.2-9.542 16.11-16.178 28.785c-12.441 23.764-19.227 41.435-20.164 52.521c-2.104 24.866-.104 89.121-.019 91.844l11.994-.379c-.021-.66-2.064-66.275-.019-90.453c1.459-17.251 22.113-55.046 33.237-73.758m-80.657-3.171c-.279.716-1.331 1.035-1.647 1.116c-1.25.319-2.665.086-3.442-.565c-2.015-1.691-2.453-5.599-.957-8.532a11.2 11.2 0 0 1 1.85-2.583c1.611 1.828 2.892 3.926 3.707 6.208c.665 1.86.843 3.449.489 4.356m32.19.654c-.351.375-1.065.992-1.839.976c-.831-.027-1.489-.819-1.808-1.289c-.993-1.467-1.312-3.527-.776-5.009c.618-1.71 1.811-3.109 3.203-4.235c1.55 1.751 2.501 3.634 2.688 5.434c.144 1.371-.447 3.027-1.468 4.123"
      />
      <path
        fill="#6B83A5"
        d="M315.932 402.701H197.897c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h38.122c-11.367 4.229-23.369 14.285-23.369 25.946v4.68c9.123 10.254 17.619 28.081 33.802 28.081h21.89c12.748 0 21.804-13.762 32.836-28.081v-4.68c0-11.661-11.451-21.717-22.548-25.946h37.302c6.6 0 12-5.4 12-12v-6.957c0-6.6-5.4-12-12-12"
      />
      <path
        fill="#ABBDDB"
        d="M324.406 402.701H189.423c-6.6 0-12-5.4-12-12v-6.957c0-6.6 5.4-12 12-12h134.983c6.6 0 12 5.4 12 12v6.957c0 6.6-5.4 12-12 12m-7.007 49.915v-6.957c0-6.6-5.4-12-12-12H208.43c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h96.969c6.6 0 12-5.4 12-12"
      />
    </svg>
  );

  // Teacher Icon SVG Component
  const TeacherIcon = ({ className = "w-4 h-4" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 48 48"
      className={className}
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M24 20a7 7 0 1 0 0-14a7 7 0 0 0 0 14M6 40.8V42h36v-1.2c0-4.48 0-6.72-.872-8.432a8 8 0 0 0-3.496-3.496C35.92 28 33.68 28 29.2 28H18.8c-4.48 0-6.72 0-8.432.872a8 8 0 0 0-3.496 3.496C6 34.08 6 36.32 6 40.8"
      />
    </svg>
  );

  // Conflict Details Component
  const ConflictDetails = ({ conflicts }) => {
    if (!conflicts || conflicts.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300 text-sm mr-[11rem]">
                Schedule Conflicts Detected
              </p>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1 mr-10">
                The following schedule conflicts prevent approval:
              </p>
            </div>
          </div>

          {/* Scrollable conflicts container */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {conflicts.map((conflict, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {/* Day and Time */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Day:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDay(conflict.DayOfWeek)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Time:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatTime(conflict.StartTime)} -{" "}
                      {formatTime(conflict.EndTime)}
                    </span>
                  </div>

                  {/* Grade Level and Section - Full width */}
                  {conflict.LevelName && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Users className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Grade Level:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {conflict.LevelName}
                      </span>
                    </div>
                  )}

                  {conflict.SectionName && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Section:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {conflict.SectionName}
                      </span>
                    </div>
                  )}

                  {/* Teachers Involved - Full width with better display */}
                  {conflict.Teachers && conflict.Teachers.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0">
                          Teachers Involved:
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1">
                            {conflict.Teachers.map((teacher, teacherIndex) => (
                              <span
                                key={teacherIndex}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 gap-1"
                              >
                                <TeacherIcon className="w-3 h-3" />
                                {teacher}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 mr-36">
                            Multiple teachers scheduled for the same time slot
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subject and Conflict Type if available */}
                  {conflict.Subject && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Subject:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {conflict.Subject}
                      </span>
                    </div>
                  )}

                  {conflict.ConflictType && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Conflict Type:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {conflict.ConflictType}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-300 text-sm flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Resolution Required:</strong> Please resolve these
                schedule conflicts before approving. Teachers cannot be
                scheduled for multiple classes at the same time.
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getSuccessMessage = () => {
    switch (actionType) {
      case "approve":
        return `Proposed Schedules Accepted Successfully`;
      case "decline-confirm":
        return `Proposed Schedules Declined Successfully`;
      default:
        return "Action completed successfully!";
    }
  };

  const getSuccessDetails = () => {
    switch (actionType) {
      case "approve":
        return `All schedules proposed by ${schedule?.proposedBy} have been approved and are now active.`;
      case "decline-confirm":
        return `All schedules proposed by ${schedule?.proposedBy} have been declined.`;
      default:
        return "The action has been completed successfully.";
    }
  };

  const getSuccessIcon = () => {
    switch (actionType) {
      case "approve":
        return (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        );
      case "decline-confirm":
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      default:
        return (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        );
    }
  };

  // Success State
  if (showSuccess) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleSuccessClose}
        width="max-w-md"
        title={
          actionType === "approve" ? "Schedules Approved" : "Schedules Declined"
        }
      >
        <div className="text-center py-4">
          {getSuccessIcon()}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {getSuccessMessage()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getSuccessDetails()}
          </p>
          <button
            onClick={handleSuccessClose}
            className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </BaseModal>
    );
  }

  // Approve Confirmation
  if (actionType === "approve") {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleModalClose}
        width="max-w-2xl"
        title="Accept All Schedules"
      >
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to accept{" "}
            <strong className="text-gray-900 dark:text-white">
              all schedules
            </strong>{" "}
            in the proposal from{" "}
            <strong className="text-gray-900 dark:text-white">
              {schedule?.proposedBy}
            </strong>
            ?
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              This will approve schedules for all teachers in this proposal.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                      Unable to Approve
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conflict Details */}
              <ConflictDetails conflicts={conflicts} />
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Checking Conflicts...
                </>
              ) : (
                "Yes, Accept All"
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    );
  }

  // Decline Confirmation
  if (actionType === "decline-confirm") {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleModalClose}
        width="max-w-md"
        title="Decline All Schedules"
      >
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to decline{" "}
            <strong className="text-gray-900 dark:text-white">
              all schedules
            </strong>{" "}
            in the proposal from{" "}
            <strong className="text-gray-900 dark:text-white">
              {schedule?.proposedBy}
            </strong>
            ?
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-800 dark:text-red-300">
              This will decline schedules for all teachers in this proposal.
              This action cannot be undone.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Yes, Decline All"}
            </button>
          </div>
        </div>
      </BaseModal>
    );
  }

  return null;
};

export default ScheduleActionModal;
