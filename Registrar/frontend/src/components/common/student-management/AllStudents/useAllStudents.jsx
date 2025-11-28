import { useState, useEffect, useMemo } from 'react';

const API_BASE = 'http://localhost/SMS-GCA-3H/Registrar/backend/api/students';

export const useAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    gradeLevel: '',
    section: '',
    status: '',
    search: '', // This is the search bar value
  });

  // Modal/Confirmation States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'csv' or 'pdf'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Toast
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
  });

  // --- Utility Functions ---

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  
  // --- Data Fetching (The Search Fix is here) ---

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      // Ensure all current filters are sent to the backend for accurate searching
      if (filters.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
      if (filters.section) params.append('section', filters.section);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`${API_BASE}/getAllStudents.php?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
        setError(null);
        setCurrentPage(1); // Reset to first page on new filter/search results
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

  // Fetch students whenever filters change (this is the core of the search fix)
  useEffect(() => {
    // Debounce is often used here, but for simplicity, we call fetchStudents directly
    // whenever any filter or search term changes.
    fetchStudents();
  }, [filters.gradeLevel, filters.section, filters.status, filters.search]);


  // --- Filter and Pagination Logic (Unchanged) ---

  const gradeLevels = useMemo(() => 
    [...new Set(students.map(s => s.gradeLevel).filter(Boolean))].sort(),
    [students]
  );

  const sections = useMemo(() => 
    [...new Set(students.map(s => s.section).filter(s => s !== 'Not Assigned'))].sort(),
    [students]
  );

  const statuses = useMemo(() => 
    [...new Set(students.map(s => s.status))].sort(),
    [students]
  );

  const clearFilters = () => {
    setFilters({
      gradeLevel: '',
      section: '',
      status: '',
      search: '',
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = students.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // --- Student Actions (Unchanged) ---

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  // --- Export Logic (With Confirmation) ---

  const startExportCSV = () => {
    setConfirmAction('csv');
    setShowConfirmModal(true);
  };

  const startExportPDF = () => {
    setConfirmAction('pdf');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    if (confirmAction === 'csv') {
      executeExportCSV();
    } else if (confirmAction === 'pdf') {
      executeExportPDF();
    }
    setConfirmAction(null);
  };

  const executeExportCSV = () => {
    try {
      // Create CSV content (same as before)
      const headers = ['Student Number', 'Name', 'Grade Level', 'Section', 'Status', 'Guardian', 'Contact'];
      const rows = students.map(s => [
        s.studentNumber,
        s.fullName,
        s.gradeLevel,
        s.section,
        s.status,
        s.guardianName,
        s.guardianPhone
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      showToast('Students exported to CSV successfully!', 'success');
    } catch (error) {
      showToast('Failed to export students to CSV', 'error');
    }
  };

  const executeExportPDF = () => {
    try {
      // NOTE: This uses the browser's native print dialog to save the current table view as a PDF.
      // For more complex, formatted PDF generation, you would need a library (like jsPDF)
      // or a server-side solution.
      window.print();
      showToast('Preparing PDF export...', 'info');
    } catch (error) {
       showToast('Failed to prepare PDF export', 'error');
    }
  };

  return {
    // Data
    students,
    paginatedStudents,
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
    
    // Actions
    handleViewStudent,
    handleEditStudent,
    
    // Export (now confirmation starters)
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