import React from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import StudentGradesSection from './StudentGradesSection';
import InfoField from './InfoField';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/SMS-GCA-3H/Registrar/backend/api';

const ViewApprovedModal = ({ submission, isOpen, onClose }) => {
  if (!submission) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {submission.status === 'Approved' ? 'Approved Grade Submission' : 'Grade Submission Details'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {submission.teacher} - {submission.subject}
            </p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full ${
              submission.status === 'Approved' 
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <span className={`text-sm font-semibold ${
                submission.status === 'Approved'
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-blue-800 dark:text-blue-300'
              }`}>
                {submission.status?.toUpperCase()} • {submission.gradingPeriod}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {submission.gradeLevel} - {submission.section}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Submission Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Submission Details
              </h3>
              <div className="space-y-3">
                <InfoField label="Teacher" value={submission.teacher} />
                <InfoField label="Subject" value={submission.subject || 'All Subjects'} />
                <InfoField label="Grade & Section" value={`${submission.gradeLevel} - ${submission.section}`} />
                <InfoField label="Student Count" value={submission.studentCount} />
                <InfoField label="Submitted Date" value={submission.submittedDate || submission.enrollmentDate} />
                <InfoField label="Grading Period" value={submission.gradingPeriod} />
                {submission.teacherNotes && (
                  <InfoField label="Teacher Notes" value={submission.teacherNotes} />
                )}
                {submission.registrarNotes && (
                  <InfoField label="Registrar Notes" value={submission.registrarNotes} />
                )}
              </div>
            </div>

            {/* Status Notice */}
            {submission.status === 'Approved' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 text-green-600 dark:text-green-400 i-tabler-circle-check" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-300">
                      Grades Approved
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      These grades have been finalized and approved for record-keeping.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Student Grades */}
          <StudentGradesSection 
            submission={submission}
            apiBaseUrl={API_BASE_URL}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewApprovedModal;