// C:\xampp\htdocs\SMS-GCA-3H\Registrar\frontend\src\components\common\records\ViewStudentInfoModal.jsx

import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../DarkModeProvider";

const API_BASE_URL = "http://localhost/SMS-GCA-3H/Registrar/backend/api/records";

const ViewStudentInfoModal = ({ isOpen, onClose, student }) => {
  const { isDarkMode } = useDarkMode();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (isOpen && student?.studentId) {
      fetchStudentInfo(student.studentId);
    } else {
      // Reset data when modal closes
      setStudentData(null);
      setDocuments([]);
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
      
      console.log("Student API response:", data); // For debugging
      setStudentData(data);
      
      // Handle documents
      if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
    // Convert string array to object array if needed
    setDocuments(
        data.documents.map(doc => 
            typeof doc === 'string' 
                ? { name: doc, status: 'Submitted' } 
                : doc
        )
    );
} else {
    // Default documents
    setDocuments([
        { name: "Application Form", status: "Submitted" },
        { name: "Transcript of Records", status: "Submitted" },
        { name: "Birth Certificate", status: "Submitted" },
        { name: "Photo (2x2)", status: "Submitted" },
        { name: "Good Moral Character", status: "Submitted" },
        { name: "Health Records", status: "Pending" },
        { name: "Government-issued ID", status: "Pending" },
        { name: "Test Permit", status: "Submitted" },
        { name: "Proof of Payment", status: "Submitted" },
    ]);
}
      
    } catch (err) {
      console.error("Error fetching student info:", err);
      setError(err.message || "Failed to fetch student information");
      
      // Set default documents on error
      setDocuments([
        { name: "Application Form", status: "Submitted" },
        { name: "Transcript of Records", status: "Submitted" },
        { name: "Birth Certificate", status: "Submitted" },
        { name: "Photo (2x2)", status: "Submitted" },
        { name: "Good Moral Character", status: "Submitted" },
        { name: "Health Records", status: "Pending" },
        { name: "Government-issued ID", status: "Pending" },
        { name: "Test Permit", status: "Submitted" },
        { name: "Proof of Payment", status: "Submitted" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // FIXED: Helper function to safely get data
  const getData = (key, defaultValue = "N/A") => {
    if (!studentData) return defaultValue;
    
    // Handle nested paths (e.g., "guardian.name")
    if (key.includes('.')) {
        const keys = key.split('.');
        let value = studentData;
        for (const k of keys) {
            value = value?.[k];
            // Stop if we hit undefined/null
            if (value === undefined || value === null) break;
        }
        // Check for empty strings after traversal
        return (value !== undefined && value !== null && value !== '') ? value : defaultValue;
    }
    
    const value = studentData[key];
    return (value !== undefined && value !== null && value !== '') ? value : defaultValue;
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b-2 border-amber-300 dark:border-amber-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              View Student Info
            </h2>
            {studentData && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ID: {getData('studentId')} • Status: {getData('studentStatus')}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading student information...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Student Info</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4 text-left">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Displaying placeholder information. Real data will show when API is configured.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Photo and Personal Info */}
              <div className="col-span-1">
                {/* Profile Photo */}
                <div className="mb-6">
                  <div className="w-48 h-48 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <img
  src={getData('photoUrl', 'https://placehold.co/200x200/CCC/666?text=No+Photo')}
  alt="Student"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/200x200/CCC/666?text=No+Photo';
  }}
/>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      First Name
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('firstName')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Age</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('age')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Middle Name
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('middleName')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Sex</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('gender')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Last Name
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('lastName')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Birthday</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('birthDate')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Birthplace
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('birthPlace')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Religion</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('religion')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Mother Tongue
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('motherTongue')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Height</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('height')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Nationality
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('nationality')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Weight</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('weight')}</p>
                  </div>
                </div>
              </div>

              {/* Middle Column - Family and Contact Info */}
              <div className="col-span-1">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getData('address')}
                    </p>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Guardian
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('guardianName')}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Relationship</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('guardianRelationship')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Guardian's Contact Number
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('guardianContact')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Guardian's Email Address
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('guardianEmail')}</p>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Father's Name
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getData('fatherFirstName')} {getData('fatherMiddleName')} {getData('fatherLastName')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Occupation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('fatherOccupation')}</p>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Mother's Name
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getData('motherFirstName')} {getData('motherMiddleName')} {getData('motherLastName')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Occupation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{getData('motherOccupation')}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Documents */}
              <div className="col-span-1">
                <div className="bg-gradient-to-br from-amber-900 to-amber-800 dark:from-amber-950 dark:to-amber-900 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">Documents:</h3>
                    <span className="text-xs text-amber-200 bg-amber-900/50 px-2 py-1 rounded">
                      {documents.length} documents
                    </span>
                  </div>
                  <div className="space-y-2">
                    {documents.length > 0 ? (
                      documents.map((doc, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="text-gray-400">📄</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {typeof doc === 'string' ? doc : doc.name || doc.documentName || 'Document'}
                          </span>
                          {typeof doc !== 'string' && doc.status && (
                            <span className={`ml-auto text-xs px-2 py-1 rounded ${
                              doc.status === 'Submitted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {doc.status}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-white/70">No documents available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Student Information Summary */}
                  <div className="mt-6 pt-4 border-t border-amber-700">
                    <h4 className="text-white font-semibold mb-2">Student Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-amber-200">Current Grade:</span>
                        <span className="ml-2 text-white">{getData('currentGradeLevel')}</span>
                      </div>
                      <div>
                        <span className="text-amber-200">Section:</span>
                        <span className="ml-2 text-white">{getData('section')}</span>
                      </div>
                      <div>
                        <span className="text-amber-200">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          getData('status') === 'Active' ? 'bg-green-600 text-white' :
                          getData('status') === 'Inactive' ? 'bg-red-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {getData('status')}
                        </span>
                      </div>
                      <div>
                        <span className="text-amber-200">School Year:</span>
                        <span className="ml-2 text-white">{getData('schoolYear')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentInfoModal;