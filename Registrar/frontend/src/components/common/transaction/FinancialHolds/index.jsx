import React, { useState, useMemo, useEffect } from 'react';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import ActionButtons from './ActionButtons';
import StudentsTable from './StudentsTable';
import FinancialHoldModal from './FinancialHoldModal';
import SuccessToast from '../../../ui/SuccessToast';
import axios from 'axios';

const API_BASE_URL = 'http://10.153.119.17/SMS-GCA-3H/Registrar/backend/api/financial-holds';

const FinancialHolds = () => {
  const [filters, setFilters] = useState({
    examPeriod: '',
    gradeLevel: '',
    holdStatus: ''
  });

  const [holds, setHolds] = useState([]);
  const [stats, setStats] = useState({
    activeHolds: 0,
    midtermHolds: 0,
    finalExamHolds: 0,
    clearedThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const studentsPerPage = 50;

  // Fetch financial holds from API
  useEffect(() => {
    fetchFinancialHolds();
  }, [filters]);

  const fetchFinancialHolds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.examPeriod) params.append('examPeriod', filters.examPeriod);
      if (filters.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
      if (filters.holdStatus) params.append('holdStatus', filters.holdStatus);

      const response = await axios.get(`${API_BASE_URL}/getFinancialHolds.php?${params.toString()}`);

      if (response.data.success) {
        // Transform backend data to match frontend structure
        const transformedHolds = response.data.holds.map(hold => ({
          id: hold.FinancialHoldID,
          name: hold.studentName,
          studentId: hold.studentId,
          gradeLevel: hold.gradeLevel,
          section: hold.section,
          outstandingBalance: `₱${parseFloat(hold.outstandingBalance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
          examPeriod: hold.examPeriod,
          holdStatus: hold.holdStatus,
          parentGuardian: hold.parentGuardian,
          contact: hold.contact,
          holdAppliedDate: hold.HoldAppliedDate,
          paymentDeadline: hold.PaymentDeadline,
          transactionId: hold.TransactionID
        }));

        setHolds(transformedHolds);
        setStats(response.data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching financial holds:', error);
      setToastMessage('Failed to load financial holds');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate
  const filteredStudents = useMemo(() => {
    return holds.filter(student => {
      const matchesExamPeriod = filters.examPeriod === '' || student.examPeriod === filters.examPeriod;
      const matchesGradeLevel = filters.gradeLevel === '' || student.gradeLevel === filters.gradeLevel;
      const matchesHoldStatus = filters.holdStatus === '' || student.holdStatus === filters.holdStatus;

      return matchesExamPeriod && matchesGradeLevel && matchesHoldStatus;
    });
  }, [holds, filters]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
    setSelectAll(!selectAll);
  };

  const clearFilters = () => {
    setFilters({ examPeriod: '', gradeLevel: '', holdStatus: '' });
    setSelectedStudents([]);
    setSelectAll(false);
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Generate CSV export
    const csvContent = [
      ['Student ID', 'Name', 'Grade Level', 'Outstanding Balance', 'Hold Status', 'Parent/Guardian', 'Contact'],
      ...filteredStudents.map(s => [
        s.studentId,
        s.name,
        `${s.gradeLevel} - ${s.section}`,
        s.outstandingBalance,
        s.holdStatus,
        s.parentGuardian,
        s.contact
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-holds-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    setToastMessage(`Exported ${filteredStudents.length} financial holds to CSV`);
    setToastType('success');
    setShowToast(true);
  };

  const handleUpdateHolds = () => {
    setToastMessage(`Bulk update for ${selectedStudents.length} selected students (Feature coming soon)`);
    setToastType('info');
    setShowToast(true);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseProfile = () => {
    setSelectedStudent(null);
  };

  const handleModalAction = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setSelectedStudent(null);
    // Refresh the holds list after action
    fetchFinancialHolds();
  };

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Financial Hold Management
        </h1>
        <button
          onClick={fetchFinancialHolds}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <SummaryCards stats={stats} />

      <Filters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
      />

      <ActionButtons
        selectedCount={selectedStudents.length}
        onExport={handleExport}
        onUpdateHolds={handleUpdateHolds}
      />

      <StudentsTable
        students={paginatedStudents}
        selectedStudents={selectedStudents}
        selectAll={selectAll}
        onSelectStudent={handleSelectStudent}
        onSelectAll={handleSelectAll}
        currentPage={currentPage}
        totalPages={totalPages}
        totalStudents={filteredStudents.length}
        studentsPerPage={studentsPerPage}
        onPageChange={setCurrentPage}
        onViewProfile={handleViewProfile}
      />

      <FinancialHoldModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={handleCloseProfile}
        onActionComplete={handleModalAction}
      />

      <SuccessToast
        isVisible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default FinancialHolds;