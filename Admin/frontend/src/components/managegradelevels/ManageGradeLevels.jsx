import { useState, useEffect, useRef } from "react";
import GradeLevelTabs from "../components/managegradelevels/GradeLevelTabs";
import GradeLevelTable from "../components/managegradelevels/GradeLevelTable";
import NewSchoolYearModal from "../components/managegradelevels/modals/NewSchoolYearModal";
import manageGradeLevelsService from "../services/manageGradeLevelsService";

export default function ManageGradeLevels() {
  const [activeTab, setActiveTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchoolYear, setCurrentSchoolYear] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const tableRef = useRef(null);

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const fetchSchoolYears = async () => {
    try {
      setIsLoading(true);
      const response = await manageGradeLevelsService.getSchoolYears();

      console.log("Grade Levels being retrieved:", response.schoolYears);

      if (response.schoolYears.length > 0) {
        const firstSchoolYear = response.schoolYears[0];
        console.log("Current School Year:", firstSchoolYear.yearName);
        console.log("Grade Levels:", firstSchoolYear.gradeLevels);

        setCurrentSchoolYear(firstSchoolYear);
        setGradeLevels(firstSchoolYear.gradeLevels || []);

        // Set the first grade level as active tab
        if (firstSchoolYear.gradeLevels.length > 0) {
          setActiveTab(firstSchoolYear.gradeLevels[0].levelName);
        }
      } else {
        console.log("No school years found in the response");
        setCurrentSchoolYear(null);
        setGradeLevels([]);
        setActiveTab("");
      }
    } catch (error) {
      setError("Failed to fetch school years data");
      console.error("Error fetching school years:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchoolYear = (schoolYearData) => {
    console.log("New school year data:", schoolYearData);
    fetchSchoolYears();
    setIsModalOpen(false);
  };

  // Section updates and refresh data
  const handleSectionUpdate = async () => {
    console.log("Section updated, refreshing all data...");
    await fetchSchoolYears();
  };

  if (isLoading) {
    return (
      <div className="ml-[1px] mt-1 bg-[whitesmoke]  min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-kumbh">
            Loading grade levels...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-[1px] mt-1 bg-[whitesmoke] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-kumbh">{error}</p>
          <button
            onClick={fetchSchoolYears}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-kumbh"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[1px] mt-1 bg-[whitesmoke] pl-6 ">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-3xl px-8 py-3 mb-6  shadow-md flex justify-between items-center">
        <div>
          <h1 className="font-spartan text-[2.5em] font-extrabold text-white mb-[0px] [text-shadow:5px_1px_2px_rgba(0,0,0,0.3)]">
            Manage Grade Levels
          </h1>
          <p className="text-white font-regular font-spartan text-[1.1em]">
            Here are the grade levels and their sections at Gymnazo Christian
            Academy - Novaliches
            {currentSchoolYear && (
              <span className="font-bold ml-2">
                ({currentSchoolYear.yearName})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-yellow-600 font-spartan font-bold py-2 px-6 rounded-2xl shadow-md hover:bg-yellow-50 hover:text-yellow-700 hover:-translate-y-1 transform transition-all duration-200 ease-in-out whitespace-nowrap hover:shadow-lg"
        >
          New Academic Year
        </button>
      </div>

      {/* Tabs */}
      {gradeLevels.length > 0 ? (
        <GradeLevelTabs
          activeTab={activeTab}
          currentSchoolYear={currentSchoolYear}
          onChange={setActiveTab}
          gradeLevels={gradeLevels}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 font-kumbh">No grade levels available</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors font-kumbh"
          >
            Create New School Year
          </button>
        </div>
      )}

      {/* Table for active tab */}
      {activeTab && (
        <div className="mt-4">
          <GradeLevelTable
            ref={tableRef}
            gradeLevel={activeTab}
            currentSchoolYear={currentSchoolYear}
            onRefreshData={handleSectionUpdate}
          />
        </div>
      )}

      {/* New School Year Modal */}
      <NewSchoolYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSchoolYear={handleAddSchoolYear}
      />
    </div>
  );
}
