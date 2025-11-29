import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, User, DollarSign, CreditCard } from 'lucide-react';
import axios from 'axios';

const ConfirmationModal = ({ payment, onClose, onConfirm, onReject }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchPaymentDetails();
  }, [payment.PaymentID]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost/SMS-GCA-3H/Registrar/backend/api/transaction/getPaymentDetails.php?paymentId=${payment.PaymentID}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setPaymentDetails(response.data.payment);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirm = () => {
    onConfirm(payment.PaymentID, remarks);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject(payment.PaymentID, remarks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Payment Confirmation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : paymentDetails ? (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <User className="text-blue-600" size={20} />
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-800 dark:text-white">{paymentDetails.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Grade Level</p>
                    <p className="font-medium text-gray-800 dark:text-white">{paymentDetails.gradeLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">School Year</p>
                    <p className="font-medium text-gray-800 dark:text-white">{paymentDetails.schoolYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium text-gray-800 dark:text-white">{paymentDetails.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign className="text-green-600" size={20} />
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                    <p className="font-medium text-gray-800 dark:text-white">{paymentDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(paymentDetails.AmountPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reference Number</p>
                    <p className="font-medium text-gray-800 dark:text-white">{paymentDetails.ReferenceNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                    <p className="font-medium text-gray-800 dark:text-white">{formatDate(paymentDetails.PaymentDateTime)}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="text-purple-600" size={20} />
                  Transaction Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatCurrency(paymentDetails.TotalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Previously Paid</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatCurrency(paymentDetails.PaidAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Payment</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(paymentDetails.AmountPaid)}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-800 dark:text-white">Remaining Balance</span>
                    <span className="font-bold text-lg text-gray-800 dark:text-white">
                      {formatCurrency(paymentDetails.BalanceAmount - paymentDetails.AmountPaid)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remarks (Optional for verification, Required for rejection)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add any notes or comments..."
                />
              </div>

              {/* Action Buttons */}
              {paymentDetails.VerificationStatus === 'Pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleReject}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <XCircle size={20} />
                    Reject Payment
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <CheckCircle size={20} />
                    Verify Payment
                  </button>
                </div>
              )}

              {/* Already Processed Message */}
              {paymentDetails.VerificationStatus !== 'Pending' && (
                <div className={`p-4 rounded-lg ${
                  paymentDetails.VerificationStatus === 'Verified' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  <p className="font-medium">
                    This payment has already been {paymentDetails.VerificationStatus.toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Payment details not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;