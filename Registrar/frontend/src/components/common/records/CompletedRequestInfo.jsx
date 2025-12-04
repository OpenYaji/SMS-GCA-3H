import React from "react";

const CompletedRequestInfoModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    console.log("Printing document...");
    window.print();
  };

  const handleArchive = () => {
    if (window.confirm("Archive this completed request? This action cannot be undone.")) {
      console.log("Archiving request:", request.id);
      alert("Request archived successfully!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">
            Completed Request - {request?.name || "Student Name"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Request Summary */}
        <div className="p-6 bg-green-50 border-b-2 border-green-100">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Student Name:</span>
                <span className="ml-2 text-gray-900">{request?.name || "N/A"}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Student ID:</span>
                <span className="ml-2 text-gray-900">{request?.studentId || "N/A"}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Grade Level:</span>
                <span className="ml-2 text-gray-900">{request?.gradeLevel || "N/A"}</span>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Document Type:</span>
                <span className="ml-2 text-gray-900">{request?.documentType || "N/A"}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Request Date:</span>
                <span className="ml-2 text-gray-900">{request?.requestDate || "N/A"}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Completed Date:</span>
                <span className="ml-2 text-gray-900">{request?.completedDate || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
            <h4 className="font-bold text-gray-900 mb-2">📅 Pickup/Delivery Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Scheduled Date:</span>
                <span className="ml-2 text-gray-900">{request?.pickupDate || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Time:</span>
                <span className="ml-2 text-gray-900">{request?.pickupTime || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Student Email:</span>
                <span className="ml-2 text-gray-900">{request?.email || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Request Purpose:</span>
                <span className="ml-2 text-gray-900">{request?.requestPurpose || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  ✓ Released to Student
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-center gap-3 border-t border-gray-200 flex-wrap">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleArchive}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 font-medium transition-colors flex items-center gap-2"
          >
            📦 Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedRequestInfoModal;