import React from "react";
import BaseModal from "./BaseModal";
import { XCircle, AlertTriangle, Info } from "lucide-react";

const ErrorModal = ({
  isOpen,
  onClose,
  error,
  title = "Error",
  type = "error", // "error", "warning", "info"
}) => {
  if (!isOpen || !error) return null;

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case "info":
        return <Info className="w-12 h-12 text-blue-500" />;
      default:
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-100";
      case "info":
        return "bg-blue-100";
      default:
        return "bg-red-100";
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} width="max-w-md">
      <div className="text-center py-6">
        <div
          className={`w-20 h-20 ${getBackgroundColor()} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {getIcon()}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-kumbh">
          {title}
        </h3>

        <p className="text-gray-600 mb-6 font-kumbh text-sm">
          {error.message || "An unexpected error occurred"}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors font-kumbh ${
              type === "warning"
                ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                : type === "info"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Okay
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ErrorModal;
