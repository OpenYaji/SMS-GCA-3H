// File: src/components/ArchiveDetailsModal.jsx (MODIFIED - Layout adjusted to 3 columns, Print/Download removed)

import React from 'react';

// Utility: Group grades by subject for table header
const getSubjects = (students) => {
    if (!students || students.length === 0) return [];
    // Get subjects from the first student, assuming all students have the same subjects
    return students[0].subjects.map(sub => ({
        id: sub.id,
        code: sub.code,
        name: sub.name,
    }));
};

// --- Custom Info Field Component (Mimicking the SubmissionDetails component's style) ---
const InfoField = ({ label, value, className = "" }) => (
    <div className={`p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 ${className}`}>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white mt-1 text-base break-words">{value || 'N/A'}</p>
    </div>
);

const ArchiveDetailsModal = ({ isOpen, onClose, submissionData, loading, error }) => {
    if (!isOpen) return null;

    const totalStudents = submissionData?.students?.length || 0;
    // Assuming passing is >= 75
    const totalPassed = submissionData?.students?.filter(s => s.average && s.average >= 75)?.length || 0; 
    const totalFailed = totalStudents - totalPassed;
    const subjects = submissionData ? getSubjects(submissionData.students) : [];

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 dark:bg-opacity-90 overflow-y-auto h-full w-full z-50 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] mx-4 overflow-hidden transform transition-transform duration-300 scale-100">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-20">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <span role="img" aria-label="Document" className="mr-3 text-indigo-500">📜</span> 
                        Archived Grade Submission Details
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-semibold transition-colors p-1"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(95vh-130px)] custom-scrollbar">
                    {loading && (
                        <div className="text-center p-10 text-indigo-600 dark:text-indigo-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 inline-block"></div>
                            <p className="mt-2 font-medium">Loading submission details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                            <p className="font-bold mb-1">Error Loading Data:</p> {error}
                        </div>
                    )}

                    {submissionData && (
                        <div className="space-y-8">
                            
                            {/* Submission Details Section (Card Style) */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-b border-indigo-300/50 dark:border-indigo-700 pb-2">
                                    General Submission Info
                                </h4>
                                {/* Binago ang grid layout para maging 3 columns (md:grid-cols-3) */}
                                {/* Changed the grid layout to be 3 columns (md:grid-cols-3) */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> 
                                    <InfoField label="Teacher" value={submissionData.submission.teacher} />
                                    <InfoField label="Grade & Section" value={`${submissionData.submission.gradeLevel} - ${submissionData.submission.sectionName}`} />
                                    <InfoField label="Grading Period" value={submissionData.submission.quarter} />
                                    <InfoField label="Status" value={submissionData.submission.status} className={submissionData.submission.status === 'Released' ? 'border-green-400' : 'border-yellow-400'}/>
                                    <InfoField label="Submitted Date" value={submissionData.submission.submittedDate} />
                                    <InfoField label="Total Students" value={submissionData.submission.totalStudents} />
                                    {/* Ginawa itong full-width (col-span-3) sa medium screens pataas */}
                                    {/* Made this full-width (col-span-3) on medium screens and up */}
                                    <InfoField label="Teacher Notes" value={submissionData.submission.teacherNotes || 'None'} className="col-span-2 md:col-span-3" />
                                </div>
                            </div>
                            
                            {/* Archive Actions Section - TINANGGAL */}
                            {/* Archive Actions Section - REMOVED */}
                            
                            {/* Student Grades Table */}
                            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b border-indigo-300/50 dark:border-indigo-700 pb-2">
                                Student Grades ({totalStudents} students)
                            </h4>
                            <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                    
                                    {/* Table Header */}
                                    <thead className="bg-indigo-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider sticky left-0 bg-indigo-100 dark:bg-gray-700 z-10 w-[150px]">Student Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Student No.</th>
                                            {subjects.map(sub => (
                                                <th key={sub.id} className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase whitespace-nowrap" title={sub.name}>
                                                    {sub.code}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase bg-indigo-600 dark:bg-indigo-900">Average</th>
                                        </tr>
                                    </thead>
                                    
                                    {/* Table Body */}
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {submissionData.students.map(student => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                                {/* Student Name (Sticky Left) */}
                                                <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700">
                                                    {student.name}
                                                </td>
                                                {/* Student Number */}
                                                <td className="px-4 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{student.studentNumber}</td>
                                                {/* Subject Grades */}
                                                {student.subjects.map(sub => (
                                                    <td key={sub.id} className={`px-4 py-2 text-center whitespace-nowrap font-medium ${sub.grade < 75 ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {sub.grade || 'INC'}
                                                    </td>
                                                ))}
                                                {/* Final Average */}
                                                <td className={`px-4 py-2 text-center whitespace-nowrap font-bold text-white ${student.average >= 75 ? 'bg-indigo-500 dark:bg-indigo-700' : 'bg-red-500 dark:bg-red-700'}`}>
                                                    {student.average || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Summary Footer (Card Style) */}
                            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-xl flex justify-around text-lg font-bold shadow-inner border border-gray-300 dark:border-gray-600">
                                <p className="text-gray-600 dark:text-gray-300">Total Students: <span className="text-xl text-indigo-600 dark:text-indigo-400">{totalStudents}</span></p>
                                <p className="text-gray-600 dark:text-gray-300">Passing: <span className="text-xl text-green-600 dark:text-green-400">{totalPassed}</span></p>
                                <p className="text-gray-600 dark:text-gray-300">Failing: <span className="text-xl text-red-600 dark:text-red-400">{totalFailed}</span></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end sticky bottom-0 bg-white dark:bg-gray-800 z-20">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors shadow-md"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArchiveDetailsModal;