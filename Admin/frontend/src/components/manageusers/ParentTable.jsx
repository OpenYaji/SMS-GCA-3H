import { useState, useEffect, useRef } from "react";
import useSearch from "../utils/useSearch";
import useSort from "../utils/useSort";
import usePagination from "../utils/usePagination";

export default function ParentTable({ onSelectParent }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("All Parents");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParentEmail, setSelectedParentEmail] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const sortDropdownRef = useRef(null);
  const itemsPerPageRef = useRef(null);

  const sortOptions = [
    { value: "All Parents", label: "All Parents" },
    { value: "Newest First", label: "Newest First" },
    { value: "Alphabetical (A-Z)", label: "Alphabetical (A-Z)" },
    { value: "Alphabetical (Z-A)", label: "Alphabetical (Z-A)" },
    { value: "Archived Parents", label: "Archived Parents" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

  // Mock data for fallback
  const mockParents = [
    {
      id: "P-2097",
      name: "Dexter M. Morgan",
      email: "dexter.morgan@gmail.com",
      child: "Harvey S. Specter",
      outstandingBalance: 12500.75,
      paymentStatus: "pending",
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "P-1843",
      name: "Lucifer S. Morningstar",
      email: "lucifer.morningstar@gmail.com",
      child: "Donna P. Paulsen",
      outstandingBalance: 7500.25,
      paymentStatus: "partially_paid",
      createdAt: "2024-01-16T00:00:00Z",
    },
    {
      id: "P-2751",
      name: "Marty J. Byrde",
      email: "marty.byrde@gmail.com",
      child: "Mike R. Ross",
      outstandingBalance: 0,
      paymentStatus: "fully_paid",
      createdAt: "2024-01-17T00:0000Z",
    },
    {
      id: "P-3924",
      name: "Wendy A. Byrde",
      email: "wendy.byrde@gmail.com",
      child: "Tommy S. Shelby",
      outstandingBalance: 18250.0,
      paymentStatus: "pending",
      createdAt: "2024-01-18T00:00:00Z",
    },
    {
      id: "P-1669",
      name: "Mazikeen L. Smith",
      email: "mazikeen.smith@gmail.com",
      child: "Arthur J. Shelby",
      outstandingBalance: 3200.5,
      paymentStatus: "partially_paid",
      createdAt: "2024-01-19T00:00:00Z",
    },
    {
      id: "P-2185",
      name: "Debra A. Morgan",
      email: "debra.morgan@gmail.com",
      child: "Louis M. Litt",
      outstandingBalance: 8900.0,
      paymentStatus: "pending",
      createdAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "P-3317",
      name: "Chloe J. Decker",
      email: "chloe.decker@gmail.com",
      child: "Rachel L. Zane",
      outstandingBalance: 0,
      paymentStatus: "fully_paid",
      createdAt: "2024-01-21T00:00:00Z",
    },
    {
      id: "P-2748",
      name: "Angel D. Batista",
      email: "angel.batista@gmail.com",
      child: "Polly A. Gray",
      outstandingBalance: 4500.75,
      paymentStatus: "partially_paid",
      createdAt: "2024-01-22T00:00:00Z",
    },
    {
      id: "P-3921",
      name: "Amenadiel S. Morningstar",
      email: "amenadiel.morningstar@gmail.com",
      child: "Jessica L. Pearson",
      outstandingBalance: 0,
      paymentStatus: "fully_paid",
      createdAt: "2024-01-23T00:00:00Z",
    },
    {
      id: "P-1573",
      name: "Linda R. Day",
      email: "linda.day@gmail.com",
      child: "Ada T. Shelby",
      outstandingBalance: 11200.25,
      paymentStatus: "pending",
      createdAt: "2024-01-24T00:00:00Z",
    },
    {
      id: "P-2847",
      name: "James R. Doakes",
      email: "james.doakes@gmail.com",
      child: "Katrina A. Bennett",
      outstandingBalance: 6800.0,
      paymentStatus: "partially_paid",
      createdAt: "2024-01-25T00:00:00Z",
    },
    {
      id: "P-3195",
      name: "Ella L. Lopez",
      email: "ella.lopez@gmail.com",
      child: "John M. Shelby",
      outstandingBalance: 0,
      paymentStatus: "fully_paid",
      createdAt: "2024-01-26T00:00:00Z",
    },
    {
      id: "P-2673",
      name: "Maria L. LaGuerta",
      email: "maria.laguerta@gmail.com",
      child: "Grace M. Holloway",
      outstandingBalance: 9400.5,
      paymentStatus: "pending",
      createdAt: "2024-01-27T00:00:00Z",
    },
    {
      id: "P-3482",
      name: "Daniel R. Espinoza",
      email: "daniel.espinoza@gmail.com",
      child: "Finn T. Shelby",
      outstandingBalance: 0,
      paymentStatus: "fully_paid",
      createdAt: "2024-01-28T00:00:00Z",
    },
  ];

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API first
        const response = await fetch("/api/parents");

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            console.log("Loaded parents from API:", data.length);
            setParents(data);
            return;
          }
        }

        // If API fails or returns empty data, use mock data
        throw new Error("API not available or empty response");
      } catch (error) {
        console.warn("Using fallback mock data for parents:", error.message);
        console.log("Loading mock parents data:", mockParents.length);
        setParents(mockParents);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
      if (
        itemsPerPageRef.current &&
        !itemsPerPageRef.current.contains(event.target)
      ) {
        setIsItemsPerPageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSortOption(option.value);
    setIsSortOpen(false);
  };

  const handleSelectParent = (parent) => {
    if (onSelectParent) {
      onSelectParent(parent);
    }
    setSelectedParentEmail(parent.email);
    setSelectedParentId(parent.id); // NEW: Set selected parent ID
  };

  // Function to truncate email
  const truncateEmail = (email, maxLength = 20) => {
    if (!email) return "";
    if (email.length <= maxLength) return email;

    const [username, domain] = email.split("@");
    if (!domain) return email;

    const truncatedUsername =
      username.length > 12 ? username.substring(0, 12) + "..." : username;

    return `${truncatedUsername}@${domain}`;
  };

  // Function to truncate name if needed
  const truncateName = (name, maxLength = 20) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const searched = useSearch(parents, searchTerm, ["name", "email", "child"]);
  const sorted = useSort(searched, sortOption);
  const {
    currentData,
    totalPages,
    currentPage,
    itemsPerPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    updateItemsPerPage,
    getResponsiveStyles,
  } = usePagination(sorted, 5);

  const styles = getResponsiveStyles();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg font-kumbh h-fit"
      style={{ overflow: "visible" }}
    >
      {" "}
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Sort Dropdown */}
          <div className="relative z-30" ref={sortDropdownRef}>
            {" "}
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors min-w-[160px] justify-between text-sm font-kumbh"
            >
              <span>{currentOption.label}</span>
              <span
                className={`transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {isSortOpen && (
              <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
                {sortOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-kumbh ${
                      sortOption === option.value
                        ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 w-full min-w-0">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
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
                placeholder="Search for a parent by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
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
      {/* Loading & Error States */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading parents...
          </span>
        </div>
      )}
      {error && !loading && (
        <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
          <p>Error loading parents: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg"
          >
            Retry
          </button>
        </div>
      )}
      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto" style={{ overflow: "visible" }}>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left font-semibold">
                <th className="px-6 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-16">
                  #
                </th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[180px]">
                  Name
                </th>
                <th className="px-4 py-2 text-[.65rem] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-32">
                  Parent ID
                </th>
                <th className="px-5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[200px]">
                  Email
                </th>
                <th className="px-2 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[180px]">
                  Child's Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => handleSelectParent(p)}
                  className={`cursor-pointer transition-colors ${
                    styles.rowHeight
                  } ${
                    selectedParentId === p.id
                      ? "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-l-yellow-500"
                      : "hover:bg-yellow-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <td
                    className={`px-6 ${styles.padding} ${styles.fontSize} font-medium text-gray-900 dark:text-white font-kumbh`}
                  >
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td
                    className={`px-3 ${styles.padding} ${styles.fontSize} text-gray-900 dark:text-white font-kumbh`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${styles.avatarSize} bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold ${styles.avatarText} flex-shrink-0`}
                      >
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="truncate max-w-[120px]" title={p.name}>
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-4 ${styles.padding} ${styles.fontSize} text-gray-600 dark:text-gray-400 font-kumbh`}
                  >
                    {p.id}
                  </td>
                  <td
                    className={`px-5 ${styles.padding} ${styles.fontSize} text-gray-600 dark:text-gray-400 font-kumbh`}
                  >
                    <span
                      className="truncate block max-w-[140px]"
                      title={p.email}
                    >
                      {truncateEmail(p.email)}
                    </span>
                  </td>
                  <td
                    className={`px-2 ${styles.padding} ${styles.fontSize} text-gray-900 dark:text-white font-kumbh`}
                  >
                    <span
                      className="truncate block max-w-[120px]"
                      title={p.child}
                    >
                      {truncateName(p.child)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-kumbh">
                {parents.length === 0
                  ? "No parents found in the system."
                  : "No parents found matching your search criteria."}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Footer/Pagination */}
      {!loading && sorted.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, sorted.length)}
                </span>{" "}
                of <span className="font-semibold">{sorted.length}</span>{" "}
                parents
              </div>

              {/* Items Per Page Dropdown */}
              <div className="relative" ref={itemsPerPageRef}>
                <button
                  onClick={() => setIsItemsPerPageOpen(!isItemsPerPageOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-sm font-kumbh transition-colors"
                >
                  <span>{itemsPerPage} per page</span>
                  <span
                    className={`transition-transform text-xs ${
                      isItemsPerPageOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isItemsPerPageOpen && (
                  <ul className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-30 py-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 11 }, (_, i) => i + 5).map((num) => (
                      <li
                        key={num}
                        onClick={() => {
                          updateItemsPerPage(num);
                          setIsItemsPerPageOpen(false);
                        }}
                        className={`px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500 text-sm font-kumbh ${
                          itemsPerPage === num
                            ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {num} per page
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* First Page Button */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
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
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`min-w-[40px] h-10 rounded-lg border transition-all duration-200 font-kumbh text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-500 hover:border-yellow-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
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
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
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
      {/* Modals */}
      {showAddModal && (
        <AddParentRecordModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          parentEmail={selectedParentEmail}
        />
      )}
    </div>
  );
}
