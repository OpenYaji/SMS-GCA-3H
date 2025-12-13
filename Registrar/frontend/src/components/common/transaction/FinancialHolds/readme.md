old financialholdmodal

import React, { useState } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import NotifyParentsModal from './NotifyParentsModal';
import ExtendDeadlineModal from './ExtendDeadlineModal';
import FinancialHoldConfirmationModal from './FinancialHoldConfirmationModal';
import axios from 'axios';

const API_BASE_URL = 'http://localhost/SMS-GCA-3H/Registrar/backend/api/financial-holds';

const FinancialHoldModal = ({ student, isOpen, onClose, onActionComplete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(false);

  if (!student) return null;

  const handleAction = (type) => {
    setActionType(type);
    if (type === 'notify') {
      setShowNotifyModal(true);
    } else if (type === 'extend') {
      setShowExtendModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleNotifySend = async (emailData) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/sendNotification.php`, {
        holdId: student.transactionId || student.id,
        type: 'Email',
        email: emailData.email,
        subject: emailData.subject,
        message: emailData.message
      });

      setShowNotifyModal(false);
      if (onActionComplete) {
        onActionComplete(`Notification sent to ${student.parentGuardian}`, 'success');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      if (onActionComplete) {
        onActionComplete('Failed to send notification', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExtendDeadline = async (extensionData) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/extendDeadline.php`, {
        holdId: student.transactionId || student.id,
        newDeadline: extensionData.newDeadline,
        reason: extensionData.reason
      });

      setShowExtendModal(false);
      const daysExtension = Math.ceil((new Date(extensionData.newDeadline) - new Date()) / (1000 * 3600 * 24));
      if (onActionComplete) {
        onActionComplete(`Deadline extended by ${daysExtension} days for ${student.name}`, 'success');
      }
    } catch (error) {
      console.error('Error extending deadline:', error);
      if (onActionComplete) {
        onActionComplete('Failed to extend deadline', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (actionType !== 'clear') return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/clearHold.php`, {
        holdId: student.transactionId || student.id,
        remarks: 'Hold cleared by registrar'
      });

      setShowConfirmModal(false);
      if (onActionComplete) {
        onActionComplete(`Financial hold cleared for ${student.name}`, 'success');
      }
    } catch (error) {
      console.error('Error clearing hold:', error);
      if (onActionComplete) {
        onActionComplete('Failed to clear hold', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Cleared':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Financial Hold Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Student ID: {student.studentId}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(student.holdStatus)}`}>
                {student.holdStatus}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {student.gradeLevel} - {student.section}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Student Information
                </h3>
                <div className="space-y-3">
                  <InfoField label="Student Name" value={student.name} />
                  <InfoField label="Grade & Section" value={`${student.gradeLevel} - ${student.section}`} />
                  <InfoField label="Parent/Guardian" value={student.parentGuardian || 'N/A'} />
                  <InfoField label="Contact Number" value={student.contact || 'N/A'} />
                  <InfoField
                    label="Outstanding Balance"
                    value={student.outstandingBalance}
                    valueClassName="text-red-600 dark:text-red-400 font-semibold text-lg"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Hold Information
                </h3>
                <div className="space-y-3">
                  <InfoField label="Exam Period" value={student.examPeriod} />
                  <InfoField label="Hold Applied" value={student.holdAppliedDate || 'N/A'} />
                  <InfoField label="Payment Deadline" value={student.paymentDeadline || 'N/A'} />
                  <InfoField label="Status" value={student.holdStatus} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Hold Management
                </h3>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleAction('notify')}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Notify Parents
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAction('extend')}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Extend Deadline
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleAction('clear')}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={student.holdStatus === 'Cleared' || loading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {loading ? 'Processing...' : 'Clear Hold'}
                  </Button>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={onClose}
                className="w-full"
                disabled={loading}
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <FinancialHoldConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        student={student}
        actionType={actionType}
        loading={loading}
      />

      <NotifyParentsModal
        student={student}
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
        onSend={handleNotifySend}
        loading={loading}
      />

      <ExtendDeadlineModal
        student={student}
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        onExtend={handleExtendDeadline}
        loading={loading}
      />
    </>
  );
};

const InfoField = ({ label, value, valueClassName = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    <p className={`text-gray-800 dark:text-white ${valueClassName}`}>
      {value || 'N/A'}
    </p>
  </div>
);

export default FinancialHoldModal;