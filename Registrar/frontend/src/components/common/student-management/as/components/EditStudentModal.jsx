import React, { useState, useEffect, useCallback } from "react";
import { X, Save, AlertCircle } from "lucide-react";

const EditStudentModal = ({ isVisible, student, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  
  // FIXED: Move useCallback BEFORE the conditional return
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        middleName: student.middleName || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || '',
        address: student.address || '',
        guardianName: student.guardianName || '',
        guardianRelationship: student.guardianRelationship || '',
        guardianPhone: student.guardianPhone || '',
        guardianEmail: student.guardianEmail || '',
        emergencyContactName: student.emergencyContactName || '',
        emergencyContactNumber: student.emergencyContactNumber || ''
      });
      setErrors({});
    }
  }, [student]);

  // NOW it's safe to do conditional return
  if (!isVisible || !student) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.guardianName?.trim()) newErrors.guardianName = 'Guardian name is required';
    if (!formData.guardianPhone?.trim()) newErrors.guardianPhone = 'Guardian contact is required';
    
    const phoneRegex = /^09\d{9}$/;
    if (formData.guardianPhone && !phoneRegex.test(formData.guardianPhone)) {
      newErrors.guardianPhone = 'Invalid phone format (09XXXXXXXXX)';
    }
    
    if (formData.emergencyContactNumber && !phoneRegex.test(formData.emergencyContactNumber)) {
      newErrors.emergencyContactNumber = 'Invalid phone format (09XXXXXXXXX)';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.guardianEmail && !emailRegex.test(formData.guardianEmail)) {
      newErrors.guardianEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch('http://localhost/SMS-GCA-3H/Registrar/backend/api/students/updateStudent.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfileId: student.id,
          ...formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onSave(result.data);
        handleClose();
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
      setErrors({});
    }, 250);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-center items-start pt-10 overflow-auto bg-black/40 transition-opacity ${
      closing ? "opacity-0" : "opacity-100"
    }`}>
      <div className="bg-white dark:bg-slate-800 max-w-[1000px] w-[95%] rounded-lg shadow-md border border-gray-200 dark:border-slate-600 flex flex-col max-h-[95vh] overflow-y-auto animate-fade-in">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 rounded-t-lg sticky top-0 z-10">
          <h2 className="text-lg font-semibold">
            Edit Student – {student.fullName}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="text-2xl font-bold hover:text-gray-200 transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-col p-6 space-y-6">
          
          {/* Global Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-100">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="block font-semibold text-sm mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  maxLength={100}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.firstName ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-sm mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName || ''}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                  maxLength={100}
                  className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  maxLength={100}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.lastName ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              
              <div>
                <label className="block font-semibold text-sm mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-sm mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700
                    ${errors.gender ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.gender}
                  </p>
                )}
              </div>

              <div className="flex items-end">
                <div className="w-full">
                  <label className="block font-semibold text-sm mb-1">Age</label>
                  <input
                    type="text"
                    value={student.age || 'N/A'}
                    disabled
                    className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-200 dark:bg-slate-600"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-100">Address</h3>
            <div>
              <label className="block font-semibold text-sm mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                maxLength={512}
                className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                  ${errors.address ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-100">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block font-semibold text-sm mb-1">
                  Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guardianName || ''}
                  onChange={(e) => handleChange('guardianName', e.target.value)}
                  maxLength={255}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.guardianName ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.guardianName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.guardianName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-sm mb-1">Relationship</label>
                <select
                  value={formData.guardianRelationship || ''}
                  onChange={(e) => handleChange('guardianRelationship', e.target.value)}
                  className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              
              <div>
                <label className="block font-semibold text-sm mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guardianPhone || ''}
                  onChange={(e) => handleChange('guardianPhone', e.target.value)}
                  maxLength={20}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.guardianPhone ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.guardianPhone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.guardianPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.guardianEmail || ''}
                  onChange={(e) => handleChange('guardianEmail', e.target.value)}
                  maxLength={255}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.guardianEmail ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.guardianEmail && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.guardianEmail}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-100">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block font-semibold text-sm mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  maxLength={255}
                  className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm mb-1">Contact Number</label>
                <input
                  type="text"
                  value={formData.emergencyContactNumber || ''}
                  onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
                  maxLength={20}
                  className={`w-full border rounded px-3 py-2 text-sm bg-gray-50 dark:bg-slate-700 
                    ${errors.emergencyContactNumber ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.emergencyContactNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.emergencyContactNumber}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Read-only Academic Info */}
          <div>
            <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-100">Academic Information (Read-only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-sm mb-1">Student Number</label>
                <input
                  type="text"
                  value={student.studentNumber}
                  disabled
                  className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-200 dark:bg-slate-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Grade Level</label>
                <input
                  type="text"
                  value={student.gradeLevel}
                  disabled
                  className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-200 dark:bg-slate-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Section</label>
                <input
                  type="text"
                  value={student.section}
                  disabled
                  className="w-full border border-gray-400 dark:border-gray-600 rounded px-3 py-2 text-sm bg-gray-200 dark:bg-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-600 sticky bottom-0 bg-white dark:bg-slate-800 pb-2">
            <button
              onClick={handleClose}
              disabled={saving}
              className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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

export default EditStudentModal;