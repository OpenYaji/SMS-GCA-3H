import React, { useState } from 'react';
import { Edit, X, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

const InfoField = ({ label, value, isEditing, onChange, name, readOnly = false }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
    {isEditing && !readOnly ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
      />
    ) : (
      <p className={`mt-1 p-2 rounded-md ${readOnly && isEditing ? 'bg-gray-100 dark:bg-slate-700' : ''}`}>
        {value}
      </p>
    )}
  </div>
);

const PersonalInfo = ({ personalData, academicData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(personalData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates = {};

      if (formData.address !== personalData.address) updates.address = formData.address;
      if (formData.phone !== personalData.phone) updates.phone = formData.phone;
      if (formData.email !== personalData.email) updates.email = formData.email;
      if (formData.gender !== personalData.gender) updates.gender = formData.gender;
      if (formData.nationality !== personalData.nationality) updates.nationality = formData.nationality;

      if (Object.keys(updates).length === 0) {
        setError('No changes detected.');
        setLoading(false);
        return;
      }

      const response = await axios.put(
        '/backend/api/profile/updateProfile.php',
        updates,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);

        // Optionally refresh user data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Personal Information</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600">
            <Edit size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(personalData);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Full Name" value={formData.fullName} isEditing={isEditing} readOnly />
        <InfoField label="Email Address" name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Age" value={formData.age} isEditing={isEditing} readOnly />
        <InfoField label="Birthday" value={formData.birthday} isEditing={isEditing} readOnly />
        <div className="md:col-span-2">
          <InfoField label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleInputChange} />
        </div>
        <InfoField label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Status" value={academicData.status} isEditing={isEditing} readOnly />

        <hr className="md:col-span-2 my-2 border-gray-100 dark:border-slate-700" />

        <InfoField label="Grade & Section" value={academicData.gradeSection} isEditing={isEditing} readOnly />
        <InfoField label="Adviser" value={academicData.adviser} isEditing={isEditing} readOnly />
        <InfoField label="Gender" name="gender" value={formData.gender} isEditing={isEditing} onChange={handleInputChange} />
        <InfoField label="Nationality" name="nationality" value={formData.nationality} isEditing={isEditing} onChange={handleInputChange} />
      </div>

      {isEditing && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 rounded-lg text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>Changing your Email or Phone Number will require a verification step before the update is applied.</span>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;