import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import useSearch from "../utils/useSearch";
import useSort from "../utils/useSort";
import usePagination from "../utils/usePagination";
import studentService from "../../services/studentService";

const StudentTable = forwardRef(
  (
    { onSelectStudent, darkMode, onSortChange, onMultipleSelectionChange },
    ref
  ) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("All Students");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isItemsPerPageOpen, setIsItemsPerPageOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
    const sortDropdownRef = useRef(null);
    const itemsPerPageRef = useRef(null);

    const sortOptions = [
      { value: "All Students", label: "All Students" },
      { value: "Newest First", label: "Newest First" },
      { value: "Alphabetical (A-Z)", label: "Alphabetical (A-Z)" },
      { value: "Alphabetical (Z-A)", label: "Alphabetical (Z-A)" },
      {
        value: "Students with No Accounts",
        label: "Students with No Accounts",
      },
      { value: "Archived Student Records", label: "Archived Student Records" },
      {
        value: "Archived Students Account",
        label: "Archived Students Account",
      },
      { value: "Students Fully Archived", label: "Students Fully Archived" },
    ];

    const currentOption =
      sortOptions.find((opt) => opt.value === sortOption) || sortOptions[0];

    // Check if we're viewing archived records
    const isViewingArchived =
      sortOption === "Archived Student Records" ||
      sortOption === "Archived Students Account" ||
      sortOption === "Students Fully Archived";

    useImperativeHandle(ref, () => ({
      refreshStudents: fetchStudents,
      clearSelection: clearSelectedStudents,
      getSelectedStudents: getSelectedStudentsData,
    }));

    const formatStudentName = (student) => {
      if (student.firstName && student.lastName) {
        const middleInitial = student.middleName
          ? ` ${student.middleName.charAt(0)}.`
          : "";
        return `${student.firstName}${middleInitial} ${student.lastName}`;
      }
      return student.name || "Unknown Student";
    };

    const fetchStudents = async (selectedSortOption = sortOption) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch students based on sort option
        let studentsResult;
        if (selectedSortOption === "Archived Students Account") {
          studentsResult = await studentService.getArchivedAccountStudents();
        } else if (selectedSortOption === "Archived Student Records") {
          studentsResult = await studentService.getArchivedRecordStudents();
        } else if (selectedSortOption === "Students Fully Archived") {
          studentsResult = await studentService.getFullyArchivedStudents();
        } else if (selectedSortOption === "Students with No Accounts") {
          studentsResult = await studentService.getStudentsWithNoAccounts();
        } else {
          studentsResult = await studentService.getStudents();
        }

        console.log(
          `Fetched ${
            studentsResult.students?.length || 0
          } students for view: ${selectedSortOption}`
        );

        // Map students and use GradeLevel and Section from the API response directly
        const formattedStudents = (studentsResult.students || []).map(
          (student) => {
            // Use the GradeLevel and Section fields from the API
            const gradeLevel =
              student.gradeLevel || student.GradeLevel || "Not Assigned";
            const section =
              student.section || student.Section || "Not Assigned";
            const gradeLevelId =
              student.gradeLevelId || student.GradeLevelID || null;
            const sectionId = student.sectionId || student.SectionID || null;

            // Create gradeSection display string
            const gradeSection =
              gradeLevel !== "Not Assigned" && section !== "Not Assigned"
                ? `${gradeLevel} - ${section}`
                : "Not Assigned";

            return {
              ...student,
              formattedName: formatStudentName(student),
              gradeSection: gradeSection,
              actualGrade: gradeLevel,
              actualSection: section,
              gradeId: gradeLevelId,
              sectionId: sectionId,
            };
          }
        );

        setStudents(formattedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchStudents();
    }, []);

    // Refetch students when sort option changes
    useEffect(() => {
      fetchStudents(sortOption);
    }, [sortOption]);

    useEffect(() => {
      setSelectedStudentId(null);
      onSelectStudent(null);

      clearSelectedStudents();
    }, [sortOption]);

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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleStudentSelection = (student, event) => {
      if (!isMultiSelectMode) {
        // Single selection mode - select student for details view
        const studentWithSection = {
          ...student,
          fullSectionName: student.gradeSection,
          section: student.actualSection || "Not Assigned",
          sectionName: student.actualSection || "Not Assigned",
          grade: student.actualGrade || "N/A",
          name: student.formattedName || student.name,
        };
        onSelectStudent(studentWithSection);
        setSelectedStudentId(student.id);
        // Clear multi-select when selecting individual student
        setSelectedStudents(new Set());
        if (onMultipleSelectionChange) {
          onMultipleSelectionChange([]);
        }
        return;
      }

      // Multi-select mode - toggle selection
      event.stopPropagation();
      const newSelectedStudents = new Set(selectedStudents);

      if (newSelectedStudents.has(student.id)) {
        newSelectedStudents.delete(student.id);
      } else {
        // Different selection logic based on current view
        if (sortOption === "Students with No Accounts") {
          // In "Students with No Accounts" view, only allow selection of students without accounts
          if (!student.hasAccount && !student.isAccountArchived) {
            newSelectedStudents.add(student.id);
          }
        } else {
          // In other views (like "All Students"), only allow selection of students WITH accounts
          // for bulk archival (they must have accounts to be archived)
          if (student.hasAccount && !student.isAccountArchived) {
            newSelectedStudents.add(student.id);
          }
        }
      }

      setSelectedStudents(newSelectedStudents);

      // Clear individual student selection when in multi-select mode
      setSelectedStudentId(null);
      onSelectStudent(null);

      // Notify parent component about selection change
      if (onMultipleSelectionChange) {
        onMultipleSelectionChange(Array.from(newSelectedStudents));
      }
    };

    // Toggle multi-select mode
    const toggleMultiSelectMode = () => {
      const newMode = !isMultiSelectMode;
      setIsMultiSelectMode(newMode);

      if (!newMode) {
        // Clear selection when exiting multi-select mode
        clearSelectedStudents();
      } else {
        // Clear individual student selection when entering multi-select mode
        setSelectedStudentId(null);
        onSelectStudent(null);
      }
    };

    // Clear all selections
    const clearSelectedStudents = () => {
      setSelectedStudents(new Set());
      if (onMultipleSelectionChange) {
        onMultipleSelectionChange([]);
      }
    };

    // Get selected students data
    const getSelectedStudentsData = () => {
      return students.filter((student) => selectedStudents.has(student.id));
    };

    const selectAllOnPage = () => {
      const selectableStudents = currentData.filter((student) => {
        if (sortOption === "Students with No Accounts") {
          // In "Students with No Accounts" view, select students without accounts
          return !student.hasAccount && !student.isAccountArchived;
        } else {
          // In other views, select students WITH accounts for bulk archival
          return student.hasAccount && !student.isAccountArchived;
        }
      });

      const newSelectedStudents = new Set(selectedStudents);
      selectableStudents.forEach((student) => {
        newSelectedStudents.add(student.id);
      });

      setSelectedStudents(newSelectedStudents);

      // Clear individual student selection
      setSelectedStudentId(null);
      onSelectStudent(null);

      if (onMultipleSelectionChange) {
        onMultipleSelectionChange(Array.from(newSelectedStudents));
      }
    };

    // Deselect all students on current page
    const deselectAllOnPage = () => {
      const newSelectedStudents = new Set(selectedStudents);
      currentData.forEach((student) => {
        newSelectedStudents.delete(student.id);
      });

      setSelectedStudents(newSelectedStudents);

      if (onMultipleSelectionChange) {
        onMultipleSelectionChange(Array.from(newSelectedStudents));
      }
    };

    const handleOptionClick = async (option) => {
      setSortOption(option.value);
      if (onSortChange) onSortChange(option.value);
      setIsSortOpen(false);
    };

    const searched = useSearch(students, searchTerm, [
      "formattedName",
      "email",
      "id",
      "studentNumber",
      "nationality",
      "gradeSection",
    ]);

    const getFilteredStudents = () => {
      return searched;
    };

    const sorted = useSort(getFilteredStudents(), sortOption);

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

    useEffect(() => {
      goToFirstPage();
    }, [sortOption]);

    // Clear selection when data changes
    useEffect(() => {
      if (isMultiSelectMode) {
        clearSelectedStudents();
      }
    }, [students]);

    // Helper function to get status badge color
    const getStatusBadgeColor = (status, darkMode) => {
      const baseClasses = "text-xs px-2 py-1 rounded-full font-medium";

      switch (status) {
        case "Withdrawn":
          return `${baseClasses} ${
            darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          }`;
        case "Graduated":
          return `${baseClasses} ${
            darkMode
              ? "bg-green-900 text-green-200"
              : "bg-green-100 text-green-800"
          }`;
        case "On Leave":
          return `${baseClasses} ${
            darkMode
              ? "bg-yellow-900 text-yellow-200"
              : "bg-yellow-100 text-yellow-800"
          }`;
        case "Inactive":
          return `${baseClasses} ${
            darkMode
              ? "bg-orange-900 text-orange-200"
              : "bg-orange-100 text-orange-800"
          }`;
        case "Suspended":
          return `${baseClasses} ${
            darkMode
              ? "bg-purple-900 text-purple-200"
              : "bg-purple-100 text-purple-800"
          }`;
        default:
          return `${baseClasses} ${
            darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"
          }`;
      }
    };

    const getCombinedArchivedBadgeColor = (darkMode) => {
      return darkMode
        ? "bg-purple-900 text-purple-200"
        : "bg-purple-100 text-purple-800";
    };

    // Determine which columns to show based on sort option
    const showArchivedRecordColumns = sortOption === "Archived Student Records";
    const showArchivedAccountColumns =
      sortOption === "Archived Students Account";
    const showFullyArchivedColumns = sortOption === "Students Fully Archived";
    const showNoAccountColumns = sortOption === "Students with No Accounts";

    const canMultiSelect =
      sortOption === "Students with No Accounts" ||
      sortOption === "All Students";

    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg font-kumbh h-fit"
        style={{ overflow: "visible" }}
      >
        {/* Header Section */}
        <div
          className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
            {/* Left side: Sort Dropdown and Multi-select Toggle */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative z-50" ref={sortDropdownRef}>
                {" "}
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center gap-2 px-14 py-2 border rounded-lg hover:bg-gray-50 transition-colors min-w-[160px] justify-between text-sm font-kumbh ${
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

              {/* Multi-select Toggle Button - Only show for relevant views */}
              {canMultiSelect && (
                <button
                  onClick={toggleMultiSelectMode}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-kumbh ${
                    isMultiSelectMode
                      ? "bg-yellow-500 border-yellow-500 text-gray-900 hover:bg-yellow-600"
                      : darkMode
                      ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                      : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                  }`}
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
                      d={
                        isMultiSelectMode ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"
                      }
                    />
                  </svg>
                  {isMultiSelectMode ? "Multi-select On" : "Multi-select"}
                </button>
              )}

              {/* Selection Actions - Only show in multi-select mode */}
              {isMultiSelectMode && selectedStudents.size > 0 && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-kumbh ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedStudents.size} selected
                  </span>
                  <button
                    onClick={clearSelectedStudents}
                    className={`px-3 py-1 text-xs border rounded transition-colors ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                        : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Clear
                  </button>
                </div>
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
                  placeholder="Search for a student by name, email, ID, or grade/section"
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
          </div>

          {/* Page Selection Controls - Only show in multi-select mode */}
          {isMultiSelectMode && currentData.length > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={selectAllOnPage}
                className={`px-3 py-1 text-xs border rounded transition-colors ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                    : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Select All on Page
              </button>
              <button
                onClick={deselectAllOnPage}
                className={`px-3 py-1 text-xs border rounded transition-colors ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                    : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Deselect All on Page
              </button>
            </div>
          )}
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div
            className={`flex justify-center items-center py-8 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-2">Loading students...</span>
          </div>
        )}
        {error && !loading && (
          <div
            className={`p-4 text-center ${
              darkMode ? "bg-red-900 text-red-200" : "bg-red-50 text-red-600"
            }`}
          >
            <p>Error loading students: {error}</p>
            <button
              onClick={() => fetchStudents(sortOption)}
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
                  {/* Selection Column - Only show in multi-select mode */}
                  {isMultiSelectMode && (
                    <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider font-kumbh w-12">
                      {/* Select All Checkbox */}
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={
                            currentData.length > 0 &&
                            currentData.every((student) => {
                              if (sortOption === "Students with No Accounts") {
                                return (
                                  selectedStudents.has(student.id) ||
                                  student.hasAccount ||
                                  student.isAccountArchived
                                );
                              } else {
                                return (
                                  selectedStudents.has(student.id) ||
                                  !student.hasAccount ||
                                  student.isAccountArchived
                                );
                              }
                            })
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              selectAllOnPage();
                            } else {
                              deselectAllOnPage();
                            }
                          }}
                          className={`w-4 h-4 rounded ${
                            darkMode
                              ? "bg-gray-600 border-gray-500 text-yellow-500"
                              : "border-gray-300 text-yellow-500"
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  <th
                    className={`${
                      isViewingArchived ? "px-2" : "px-4"
                    } py-2 text-left text-xs font-bold uppercase tracking-wider font-kumbh ${
                      isViewingArchived ? "w-10" : "w-12"
                    } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    #
                  </th>
                  <th
                    className={`${
                      isViewingArchived ? "px-1" : "px-1"
                    } py-2 text-xs font-bold uppercase tracking-wider font-kumbh ${
                      isViewingArchived ? "min-w-[120px]" : "min-w-[140px]"
                    } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Name
                  </th>
                  <th
                    className={`${
                      isViewingArchived ? "px-1" : "px-2"
                    } py-2 text-[.70rem] font-bold uppercase tracking-wider font-kumbh ${
                      isViewingArchived ? "w-20" : "w-24"
                    } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Student ID
                  </th>
                  <th
                    className={`${
                      isViewingArchived ? "px-1" : "px-2"
                    } py-2 text-xs font-bold uppercase tracking-wider font-kumbh ${
                      isViewingArchived ? "min-w-[120px]" : "min-w-[150px]"
                    } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Email
                  </th>
                  <th
                    className={`${
                      isViewingArchived ? "px-1" : "px-2"
                    } py-2 text-xs font-bold uppercase tracking-wider font-kumbh ${
                      isViewingArchived ? "min-w-[150px]" : "min-w-[180px]"
                    } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Grade & Section
                  </th>

                  {/* Combined Status Column for all archive */}
                  {(showArchivedRecordColumns ||
                    showArchivedAccountColumns ||
                    showFullyArchivedColumns) && (
                    <th
                      className={`px-2 py-2 text-xs font-bold uppercase tracking-wider font-kumbh ${
                        isViewingArchived ? "min-w-[180px]" : "min-w-[200px]"
                      } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Record and Account Status
                    </th>
                  )}

                  {/* Show Account Status column for "Students with No Accounts" view */}
                  {showNoAccountColumns && (
                    <th
                      className={`px-2 py-2 text-xs font-bold uppercase tracking-wider font-kumbh min-w-[150px] ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Account Status
                    </th>
                  )}

                  {/* Show Sex column only for non-archived views */}
                  {!isViewingArchived && !showNoAccountColumns && (
                    <th
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-kumbh w-20 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Sex
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
                {currentData.map((student, i) => {
                  const isSelected = selectedStudents.has(student.id);
                  let canSelect = false;

                  // Determine if student can be selected based on current view
                  if (sortOption === "Students with No Accounts") {
                    canSelect =
                      !student.hasAccount && !student.isAccountArchived;
                  } else {
                    canSelect =
                      student.hasAccount && !student.isAccountArchived;
                  }

                  return (
                    <tr
                      key={student.id}
                      onClick={(e) => handleStudentSelection(student, e)}
                      className={`cursor-pointer transition-colors ${
                        styles.rowHeight
                      } ${
                        // Apply different styling based on selection mode and state
                        isMultiSelectMode && isSelected
                          ? "bg-blue-100 dark:bg-blue-900 border-l-4 border-l-blue-500"
                          : selectedStudentId === student.id &&
                            !isMultiSelectMode
                          ? "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-l-yellow-500"
                          : darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-yellow-50 text-gray-900"
                      } ${
                        isMultiSelectMode && !canSelect
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {/* Selection Checkbox - Only show in multi-select mode */}
                      {isMultiSelectMode && (
                        <td
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (canSelect) {
                                  handleStudentSelection(student, e);
                                }
                              }}
                              disabled={!canSelect}
                              className={`w-4 h-4 rounded ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-yellow-500"
                                  : "border-gray-300 text-yellow-500"
                              } ${
                                !canSelect
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>
                        </td>
                      )}
                      <td
                        className={`${isViewingArchived ? "px-2" : "px-4"} ${
                          styles.padding
                        } ${styles.fontSize} font-medium font-kumbh ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td
                        className={`${isViewingArchived ? "px-1" : "px-1"} ${
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
                            {student.profilePictureURL ||
                            student.profilePicture ? (
                              <img
                                src={
                                  student.profilePictureURL ||
                                  student.profilePicture
                                }
                                alt={student.formattedName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  const fallback = e.target.nextElementSibling;
                                  if (fallback) fallback.style.display = "flex";
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
                              } ${
                                student.profilePictureURL ||
                                student.profilePicture
                                  ? "hidden"
                                  : "flex"
                              }`}
                            >
                              {student.formattedName
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
                              title={student.formattedName}
                            >
                              {student.formattedName}
                            </span>
                            {/* Combined Archived Badge - Only show for specific views */}
                            {(student.isRecordArchived ||
                              student.isAccountArchived) &&
                              sortOption !== "Archived Students Account" &&
                              sortOption !== "Students Fully Archived" && (
                                <span
                                  className={`text-xs text-center px-2 py-1 rounded-full font-medium ${getCombinedArchivedBadgeColor(
                                    darkMode
                                  )}`}
                                >
                                  {student.isRecordArchived &&
                                  student.isAccountArchived
                                    ? "Fully Archived"
                                    : student.isRecordArchived
                                    ? "Records Archived"
                                    : "Account Archived"}
                                </span>
                              )}
                          </div>
                        </div>
                      </td>
                      <td
                        className={`${isViewingArchived ? "px-1" : "px-1"} ${
                          styles.padding
                        } text-xs font-kumbh ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {student.studentNumber || student.id}
                      </td>
                      <td
                        className={`${isViewingArchived ? "px-1" : "px-1"} ${
                          styles.padding
                        } ${styles.fontSize} font-kumbh ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <span
                          className="truncate block max-w-[120px]"
                          title={student.email}
                        >
                          {student.email || "No email"}
                        </span>
                      </td>
                      <td
                        className={`${isViewingArchived ? "px-1" : "px-1"} ${
                          styles.padding
                        } ${styles.fontSize} font-kumbh ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        <span
                          className={`px-1 py-1 rounded-full text-xs ${
                            student.gradeSection === "Not Assigned"
                              ? darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-800"
                              : darkMode
                              ? "bg-blue-900 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {student.gradeSection}
                        </span>
                      </td>

                      {/* Combined Status Column Data */}
                      {(showArchivedRecordColumns ||
                        showArchivedAccountColumns ||
                        showFullyArchivedColumns) && (
                        <td
                          className={`px-2 ${styles.padding} ${styles.fontSize} font-kumbh`}
                        >
                          <div className="flex flex-col gap-1">
                            {/* Show record status for record archives and fully archived */}
                            {(showArchivedRecordColumns ||
                              showFullyArchivedColumns) && (
                              <div className="flex justify-center">
                                <span
                                  className={getStatusBadgeColor(
                                    student.status,
                                    darkMode
                                  )}
                                >
                                  Record: {student.status || "Unknown"}
                                </span>
                              </div>
                            )}
                            {/* Show account status for account archives and fully archived */}
                            {(showArchivedAccountColumns ||
                              showFullyArchivedColumns) && (
                              <div className="flex justify-center">
                                <span
                                  className={getStatusBadgeColor(
                                    student.accountStatus,
                                    darkMode
                                  )}
                                >
                                  Account: {student.accountStatus || "Unknown"}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Account Status Column for "Students with No Accounts" view */}
                      {showNoAccountColumns && (
                        <td
                          className={`px-2 ${styles.padding} ${styles.fontSize} font-kumbh`}
                        >
                          <div className="flex justify-center">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                darkMode
                                  ? "bg-orange-900 text-orange-200"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {student.accountStatus === "PendingVerification"
                                ? "No Account"
                                : student.accountStatus || "No Account"}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Show Sex data only for non-archived and non-no-account views */}
                      {!isViewingArchived && !showNoAccountColumns && (
                        <td
                          className={`px-4 ${styles.padding} ${
                            styles.fontSize
                          } font-kumbh text-center ${
                            darkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {student.sex || "N/A"}
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
                  {students.length === 0
                    ? "No students found in the system."
                    : sortOption === "Archived Student Records"
                    ? "No Archived Student Records found."
                    : sortOption === "Archived Students Account"
                    ? "No archived student accounts found."
                    : sortOption === "Students Fully Archived"
                    ? "No fully archived students found."
                    : sortOption === "Students with No Accounts"
                    ? "No students without accounts found."
                    : "No students found matching your search criteria."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer/Pagination */}
        {!loading && sorted.length > 0 && (
          <div
            className={`px-6 py-4 border-t ${
              darkMode
                ? "border-gray-700 bg-gray-800"
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
                  students
                  {isMultiSelectMode && selectedStudents.size > 0 && (
                    <span className="ml-2">
                      •{" "}
                      <span className="font-semibold text-blue-600">
                        {selectedStudents.size}
                      </span>{" "}
                      selected
                    </span>
                  )}
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
                      }
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
                      {Array.from({ length: 11 }, (_, i) => i + 5).map(
                        (num) => (
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
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
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
      </div>
    );
  }
);

export default StudentTable;
