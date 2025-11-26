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
import AddRegistrarRecordModal from "./modals/registrars/AddRegistrarRecordModal";
import registrarService from "../../services/registrarService";

const RegistrarTable = forwardRef(({ onSelectRegistrar, darkMode }, ref) => {
  const [registrars, setRegistrars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("All Registrars");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRegistrarEmail, setSelectedRegistrarEmail] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
  const [selectedRegistrarId, setSelectedRegistrarId] = useState(null);
  const sortDropdownRef = useRef(null);
  const itemsPerPageRef = useRef(null);

  const sortOptions = [
    { value: "All Registrars", label: "All Registrars" },
    { value: "Newest First", label: "Newest First" },
    { value: "Alphabetical (A-Z)", label: "Alphabetical (A-Z)" },
    { value: "Alphabetical (Z-A)", label: "Alphabetical (Z-A)" },
    { value: "Archived Registrars", label: "Archived Registrars" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

  // Check if we're viewing archived records
  const isViewingArchived = sortOption === "Archived Registrars";

  // Fetch registrars from API
  const fetchRegistrars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await registrarService.getRegistrars();
      if (response.registrars && Array.isArray(response.registrars)) {
        setRegistrars(response.registrars);
      } else {
        setRegistrars([]);
      }
    } catch (err) {
      console.error("Error fetching registrars:", err);
      setError(err.message);
      setRegistrars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrars();
  }, []);

  useEffect(() => {
    if (!showAddModal) fetchRegistrars();
  }, [showAddModal]);

  useImperativeHandle(ref, () => ({
    refreshRegistrars: fetchRegistrars,
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
    // Reset selected registrar when filter changes
    setSelectedRegistrarId(null);
    if (onSelectRegistrar) {
      onSelectRegistrar(null);
    }
  };

  // Handle registrar updates
  const handleRegistrarUpdated = (updatedRegistrar) => {
    console.log("Registrar updated, refreshing table data");
    fetchRegistrars();

    if (
      onSelectRegistrar &&
      selectedRegistrarEmail === updatedRegistrar.email
    ) {
      onSelectRegistrar(updatedRegistrar);
    }
  };

  const handleSelectRegistrar = (registrar) => {
    onSelectRegistrar?.(registrar);
    setSelectedRegistrarEmail(registrar.email);
    setSelectedRegistrarId(registrar.id);
  };

  const handleRegistrarAdded = async () => {
    await fetchRegistrars();
    setShowAddModal(false);
  };

  // Function to format name with middle initial
  const formatNameWithMiddleInitial = (registrar) => {
    if (registrar.firstName || registrar.lastName) {
      const firstName = registrar.firstName || "";
      const middleName = registrar.middleName || "";
      const lastName = registrar.lastName || "";

      if (middleName && middleName.trim() !== "") {
        const middleInitial = middleName.charAt(0).toUpperCase() + ".";
        return `${firstName} ${middleInitial} ${lastName}`.trim();
      }

      return `${firstName} ${lastName}`.trim();
    }

    // Fallback to existing name if no separate name fields
    return registrar.name || "Unknown Registrar";
  };

  // Function to get avatar initials

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

  const getAvatarInitials = (registrar) => {
    const displayName = formatNameWithMiddleInitial(registrar);
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const searched = useSearch(registrars, searchTerm, [
    "name",
    "email",
    "firstName",
    "lastName",
    "middleName",
  ]);
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
      {/* Header */}
      <div
        className={`p-6 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
          {/* Sort Dropdown */}
          <div className="relative z-50" ref={sortDropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors min-w-[160px] justify-between text-sm font-kumbh ${
                darkMode
                  ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              }`}
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
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm font-kumbh ${
                      sortOption === option.value
                        ? darkMode
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-yellow-50 text-yellow-700"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-600"
                        : "text-gray-700 hover:bg-gray-50"
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
                placeholder="Search for a registrar by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedRegistrarEmail("");
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-kumbh px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-[2px] w-full sm:w-auto justify-center text-sm flex-shrink-0"
          >
            +<span>Add Registrar Record</span>
          </button>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span
            className={`ml-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Loading registrars...
          </span>
        </div>
      )}
      {error && !loading && (
        <div
          className={`p-4 text-center ${
            darkMode ? "text-red-400 bg-red-900/20" : "text-red-600 bg-red-50"
          }`}
        >
          <p>Error loading registrars: {error}</p>
          <button
            onClick={fetchRegistrars}
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
              <tr
                className={`text-left font-semibold ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <th
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider font-kumbh w-16 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  #
                </th>
                <th
                  className={`px-4 py-4 text-xs font-bold uppercase tracking-wider font-kumbh min-w-[180px] ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Name
                </th>
                <th
                  className={`px-2 py-4 text-xs font-bold uppercase tracking-wider font-kumbh w-32 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Registrar ID
                </th>
                <th
                  className={`px-2 py-4 text-xs font-bold uppercase tracking-wider font-kumbh min-w-[200px] ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address
                </th>
                {isViewingArchived && (
                  <th
                    className={`px-3 py-4 text-xs font-bold uppercase tracking-wider font-kumbh w-30 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Account Status
                  </th>
                )}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode
                  ? "bg-gray-800 divide-gray-700"
                  : "bg-white divide-gray-200"
              }`}
            >
              {currentData.map((registrar, i) => {
                const displayName = formatNameWithMiddleInitial(registrar);
                const avatarInitials = getAvatarInitials(registrar);

                return (
                  <tr
                    key={registrar.id}
                    onClick={() => handleSelectRegistrar(registrar)}
                    className={`cursor-pointer transition-colors ${
                      styles.rowHeight
                    } ${
                      selectedRegistrarId === registrar.id
                        ? "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-l-yellow-500"
                        : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-yellow-50"
                    }`}
                  >
                    <td
                      className={`px-6 ${styles.padding} ${
                        styles.fontSize
                      } font-medium font-kumbh ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td
                      className={`px-4 ${styles.padding} ${
                        styles.fontSize
                      } font-kumbh ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`${styles.avatarSize} rounded-full flex-shrink-0 overflow-hidden`}
                        >
                          {registrar.profilePicture ? (
                            <img
                              src={registrar.profilePicture}
                              alt={displayName}
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
                            } ${registrar.profilePicture ? "hidden" : ""}`}
                          >
                            {avatarInitials}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{displayName}</span>
                          {registrar.archived && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                darkMode
                                  ? "bg-red-900 text-red-200"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-4 ${styles.padding} ${
                        styles.fontSize
                      } font-kumbh ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {registrar.registrarId || registrar.id}
                    </td>
                    <td
                      className={`px-4 ${styles.padding} ${
                        styles.fontSize
                      } font-kumbh ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {registrar.email}
                    </td>

                    {isViewingArchived && (
                      <td
                        className={`px-5 ${styles.padding} ${styles.fontSize} font-kumbh`}
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getArchiveReasonStyle(
                            registrar.accountStatus
                          )}`}
                        >
                          {registrar.accountStatus || "Inactive"}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <div
              className={`text-center py-12 text-lg font-kumbh ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {sortOption === "Archived Registrars"
                ? "No archived registrars found."
                : "No registrars found matching your search criteria."}
            </div>
          )}
        </div>
      )}

      {/* Footer/Pagination */}
      {!loading && sorted.length > 0 && (
        <div
          className={`px-6 py-4 border-t ${
            darkMode
              ? "border-gray-700 bg-gray-700"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`text-sm font-kumbh ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, sorted.length)}
                </span>{" "}
                of <span className="font-semibold">{sorted.length}</span>{" "}
                registrars
              </div>

              {/* Items Per Page Dropdown */}
              <div className="relative" ref={itemsPerPageRef}>
                <button
                  onClick={() => setIsItemsPerPageOpen(!isItemsPerPageOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-kumbh transition-colors ${
                    darkMode
                      ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-gray-300"
                      : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
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
                  <ul
                    className={`absolute bottom-full left-0 mb-1 w-full border rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto ${
                      darkMode
                        ? "bg-gray-600 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {Array.from({ length: 11 }, (_, i) => i + 5).map((num) => (
                      <li
                        key={num}
                        onClick={() => {
                          updateItemsPerPage(num);
                          setIsItemsPerPageOpen(false);
                        }}
                        className={`px-3 py-1.5 cursor-pointer hover:bg-gray-50 text-sm font-kumbh ${
                          itemsPerPage === num
                            ? darkMode
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-yellow-50 text-yellow-700"
                            : darkMode
                            ? "text-gray-300 hover:bg-gray-500"
                            : "text-gray-700 hover:bg-gray-50"
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
                className={`p-2 rounded-lg border transition-all duration-200 font-kumbh text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode
                    ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:border-yellow-300"
                    : "border-gray-300 bg-white hover:bg-yellow-50 text-gray-700 hover:border-yellow-300"
                }`}
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
                className={`p-2 rounded-lg border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode
                    ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:border-yellow-300"
                    : "border-gray-300 bg-white hover:bg-yellow-50 text-gray-700 hover:border-yellow-300"
                }`}
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
                          : darkMode
                          ? "border-gray-600 bg-gray-600 text-gray-300 hover:bg-gray-500 hover:border-yellow-300"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-yellow-50 hover:border-yellow-300"
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
                className={`p-2 rounded-lg border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode
                    ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:border-yellow-300"
                    : "border-gray-300 bg-white hover:bg-yellow-50 text-gray-700 hover:border-yellow-300"
                }`}
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
                className={`p-2 rounded-lg border transition-all duration-200 font-kumbh text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode
                    ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:border-yellow-300"
                    : "border-gray-300 bg-white hover:bg-yellow-50 text-gray-700 hover:border-yellow-300"
                }`}
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

      {/* Add Registrar Modal */}
      {showAddModal && (
        <AddRegistrarRecordModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          registrarEmail={selectedRegistrarEmail}
          onRegistrarAdded={handleRegistrarAdded}
          onRegistrarUpdated={handleRegistrarUpdated}
          darkMode={darkMode}
        />
      )}
    </div>
  );
});

RegistrarTable.displayName = "RegistrarTable";
export default RegistrarTable;
