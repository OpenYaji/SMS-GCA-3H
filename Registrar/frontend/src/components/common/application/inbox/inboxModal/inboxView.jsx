import React, { useState } from "react";
import { HOST_IP } from "../../../../../../config";
import SuccessToast from "../../../../ui/SuccessToast";

const API_BASE = `http://${HOST_IP}/SMS-GCA-3H/Registrar/backend/api/applicants`;

// Function to calculate age based on birthdate string (YYYY-MM-DD format)
const calculateAge = (birthDateString) => {
    if (!birthDateString) return '—';
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 0 ? age : '—'; // Return '—' if age is negative (invalid date)
};


const InboxView = ({ applicant, onClose, onProceedToScreening, onRejectSuccess, onShowToast }) => { 
  const [closing, setClosing] = useState(false);
  const [proceeding, setProceeding] = useState(false); 
  const [rejecting, setRejecting] = useState(false); 

  // Exit if no applicant data is provided
  if (!applicant) return null;

  // Helper function to display field values or a dash if null/empty
  const fieldValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") return value.toString();
    if (typeof value === "string" && value.trim() !== "") return value;
    return "—";
  };
    
  // Calculate age automatically
  const computedAge = calculateAge(applicant.DateOfBirth);

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
    // Block action if rejecting or proceeding is already true
    if (rejecting || proceeding) return; 
    setRejecting(true);

    try {
      const response = await fetch(`${API_BASE}/updateStage.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // Show Success Toast via parent component prop
      onShowToast(`Applicant ${applicant.StudentLastName} rejected successfully.`, "success");

      handleClose();

    } catch (err) {
      // Show Error Toast via parent component prop
      onShowToast(`Error rejecting applicant: ${err.message}`, "error");
    } finally {
      // Re-enable the buttons regardless of success or failure
      setRejecting(false); 
    }
  };

  // Handle proceeding to screening stage
  const handleProceed = async () => {
    // Block action if proceeding or rejecting is already true
    if (proceeding || rejecting) return; 
    setProceeding(true);

    try {
      // Perform the action via prop function (which handles the API update and toast)
      await onProceedToScreening(applicant); 
      handleClose();
    } catch (err) {
      // Show Error Toast via parent component prop
      onShowToast(`Error proceeding applicant: ${err.message}`, "error"); 
    } finally {
      // Re-enable the buttons regardless of success or failure
      setProceeding(false); 
    }
  };

  // Determine required documents based on applicant type
  const getRequiredDocuments = (type) => {
    if (!type) return ["No required documents specified."];
    const t = type.toLowerCase();

    if (t === "new student" || t === "new") {
      return ["Birth Certificate"];
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
                  // CHANGED: Use computedAge instead of applicant.Age
                  { label: "Age", value: computedAge }, 
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
        <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm overflow-hidden truncate">{item.value}</p>
      </div>
    ))}
  </div>
</div>


          {/* Required Docs and Actions */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-stretch">

            {/* Required Documents List */}
            <div className="flex flex-col gap-2 flex-1 min-w-[300px]">
              <h3 className="text-sm font-semibold">Required Documents</h3>

              {getRequiredDocuments(applicant.EnrolleeType).map((doc, idx) => (
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
                disabled={rejecting || proceeding} 
                className={`w-[190px] px-4 py-2 rounded bg-red-600 text-black font-semibold hover:bg-red-700 transition ${
                  (rejecting || proceeding) ? "opacity-50 cursor-not-allowed" : "" 
                }`}
              >
                {rejecting ? 'Rejecting...' : 'Reject Application'}
              </button>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={proceeding || rejecting}
                className={`w-[190px] px-4 py-2 rounded bg-green-600 text-black font-semibold hover:bg-green-700 transition ${
                  (proceeding || rejecting) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {proceeding ? 'Processing...' : 'Proceed to Screening'}
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