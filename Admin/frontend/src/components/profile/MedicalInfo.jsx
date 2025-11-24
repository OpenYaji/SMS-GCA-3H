import React, { useState } from "react";
import { Check, X } from "lucide-react";

const MedicalInfoItem = ({
  label,
  value,
  field,
  isEditing = false,
  onMedicalChange,
}) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </span>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onMedicalChange(field, e.target.value)}
        className="w-full px-3 py-2 border-2 border-yellow-500 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium transition-all focus:border-yellow-600 focus:ring-3 focus:ring-yellow-200 dark:focus:ring-yellow-800 dark:text-white"
      />
    ) : (
      <span className="text-sm text-gray-900 dark:text-white font-medium">
        {value}
      </span>
    )}
  </div>
);

const MedicalInfo = ({ medicalData, setMedicalData }) => {
  const [isMedicalEditing, setIsMedicalEditing] = useState(false);

  const handleMedicalChange = (field, value) => {
    setMedicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveMedical = () => {
    setIsMedicalEditing(false);
    console.log("Medical info saved:", medicalData);
  };

  const handleCancelMedical = () => {
    setIsMedicalEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 font-kumbh transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 14 14"
          >
            <g
              fill="none"
              stroke="#dc3545"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M.58 4.31C1.09 1.85 4.12 0 7 3.27c4.11-4.71 8.5 1.13 5.52 4.14L7 12.5l-3.23-3" />
              <path d="M.5 7H3l1.5-2l2 3.5l1.5-2h1.5" />
            </g>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-kumbh flex-1">
          Medical Info
        </h2>
        {isMedicalEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSaveMedical}
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-all duration-300"
            >
              <Check size={18} />
            </button>
            <button
              onClick={handleCancelMedical}
              className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsMedicalEditing(true)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <MedicalInfoItem
            label="Weight"
            value={medicalData.weight}
            field="weight"
            isEditing={isMedicalEditing}
            onMedicalChange={handleMedicalChange}
          />
          <MedicalInfoItem
            label="Height"
            value={medicalData.height}
            field="height"
            isEditing={isMedicalEditing}
            onMedicalChange={handleMedicalChange}
          />
          <MedicalInfoItem
            label="Allergies"
            value={medicalData.allergies}
            field="allergies"
            isEditing={isMedicalEditing}
            onMedicalChange={handleMedicalChange}
          />
          <MedicalInfoItem
            label="Known Medical Conditions"
            value={medicalData.medicalConditions}
            field="medicalConditions"
            isEditing={isMedicalEditing}
            onMedicalChange={handleMedicalChange}
          />
        </div>

        <div className="border-t dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-kumbh">
            Emergency Contact
          </h3>
          <div className="space-y-4">
            <MedicalInfoItem
              label="Contact Person"
              value={medicalData.emergencyContact}
              field="emergencyContact"
              isEditing={isMedicalEditing}
              onMedicalChange={handleMedicalChange}
            />
            <MedicalInfoItem
              label="Contact Number"
              value={medicalData.emergencyNumber}
              field="emergencyNumber"
              isEditing={isMedicalEditing}
              onMedicalChange={handleMedicalChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;
