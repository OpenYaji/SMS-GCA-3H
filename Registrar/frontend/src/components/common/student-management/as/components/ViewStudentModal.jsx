import React, { useState } from "react";

const ViewStudentModal = ({ isVisible, student, onClose }) => {
  const [closing, setClosing] = useState(false);
  if (!isVisible || !student) return null;

  const fieldValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    return value;
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-start pt-10 overflow-auto bg-black/40 transition-opacity ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="bg-white dark:bg-slate-800 max-w-[1200px] w-[95%] rounded-lg shadow-md border border-gray-200 dark:border-slate-600 flex flex-col max-h-[95vh] overflow-y-auto animate-fade-in">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-blue-500 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">
            Student Details – {fieldValue(student.fullName)}
          </h2>
        </div>

        {/* BODY */}
        <div className="flex flex-col p-6 space-y-6 text-gray-800 dark:text-gray-100">

          {/* PERSONAL INFORMATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT COLUMN */}
            <div className="space-y-2">
              {[
                { label: "Student Number", value: student.studentNumber },
                { label: "Full Name", value: student.fullName },
                { label: "Birthdate", value: student.dateOfBirth },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="block font-semibold text-sm mb-1">{item.label}</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(item.value)}
                  </p>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Grade Level", value: student.gradeLevel },
                  { label: "Section", value: student.section },
                  { label: "Enrollment Date", value: student.enrollmentDate },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block font-semibold text-sm mb-1">{item.label}</label>
                    <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                      {fieldValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Age", value: student.age },
                  { label: "Gender", value: student.gender },
                  { label: "Nationality", value: student.nationality },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block font-semibold text-sm mb-1">{item.label}</label>
                    <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                      {fieldValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Birth Place", value: student.birthPlace},
                  { label: "Mother Tongue", value: student.motherTongue },
                  { label: "Religion", value: student.religion },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block font-semibold text-sm mb-1">{item.label}</label>
                    <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                      {fieldValue(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ADDRESS */}
          <div>
            <label className="block font-semibold text-sm mb-1">Full Address</label>
            <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
              {fieldValue(student.address)}
            </p>
          </div>

          {/* GUARDIAN INFORMATION */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Parent / Guardian Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: "Guardian Name", value: student.guardianName },
                { label: "Relationship", value: student.guardianRelationship },
                { label: "Contact Number", value: student.guardianPhone },
                { label: "Email", value: student.guardianEmail },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="block font-semibold text-sm mb-1">{item.label}</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Name", value: student.emergencyContactName },
                { label: "Contact Number", value: student.emergencyContactNumber },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="block font-semibold text-sm mb-1">{item.label}</label>
                  <p className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm">
                    {fieldValue(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-4 flex justify-end p-6 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* ANIMATION */}
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

export default ViewStudentModal;
