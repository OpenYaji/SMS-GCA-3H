import React from "react";

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between py-3 px-6 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-700 rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`px-3 py-2 text-sm rounded-md ${currentPage === number ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300"}`}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-700 rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}