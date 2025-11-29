import { useState, useEffect, useRef } from "react";
import GradeLevelTabs from "../components/managegradelevels/GradeLevelTabs";
import GradeLevelTable from "../components/managegradelevels/GradeLevelTable";
import NewSchoolYearModal from "../components/managegradelevels/modals/NewSchoolYearModal";
import UpdateSchoolYearModal from "../components/managegradelevels/modals/UpdateSchoolYearModal";
import SetDeadlineModal from "../components/managegradelevels/modals/SetDeadlineModal";
import manageGradeLevelsService from "../services/manageGradeLevelsService";

export default function ManageGradeLevels() {
  const [activeTab, setActiveTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [currentSchoolYear, setCurrentSchoolYear] = useState(null);
  const [allSchoolYears, setAllSchoolYears] = useState([]);
  const [isSchoolYearDropdownOpen, setIsSchoolYearDropdownOpen] =
    useState(false);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [gradeDeadlines, setGradeDeadlines] = useState([]);
  const [currentQuarter, setCurrentQuarter] = useState(null);

  // Ref to access GradeLevelTable methods
  const gradeLevelTableRef = useRef(null);

  useEffect(() => {
    fetchSchoolYearsList();
    // Check for dark mode preference
    const isDarkMode = document.documentElement.classList.contains("dark");
    setDarkMode(isDarkMode);
  }, []);

  // Fetch deadlines whenever currentSchoolYear changes
  useEffect(() => {
    if (currentSchoolYear?.id) {
      fetchGradeDeadlines();
    }
  }, [currentSchoolYear?.id]);

  const fetchGradeDeadlines = async () => {
    try {
      if (currentSchoolYear?.id) {
        const deadlines =
          await manageGradeLevelsService.getGradeSubmissionDeadlines(
            currentSchoolYear.id
          );
        setGradeDeadlines(deadlines || []);

        // Determine current quarter based on today's date
        const today = new Date();
        const activeQuarter = deadlines.find((deadline) => {
          const startDate = new Date(deadline.startDate);
          const endDate = new Date(deadline.deadlineDate);
          return today >= startDate && today <= endDate;
        });

        setCurrentQuarter(activeQuarter || null);
      }
    } catch (error) {
      console.error("Error fetching grade deadlines:", error);
      setGradeDeadlines([]);
      setCurrentQuarter(null);
    }
  };

  const fetchSchoolYearsList = async () => {
    try {
      setIsLoading(true);
      const response = await manageGradeLevelsService.getSchoolYears({
        page: 1,
        per_page: 1,
      });

      if (response.pagination && response.pagination.year_names) {
        const schoolYearsList = Object.entries(
          response.pagination.year_names
        ).map(([page, yearName]) => ({
          page: parseInt(page),
          yearName: yearName,
        }));

        setAllSchoolYears(schoolYearsList);

        if (schoolYearsList.length > 0) {
          await fetchSchoolYearByPage(schoolYearsList[0].page);
        }
      } else {
        setAllSchoolYears([]);
      }
    } catch (error) {
      console.error("Error fetching school years list:", error);
      setError("Failed to fetch school years list");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchoolYearByPage = async (page, preserveActiveTab = false) => {
    try {
      setIsLoading(true);
      const response = await manageGradeLevelsService.getSchoolYears({
        page: page,
        per_page: 1,
      });

      if (response.schoolYears && response.schoolYears.length > 0) {
        const schoolYear = response.schoolYears[0];
        setCurrentSchoolYear(schoolYear);
        setGradeLevels(schoolYear.gradeLevels || []);

        // Only change active tab if not preserving or if no active tab set
        if (!preserveActiveTab || !activeTab) {
          if (schoolYear.gradeLevels.length > 0) {
            setActiveTab(schoolYear.gradeLevels[0].levelName);
          } else {
            setActiveTab("");
          }
        } else {
          // Check if current activeTab still exists in new data
          const tabStillExists = schoolYear.gradeLevels.some(
            (gl) => gl.levelName === activeTab
          );
          if (!tabStillExists && schoolYear.gradeLevels.length > 0) {
            setActiveTab(schoolYear.gradeLevels[0].levelName);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching school year by page:", error);
      setError("Failed to fetch school year data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSchoolYearSelect = async (schoolYearItem) => {
    setIsSchoolYearDropdownOpen(false);
    await fetchSchoolYearByPage(schoolYearItem.page);
  };

  const handleAddSchoolYear = async (schoolYearData) => {
    setIsModalOpen(false);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await fetchSchoolYearsList();
  };

  const handleSetDeadline = async (deadlineData) => {
    // Refresh deadlines after setting
    await fetchGradeDeadlines();
    setIsDeadlineModalOpen(false);
  };

  const handleSectionAdded = async () => {
    if (currentSchoolYear) {
      await fetchSchoolYearByPage(
        allSchoolYears.find((sy) => sy.yearName === currentSchoolYear.yearName)
          ?.page || 1,
        true
      );
    }
  };

  const handleUpdateSchoolYear = async (updatedData) => {
    if (currentSchoolYear && updatedData.data) {
      const updatedSchoolYear = {
        ...currentSchoolYear,
        yearName: updatedData.data.YearName || updatedData.data.yearName,
        startDate: updatedData.data.StartDate || updatedData.data.startDate,
        endDate: updatedData.data.EndDate || updatedData.data.endDate,
      };

      setCurrentSchoolYear(updatedSchoolYear);
    }

    setIsUpdateModalOpen(false);
    await fetchSchoolYearsList();
  };

  const handleAcademicYearClick = () => {
    if (currentSchoolYear) {
      setIsUpdateModalOpen(true);
    }
  };

  const isCurrentSchoolYearEditable = () => {
    if (!currentSchoolYear) return false;

    const endDate = new Date(currentSchoolYear.endDate);
    const today = new Date();
    return endDate >= today;
  };

  // Function to refresh only the GradeLevelTable data
  const handleRefreshGradeLevelTable = () => {
    if (gradeLevelTableRef.current) {
      gradeLevelTableRef.current.refreshSections();
    }
  };

  // Banner styles based on dark mode
  const bannerStyle = darkMode
    ? { background: "linear-gradient(135deg, #374151 0%, #1f2937 100%)" } //DARKMODE
    : { background: "linear-gradient(135deg, #ffbc0d 0%, #f59e0b 100%)" }; //LIGHTMODE

  // Button styles for light mode (yellow theme)
  const newAcademicYearButtonClass = darkMode
    ? "bg-white text-[#1e40af] font-spartan font-bold py-2 px-6 rounded-2xl shadow-md hover:bg-gray-50 hover:text-[#1e3a8a] hover:-translate-y-1 transform transition-all duration-200 ease-in-out whitespace-nowrap hover:shadow-lg"
    : "bg-white text-[#d97706] font-spartan font-bold py-2 px-6 rounded-2xl shadow-md hover:bg-yellow-50 hover:text-[#b45309] hover:-translate-y-1 transform transition-all duration-200 ease-in-out whitespace-nowrap hover:shadow-lg";

  const deadlineButtonClass = darkMode
    ? "bg-white text-[#1e40af] font-spartan font-bold py-2 px-6 rounded-2xl shadow-md hover:bg-gray-50 hover:text-[#1e3a8a] hover:-translate-y-1 transform transition-all duration-200 ease-in-out whitespace-nowrap hover:shadow-lg"
    : "bg-white text-[#d97706] font-spartan font-bold py-2 px-6 rounded-2xl shadow-md hover:bg-yellow-50 hover:text-[#b45309] hover:-translate-y-1 transform transition-all duration-200 ease-in-out whitespace-nowrap hover:shadow-lg";

  const dropdownButtonClass = darkMode
    ? "text-white font-regular font-spartan text-[0.9em] text-center cursor-pointer hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out group flex items-center gap-2"
    : "text-white font-regular font-spartan text-[0.9em] text-center cursor-pointer hover:bg-yellow-600/30 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out group flex items-center gap-2";

  const editButtonClass = darkMode
    ? "text-white font-regular font-spartan text-[0.9em] text-center cursor-pointer hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out group flex items-center gap-1"
    : "text-white font-regular font-spartan text-[0.9em] text-center cursor-pointer hover:bg-yellow-600/30 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out group flex items-center gap-1";

  const dropdownItemClass = (isSelected) =>
    darkMode
      ? `w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
          isSelected
            ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
            : "text-gray-700 dark:text-gray-300"
        }`
      : `w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
          isSelected ? "bg-yellow-50 text-yellow-700" : "text-gray-700"
        }`;

  if (isLoading) {
    return (
      <div className="ml-[1px] mt-1 bg-[whitesmoke] dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-kumbh">
            Loading grade levels...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-[1px] mt-1 bg-[whitesmoke] dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 font-kumbh">{error}</p>
          <button
            onClick={fetchSchoolYearsList}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-kumbh"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[1px] mt-4 bg-[whitesmoke] dark:bg-gray-900 pl-6">
      <div
        className="rounded-3xl px-8 py-3 mb-6 shadow-md flex justify-between items-center"
        style={bannerStyle}
      >
        <div>
          <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
            Manage Grade Levels
          </h1>
          <p className="text-white font-semibold font-spartan text-[1.1em] [text-shadow:2px_1px_2px_rgba(0,0,0,0.5)]">
            Here are the grade levels and their sections at Gymnazo Christian
            Academy - Novaliches
          </p>
        </div>

        <div className="flex items-start gap-4">
          {/* Set Deadline Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className={deadlineButtonClass}
            >
              Set a deadline of grades
            </button>

            {/* Current Quarter Indicator - Same style as School Year */}
            {currentQuarter && (
              <div className="flex flex-col items-center gap-2">
                <div className={dropdownButtonClass}>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white group-hover:text-yellow-100 transition-colors">
                      {currentQuarter.quarter}
                    </span>
                    <span className="text-white/90 text-xs font-normal group-hover:text-yellow-100 transition-colors">
                      Deadline: {formatShortDate(currentQuarter.deadlineDate)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDeadlineModalOpen(true)}
                  className={editButtonClass}
                  title="Edit grade deadlines"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit Deadline</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className={newAcademicYearButtonClass}
            >
              New Academic Year
            </button>

            {currentSchoolYear && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsSchoolYearDropdownOpen(!isSchoolYearDropdownOpen)
                    }
                    className={dropdownButtonClass}
                  >
                    <span className="font-bold text-white group-hover:text-yellow-100 transition-colors">
                      A.Y. {currentSchoolYear.yearName}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isSchoolYearDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isSchoolYearDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      {allSchoolYears.map((schoolYearItem) => (
                        <button
                          key={schoolYearItem.page}
                          onClick={() => handleSchoolYearSelect(schoolYearItem)}
                          className={dropdownItemClass(
                            currentSchoolYear?.yearName ===
                              schoolYearItem.yearName
                          )}
                        >
                          <div className="font-medium">
                            {schoolYearItem.yearName}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isCurrentSchoolYearEditable() && (
                  <button
                    onClick={handleAcademicYearClick}
                    className={editButtonClass}
                    title="Edit current school year"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit Current A.Y.</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {gradeLevels.length > 0 ? (
        <GradeLevelTabs
          activeTab={activeTab}
          currentSchoolYear={currentSchoolYear}
          onChange={setActiveTab}
          gradeLevels={gradeLevels}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 font-kumbh">
            No grade levels available for this school year
          </p>
        </div>
      )}

      {activeTab && (
        <div className="mt-4">
          <GradeLevelTable
            ref={gradeLevelTableRef}
            gradeLevel={activeTab}
            currentSchoolYear={currentSchoolYear}
            onRefreshData={handleRefreshGradeLevelTable}
            onSectionAdded={handleSectionAdded}
          />
        </div>
      )}

      <NewSchoolYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSchoolYear={handleAddSchoolYear}
      />

      <UpdateSchoolYearModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdateSchoolYear={handleUpdateSchoolYear}
        schoolYear={currentSchoolYear}
      />

      <SetDeadlineModal
        isOpen={isDeadlineModalOpen}
        onClose={() => setIsDeadlineModalOpen(false)}
        onSetDeadline={handleSetDeadline}
        currentSchoolYear={currentSchoolYear}
      />
    </div>
  );
}
