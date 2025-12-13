import React, { useState } from 'react';
import GradeReviewModal from '../GradeReviewModal';
import ViewApprovedModal from '../ViewApprovedModal';
import SuccessToast from '../../../../ui/SuccessToast';

const GradesTable = ({ 
    submissions, 
    selectedSubmissions, 
    selectAll, 
    onSelectSubmission, 
    onSelectAll,
    onReviewSubmission,
    onRefresh,
    apiBaseUrl
}) => {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [isProcessing, setIsProcessing] = useState(false);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Submitted':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const handleReview = (submission) => {
        setSelectedSubmission(submission);
        setShowReviewModal(true);
    };

    const handleViewApproved = (submission) => {
        setSelectedSubmission(submission);
        setShowViewModal(true);
    };

    const handleCloseModals = () => {
        setShowReviewModal(false);
        setShowViewModal(false);
        setSelectedSubmission(null);
    };

    const handleModalAction = async (action, data) => {
        console.log(`${action} action:`, data);
        setIsProcessing(true);
        
        try {
            if (action === 'approve' && onReviewSubmission) {
                const success = await onReviewSubmission(data.id, 'approve', data.notes || '');
                if (success) {
                    setToastMessage(`Grades for ${data.teacher} - ${data.gradeLevel} ${data.section} approved successfully!`);
                    setToastType('success');
                    setShowToast(true);
                    if (onRefresh) onRefresh();
                }
            } else if (action === 'flag' || action === 'reject') {
                if (onReviewSubmission) {
                    const success = await onReviewSubmission(data.id, 'reject', data.notes || data.reason || '');
                    if (success) {
                        setToastMessage(`Grade submission flagged for review. Teacher has been notified.`);
                        setToastType('warning');
                        setShowToast(true);
                        if (onRefresh) onRefresh();
                    }
                }
            }
        } catch (error) {
            console.error('Error processing action:', error);
            setToastMessage('Failed to process action. Please try again.');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsProcessing(false);
            setShowReviewModal(false);
            setSelectedSubmission(null);
        }
    };

    const getActionButton = (submission) => {
        switch (submission.status) {
            case 'Submitted':
                return (
                    <button
                        onClick={() => handleReview(submission)}
                        className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm"
                    >
                        Review
                    </button>
                );
            case 'Approved':
                return (
                    <button
                        onClick={() => handleViewApproved(submission)}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm"
                    >
                        View
                    </button>
                );
            case 'Pending':
                return (
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium px-3 py-1">
                        Awaiting
                    </span>
                );
            case 'Rejected':
                return (
                    <button
                        onClick={() => handleReview(submission)}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm"
                    >
                        Re-review
                    </button>
                );
            default:
                return (
                    <button
                        onClick={() => handleViewApproved(submission)}
                        className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm"
                    >
                        View
                    </button>
                );
        }
    };

    // Helper to render checkbox or empty cell
    const renderCheckboxCell = (submission) => {
        if (submission.status === 'Approved') {
            // Gumamit ng consistent styling para sa non-checkbox cells
            return <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">—</td>;
        }
        
        return (
            <td className="px-4 py-3 text-center">
                <input
                    type="checkbox"
                    checked={selectedSubmissions.includes(submission.id)}
                    onChange={() => onSelectSubmission(submission.id)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 dark:bg-slate-800 dark:border-slate-600"
                />
            </td>
        );
    };

    return (
        <>
            {/* Main Table Container */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        {/* Table Header (Styled to Match) */}
                        <thead className="bg-[#3C2F2F] dark:bg-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={onSelectAll}
                                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider min-w-[180px]">Teacher</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider min-w-[120px]">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider min-w-[150px]">Grade & Section</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider min-w-[100px]">Students</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider min-w-[120px]">Enrollment Date</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider min-w-[100px]">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider min-w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400 text-lg">
                                        <div className="i-tabler-inbox-off text-4xl mb-2 mx-auto" />
                                        No grade submissions found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((submission) => (
                                    <tr 
                                        key={submission.id} 
                                        className="hover:bg-amber-50 dark:hover:bg-slate-700 transition duration-100"
                                    >
                                        {/* Checkbox/Empty Cell */}
                                        {renderCheckboxCell(submission)}
                                        
                                        {/* Data Cells */}
                                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium whitespace-nowrap">{submission.teacher}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{submission.subject}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{submission.gradeLevel} - {submission.section}</td>
                                        <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">{submission.studentCount}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{submission.enrollmentDate}</td>
                                        
                                        {/* Status Badge */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase shadow-sm ${getStatusBadge(submission.status)}`}>
                                                {submission.status}
                                            </span>
                                        </td>
                                        
                                        {/* Action Button */}
                                        <td className="px-4 py-3 text-center">
                                            {getActionButton(submission)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals and Toast */}
            <GradeReviewModal
                submission={selectedSubmission}
                isOpen={showReviewModal}
                onClose={handleCloseModals}
                onAction={handleModalAction}
                isProcessing={isProcessing}
                apiBaseUrl={apiBaseUrl}
            />

            <ViewApprovedModal
                submission={selectedSubmission}
                isOpen={showViewModal}
                onClose={handleCloseModals}
            />

            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default GradesTable;