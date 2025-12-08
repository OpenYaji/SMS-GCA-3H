import React, { useState } from "react";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const CompletedRequestInfoModal = ({ isOpen, onClose, request, onArchived }) => {
  const [archiving, setArchiving] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !request) return null;

  const handlePrint = () => {
    console.log("Printing document...");
    window.print();
  };

  const handleArchiveClick = () => {
    setShowArchiveConfirm(true);
  };

  const handleArchiveConfirm = async () => {
    try {
      setArchiving(true);
      setShowArchiveConfirm(false);
      
      const response = await fetch(`${API_BASE_URL}/archive_request.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: request.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSuccessModal(true);
        // Auto close success modal after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          if (onArchived) {
            onArchived();
          }
          onClose();
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to archive request");
      }
    } catch (error) {
      console.error("Error archiving request:", error);
      alert("Error: " + error.message);
      setShowArchiveConfirm(false);
    } finally {
      setArchiving(false);
    }
  };

  const handleArchiveCancel = () => {
    setShowArchiveConfirm(false);
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-bold text-white">
              Completed Request - {request?.studentName || "Student Name"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Request Summary */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border-b-2 border-green-100 dark:border-green-800">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Student Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.studentName || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Student ID:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.studentId || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Grade Level:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.gradeLevel || "N/A"}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Document Type:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.documentType || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Request Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.requestDate || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Completed Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.completedDate || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">📅 Pickup Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Scheduled Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.pickupDate || "N/A"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Time:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.pickupTime || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Student Email:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.email || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Request Purpose:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{request?.requestPurpose || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                    ✓ Released to Student
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-center gap-3 border-t border-gray-200 dark:border-gray-700 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors flex items-center gap-2"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleArchiveClick}
              disabled={archiving}
              className="px-4 py-2 bg-gray-700 dark:bg-gray-800 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {archiving ? "Archiving..." : "📦 Archive"}
            </button>
          </div>
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚠️</div>
                <h3 className="text-xl font-bold text-white">Confirm Archive</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">
                Archive this completed request? This will move it to the Archive Search tab.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                  📋 <strong>{request?.studentName}</strong> - {request?.documentType}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={handleArchiveCancel}
                className="px-5 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveConfirm}
                disabled={archiving}
                className="px-5 py-2.5 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {archiving ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Archiving...
                  </>
                ) : (
                  <>
                    📦 Archive Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-bounce-in">
            <div className="p-8 text-center">
              <div className="mb-4 text-6xl animate-checkmark">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Success!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Request archived successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-checkmark {
          animation: checkmark 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </>
  );
};

export default CompletedRequestInfoModal;