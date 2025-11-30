// components/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ isVisible, action, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    let title = '';
    let message = '';
    
    if (action === 'csv') {
        title = 'Confirm CSV Export';
        message = 'Are you sure you want to export ALL filtered student data to a CSV file?';
    } else if (action === 'pdf') {
        title = 'Confirm PDF Export';
        message = 'Are you sure you want to generate a PDF of the current view? This will use your browser\'s print dialog.';
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-96">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white transition 
                            ${action === 'csv' ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        Confirm Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
