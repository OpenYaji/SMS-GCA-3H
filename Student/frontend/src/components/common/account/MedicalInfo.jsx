import React, { useState } from 'react';
import { Edit, X, Save, HeartPulse } from 'lucide-react';
import axios from 'axios';

const InfoField = ({ label, value, isEditing, onChange, name, suffix = '' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
    {isEditing ? (
      <div className="relative">
        <input type="text" name={name} value={value} onChange={onChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{suffix}</span>}
      </div>
    ) : (
      <p className="mt-1 p-2">{value} {suffix}</p>
    )}
  </div>
);

const MedicalInfo = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        '/backend/api/profile/updateMedicalInfo.php',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Medical information updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update medical information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-red-500" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Medical Info</h3>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
            <Edit size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(data);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-semibold bg-amber-400 text-stone-900 px-3 py-1.5 rounded-lg hover:bg-amber-500 disabled:opacity-50"
            >
              <Save size={14} /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 rounded-lg text-sm text-green-800 dark:text-green-200">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Weight" name="weight" value={formData.weight} isEditing={isEditing} onChange={handleInputChange} suffix="kg" />
          <InfoField label="Height" name="height" value={formData.height} isEditing={isEditing} onChange={handleInputChange} suffix="cm" />
        </div>
        <InfoField label="Allergies" name="allergies" value={formData.allergies} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Known Medical Conditions" name="conditions" value={formData.conditions} isEditing={isEditing} onChange={handleInputChange} />

        <hr className="my-2 border-gray-100 dark:border-slate-700" />

        <h4 className="text-sm font-bold pt-2 text-gray-700 dark:text-gray-300">Emergency Contact</h4>
        <InfoField label="Contact Person" name="emergencyContactPerson" value={formData.emergencyContactPerson} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Contact Number" name="emergencyContactNumber" value={formData.emergencyContactNumber} isEditing={isEditing} onChange={handleInputChange} />
      </div>
    </div>
  );
};

export default MedicalInfo;