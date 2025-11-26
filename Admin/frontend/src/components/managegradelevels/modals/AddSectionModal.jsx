import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModel";
import { CheckCircle, Search, ChevronDown } from "lucide-react";
import teacherService from "../../../services/teacherService";

export default function AddSectionModal({
  isOpen = false,
  onClose = () => {},
  gradeLevel = "",
  currentSchoolYear = null,
  onAddSection = async (sectionData) => {
    console.log("Adding section:", sectionData);
    return { success: true, data: sectionData };
  },
  onSectionCreated = () => {}, // Callback to refresh sections data
}) {
  const [formData, setFormData] = useState({
    name: "",
    adviser: "",
  });
  const [sectionId, setSectionId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdSection, setCreatedSection] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate section ID based on grade level
  const generateSectionId = () => {
    const gradePrefixes = {
      "Pre-School": "SEC-PS",
      "Kinder 1": "SEC-K1",
      "Kinder 2": "SEC-K2",
      "Grade 1": "SEC-G1",
      "Grade 2": "SEC-G2",
      "Grade 3": "SEC-G3",
      "Grade 4": "SEC-G4",
      "Grade 5": "SEC-G5",
      "Grade 6": "SEC-G6",
    };

    const prefix = gradePrefixes[gradeLevel] || "SEC";
    const randomNum = Math.floor(Math.random() * 90) + 10; // 10-99
    const randomLetter = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    ); // A-Z

    return `${prefix}-${randomNum}${randomLetter}`;
  };

  // Fetch teachers from teacher service
  const fetchTeachers = async () => {
    setIsLoadingTeachers(true);
    try {
      const response = await teacherService.getTeachers();
      const activeTeachers = response.teachers.filter(
        (teacher) => !teacher.archived
      );
      setTeachers(activeTeachers);
      setFilteredTeachers(activeTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Failed to load teachers. Please try again.");
      setTeachers([]);
      setFilteredTeachers([]);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  // Filter teachers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchTerm, teachers]);

  // Reset form when modal opens/closes or grade level changes
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", adviser: "" });
      setSectionId(generateSectionId());
      setError(null);
      setCurrentStep(1);
      setCreatedSection(null);
      setSearchTerm("");
      setIsDropdownOpen(false);
      fetchTeachers();
    }
  }, [isOpen, gradeLevel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeacherSelect = (teacherId, teacherName) => {
    setFormData((prev) => ({
      ...prev,
      adviser: teacherId,
    }));
    setIsDropdownOpen(false);
    setSearchTerm(teacherName);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.adviser.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const selectedTeacher = teachers.find(
        (teacher) => teacher.id === formData.adviser
      );

      if (!selectedTeacher) {
        throw new Error("Selected teacher not found");
      }

      // Find the grade level ID from current school year
      const gradeLevelData = currentSchoolYear?.gradeLevels?.find(
        (gl) => gl.levelName === gradeLevel
      );

      if (!gradeLevelData) {
        throw new Error("Grade level not found in current school year");
      }

      const sectionData = {
        SchoolYearID: parseInt(currentSchoolYear.id),
        GradeLevelID: parseInt(gradeLevelData.id),
        AdviserTeacherID: parseInt(selectedTeacher.id),
        SectionName: formData.name.trim(),
        MaxCapacity: 15,
        CurrentEnrollment: 0,
      };

      console.log("📤 Sending section data to API:", sectionData);

      // Call the actual API through the parent component
      const result = await onAddSection(sectionData);

      if (result.success) {
        setCreatedSection({
          name: formData.name.trim(),
          id: sectionId,
          adviser: selectedTeacher.name,
          adviserId: selectedTeacher.id,
        });

        if (onSectionCreated) {
          await onSectionCreated();
        }

        // Move to success step
        setCurrentStep(2);
      } else {
        setError(result.message || "Failed to add section");
      }
    } catch (error) {
      console.error("Error adding section:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", adviser: "" });
    setError(null);
    setIsLoading(false);
    setCurrentStep(1);
    setCreatedSection(null);
    setSearchTerm("");
    setIsDropdownOpen(false);
    onClose();
  };

  const handleDone = () => {
    handleClose();
  };

  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === formData.adviser
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Step 1: Form Modal
  const renderFormStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 1}
      onClose={handleClose}
      title="Add New Section"
      width="max-w-md"
      darkBackground={true}
      scrollable={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-kumbh">
        {/* Grade Level Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Grade Level
          </label>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
            {gradeLevel}
          </div>
        </div>
        {/* Section Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name of the Section *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter section name (e.g., Buttercup, Sunflower)"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none font-kumbh bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Adviser Dropdown with Search */}
        <div className="dropdown-container">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adviser of the Section *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-white dark:bg-gray-700 text-left flex items-center justify-between text-gray-900 dark:text-white"
            >
              <span
                className={
                  selectedTeacher
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }
              >
                {selectedTeacher ? selectedTeacher.name : "Select an adviser"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Teachers List */}
                <div className="overflow-y-auto flex-1 max-h-48">
                  {isLoadingTeachers ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Loading teachers...
                    </div>
                  ) : filteredTeachers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      {searchTerm
                        ? "No teachers found"
                        : "No teachers available"}
                    </div>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() =>
                          handleTeacherSelect(teacher.id, teacher.name)
                        }
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                          formData.adviser === teacher.id
                            ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {teacher.email}
                        </div>
                        {teacher.subject && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {teacher.subject}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-kumbh"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isLoading ||
              isLoadingTeachers ||
              !formData.name ||
              !formData.adviser
            }
            className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-kumbh"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Section"
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );

  // Step 2: Success Modal
  const renderSuccessStep = () => (
    <BaseModal
      isOpen={isOpen && currentStep === 2}
      onClose={handleDone}
      title="Section Created Successfully!"
      width="max-w-sm"
      darkBackground={true}
    >
      <div className="text-center font-kumbh">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Successfully Created!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Section{" "}
          <span className="font-semibold">"{createdSection?.name}"</span> has
          been successfully created for {gradeLevel} with Section ID{" "}
          <span className="font-mono font-semibold">{createdSection?.id}</span>.
        </p>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors w-full font-kumbh"
        >
          Done
        </button>
      </div>
    </BaseModal>
  );

  return (
    <>
      {renderFormStep()}
      {renderSuccessStep()}
    </>
  );
}
