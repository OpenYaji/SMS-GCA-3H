import React, { useState, useEffect } from "react";
import RequestInfo from "./submodal/requestInfo";

const ScreeningModal = ({ applicant, onClose, onValidate }) => {
  const [closing, setClosing] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Payment states
  const [paymentMode, setPaymentMode] = useState("full");
  const [downPayment, setDownPayment] = useState(0);
  const [feeStructure, setFeeStructure] = useState(null);

  useEffect(() => {
    if (applicant?.grade) {
      const fees = getFeeStructure(applicant.grade);
      setFeeStructure(fees);
      setDownPayment(fees.downPayments[paymentMode]);
    }
  }, [applicant, paymentMode]);

  const getFeeStructure = (grade) => {
    const feeTable = {
      'Nursery': { registration: 1500, miscellaneous: 3000, tuition: 10000, full: 14500, quarterly: 2500, monthly: 1000 },
      'Kinder 1': { registration: 1500, miscellaneous: 3000, tuition: 10000, full: 14500, quarterly: 2500, monthly: 1000 },
      'Kinder 2': { registration: 1500, miscellaneous: 3000, tuition: 10000, full: 14500, quarterly: 2500, monthly: 1000 },
      'Grade 1': { registration: 2000, miscellaneous: 4500, tuition: 12000, full: 18500, quarterly: 2400, monthly: 1200 },
      'Grade 2': { registration: 2000, miscellaneous: 4500, tuition: 12000, full: 18500, quarterly: 2400, monthly: 1200 },
      'Grade 3': { registration: 2000, miscellaneous: 4500, tuition: 12000, full: 18500, quarterly: 2400, monthly: 1200 },
      'Grade 4': { registration: 2000, miscellaneous: 5000, tuition: 13000, full: 20000, quarterly: 2600, monthly: 1300 },
      'Grade 5': { registration: 2000, miscellaneous: 5000, tuition: 13000, full: 20000, quarterly: 2600, monthly: 1300 },
      'Grade 6': { registration: 2000, miscellaneous: 5000, tuition: 13000, full: 20000, quarterly: 2600, monthly: 1300 }
    };

    const fees = feeTable[grade] || feeTable['Grade 1'];

    return {
      ...fees,
      downPayments: {
        full: fees.registration + fees.miscellaneous + fees.tuition,
        quarterly: fees.registration + fees.miscellaneous + fees.quarterly,
        monthly: fees.registration + fees.miscellaneous + fees.monthly
      }
    };
  };

  if (!applicant || !isVisible) return null;

  const fieldValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") return value.toString();
    if (typeof value === "string" && value.trim() !== "") return value;
    return "—";
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      setClosing(false);
    }, 250);
  };

  const handleValidateClick = async () => {
    if (onValidate) {
      await onValidate({
        ...applicant,
        paymentMode,
        downPayment,
        notes
      });
      handleClose();
    }
  };

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

  const outstandingBalance = feeStructure ? feeStructure.full - downPayment : 0;

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-auto pt-10 transition-opacity ${closing ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="bg-white dark:bg-slate-800 max-w-[1200px] w-[90%] rounded-lg shadow-md border border-gray-200 dark:border-slate-600 flex flex-col max-h-[95vh] overflow-y-auto animate-fade-in">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-yellow-400 text-black dark:text-white px-6 py-4">
          <h2 className="text-lg font-semibold">
            Screening – {fieldValue(applicant.StudentLastName)}, {fieldValue(applicant.StudentFirstName)} {fieldValue(applicant.StudentMiddleName)}.
          </h2>
          <span className="text-2xl cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={handleClose}>
            &times;
          </span>
        </div>

        {/* BODY */}
        <div className="flex flex-col p-6 space-y-3 text-black dark:text-white">
          {/* Student Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-1">
              <div>
                <label className="block font-semibold text-sm mb-1">Student Name</label>
                <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                  {fieldValue(`${applicant.StudentFirstName}, ${applicant.StudentFirstName} ${applicant.StudentMiddleName}.`)}
                </p>
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Birthdate</label>
                <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                  {fieldValue(applicant.DateOfBirth)}
                </p>
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Mother Tongue</label>
                <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                  {fieldValue(applicant.motherTongue)}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Student Type</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.EnrolleeType)}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Grade Level</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.grade)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Age</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.age)}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Gender</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.Gender)}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Birth Place</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.birthPlace)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-sm mb-1">Nationality</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.Nationality)}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-1">Religion</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(applicant.religion)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Address */}
          <div className="w-full mt-4">
            <label className="block font-semibold text-sm mb-1">Full Address</label>
            <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm w-full">
              {fieldValue(applicant.Address)}
            </p>
          </div>

          {/* PARENT/GUARDIAN */}
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

          {/* PAYMENT SECTION */}
          {feeStructure && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Payment Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fee Breakdown */}
                <div className="space-y-2 bg-gray-50 dark:bg-slate-700 p-4 rounded">
                  <h4 className="font-semibold text-sm">Fee Breakdown ({applicant.grade})</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Registration Fee:</span>
                      <span className="font-semibold">₱ {feeStructure.registration.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Miscellaneous Fee:</span>
                      <span className="font-semibold">₱ {feeStructure.miscellaneous.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tuition Fee:</span>
                      <span className="font-semibold">₱ {feeStructure.tuition.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 mt-1 font-bold">
                      <span>Total Fee:</span>
                      <span>₱ {feeStructure.full.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    * Uniforms and books NOT included
                  </p>
                </div>

                {/* Payment Mode Selection */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-sm mb-2">Payment Mode</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm"
                    >
                      <option value="full">Full Payment</option>
                      <option value="quarterly">Quarterly (4 months)</option>
                      <option value="monthly">Monthly (8 months)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-sm mb-2">Down Payment</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                      min={feeStructure.registration + feeStructure.miscellaneous}
                      max={feeStructure.full}
                      className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum: ₱ {(feeStructure.registration + feeStructure.miscellaneous).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Down Payment:</span>
                      <span className="font-semibold text-5xl">₱ {downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Outstanding Balance:</span>
                      <span className="text-4xl text-red-600 dark:text-red-400">₱ {outstandingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Screening Section */}
          <div className="justify-between gap-6 mt-6 items-start">
            {/* Required Documents */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Required Documents</h3>
              <div className="flex flex-col gap-2">
                {getRequiredDocuments(applicant.EnrolleeType).map((doc, i) => {
                  const received = applicant.documents?.includes(doc);
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center border border-gray-400 dark:border-gray-600 rounded px-2.5 py-1.5 bg-gray-50 dark:bg-slate-700"
                    >
                      <span className={`text-sm font-medium ${received ? "" : "italic text-gray-400 dark:text-gray-300"}`}>
                        {doc}
                      </span>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${received ? "w-20 bg-green-500 text-black" : "bg-yellow-400 text-black"
                          }`}
                      >
                        {received ? "Received" : "Requested"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col mt-auto items-end">
              <h3 className="text-sm font-semibold mb-2 invisible">Actions</h3>
              <div className="flex flex-col gap-2">

                <button
                  onClick={handleValidateClick}
                  className="w-[190px] px-3.5 py-1.5 rounded bg-green-600 text-black font-semibold hover:bg-green-700 transition"
                >
                  Confirm and Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submodal */}
      <RequestInfo isOpen={isSubModalOpen} onClose={() => setSubModalOpen(false)} />

      {/* Animation */}
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

export default ScreeningModal;
