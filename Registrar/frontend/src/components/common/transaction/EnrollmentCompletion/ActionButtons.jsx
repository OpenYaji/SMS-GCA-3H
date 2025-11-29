import React from 'react';
import { CheckCircle, FileDown } from 'lucide-react';

const ActionButtons = ({ selectedCount, totalCount, onExport, onVerifySelected }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount > 0 ? (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {selectedCount} of {totalCount} selected
          </span>
        ) : (
          <span>No payments selected</span>
        )}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FileDown size={18} />
          <span>Export List</span>
        </button>
        
        <button
          onClick={onVerifySelected}
          disabled={selectedCount === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            selectedCount === 0
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <CheckCircle size={18} />
          <span>Verify Selected ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;