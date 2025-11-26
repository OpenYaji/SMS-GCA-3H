import React from "react";

const BaseModal = ({
  isOpen,
  title,
  children,
  onClose,
  width = "max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed -inset-7 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md">
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full ${width} relative animate-fadeIn max-h-[90vh] overflow-y-auto`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition text-2xl w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {title}
          </h2>
        )}

        {/* Modal Content */}
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
