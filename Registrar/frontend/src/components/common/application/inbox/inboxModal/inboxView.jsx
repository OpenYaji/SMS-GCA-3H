import React, { useState } from "react";
import { HOST_IP } from "../../../../../../config";
import SuccessToast from "../../../../ui/SuccessToast";

const API_BASE = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/applicants`;

// Added onShowToast prop to allow child component to trigger toast in parent (InboxTable)
const InboxView = ({ applicant, onClose, onProceedToScreening, onRejectSuccess, onShowToast }) => { 
  const [closing, setClosing] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Local toast state removed; using onShowToast prop
  // Removed local toast state; using onShowToast prop

  // Exit if no applicant data is provided
  if (!applicant) return null;

  // Helper function to display field values or a dash if null/empty
  const fieldValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") return value.toString();
    if (typeof value === "string" && value.trim() !== "") return value;
    return "—";
  };

  // Handle modal closing animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 250);
  };

  // Handle rejecting the application
  const handleReject = async () => {
    if (rejecting) return;
    setRejecting(true);

    try {
      const response = await fetch(`${API_BASE}/updateStage.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Note: The backend (updateStage.php) must be updated to *NOT* send a parent/SMS notification
        // when 'action: "reject"' is received, as per request.
        body: JSON.stringify({ applicantId: applicant.id, action: "reject" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Rejection failed");
      }

      // Notify parent component to remove applicant from list
      await onRejectSuccess(applicant);

      // Show Success Toast via parent component prop (This is for the Admin user, not the Parent/Applicant)
      onShowToast(`Applicant ${applicant.StudentLastName} rejected successfully.`, "success");

      handleClose();

    } catch (err) {
      // Show Error Toast via parent component prop
      onShowToast(`Error rejecting applicant: ${err.message}`, "error");
    } finally {
      setRejecting(false);
    }
  };

  // Handle proceeding to screening stage
  const handleProceed = async () => {
    if (proceeding) return;
    setProceeding(true);

    try {
      // Perform the action via prop function (which handles the API update and toast)
      await onProceedToScreening(applicant); 
      handleClose();
    } catch (err) {
      // Show Error Toast via parent component prop
      onShowToast(`Error proceeding applicant: ${err.message}`, "error"); 
    } finally {
      setProceeding(false);
    }
  };

  // Determine required documents based on applicant type
  const getRequiredDocuments = (type) => {
    if (!type) return ["No required documents specified."];
    const t = type.toLowerCase();

    if (t === "new student" || t === "new") {
      return ["Birth Certificate", "Report Card", "Good Moral Certificate", "Certificate of Completion", "Form 137"];
    } else if (t === "old student" || t === "old") {
      return ["Report Card"];
    } else if (t === "transferee" || t === "transfer" || t === "transferree") {
      return ["Good Moral Certificate", "Birth Certificate", "Certificate of Completion", "Form 137"];
    } else if (t === "returnee" || t === "return") {
      return ["Report Card"];
    } else {
      return ["No required documents specified."];
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-start pt-10 overflow-auto bg-black/40 transition-opacity ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Toast Notification element is now handled by the parent component (InboxTable) */}

      {/* Modal Content */}
      <div className="bg-white dark:bg-slate-800 max-w-[1200px] w-[90%] rounded-lg shadow-md border border-gray-200 dark:border-slate-600 flex flex-col max-h-[95vh] overflow-y-auto animate-fade-in">

        {/* Header */}
        <div className="flex justify-between items-center bg-yellow-400 text-black dark:text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">
            Applicant Details – {fieldValue(applicant.StudentLastName)} {fieldValue(applicant.StudentFirstName)} {fieldValue(applicant.StudentMiddleName)}.
          </h2>
          <button onClick={() => handleClose()} className="text-2xl font-bold hover:text-gray-700 dark:hover:text-gray-300 transition">
            &times;
          </button>
        </div>

        {/* Body Content */}
        <div className="flex flex-col p-6 space-y-4 text-black dark:text-white">
          {/* ... (Student Details Grid remains the same) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name and Birth Info */}
            <div className="space-y-2">
              {[
                { label: "Student Name", value: `${fieldValue(applicant.StudentLastName)} ${fieldValue(applicant.StudentFirstName)} ${fieldValue(applicant.StudentMiddleName)}.` },
                { label: "Birthdate", value: fieldValue(applicant.DateOfBirth) },
                { label: "Birthplace", value: fieldValue(applicant.birthPlace) },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="block font-semibold text-sm mb-1">{item.label}</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Type, Grade, Age, Gender, etc. */}
            <div className="space-y-2">
              {/* Type and Grade */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Student Type", value: fieldValue(applicant.EnrolleeType) },
                  { label: "Grade Level", value: fieldValue(applicant.grade) },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block font-semibold text-sm mb-1">{item.label}</label>
                    <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Age, Gender, Nationality */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Age", value: fieldValue(applicant.Age) },
                  { label: "Gender", value: fieldValue(applicant.Gender) },
                  { label: "Nationality", value: fieldValue(applicant.Nationality) },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block font-semibold text-sm mb-1">{item.label}</label>
                    <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Mother Tongue and Religion */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Mother Tongue", value: fieldValue(applicant.motherTongue) },
                  { label: "Religion", value: fieldValue(applicant.religion) },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block font-semibold text-sm mb-1">{item.label}</label>
                    <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-sm mb-1">Full Address</label>
            <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
              {fieldValue(applicant.Address)}
            </p>
          </div>

          {/* Parent / Guardian Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Parent / Guardian Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { label: "Guardian Name", value: `${fieldValue(applicant.GuardianFirstName)} ${fieldValue(applicant.GuardianLastName)}` },
                { label: "Relationship", value: fieldValue(applicant.GuardianRelationship) },
                { label: "Contact Number", value: fieldValue(applicant.GuardianContact) },
                { label: "Email", value: fieldValue(applicant.GuardianEmail) },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="block font-semibold text-sm mb-1">{item.label}</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
            </div>

          {/* Required Docs and Actions */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-stretch">

            {/* Required Documents List */}
            <div className="flex flex-col gap-2 flex-1 min-w-[300px]">
              <h3 className="text-sm font-semibold">Required Documents</h3>

              {getRequiredDocuments(applicant.studentType).map((doc, idx) => (
                <p key={idx} className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 w-full md:w-[365px] bg-gray-50 dark:bg-slate-700 text-sm text-gray-400 italic dark:text-gray-300">
                  {doc}
                </p>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 justify-end items-end">
              {/* Reject Button */}
              <button
                onClick={handleReject}
                disabled={rejecting}
                className={`w-[190px] px-4 py-2 rounded bg-red-600 text-black font-semibold hover:bg-red-700 transition ${
                  rejecting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {rejecting ? 'Rejecting...' : 'Reject Application'}
              </button>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={proceeding}
                className={`w-[190px] px-4 py-2 rounded bg-green-600 text-black font-semibold hover:bg-green-700 transition ${
                  proceeding ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Proceed to Screening
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Custom styles for fade-in animation */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-15px); }
            to { opacity: 1; transform: translateY(0); }
          } 
          .animate-fade-in {
            animation: fade-in 0.25s ease;
          }
        `}
      </style>
    </div>
  );
};

export default InboxView;