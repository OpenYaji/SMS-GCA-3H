import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const ViewStudentInfoModal = ({ isOpen, onClose, student }) => {
  const { isDarkMode } = useDarkMode();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && student?.studentId) {
      fetchStudentInfo(student.studentId);
    } else {
      setStudentData(null);
      setError(null);
    }
  }, [isOpen, student]);

  const fetchStudentInfo = async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/get_student_info.php?student_id=${encodeURIComponent(studentId)}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log("Student API response:", data);
      setStudentData(data);
      
    } catch (err) {
      console.error("Error fetching student info:", err);
      setError(err.message || "Failed to fetch student information");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getData = (key, defaultValue = "N/A") => {
    if (!studentData) return defaultValue;
    
    if (key.includes('.')) {
        const keys = key.split('.');
        let value = studentData;
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined || value === null) break;
        }
        return (value !== undefined && value !== null && value !== '') ? value : defaultValue;
    }
    
    const value = studentData[key];
    return (value !== undefined && value !== null && value !== '') ? value : defaultValue;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 dark:from-amber-600 dark:via-amber-700 dark:to-orange-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Student Information
            </h2>
            {studentData && (
              <div className="flex items-center gap-4 mt-2">
                <span className="text-amber-50 font-medium">
                  {getData('studentNumber')}
                </span>
                <span className="text-amber-100">•</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  getData('status') === 'Enrolled' ? 'bg-green-500/20 text-green-100 ring-1 ring-green-400/50' :
                  getData('status') === 'Withdrawn' ? 'bg-red-500/20 text-red-100 ring-1 ring-red-400/50' :
                  getData('status') === 'Graduated' ? 'bg-blue-500/20 text-blue-100 ring-1 ring-blue-400/50' :
                  'bg-white/20 text-white ring-1 ring-white/50'
                }`}>
                  {getData('status')}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white hover:bg-white/20 rounded-full text-2xl font-bold w-10 h-10 flex items-center justify-center transition-all"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-500 dark:border-gray-700 dark:border-t-amber-500"></div>
              <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Loading student information...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Student Info</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => fetchStudentInfo(student?.studentId)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-amber-500/30"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Student Header Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-amber-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {getData('firstName', '?').charAt(0)}{getData('lastName', '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getData('firstName')} {getData('middleName')} {getData('lastName')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {getData('currentGradeLevel')} • {getData('section')} • {getData('schoolYear')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <Section title="Personal Information" icon="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoField label="First Name" value={getData('firstName')} />
                  <InfoField label="Middle Name" value={getData('middleName')} />
                  <InfoField label="Last Name" value={getData('lastName')} />
                  <InfoField label="Age" value={getData('age')} />
                  <InfoField label="Gender" value={getData('gender')} />
                  <InfoField label="Birth Date" value={getData('birthDate')} />
                  <InfoField label="Religion" value={getData('religion')} />
                  <InfoField label="Mother Tongue" value={getData('motherTongue')} />
                  <InfoField label="Nationality" value={getData('nationality')} />
                </div>
              </Section>

              {/* Contact Information */}
              <Section title="Contact Information" icon="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Email Address" value={getData('emailAddress')} icon="" />
                  <InfoField label="Contact Number" value={getData('contactNumber')} icon="" />
                  <div className="md:col-span-2">
                    <InfoField label="Address" value={getData('address')} icon="" />
                  </div>
                </div>
              </Section>

              {/* Guardian Information */}
              <Section title="Guardian Information" icon="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Primary Guardian" value={getData('guardianName')} />
                  <InfoField label="Relationship" value={getData('guardianRelationship')} />
                  <InfoField label="Guardian Contact" value={getData('guardianContact')} />
                  <InfoField label="Guardian Email" value={getData('guardianEmail')} />
                </div>
              </Section>

              {/* Emergency Contact */}
              <Section title="Emergency Contact" icon="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Contact Person" value={getData('emergencyContactPerson')} />
                  <InfoField label="Contact Number" value={getData('emergencyContactNumber')} />
                </div>
              </Section>

              {/* Academic Information */}
              <Section title="Academic Information" icon="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoField label="Student Number" value={getData('studentNumber')} />
                  <InfoField label="QR Code ID" value={getData('qrCodeId')} />
                  <InfoField label="Current Grade Level" value={getData('currentGradeLevel')} />
                  <InfoField label="Section" value={getData('section')} />
                  <InfoField label="School Year" value={getData('schoolYear')} />
                  <InfoField label="Enrollment Date" value={getData('enrollmentDate')} />
                  <InfoField label="Adviser" value={getData('adviserName')} />
                  <InfoField label="Previous School" value={getData('previousSchool')} />
                  <InfoField label="Enrollee Type" value={getData('enrolleeType')} />
                </div>
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Section Component
const Section = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// InfoField Component
const InfoField = ({ label, value, icon }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </label>
    <p className="text-base text-gray-900 dark:text-white font-medium break-words bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg">
      {value}
    </p>
  </div>
);

export default ViewStudentInfoModal;