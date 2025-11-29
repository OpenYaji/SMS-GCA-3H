import React, { useState, useEffect } from 'react';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import ActionButtons from './ActionButtons';
import StudentsTable from './StudentsTable';
import ConfirmationModal from './ConfirmationModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EnrollmentCompletion = () => {
  // State for filters
  const [filters, setFilters] = useState({
    paymentMethod: '',
    paymentStatus: '',
    gradeLevel: ''
  });

  // State for data
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    pendingGCash: 0,
    pendingBankTransfer: 0,
    verifiedToday: 0,
    totalPending: 0
  });
  const [loading, setLoading] = useState(true);

  // State for selected students
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch payment data
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.gradeLevel) params.append('gradeLevel', filters.gradeLevel);

      const response = await axios.get(
`http://localhost/SMS-GCA-3H/Registrar/backend/api/transaction/getTransaction.php?${params.toString()}`,        { withCredentials: true }
      );

      if (response.data.success) {
        setStudents(response.data.payments || []);
        setSummary(response.data.summary || {
          pendingGCash: 0,
          pendingBankTransfer: 0,
          verifiedToday: 0,
          totalPending: 0
        });
      } else {
        toast.error(response.data.message || 'Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error loading payment data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and filter change
  useEffect(() => {
    fetchPayments();
  }, [filters]);

  // Handle individual checkbox selection
  const handleStudentSelect = (paymentId) => {
    if (selectedStudents.includes(paymentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== paymentId));
    } else {
      setSelectedStudents([...selectedStudents, paymentId]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      // Only select pending payments
      const pendingPayments = students
        .filter(s => s.status === 'Pending')
        .map(s => s.PaymentID);
      setSelectedStudents(pendingPayments);
    }
    setSelectAll(!selectAll);
  };

  // Handle view/confirm payment
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowConfirmModal(true);
  };

  // Handle confirm single payment
  const handleConfirmPayment = async (paymentId, remarks) => {
    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Registrar/backend/api/transaction/updateVerify.php',
        {
          paymentId: paymentId,
          status: 'Verified',
          remarks: remarks
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Payment verified successfully!');
        setShowConfirmModal(false);
        setSelectedPayment(null);
        fetchPayments(); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment');
    }
  };

  // Handle reject payment
  const handleRejectPayment = async (paymentId, remarks) => {
    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Registrar/backend/api/transaction/updateVerify.php',
        {
          paymentId: paymentId,
          status: 'Rejected',
          remarks: remarks
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Payment rejected');
        setShowConfirmModal(false);
        setSelectedPayment(null);
        fetchPayments(); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Error rejecting payment');
    }
  };

  // Handle bulk verify selected
  const handleVerifySelected = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one payment to verify');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/SMS-GCA-3H/Registrar/backend/api/transaction/bulkVerify.php',
        {
          paymentIds: selectedStudents
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`${selectedStudents.length} payment(s) verified successfully!`);
        setSelectedStudents([]);
        setSelectAll(false);
        fetchPayments(); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to verify payments');
      }
    } catch (error) {
      console.error('Error verifying payments:', error);
      toast.error('Error verifying payments');
    }
  };

  // Handle export list
  const handleExportList = () => {
    // Convert data to CSV
    const headers = ['Student Name', 'Grade Level', 'Payment Method', 'Amount', 'Status', 'Reference Number', 'Date'];
    const rows = students.map(s => [
      s.studentName,
      s.gradeLevel,
      s.paymentMethod,
      s.amount,
      s.status,
      s.referenceNumber || 'N/A',
      new Date(s.dateAdded).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_confirmations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Export completed!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Payment Confirmation
      </h1>
      
      <SummaryCards summary={summary} />
      
      <Filters filters={filters} setFilters={setFilters} />
      
      <ActionButtons 
        selectedCount={selectedStudents.length}
        totalCount={students.filter(s => s.status === 'Pending').length}
        onExport={handleExportList}
        onVerifySelected={handleVerifySelected}
      />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <StudentsTable 
          students={students}
          selectedStudents={selectedStudents}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          onStudentSelect={handleStudentSelect}
          onViewPayment={handleViewPayment}
        />
      )}

      {showConfirmModal && selectedPayment && (
        <ConfirmationModal
          payment={selectedPayment}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedPayment(null);
          }}
          onConfirm={handleConfirmPayment}
          onReject={handleRejectPayment}
        />
      )}
    </div>
  );
};

export default EnrollmentCompletion;