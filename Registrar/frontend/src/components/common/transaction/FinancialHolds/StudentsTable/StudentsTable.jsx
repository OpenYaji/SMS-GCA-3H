import React, { useState } from 'react';
import Modal from '../../../../ui/Modal';

const StudentsTable = ({
  students,
  selectedStudents,
  selectAll,
  onSelectStudent,
  onSelectAll,
  onViewProfile,
  currentPage,
  totalPages,
  totalStudents,
  studentsPerPage,
  onPageChange
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getStatusBadge = (status) => {
    const badges = {
      'Active': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Cleared': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getExamPeriodBadge = (period) => {
    const badges = {
      'Final': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Midterm': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Quarterly': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    };
    return badges[period] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (student) => {
    if (onViewProfile) {
      onViewProfile(student);
    }
  };

  const startIndex = (currentPage - 1) * studentsPerPage + 1;
  const endIndex = Math.min(currentPage * studentsPerPage, totalStudents);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      {/* Table Header with Pagination Info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Students with Financial Holds
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex}-{endIndex} of {totalStudents}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Grade & Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Outstanding Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Exam Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Parent/Guardian
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {students.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg font-medium">No financial holds found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => onSelectStudent(student.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {student.gradeLevel} - {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {student.outstandingBalance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getExamPeriodBadge(student.examPeriod)}`}>
                      {student.examPeriod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.holdStatus)}`}>
                      {student.holdStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{student.parentGuardian || 'N/A'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{student.contact || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewDetails(student)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;