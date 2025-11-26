import React from "react";
import BaseModal from "../BaseModal";
import { XCircle, AlertTriangle, Info } from "lucide-react";

export default function ErrorModal({
  isOpen = false,
  onClose = () => {},
  title = "Error",
  message = "Something went wrong. Please try again.",
  type = "error", // "error" | "warning" | "info"
  details = "", // Additional error details
  showRetry = false,
  onRetry = () => {},
  darkMode = false,
}) {
  // Icon and color configuration based on type
  const config = {
    error: {
      icon: XCircle,
      iconColor: darkMode ? "text-red-400" : "text-red-500",
      bgColor: darkMode ? "bg-red-900" : "bg-red-50",
      borderColor: darkMode ? "border-red-800" : "border-red-200",
      textColor: darkMode ? "text-red-300" : "text-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: darkMode ? "text-yellow-400" : "text-yellow-500",
      bgColor: darkMode ? "bg-yellow-900" : "bg-yellow-50",
      borderColor: darkMode ? "border-yellow-800" : "border-yellow-200",
      textColor: darkMode ? "text-yellow-300" : "text-yellow-800",
      buttonColor: "bg-yellow-400 hover:bg-yellow-500",
    },
    info: {
      icon: Info,
      iconColor: darkMode ? "text-blue-400" : "text-blue-500",
      bgColor: darkMode ? "bg-blue-900" : "bg-blue-50",
      borderColor: darkMode ? "border-blue-800" : "border-blue-200",
      textColor: darkMode ? "text-blue-300" : "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const {
    icon: Icon,
    iconColor,
    bgColor,
    borderColor,
    textColor,
    buttonColor,
  } = config[type];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center py-6">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}
          >
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>
        </div>

        {/* Error Message */}
        <h3 className={`text-xl font-semibold mb-2 font-kumbh ${textColor}`}>
          {title}
        </h3>
        <p
          className={`mb-4 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {/* Additional Details */}
        {details && (
          <div
            className={`mb-4 p-3 ${bgColor} border ${borderColor} rounded-lg`}
          >
            <p className={`text-sm font-kumbh ${textColor}`}>{details}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {showRetry && (
            <button
              onClick={onRetry}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors font-kumbh ${buttonColor}`}
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors font-kumbh ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            {showRetry ? "Cancel" : "Close"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
