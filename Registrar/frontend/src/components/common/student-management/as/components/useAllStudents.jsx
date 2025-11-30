import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost/SMS-GCA-3H/Registrar/backend/api/students';

export const useAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    gradeLevel: '',
    section: '',
    status: '',
    search: '', // search bar value
  });

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Toast
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => setToast({ isVisible: true, message, type });
  const hideToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  // --- Fetch all students once
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/getAllStudents.php`);
      const result = await response.json();
      if (result.success) {
        setStudents(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Filter & search on frontend (no memo)
  const filteredStudents = students.filter(s => {
    const matchesSearch = filters.search
      ? s.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.studentNumber.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesGrade = filters.gradeLevel ? s.gradeLevel === filters.gradeLevel : true;
    const matchesSection = filters.section ? s.section === filters.section : true;
    const matchesStatus = filters.status ? s.status === filters.status : true;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // --- Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const handleItemsPerPageChange = value => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ gradeLevel: '', section: '', status: '', search: '' });
    setCurrentPage(1);
  };

  // --- Student Actions
  const handleViewStudent = student => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };
  const handleEditStudent = student => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  // --- Export logic (CSV/PDF)
  const startExportCSV = () => { setConfirmAction('csv'); setShowConfirmModal(true); };
  const startExportPDF = () => { setConfirmAction('pdf'); setShowConfirmModal(true); };
  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    if (confirmAction === 'csv') executeExportCSV();
    else if (confirmAction === 'pdf') executeExportPDF();
    setConfirmAction(null);
  };
  const executeExportCSV = () => {
    const headers = ['Student Number', 'Name', 'Grade Level', 'Section', 'Status', 'Guardian', 'Contact'];
    const rows = students.map(s => [
      s.studentNumber, s.fullName, s.gradeLevel, s.section, s.status, s.guardianName, s.guardianPhone
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Students exported to CSV successfully!', 'success');
  };
  const executeExportPDF = () => { window.print(); showToast('Preparing PDF export...', 'info'); };

  // --- Filter options (no memo)
  const gradeLevels = Array.from(new Set(students.map(s => s.gradeLevel).filter(Boolean))).sort();
  const sections = Array.from(new Set(students.map(s => s.section).filter(s => s !== 'Not Assigned'))).sort();
  const statuses = Array.from(new Set(students.map(s => s.status))).sort();

  return {
    students,
    paginatedStudents,
    filteredStudents,
    loading,
    error,
    selectedStudent,

    // Filters
    filters,
    setFilters,
    gradeLevels,
    sections,
    statuses,
    clearFilters,

    // Pagination
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    startIndex,
    endIndex,

    // Modals
    showViewModal,
    showEditModal,
    setShowViewModal,
    setShowEditModal,
    handleViewStudent,
    handleEditStudent,

    // Export
    handleExportCSV: startExportCSV,
    handleExportPDF: startExportPDF,

    // Toast
    toast,
    showToast,
    hideToast,

    // Confirmation
    showConfirmModal,
    setShowConfirmModal,
    confirmAction,
    handleConfirmAction,

    // Refresh
    fetchStudents,
  };
};
