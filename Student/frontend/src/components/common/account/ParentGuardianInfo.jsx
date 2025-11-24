import React, { useState } from 'react';
import { Edit, X, Save } from 'lucide-react';

// Reusable InfoField component can be extracted to a separate file if used more widely
const InfoField = ({ label, value, isEditing, onChange, name }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
    {isEditing ? (
      <input type="text" name={name} value={value} onChange={onChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
    ) : (
      <p className="mt-1 p-2">{value}</p>
    )}
  </div>
);

const ParentGuardianInfo = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Parent/Guardian</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
            <Edit size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
             <button onClick={() => { setIsEditing(false); setFormData(data); }} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
              <X size={14} /> Cancel
            </button>
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-sm font-semibold bg-amber-400 text-stone-900 px-3 py-1.5 rounded-lg hover:bg-amber-500">
              <Save size={14} /> Save
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Father's Name" name="fatherName" value={formData.fatherName} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Mother's Name" name="motherName" value={formData.motherName} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Guardian's Name" name="guardianName" value={formData.guardianName} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Relationship to Guardian" name="guardianRelationship" value={formData.guardianRelationship} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Contact Number" name="contactNumber" value={formData.contactNumber} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} />
      </div>
    </div>
  );
};

export default ParentGuardianInfo;