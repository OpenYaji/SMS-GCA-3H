import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useSearch from "../utils/useSearch";
import useSort from "../utils/useSort";
import usePagination from "../utils/usePagination";
import AddGuardRecordModal from "./modals/guards/AddGuardRecordModal";
import guardService from "../../services/guardService";

// Helper function to format name with middle initial
const formatNameWithMiddleInitial = (guard) => {
  if (!guard.name) return "";

  // If we have separate name fields, use them
  if (guard.firstName || guard.lastName) {
    const firstName = guard.firstName || "";
    const middleName = guard.middleName || "";
    const lastName = guard.lastName || "";

    if (middleName) {
      const middleInitial = middleName.charAt(0).toUpperCase() + ".";
      return `${firstName} ${middleInitial} ${lastName}`.trim();
    }
    return `${firstName} ${lastName}`.trim();
  }

  // Fallback to original name parsing
  const nameParts = guard.name.split(" ").filter((part) => part.trim());
  if (nameParts.length >= 3) {
    // Assume format: First Middle Last
    const firstName = nameParts[0];
    const middleInitial = nameParts[1].charAt(0).toUpperCase() + ".";
    const lastName = nameParts.slice(2).join(" ");
    return `${firstName} ${middleInitial} ${lastName}`;
  }

  return guard.name;
};

// Helper function to get initials for avatar
const getInitials = (guard) => {
  if (guard.firstName && guard.lastName) {
    return `${guard.firstName.charAt(0)}${guard.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  // Fallback to original logic
  return guard.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const GuardTable = forwardRef(({ onSelectGuard, darkMode }, ref) => {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("All Guards");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGuardEmail, setSelectedGuardEmail] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
  const [selectedGuardId, setSelectedGuardId] = useState(null);
  const sortDropdownRef = useRef(null);
  const itemsPerPageRef = useRef(null);

  const sortOptions = [
    { value: "All Guards", label: "All Guards" },
    { value: "Newest First", label: "Newest First" },
    { value: "Alphabetical (A-Z)", label: "Alphabetical (A-Z)" },
    { value: "Alphabetical (Z-A)", label: "Alphabetical (Z-A)" },
    { value: "Archived Guards", label: "Archived Guards" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

  // Check if we're viewing archived records
  const isViewingArchived = sortOption === "Archived Guards";

  // Get archive reason badge styling
  const getArchiveReasonStyle = (accountStatus) => {
    if (accountStatus === "Suspended") {
      return darkMode
        ? "bg-red-900 text-red-200 border-red-700"
        : "bg-red-100 text-red-800 border-red-300";
    }
    // Default to Inactive styling
    return darkMode
      ? "bg-yellow-900 text-yellow-200 border-yellow-700"
      : "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  // Fetch guards from API
  const fetchGuards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await guardService.getGuards();
      if (response.guards && Array.isArray(response.guards)) {
        setGuards(response.guards);
      } else {
        setGuards([]);
      }
    } catch (err) {
      console.error("Error fetching guards:", err);
      setError(err.message);
      setGuards([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchGuards();
  }, []);

  useEffect(() => {
    if (!showAddModal) fetchGuards();
  }, [showAddModal]);

  useImperativeHandle(ref, () => ({
    refreshGuards: fetchGuards,
  }));

  // Close dropdowns when clicking outside
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

  // Sort handler
  const handleOptionClick = (option) => {
    setSortOption(option.value);
    setIsSortOpen(false);
    // Reset selected guard when filter changes
    setSelectedGuardId(null);
    if (onSelectGuard) {
      onSelectGuard(null);
    }
  };

  // Select guard
  const handleSelectGuard = (guard) => {
    onSelectGuard?.(guard);
    setSelectedGuardEmail(guard.email);
    setSelectedGuardId(guard.id);
  };

  // After new guard is added
  const handleGuardAdded = async () => {
    await fetchGuards();
    setShowAddModal(false);
  };

  // Apply search, sort, and pagination
  const searched = useSearch(guards, searchTerm, ["name", "email"]);
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
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
          {/* Sort Dropdown */}
          <div className="relative z-50" ref={sortDropdownRef}>
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
              <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[9999] py-1 max-h-60 overflow-y-auto">
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
                placeholder="Search for a guard by name, email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedGuardEmail("");
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-kumbh px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-[2px] w-full sm:w-auto justify-center text-sm flex-shrink-0"
          >
            +<span>Add Guard Record</span>
          </button>
        </div>
      </div>
      {/* Loading & Error */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading guards...
          </span>
        </div>
      )}
      {error && !loading && (
        <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
          <p>Error loading guards: {error}</p>
          <button
            onClick={fetchGuards}
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
                <th
                  className={`px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-16`}
                >
                  #
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[200px]`}
                >
                  Name
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-32`}
                >
                  Guard ID
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[250px]`}
                >
                  Email Address
                </th>
                {isViewingArchived && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh w-32">
                    Account Status
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((guard, i) => {
                const formattedName = formatNameWithMiddleInitial(guard);
                const initials = getInitials(guard);

                return (
                  <tr
                    key={guard.id}
                    onClick={() => handleSelectGuard(guard)}
                    className={`cursor-pointer transition-colors ${
                      styles.rowHeight
                    } ${
                      selectedGuardId === guard.id
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
                      className={`px-6 ${styles.padding} ${styles.fontSize} text-gray-900 dark:text-white font-kumbh`}
                    >
                      <div className={`flex items-center gap-4`}>
                        <div
                          className={`${styles.avatarSize} rounded-full flex-shrink-0 overflow-hidden`}
                        >
                          {guard.profilePicture ? (
                            <img
                              src={guard.profilePicture}
                              alt={formattedName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full flex items-center justify-center font-bold ${
                              styles.avatarText
                            } ${
                              darkMode
                                ? "bg-yellow-600 text-white"
                                : "bg-yellow-500 text-white"
                            } ${guard.profilePicture ? "hidden" : ""}`}
                          >
                            {initials}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`font-medium truncate max-w-[150px]`}
                            title={formattedName}
                          >
                            {formattedName}
                          </span>
                          {guard.archived && (
                            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0">
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 ${styles.padding} ${
                        guard.archived ? "text-xs" : styles.fontSize
                      } text-gray-600 dark:text-gray-400 font-kumbh truncate`}
                      title={guard.guardId || guard.id}
                    >
                      {guard.guardId || guard.id}
                    </td>
                    <td
                      className={`px-6 ${styles.padding} ${styles.fontSize} text-gray-600 dark:text-gray-400 font-kumbh max-w-[250px] truncate`}
                      title={guard.email}
                    >
                      <span className="truncate block" title={guard.email}>
                        {guard.email}
                      </span>
                    </td>
                    {isViewingArchived && (
                      <td
                        className={`px-6 ${styles.padding} ${styles.fontSize} font-kumbh`}
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getArchiveReasonStyle(
                            guard.accountStatus
                          )}`}
                        >
                          {guard.accountStatus || "Inactive"}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm font-kumbh">
              {sortOption === "Archived Guards"
                ? "No archived guards found."
                : "No guards found matching your search criteria."}
            </div>
          )}
        </div>
      )}
      {/* Footer/Pagination */}
      {!loading && sorted.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
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
                of <span className="font-semibold">{sorted.length}</span> guards
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
                  <ul className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
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
      {showAddModal && (
        <AddGuardRecordModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          guardEmail={selectedGuardEmail}
          onSuccess={handleGuardAdded}
          darkMode={document.documentElement.classList.contains("dark")}
        />
      )}
    </div>
  );
});

GuardTable.displayName = "GuardTable";
export default GuardTable;
