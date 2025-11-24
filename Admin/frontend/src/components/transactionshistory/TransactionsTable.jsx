import React, { useState, useRef, useEffect } from "react";
import useSearch from "../utils/useSearch";
import useSort from "../utils/useSort";
import usePagination from "../utils/usePagination";

const TransactionsTable = ({ transactions, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const sortDropdownRef = useRef(null);
  const itemsPerPageDropdownRef = useRef(null);

  // Sort options
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Amount (High to Low)",
    "Amount (Low to High)",
    "Alphabetical (A-Z)",
    "Alphabetical (Z-A)",
    "Fully Paid",
    "With Outstanding Balance",
  ];

  const itemsPerPageOptions = [5, 10, 15, 20, 25];

  // Search and sort data
  const searched = useSearch(transactions, searchTerm, ["user", "type", "id"]);
  const sorted = useSort(searched, sortOption);

  // Pagination with customizable items per page
  const {
    currentData: finalCurrentData,
    currentPage: finalCurrentPage,
    totalPages: finalTotalPages,
    itemsPerPage,
    goToPage: finalGoToPage,
    goToFirstPage: finalGoToFirstPage,
    goToLastPage: finalGoToLastPage,
    goToNextPage: finalGoToNextPage,
    goToPreviousPage: finalGoToPreviousPage,
    updateItemsPerPage,
  } = usePagination(sorted, 5);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target) &&
        itemsPerPageDropdownRef.current &&
        !itemsPerPageDropdownRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
        setIsItemsPerPageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format currency with proper commas
  const formatCurrency = (amount) => {
    if (typeof amount === "string" && amount.startsWith("₱")) {
      return amount;
    }

    const number = parseFloat(amount);
    if (isNaN(number)) return "₱ 0.00";

    return `₱ ${number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format balance
  const formatBalance = (balance) => {
    const number = parseFloat(balance);
    if (isNaN(number)) return `₱ 0.00`;

    return `₱ ${number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get payment status based on balance
  const getPaymentStatus = (balance) => {
    const balanceAmount = parseFloat(balance);
    if (isNaN(balanceAmount)) return "N/A";

    return balanceAmount === 0 ? "Paid" : "Partial";
  };

  const truncateTransactionType = (type, maxLength = 20) => {
    if (!type || type === "N/A") return "N/A";

    if (type.length <= maxLength) return type;

    return type.substring(0, maxLength) + "...";
  };

  const showTooltip = (content, event) => {
    if (!content || content === "N/A") return;

    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  const headers = [
    "No.",
    "Transaction ID",
    "Transaction",
    "Payments made by",
    "Date and Time",
    "Amount",
    "New Balance",
    "Status",
  ];

  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
    finalGoToPage(1);
  };

  const handleItemsPerPageClick = (option) => {
    updateItemsPerPage(option);
    setIsItemsPerPageOpen(false);
  };

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            Failed to load transactions: {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-sm transition-opacity duration-200"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          {tooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}

      {/* Filters and Search Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors min-w-[200px] justify-between text-sm"
            >
              <span>{sortOption}</span>
              <span
                className={`transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isSortOpen && (
              <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1 max-h-60 overflow-y-auto">
                {sortOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleSortOptionClick(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-sm ${
                      sortOption === option
                        ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  finalGoToPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    finalGoToPage(1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left font-semibold">
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh ${
                    index === 0 ? "pl-8" : ""
                  } ${index === headers.length - 1 ? "pr-8" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {finalCurrentData.map((transaction) => {
              const paymentStatus = getPaymentStatus(transaction.balance);
              const displayType = truncateTransactionType(transaction.type);
              const fullType = transaction.type || "N/A";
              const showTooltipForCell =
                displayType !== fullType || fullType !== "N/A";

              return (
                <tr
                  key={transaction.id}
                  className="hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white pl-8">
                    {transaction.no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {transaction.id}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white relative"
                    onMouseEnter={(e) =>
                      showTooltipForCell && showTooltip(fullType, e)
                    }
                    onMouseLeave={hideTooltip}
                    onFocus={(e) =>
                      showTooltipForCell && showTooltip(fullType, e)
                    }
                    onBlur={hideTooltip}
                  >
                    <span
                      className={`cursor-default ${
                        showTooltipForCell
                          ? "underline decoration-dotted decoration-gray-400"
                          : ""
                      }`}
                    >
                      {displayType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.user || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {transaction.date || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatBalance(transaction.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-kumbh pr-8">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        paymentStatus === "Paid"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : paymentStatus === "Partial"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {finalCurrentData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              No transactions found matching your search criteria.
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Updated with items per page selector */}
      {sorted.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items count and per page selector */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                Showing{" "}
                <span className="font-semibold">
                  {(finalCurrentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(finalCurrentPage * itemsPerPage, sorted.length)}
                </span>{" "}
                of <span className="font-semibold">{sorted.length}</span>{" "}
                transactions
              </div>

              {/* Items per page dropdown */}
              <div className="relative" ref={itemsPerPageDropdownRef}>
                <button
                  onClick={() => setIsItemsPerPageOpen(!isItemsPerPageOpen)}
                  className="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium transition-colors text-sm"
                >
                  <span>{itemsPerPage} per page</span>
                  <span
                    className={`transition-transform ${
                      isItemsPerPageOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isItemsPerPageOpen && (
                  <ul className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1 max-h-60 overflow-y-auto">
                    {itemsPerPageOptions.map((option) => (
                      <li
                        key={option}
                        onClick={() => handleItemsPerPageClick(option)}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-sm ${
                          itemsPerPage === option
                            ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {option} per page
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              {/* First Page Button */}
              <button
                onClick={finalGoToFirstPage}
                disabled={finalCurrentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-500 hover:border-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-kumbh text-xs flex items-center gap-1 text-gray-700 dark:text-gray-300"
                title="First Page"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
                First
              </button>

              {/* Previous Page Button */}
              <button
                onClick={finalGoToPreviousPage}
                disabled={finalCurrentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-500 hover:border-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-gray-700 dark:text-gray-300"
                title="Previous Page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, finalTotalPages) },
                  (_, i) => {
                    let pageNum;
                    if (finalTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (finalCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (finalCurrentPage >= finalTotalPages - 2) {
                      pageNum = finalTotalPages - 4 + i;
                    } else {
                      pageNum = finalCurrentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => finalGoToPage(pageNum)}
                        className={`min-w-[40px] h-10 rounded-lg border transition-all duration-200 font-kumbh text-sm font-medium ${
                          finalCurrentPage === pageNum
                            ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-500 hover:border-yellow-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Next Page Button */}
              <button
                onClick={finalGoToNextPage}
                disabled={finalCurrentPage === finalTotalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-500 hover:border-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-gray-700 dark:text-gray-300"
                title="Next Page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Last Page Button */}
              <button
                onClick={finalGoToLastPage}
                disabled={finalCurrentPage === finalTotalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-500 hover:border-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-kumbh text-xs flex items-center gap-1 text-gray-700 dark:text-gray-300"
                title="Last Page"
              >
                Last
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
