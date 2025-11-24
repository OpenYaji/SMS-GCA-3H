import React from "react";
import BaseModal from "../BaseModal";
import { CheckCircle } from "lucide-react";

export default function SuccessModal({
  isOpen = false,
  onClose = () => {},
  title = "Success!",
  message = "Operation completed successfully.",
  darkMode = false,
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Success"
      width="max-w-md"
      darkMode={darkMode}
    >
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <CheckCircle
            className={`w-16 h-16 ${
              darkMode ? "text-green-400" : "text-green-500"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 font-kumbh ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mb-6 font-kumbh ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors font-kumbh"
        >
          Done
        </button>
      </div>
    </BaseModal>
  );
}
