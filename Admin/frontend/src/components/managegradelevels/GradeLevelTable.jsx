import React, {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Eye, Pencil, Plus, Check, X } from "lucide-react";
import useSearch from "../utils/useSearch";
import useSort from "../utils/useSort";
import usePagination from "../utils/usePagination";
import AddSectionModal from "./modals/AddSectionModal";
import ViewSectionModal from "./modals/ViewSectionModal";
import manageGradeLevelsService from "../../services/manageGradeLevelsService";
import teacherService from "../../services/teacherService";

const GradeLevelTable = forwardRef(
  ({ gradeLevel, currentSchoolYear, onRefreshData, onSectionAdded }, ref) => {
    const [sortOption, setSortOption] = useState("All Sections");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [editFormData, setEditFormData] = useState({
      name: "",
      adviserId: "",
    });
    const [teachers, setTeachers] = useState([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [sections, setSections] = useState([]);
    const [isLoadingSections, setIsLoadingSections] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const sortDropdownRef = React.useRef(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedViewSection, setSelectedViewSection] = useState(null);

    const sortOptions = [
      "All Sections",
      "Archived Sections",
      "Alphabetical (A-Z)",
      "Alphabetical (Z-A)",
      "Newest First",
    ];

    // Check if the current school year is editable (not past)
    const isSchoolYearEditable = useMemo(() => {
      if (!currentSchoolYear || !currentSchoolYear.endDate) return false;

      const endDate = new Date(currentSchoolYear.endDate);
      const today = new Date();
      return endDate >= today;
    }, [currentSchoolYear]);

    // GET SECTIONS
    const fetchSections = async () => {
      if (!currentSchoolYear || !gradeLevel) return;

      setIsLoadingSections(true);
      try {
        console.log(`Fetching sections for ${gradeLevel}...`);

        const gradeLevelData = currentSchoolYear.gradeLevels?.find(
          (gl) => gl.levelName === gradeLevel
        );

        if (gradeLevelData) {
          console.log(`Found grade level data:`, gradeLevelData);
          const gradeLevelSections = gradeLevelData.sections || [];

          const sectionsWithCounts = await Promise.all(
            gradeLevelSections.map(async (section, index) => {
              let adviserName = "Not Assigned";
              let adviserId = "";
              let specialization = "Not Specified";
              let profilePictureURL = null;

              if (section.AdviserName) {
                adviserName = section.AdviserName;
              } else if (section.Adviser?.name) {
                adviserName = section.Adviser.name;
              } else if (section.AdviserTeacher?.name) {
                adviserName = section.AdviserTeacher.name;
              }

              if (section.AdviserID) {
                adviserId = section.AdviserID.toString();
              } else if (section.AdviserTeacherID) {
                adviserId = section.AdviserTeacherID.toString();
              } else if (section.Adviser?.id) {
                adviserId = section.Adviser.id.toString();
              } else if (section.AdviserTeacher?.id) {
                adviserId = section.AdviserTeacher.id.toString();
              }

              if (section.rawData?.Adviser) {
                specialization =
                  section.rawData.Adviser.Specialization || "Not Specified";
                profilePictureURL = section.rawData.Adviser.ProfilePictureURL;
              }

              let studentCount = 0;
              if (section.Students || section.StudentsURL) {
                studentCount = await manageGradeLevelsService.getStudentCount(
                  section.Students || section.StudentsURL
                );
              }

              return {
                id: section.SectionID?.toString() || `SEC-${index + 1}`,
                name: section.SectionName || `Section ${index + 1}`,
                students: studentCount,
                adviser: adviserName,
                adviserId: adviserId,
                specialization: specialization,
                profilePictureURL: profilePictureURL,
                rawData: section,
              };
            })
          );

          setSections(sectionsWithCounts);
        } else {
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      } finally {
        setIsLoadingSections(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refreshSections: fetchSections,
    }));

    useEffect(() => {
      fetchSections();
    }, [gradeLevel, currentSchoolYear]);

    // GET teachers from teacher service
    const fetchTeachers = async () => {
      setIsLoadingTeachers(true);
      try {
        const response = await teacherService.getTeachers();
        const activeTeachers = response.teachers.filter(
          (teacher) => !teacher.archived
        );
        setTeachers(activeTeachers);
        console.log(`Loaded ${activeTeachers.length} active teachers`);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeachers([]);
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          sortDropdownRef.current &&
          !sortDropdownRef.current.contains(event.target)
        ) {
          setIsSortOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSortOptionClick = (option) => {
      setSortOption(option);
      setIsSortOpen(false);
    };

    const data = useMemo(() => sections, [sections]);
    const searchedData = useSearch(data, searchTerm, ["name", "adviser"]);
    const sortedData = useSort(searchedData, sortOption, "name");
    const {
      currentData,
      totalPages,
      currentPage,
      goToPage,
      goToFirstPage,
      goToLastPage,
      goToNextPage,
      goToPreviousPage,
    } = usePagination(sortedData, 5);

    // Edit section handlers
    const handleEditClick = (section) => {
      if (!isSchoolYearEditable) return; // Prevent editing if school year is past

      setEditingSection(section.id);
      setEditFormData({
        name: section.name,
        adviserId: section.adviserId || "",
      });
      fetchTeachers();
    };

    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSaveEdit = async (sectionId) => {
      if (!isSchoolYearEditable) return; // Prevent saving if school year is past

      try {
        if (!editFormData.name.trim() || !editFormData.adviserId) {
          alert("Please fill in all required fields");
          return;
        }

        setIsSaving(true);

        const originalSection = sections.find(
          (section) => section.id === sectionId
        );
        if (!originalSection) {
          throw new Error("Section not found");
        }

        const selectedTeacher = teachers.find(
          (teacher) => teacher.id === editFormData.adviserId
        );
        if (!selectedTeacher) {
          throw new Error("Selected teacher not found");
        }

        const updateData = {
          SectionName: editFormData.name.trim(),
          AdviserTeacherID: parseInt(selectedTeacher.id),
          MaxCapacity: originalSection.rawData?.MaxCapacity || 15,
          CurrentEnrollment: originalSection.rawData?.CurrentEnrollment || 0,
        };

        console.log("Updating section via API:", {
          sectionId,
          updateData,
        });

        const response = await manageGradeLevelsService.updateSection(
          sectionId,
          updateData
        );

        console.log("Section updated successfully:", response.data);

        await fetchSections();

        setEditingSection(null);
        setEditFormData({ name: "", adviserId: "" });
      } catch (error) {
        console.error(" Error updating section:", error);
        alert(`Failed to update section: ${error.message}`);
      } finally {
        setIsSaving(false);
      }
    };

    const handleCancelEdit = () => {
      setEditingSection(null);
      setEditFormData({ name: "", adviserId: "" });
    };

    const handleAddSection = async (sectionData) => {
      try {
        console.log("Adding new section via API:", sectionData);

        const response = await manageGradeLevelsService.createSection(
          sectionData
        );

        console.log("Section created successfully:", response.data);

        await fetchSections();

        return { success: true, message: "Section added successfully" };
      } catch (error) {
        console.error(" Error adding section:", error);
        throw error;
      }
    };

    const closeAddModal = () => {
      setShowAddModal(false);
    };

    const handleViewClick = (section) => {
      setSelectedViewSection(section);
      setShowViewModal(true);
    };

    const closeViewModal = () => {
      setShowViewModal(false);
      setSelectedViewSection(null);
    };

    const Tooltip = ({ children, text }) => (
      <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></div>
        </div>
      </div>
    );

    const headers = [
      "#",
      "Section Name",
      "Section ID",
      "No. of Students",
      "Adviser",
      "Actions",
    ];

    if (isLoadingSections) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden font-kumbh">
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-kumbh">
              Loading sections for {gradeLevel}...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden font-kumbh">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors min-w-[160px] justify-between text-sm font-kumbh"
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
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-kumbh ${
                        sortOption === option
                          ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
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
                  placeholder={`Search within ${gradeLevel}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
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

            {/* Add Button - Conditionally rendered */}
            {isSchoolYearEditable && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-kumbh px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-[2px] w-full sm:w-auto justify-center text-sm flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
                Add Section
              </button>
            )}
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
              {currentData.map((section, index) => (
                <tr
                  key={section.id}
                  className="hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white font-kumbh pl-8">
                    {(currentPage - 1) * 5 + index + 1}
                  </td>

                  {/* Section Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-kumbh">
                    {editingSection === section.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Section name"
                        disabled={isSaving || !isSchoolYearEditable}
                      />
                    ) : (
                      section.name
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                    {section.id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-kumbh">
                    {section.students} Students
                  </td>

                  {/* Adviser */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-kumbh">
                    {editingSection === section.id ? (
                      isLoadingTeachers ? (
                        <div className="text-gray-500 dark:text-gray-400 text-sm font-kumbh">
                          Loading teachers...
                        </div>
                      ) : (
                        <select
                          name="adviserId"
                          value={editFormData.adviserId}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-kumbh text-sm"
                          disabled={isSaving || !isSchoolYearEditable}
                        >
                          <option value="">Select an adviser</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </option>
                          ))}
                        </select>
                      )
                    ) : (
                      section.adviser
                    )}
                  </td>

                  <td className="pr-16 py-4 whitespace-nowrap text-sm font-kumbh ">
                    <div className="flex items-center justify-center gap-3">
                      {editingSection === section.id ? (
                        <>
                          {/* Save Button */}
                          {isSchoolYearEditable && (
                            <Tooltip text="Save Changes">
                              <button
                                onClick={() => handleSaveEdit(section.id)}
                                disabled={isSaving}
                                className="text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSaving ? (
                                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            </Tooltip>
                          )}

                          {/* Cancel Button */}
                          <Tooltip text="Cancel Edit">
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          {/* View Button */}
                          <Tooltip text="View Section">
                            <button
                              onClick={() => handleViewClick(section)}
                              className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Tooltip>

                          {/* Edit Button */}
                          {isSchoolYearEditable && (
                            <Tooltip text="Edit Section">
                              <button
                                onClick={() => handleEditClick(section)}
                                className="text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-all"
                                disabled={!isSchoolYearEditable}
                                title={
                                  !isSchoolYearEditable
                                    ? "Cannot edit past school years"
                                    : ""
                                }
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg font-kumbh">
                No sections found{" "}
                {sections.length === 0
                  ? `for ${gradeLevel}`
                  : "matching your search criteria"}
                .
              </div>
              {sections.length === 0 && isSchoolYearEditable && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Click "Add Section" to create the first section for this grade
                  level.
                </p>
              )}
              {sections.length === 0 && !isSchoolYearEditable && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  This school year is in the past and cannot be modified.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer/Pagination */}
        {searchedData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-kumbh">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * 5 + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * 5, searchedData.length)}
                </span>{" "}
                of <span className="font-semibold">{searchedData.length}</span>{" "}
                sections
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
        <AddSectionModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          gradeLevel={gradeLevel}
          currentSchoolYear={currentSchoolYear}
          onAddSection={handleAddSection}
          onSectionCreated={async () => {
            if (onSectionAdded) {
              await onSectionAdded();
            }
            await fetchSections();
          }}
        />

        <ViewSectionModal
          isOpen={showViewModal}
          onClose={closeViewModal}
          section={selectedViewSection}
          gradeLevel={gradeLevel}
        />
      </div>
    );
  }
);

GradeLevelTable.displayName = "GradeLevelTable";
export default GradeLevelTable;
