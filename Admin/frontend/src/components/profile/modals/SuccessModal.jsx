import React from "react";
import { CheckCircle } from "lucide-react";

const SuccessModal = ({ showSuccessModal, setShowSuccessModal }) => {
  if (!showSuccessModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-scaleIn transition-colors duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-kumbh">
            Password Changed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-kumbh">
            Your password has been updated{" "}
            <span className="text-green-600 dark:text-green-400 font-semibold">
              successfully
            </span>
            .
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium font-kumbh transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
