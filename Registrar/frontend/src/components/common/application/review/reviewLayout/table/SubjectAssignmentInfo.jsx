import React from 'react';

/**
 * Component to display assigned subjects information
 * Can be used in the enrollment success modal or as a separate info panel
 */
const SubjectAssignmentInfo = ({ subjects, totalSubjects, gradeLevel }) => {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          Subjects Assigned {gradeLevel && `for ${gradeLevel}`}
        </h4>
        <span className="text-xs font-bold bg-purple-600 text-white px-2 py-1 rounded-full">
          {totalSubjects} Subjects
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-md p-3 border border-purple-100 dark:border-purple-900">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {subjects.map((subject, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-md text-xs text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
              title={subject}
            >
              <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{subject}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-start space-x-2 text-xs text-purple-700 dark:text-purple-300">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p>
          All subjects have been automatically assigned with grade placeholders for all four quarters. Teachers can now input grades throughout the school year.
        </p>
      </div>
    </div>
  );
};

export default SubjectAssignmentInfo;