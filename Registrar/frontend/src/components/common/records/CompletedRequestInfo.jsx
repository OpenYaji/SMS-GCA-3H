// C:\xampp\htdocs\SMS-GCA-3H\Registrar\frontend\src\components\common\records\CompletedRequestInfo.jsx

import React, { useState } from "react";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const CompletedRequestInfoModal = ({ isOpen, onClose, request, onArchived }) => {
  const [archiving, setArchiving] = useState(false);
  const { isDarkMode } = useDarkMode();

  if (!isOpen || !request) return null;

  const handlePrint = () => {
    console.log("Printing document...");
    window.print();
  };

  const handleArchive = async () => {
    if (window.confirm("Archive this completed request? This will move it to the Archive Search tab.")) {
      try {
        setArchiving(true);
        
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
          alert("Request archived successfully!");
          if (onArchived) {
            onArchived();
          }
          onClose();
        } else {
          throw new Error(data.error || "Failed to archive request");
        }
      } catch (error) {
        console.error("Error archiving request:", error);
        alert("Error: " + error.message);
      } finally {
        setArchiving(false);
      }
    }
  };

  return (
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
            onClick={handleArchive}
            disabled={archiving}
            className="px-4 py-2 bg-gray-700 dark:bg-gray-800 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {archiving ? "Archiving..." : "📦 Archive"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedRequestInfoModal;