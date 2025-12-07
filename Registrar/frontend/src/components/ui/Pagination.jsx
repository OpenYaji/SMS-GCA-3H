// Pagination.jsx (MINIMAL - FIXED 10 ITEMS LOGIC - PREV/NEXT ONLY)

import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  handlePageChange 
  // REMOVED: itemsPerPage and handleItemsPerPageChange
}) => {
  
  // Only show pagination if there is more than one page
  if (totalPages <= 1) return null; 

  return (
    // REMOVE all wrapping styles (border-t, rounded-b)
    // because this is moved to the top of the table and separate from the footer.
    <div className="flex items-center space-x-2"> 
      
      {/* Page X of Y Display */}
      <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
        Page {currentPage} of {totalPages}
      </span>
      
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        title="Previous Page"
      >
        {"<"}
      </button>
      
      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        title="Next Page"
      >
        {">"}
      </button>
      
    </div>
  );
};

export default Pagination;