import React from 'react';

const SummaryCards = ({ stats }) => {
  // Helper to calculate percentage safely (avoid division by zero)
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-gray-800 dark:text-white font-semibold">Submitted Grades</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.submittedGrades || 0}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {stats.submittedGrades || 0} submission(s) pending review
        </p>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-gray-800 dark:text-white font-semibold">Approved Grades</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approvedGrades || 0}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {stats.approvedGrades || 0} submission(s) approved
        </p>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-gray-800 dark:text-white font-semibold">Pending Review</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReview || 0}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {stats.pendingReview || 0} submission(s) rejected/needs attention
        </p>
      </div>
      
      <div className="bg-[#3C2F2F] dark:bg-slate-800 p-4 rounded-lg border border-[#3C2F2F] dark:border-slate-700">
        <h3 className="text-white dark:text-white font-semibold">Total Students</h3>
        <p className="text-2xl font-bold text-white dark:text-white">{stats.totalStudents || 0}</p>
        <p className="text-xs text-amber-200 dark:text-gray-400 mt-1">
          Currently enrolled
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;