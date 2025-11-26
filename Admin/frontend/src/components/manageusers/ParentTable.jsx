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
import { authorizedEscortsService } from "../../services/authorizedEscortsService";

const ParentTable = forwardRef(
  ({ onSelectParent, darkMode, onParentTableRefresh }, ref) => {
    const [escorts, setEscorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("All Escorts");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
    const [selectedEscortId, setSelectedEscortId] = useState(null);
    const filterDropdownRef = useRef(null);
    const itemsPerPageRef = useRef(null);

    // Combined filter options - status and sorting in one dropdown
    const filterOptions = [
      { value: "All Escorts", label: "All Escorts" },
      { value: "Approved Only", label: "Approved Only" },
      { value: "Pending Only", label: "Pending Only" },
      { value: "Declined Only", label: "Declined Only" },
      { value: "divider", label: "divider" },
      { value: "Newest First", label: "Newest First" },
      { value: "Alphabetical (A-Z)", label: "Alphabetical (A-Z)" },
      { value: "Alphabetical (Z-A)", label: "Alphabetical (Z-A)" },
    ];

    const currentOption =
      filterOptions.find((opt) => opt.value === filterOption) ||
      filterOptions[0];

    // Expose refresh function to parent component
    useImperativeHandle(ref, () => ({
      refreshParents: fetchEscorts,
    }));

    const fetchEscorts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await authorizedEscortsService.getAuthorizedEscorts();
        console.log("Loaded escorts from API:", data.length);
        setEscorts(data);
      } catch (error) {
        console.error("Error fetching escorts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data only once on component mount
    useEffect(() => {
      fetchEscorts();
    }, []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          filterDropdownRef.current &&
          !filterDropdownRef.current.contains(event.target)
        ) {
          setIsFilterOpen(false);
        }
        if (
          itemsPerPageRef.current &&
          !itemsPerPageRef.current.contains(event.target)
        ) {
          setIsItemsPerPageOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFilterClick = (option) => {
      if (option.value === "divider") return;
      setFilterOption(option.value);
      setIsFilterOpen(false);
    };

    const handleSelectEscort = (escort) => {
      if (onSelectParent) {
        onSelectParent({
          id: escort.EscortID,
          name: escort.FullName,
          relationship: escort.RelationshipToStudent,
          contactNumber: escort.ContactNumber,
          student: `${escort.Student.FirstName} ${escort.Student.LastName}`,
          status: escort.EscortStatus,
          isActive: escort.IsActive,
        });
      }
      setSelectedEscortId(escort.EscortID);
    };

    // Function to truncate name if needed
    const truncateName = (name, maxLength = 20) => {
      if (!name) return "";
      if (name.length <= maxLength) return name;
      return name.substring(0, maxLength) + "...";
    };

    // Use hooks at the top level - not inside useMemo
    const searched = useSearch(escorts, searchTerm, [
      "FullName",
      "RelationshipToStudent",
      "Student.FirstName",
      "Student.LastName",
    ]);

    const sorted = useSort(searched, filterOption);

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
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Combined Filter Dropdown */}
            <div className="relative z-30" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors min-w-[180px] justify-between text-sm font-kumbh"
              >
                <span>{currentOption.label}</span>
                <span
                  className={`transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {isFilterOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
                  {filterOptions.map((option, index) => (
                    <div key={option.value}>
                      {option.value === "divider" ? (
                        <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                      ) : (
                        <li
                          onClick={() => handleFilterClick(option)}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-kumbh ${
                            filterOption === option.value
                              ? "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                              : "text-gray-700 dark:text-gray-300"
                          } ${index > 4 ? "text-xs text-gray-500" : ""}`}
                        >
                          {option.label}
                        </li>
                      )}
                    </div>
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
                  placeholder="Search for an escort by name or relationship"
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
              Loading authorized escorts...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            <p>Error loading authorized escorts: {error}</p>
            <button
              onClick={() => fetchEscorts()}
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
                    Full Name
                  </th>
                  <th className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[150px]">
                    Relationship
                  </th>
                  <th className="px-5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[150px]">
                    Contact Number
                  </th>
                  <th className="px-2 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[180px]">
                    Student Name
                  </th>
                  <th className="px-2 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-kumbh min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentData.map((escort, i) => (
                  <tr
                    key={escort.EscortID}
                    onClick={() => handleSelectEscort(escort)}
                    className={`cursor-pointer transition-colors ${
                      styles.rowHeight
                    } ${
                      selectedEscortId === escort.EscortID
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
                          {escort.FullName.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span
                          className="truncate max-w-[120px]"
                          title={escort.FullName}
                        >
                          {escort.FullName}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-4 ${styles.padding} ${styles.fontSize} text-gray-600 dark:text-gray-400 font-kumbh`}
                    >
                      {escort.RelationshipToStudent}
                    </td>
                    <td
                      className={`px-5 ${styles.padding} ${styles.fontSize} text-gray-600 dark:text-gray-400 font-kumbh`}
                    >
                      {escort.ContactNumber}
                    </td>
                    <td
                      className={`px-2 ${styles.padding} ${styles.fontSize} text-gray-900 dark:text-white font-kumbh`}
                    >
                      <span
                        className="truncate block max-w-[120px]"
                        title={`${escort.Student.FirstName} ${escort.Student.LastName}`}
                      >
                        {truncateName(
                          `${escort.Student.FirstName} ${escort.Student.LastName}`
                        )}
                      </span>
                    </td>
                    <td
                      className={`px-2 ${styles.padding} ${styles.fontSize} font-kumbh`}
                    >
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          escort.EscortStatus === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : escort.EscortStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {escort.EscortStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentData.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-kumbh">
                  {escorts.length === 0
                    ? "No authorized escorts found in the system."
                    : "No escorts found matching your search criteria."}
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
                  escorts
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
                      {Array.from({ length: 11 }, (_, i) => i + 5).map(
                        (num) => (
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
                        )
                      )}
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
      </div>
    );
  }
);

export default ParentTable;
