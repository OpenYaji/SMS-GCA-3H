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
import AddTeacherRecordModal from "./modals/teachers/AddTeacherRecordModal";
import teacherService from "../../services/teacherService";

const TeacherTable = forwardRef(({ onSelectTeacher, darkMode }, ref) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("All Teachers");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacherEmail, setSelectedTeacherEmail] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const sortDropdownRef = useRef(null);
  const itemsPerPageRef = useRef(null);

  const sortOptions = [
    { value: "All Teachers", label: "All Teachers" },
    { value: "Newest First", label: "Newest First" },
    { value: "Alphabetical (A-Z)", label: "Alphabetical (A-Z)" },
    { value: "Alphabetical (Z-A)", label: "Alphabetical (Z-A)" },
    { value: "Archived Teachers", label: "Archived Teachers" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

  // Check if we're viewing archived records
  const isViewingArchived = sortOption === "Archived Teachers";

  const formatName = (teacher) => {
    if (!teacher) return "";

    if (teacher.firstName || teacher.lastName) {
      const firstName = teacher.firstName || "";
      const middleName = teacher.middleName || "";
      const lastName = teacher.lastName || "";
      const suffix = teacher.suffix || "";

      let formattedName = firstName;
      if (middleName && middleName.trim() !== "") {
        formattedName += ` ${middleName.charAt(0)}.`;
      }
      formattedName += ` ${lastName}`;
      if (suffix && suffix.trim() !== "") {
        formattedName += ` ${suffix}`;
      }
      return formattedName.trim();
    }

    if (teacher.rawData?.Profile) {
      const profile = teacher.rawData.Profile;
      const firstName = profile.FirstName || "";
      const middleName = profile.MiddleName || "";
      const lastName = profile.LastName || "";
      const suffix = profile.Suffix || "";

      let formattedName = firstName;
      if (middleName && middleName.trim() !== "") {
        formattedName += ` ${middleName.charAt(0)}.`;
      }
      formattedName += ` ${lastName}`;
      if (suffix && suffix.trim() !== "") {
        formattedName += ` ${suffix}`;
      }
      return formattedName.trim();
    }

    return teacher.name || "";
  };

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch all teachers

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

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherService.getTeachers();

      if (response.teachers && Array.isArray(response.teachers)) {
        setTeachers(response.teachers);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error(" Error fetching teachers:", err);
      setError(err.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchTeachers to parent via ref
  useImperativeHandle(ref, () => ({
    refreshTeachers: fetchTeachers,
  }));

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
    setSelectedTeacherId(null);
    if (onSelectTeacher) {
      onSelectTeacher(null);
    }
  };

  const handleSelectTeacher = (teacher) => {
    onSelectTeacher?.(teacher);
    setSelectedTeacherEmail(teacher.email);
    setSelectedTeacherId(teacher.id);
  };

  // Handle when a new teacher is added
  const handleTeacherAdded = async () => {
    await fetchTeachers();
  };

  // Apply search, sort, and pagination
  const searched = useSearch(teachers, searchTerm, [
    "name",
    "email",
    "subject",
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
      {" "}
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
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors min-w-[160px] justify-between text-sm font-kumbh ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="truncate">{currentOption.label}</span>
              <span
                className={`transition-transform flex-shrink-0 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } ${isSortOpen ? "rotate-180" : ""}`}
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
                          ? "bg-yellow-600 text-white"
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
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
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
                placeholder="Search for a teacher by name, email, or subject"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none font-kumbh text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-500 focus:border-yellow-500"
                    : "border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
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

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedTeacherEmail("");
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-kumbh px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-[2px] w-full sm:w-auto justify-center text-sm flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Teacher Record
          </button>
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <div
          className={`flex justify-center items-center py-8 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span className="ml-2">Loading teachers...</span>
        </div>
      )}
      {/* Error State */}
      {error && !loading && (
        <div
          className={`p-4 text-center ${
            darkMode ? "bg-red-900 text-red-200" : "bg-red-50 text-red-600"
          }`}
        >
          <p>Error loading teachers: {error}</p>
          <button
            onClick={fetchTeachers}
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
                  className={`${
                    isViewingArchived ? "px-2" : "px-6"
                  } py-4 text-xs font-bold uppercase tracking-wider font-kumbh ${
                    isViewingArchived ? "w-10" : "w-16"
                  } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  #
                </th>
                <th
                  className={`${
                    isViewingArchived ? "px-2" : "px-4"
                  } py-4 text-xs font-bold uppercase tracking-wider font-kumbh ${
                    isViewingArchived ? "min-w-[150px]" : "min-w-[180px]"
                  } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Name
                </th>
                <th
                  className={`${
                    isViewingArchived ? "px-2" : "px-4"
                  } py-4 text-xs font-bold uppercase tracking-wider font-kumbh ${
                    isViewingArchived ? "w-24" : "w-32"
                  } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Teacher ID
                </th>
                <th
                  className={`${
                    isViewingArchived ? "px-2" : "px-4"
                  } py-4 text-xs font-bold uppercase tracking-wider font-kumbh ${
                    isViewingArchived ? "min-w-[150px]" : "min-w-[200px]"
                  } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </th>
                <th
                  className={`${
                    isViewingArchived ? "px-2" : "px-4"
                  } py-4 text-xs font-bold uppercase tracking-wider font-kumbh ${
                    isViewingArchived ? "min-w-[100px]" : "min-w-[180px]"
                  } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Subject
                </th>
                {isViewingArchived && (
                  <th
                    className={`px-2 py-4 text-xs font-bold uppercase tracking-wider font-kumbh w-24 ${
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
              {currentData.map((teacher, i) => {
                const formattedName = formatName(teacher);
                const isHeadTeacher = teacher.userType === "Head Teacher";
                return (
                  <tr
                    key={teacher.id}
                    onClick={() => handleSelectTeacher(teacher)}
                    className={`cursor-pointer transition-colors ${
                      styles.rowHeight
                    } ${
                      selectedTeacherId === teacher.id
                        ? "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-l-yellow-500"
                        : darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-yellow-50 text-gray-900"
                    }`}
                  >
                    <td
                      className={`${isViewingArchived ? "px-2" : "px-6"} ${
                        styles.padding
                      } ${styles.fontSize} font-medium font-kumbh ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td
                      className={`${isViewingArchived ? "px-1" : "px-2"} ${
                        styles.padding
                      } ${styles.fontSize} font-kumbh ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          isViewingArchived ? "gap-2" : "gap-3"
                        }`}
                      >
                        <div
                          className={`${styles.avatarSize} rounded-full flex-shrink-0 overflow-hidden`}
                        >
                          {teacher.profilePicture ? (
                            <img
                              src={teacher.profilePicture}
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
                            } ${teacher.profilePicture ? "hidden" : ""}`}
                          >
                            {formattedName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`font-medium truncate ${
                              isViewingArchived
                                ? "max-w-[100px]"
                                : "max-w-[120px]"
                            }`}
                            title={formattedName}
                          >
                            {formattedName}
                          </span>
                          {teacher.archived && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                                darkMode
                                  ? "bg-red-900 text-red-200"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Archived
                            </span>
                          )}
                          {isHeadTeacher && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                                darkMode
                                  ? "bg-purple-900 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              Head Teacher
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-5 ${styles.padding} font-kumbh ${
                        sortOption === "Archived Teachers"
                          ? "text-xs"
                          : styles.fontSize
                      } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {teacher.teacherId || teacher.id}
                    </td>
                    <td
                      className={`${isViewingArchived ? "px-1" : "px-2"} ${
                        styles.padding
                      } ${styles.fontSize} font-kumbh ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span
                        className="px-0 w-80 truncate block max-w-[160px]"
                        title={teacher.email}
                      >
                        {teacher.email}
                      </span>
                    </td>
                    <td
                      className={`${isViewingArchived ? "px-1" : "px-2"} ${
                        styles.padding
                      } ${styles.fontSize} font-kumbh ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <span
                        className="truncate block max-w-[150px]"
                        title={teacher.subject}
                      >
                        {teacher.subject}
                      </span>
                    </td>

                    {isViewingArchived && (
                      <td
                        className={`px-2 ${styles.padding} ${styles.fontSize} font-kumbh`}
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getArchiveReasonStyle(
                            teacher.accountStatus
                          )}`}
                        >
                          {teacher.accountStatus || "Inactive"}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {currentData.length === 0 && !loading && (
            <div className="text-center py-12">
              <div
                className={`text-sm font-kumbh ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {teachers.length === 0
                  ? "No teachers found in the system."
                  : sortOption === "Archived Teachers"
                  ? "No archived teachers found."
                  : "No teachers found matching your search criteria."}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Footer/Pagination*/}
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
                teachers
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
                className={`p-2 rounded-lg border transition-all duration-200 font-kumbh text-xs flex items-center gap-1 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-yellow-500 disabled:opacity-30"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-30"
                } disabled:cursor-not-allowed`}
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
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-yellow-500 disabled:opacity-30"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-30"
                } disabled:cursor-not-allowed`}
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
                          ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-yellow-500"
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
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-yellow-500 disabled:opacity-30"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-30"
                } disabled:cursor-not-allowed`}
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
                className={`p-2 rounded-lg border transition-all duration-200 font-kumbh text-xs flex items-center gap-1 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-yellow-500 disabled:opacity-30"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-30"
                } disabled:cursor-not-allowed`}
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
        <AddTeacherRecordModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          teacherEmail={selectedTeacherEmail}
          onSuccess={handleTeacherAdded}
          darkMode={darkMode}
        />
      )}
    </div>
  );
});

TeacherTable.displayName = "TeacherTable";

export default TeacherTable;
