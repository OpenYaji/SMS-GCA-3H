import React, { useState } from 'react';

const EnrollmentSuccessModal = ({ isOpen, onClose, enrollmentData }) => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  if (!isOpen || !enrollmentData) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg 
                className="h-10 w-10 text-green-600 dark:text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Enrollment Successful!
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Student has been successfully enrolled
            </p>
          </div>

          {/* Credentials Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-5 mb-4 border border-blue-200 dark:border-slate-500">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              Login Credentials
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Student Number
                </label>
                <div className="mt-1 flex items-center justify-between bg-white dark:bg-slate-800 rounded-md px-3 py-2 border border-gray-200 dark:border-slate-600">
                  <span className="text-sm font-mono font-semibold text-gray-800 dark:text-white">
                    {enrollmentData.studentNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(enrollmentData.studentNumber, 'studentNumber')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'studentNumber' ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="mt-1 flex items-center justify-between bg-white dark:bg-slate-800 rounded-md px-3 py-2 border border-gray-200 dark:border-slate-600">
                  <span className="text-sm font-mono text-gray-800 dark:text-white break-all">
                    {enrollmentData.emailAddress}
                  </span>
                  <button
                    onClick={() => copyToClipboard(enrollmentData.emailAddress, 'email')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-2 flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'email' ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Default Password
                </label>
                <div className="mt-1 flex items-center justify-between bg-white dark:bg-slate-800 rounded-md px-3 py-2 border border-gray-200 dark:border-slate-600">
                  <span className="text-sm font-mono font-semibold text-gray-800 dark:text-white">
                    {enrollmentData.defaultPassword}
                  </span>
                  <button
                    onClick={() => copyToClipboard(enrollmentData.defaultPassword, 'password')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'password' ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {copied && (
              <div className="mt-3 text-xs text-green-600 dark:text-green-400 text-center font-medium">
                ✓ Copied to clipboard
              </div>
            )}
          </div>

          {/* Subjects Assigned Card */}
          {enrollmentData.assignedSubjects && enrollmentData.assignedSubjects.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Subjects Automatically Assigned
                </h4>
                <span className="text-xs font-bold bg-purple-600 text-white px-2 py-1 rounded-full">
                  {enrollmentData.totalSubjects} Subjects
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-md p-3 border border-purple-100 dark:border-purple-900">
                <div className={`grid grid-cols-2 gap-2 ${!showAllSubjects && enrollmentData.assignedSubjects.length > 6 ? 'max-h-32' : 'max-h-48'} overflow-y-auto`}>
                  {enrollmentData.assignedSubjects.slice(0, showAllSubjects ? undefined : 6).map((subject, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-md text-xs text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-700"
                    >
                      <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{subject}</span>
                    </div>
                  ))}
                </div>

                {!showAllSubjects && enrollmentData.assignedSubjects.length > 6 && (
                  <button
                    onClick={() => setShowAllSubjects(true)}
                    className="w-full mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Show all {enrollmentData.assignedSubjects.length} subjects →
                  </button>
                )}
                
                {showAllSubjects && enrollmentData.assignedSubjects.length > 6 && (
                  <button
                    onClick={() => setShowAllSubjects(false)}
                    className="w-full mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Show less ↑
                  </button>
                )}
              </div>

              <div className="mt-3 flex items-start space-x-2 text-xs text-purple-700 dark:text-purple-300">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                  All subjects assigned with grade placeholders for all four quarters. Teachers can now input grades.
                </p>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                <strong>Important:</strong> Save these credentials. The student must change the default password upon first login.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSuccessModal;