import React from "react";

const BaseModal = ({
  isOpen,
  title,
  children,
  onClose,
  width = "max-w-lg",
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`rounded-2xl shadow-lg p-6 w-full ${width} relative animate-fadeIn max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 transition p-1 rounded-full ${
            darkMode
              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-2xl font-semibold mb-4 pr-8 font-kumbh">
            {title}
          </h2>
        )}

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
