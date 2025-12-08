import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/SMS-GCA-3H/Registrar/backend/api';

const GradeApprovalPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState({
    gradingPeriod: '',
    gradeLevel: '',
    status: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      const quarterMap = {
        'Q1': 'First Quarter',
        'Q2': 'Second Quarter',
        'Q3': 'Third Quarter',
        'Q4': 'Fourth Quarter'
      };
      
      const params = new URLSearchParams();
      if (filters.gradingPeriod) {
        params.append('gradingPeriod', quarterMap[filters.gradingPeriod] || filters.gradingPeriod);
      }
      if (filters.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
      if (filters.status) params.append('status', filters.status);
      
      const url = `${API_BASE_URL}/grades/get-submissions.php${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url, { withCredentials: true });
      
      if (response.data.success) {
        setSubmissions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Failed to load submissions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (submission, actionType) => {
    setSelectedSubmission(submission);
    setAction(actionType);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      setProcessing(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/grades/review-submission.php`,
        {
          submissionId: selectedSubmission.id,
          action: action,
          notes: ''
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert(response.data.message);
        setShowModal(false);
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Resubmitted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Grade Approval Dashboard</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6 border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
            value={filters.gradingPeriod}
            onChange={(e) => setFilters({...filters, gradingPeriod: e.target.value})}
          >
            <option value="">All Periods</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>

          <select 
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
            value={filters.gradeLevel}
            onChange={(e) => setFilters({...filters, gradeLevel: e.target.value})}
          >
            <option value="">All Grades</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
          </select>

          <select 
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button 
            className="bg-gray-500 hover:bg-gray-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white px-4 py-2 rounded transition-colors"
            onClick={() => setFilters({ gradingPeriod: '', gradeLevel: '', status: '' })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      {submissions.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-8 text-center border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No grade submissions found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-[#3C2F2F] dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Quarter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Submitted</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-amber-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{submission.teacher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{submission.gradeLevel} - {submission.section}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {submission.gradingPeriod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{submission.studentsWithGrades || submission.studentCount}/{submission.studentCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {submission.submittedDate ? new Date(submission.submittedDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {submission.status === 'Submitted' || submission.status === 'Resubmitted' ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleAction(submission, 'approve')}
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(submission, 'reject')}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : submission.status === 'Approved' ? (
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Approved</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {action === 'approve' ? 'Approve Submission' : 'Reject Submission'}
            </h3>
            
            <div className="mb-6 space-y-2">
              <p className="text-gray-800 dark:text-white"><strong>Teacher:</strong> {selectedSubmission.teacher}</p>
              <p className="text-gray-800 dark:text-white"><strong>Section:</strong> {selectedSubmission.gradeLevel} - {selectedSubmission.section}</p>
              <p className="text-gray-800 dark:text-white"><strong>Quarter:</strong> {selectedSubmission.gradingPeriod}</p>
              <p className="text-gray-800 dark:text-white"><strong>Students:</strong> {selectedSubmission.studentCount}</p>
              
              {action === 'approve' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Warning:</strong> Approving will lock all grades and make them available for release to students. This cannot be undone.
                  </p>
                </div>
              )}

              {action === 'reject' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>Note:</strong> Teacher will be notified to correct and resubmit grades.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmAction}
                disabled={processing}
                className={`flex-1 px-4 py-2 rounded font-medium text-white ${
                  action === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSubmission(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded font-medium hover:bg-gray-300 dark:hover:bg-slate-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeApprovalPage;