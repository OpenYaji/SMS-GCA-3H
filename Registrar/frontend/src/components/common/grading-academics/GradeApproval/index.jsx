import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import ActionButtons from './ActionButtons';
import GradesTable from './GradesTable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/SMS-GCA-3H/Registrar/backend/api';

const GradeApproval = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    submittedGrades: 0,
    approvedGrades: 0,
    pendingReview: 0,
    rejectedGrades: 0,
    totalStudents: 0
  });

  const [filters, setFilters] = useState({
    gradingPeriod: '',
    gradeLevel: '',
    status: ''
  });

  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 50;

  // Fetch submissions from API
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map frontend quarter values to database enum values
      const quarterMap = {
        'Q1': 'First Quarter',
        'Q2': 'Second Quarter',
        'Q3': 'Third Quarter',
        'Q4': 'Fourth Quarter',
        'Final': 'Final'
      };
      
      // Build query params
      const params = new URLSearchParams();
      if (filters.gradingPeriod) {
        params.append('quarter', quarterMap[filters.gradingPeriod] || filters.gradingPeriod);
      }
      if (filters.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
      if (filters.status) params.append('status', filters.status);
      
      const url = `${API_BASE_URL}/grades/get-submissions.php${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await axios.get(url, { withCredentials: true });
      
      if (response.data.success) {
        // Map database quarter values to frontend display values
        const quarterDisplayMap = {
          'First Quarter': 'Q1',
          'Second Quarter': 'Q2',
          'Third Quarter': 'Q3',
          'Fourth Quarter': 'Q4'
        };
        
        // Transform API data to match frontend structure
        const transformedData = response.data.data.map(sub => ({
          id: sub.id,
          teacher: sub.teacher || 'Unknown Teacher',
          subject: 'All Subjects',
          gradeLevel: sub.gradeLevel,
          section: sub.section,
          studentCount: sub.studentCount,
          enrollmentDate: sub.submittedDate || '-',
          gradingPeriod: sub.gradingPeriod || quarterDisplayMap[sub.quarter] || sub.quarter,
          status: sub.status,
          submittedDate: sub.submittedDate,
          teacherNotes: sub.teacherNotes,
          registrarNotes: sub.registrarNotes,
          schoolYearId: sub.schoolYearId
        }));
        
        setSubmissions(transformedData);
        
        // API returns: submittedGrades, approvedGrades, pendingReview, rejectedGrades, totalStudents
        const apiStats = response.data.stats || {};
        setStats({
          submittedGrades: apiStats.submittedGrades || 0,
          approvedGrades: apiStats.approvedGrades || 0,
          pendingReview: apiStats.pendingReview || 0,
          rejectedGrades: apiStats.rejectedGrades || 0,
          totalStudents: apiStats.totalStudents || 0
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.message || 'Failed to load grade submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Filter out approved submissions from selectable ones
  const selectableSubmissions = useMemo(() => {
    return submissions.filter(submission => submission.status !== 'Approved');
  }, [submissions]);

  // Calculate paginated submissions
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * submissionsPerPage;
    const endIndex = startIndex + submissionsPerPage;
    return submissions.slice(startIndex, endIndex);
  }, [submissions, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedSubmissions([]);
    setSelectAll(false);
  }, [filters]);

  // Summary stats directly from API
  const summaryStats = useMemo(() => {
    return {
      submittedGrades: stats.submittedGrades,
      approvedGrades: stats.approvedGrades,
      pendingReview: stats.pendingReview,
      totalStudents: stats.totalStudents
    };
  }, [stats]);

  const handleSelectSubmission = (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission && submission.status === 'Approved') {
      return;
    }

    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(selectableSubmissions.map(submission => submission.id));
    }
    setSelectAll(!selectAll);
  };

  const clearFilters = () => {
    setFilters({ gradingPeriod: '', gradeLevel: '', status: '' });
    setSelectedSubmissions([]);
    setSelectAll(false);
    setCurrentPage(1);
  };

  const handleExportGrades = () => {
    alert(`Exporting ${submissions.length} grade submissions to Excel`);
  };

  const handleApproveAll = async () => {
    if (selectedSubmissions.length === 0) {
      alert('Please select submissions to approve');
      return;
    }
    
    if (!confirm(`Are you sure you want to approve ${selectedSubmissions.length} selected grade submission(s)?`)) {
      return;
    }
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/grades/approve-all.php`,
        { submissionIds: selectedSubmissions },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert(`Successfully approved ${response.data.approvedCount} submission(s)`);
        setSelectedSubmissions([]);
        setSelectAll(false);
        fetchSubmissions();
      } else {
        throw new Error(response.data.message || 'Failed to approve submissions');
      }
    } catch (err) {
      console.error('Error approving submissions:', err);
      alert('Failed to approve submissions: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReviewSubmission = async (submissionId, action, notes = '') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/grades/review-submission.php`,
        { submissionId, action, notes },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        fetchSubmissions();
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to review submission');
      }
    } catch (err) {
      console.error('Error reviewing submission:', err);
      alert('Failed to review submission: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  // Show loading state
  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading grade submissions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4"></div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Grade Submission & Approval
      </h1>

      <SummaryCards stats={summaryStats} />
      
      <Filters 
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
      />

      <ActionButtons 
        selectedCount={selectedSubmissions.length}
        onExport={handleExportGrades}
        onApproveAll={handleApproveAll}
      />

      <GradesTable 
        submissions={paginatedSubmissions}
        selectedSubmissions={selectedSubmissions}
        selectAll={selectAll}
        onSelectSubmission={handleSelectSubmission}
        onSelectAll={handleSelectAll}
        currentPage={currentPage}
        totalPages={totalPages}
        totalSubmissions={submissions.length}
        submissionsPerPage={submissionsPerPage}
        onPageChange={setCurrentPage}
        onReviewSubmission={handleReviewSubmission}
        onRefresh={fetchSubmissions}
        apiBaseUrl={API_BASE_URL}
      />
    </div>
  );
};

export default GradeApproval;
