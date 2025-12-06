import React from "react";
import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Loader } from "lucide-react";

const ScheduleActionModal = ({
  isOpen,
  onClose,
  actionType,
  schedule,
  onActionConfirm,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (actionType) {
      case "approve":
        return {
          title: "Approve Schedule Proposal",
          icon: CheckCircle,
          iconColor: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          confirmText: "Yes, Approve All Schedules",
          confirmButtonColor: "bg-green-600 hover:bg-green-700",
          message: `Are you sure you want to approve all ${
            schedule?.totalPendingSchedules || 0
          } pending schedules proposed by ${
            schedule?.name || "the head teacher"
          }?`,
          warning:
            "This action cannot be undone. Approved schedules will become active immediately.",
        };
      case "decline-confirm":
        return {
          title: "Decline Schedule Proposal",
          icon: XCircle,
          iconColor: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          confirmText: "Yes, Decline All Schedules",
          confirmButtonColor: "bg-red-600 hover:bg-red-700",
          message: `Are you sure you want to decline all ${
            schedule?.totalPendingSchedules || 0
          } pending schedules proposed by ${
            schedule?.name || "the head teacher"
          }?`,
          warning:
            "This action cannot be undone. Declined schedules will be removed from the system.",
        };
      default:
        return {
          title: "Confirm Action",
          icon: AlertTriangle,
          iconColor: "text-yellow-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          confirmText: "Confirm",
          confirmButtonColor: "bg-blue-600 hover:bg-blue-700",
          message: "Please confirm this action.",
          warning: "",
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      await onActionConfirm();
      onClose();
    } catch (err) {
      console.error("Action failed:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-[-30px] bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className={`relative ${config.bgColor} border ${config.borderColor} rounded-xl shadow-lg w-full max-w-md`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {config.title}
            </h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{config.message}</p>

            {schedule && (
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={schedule.avatar}
                    alt={schedule.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {schedule.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {schedule.position}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Schedules:
                    </span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {schedule.totalPendingSchedules}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Teachers:
                    </span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {schedule.totalTeachers}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {config.warning && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {config.warning}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2 ${config.confirmButtonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                config.confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleActionModal;
