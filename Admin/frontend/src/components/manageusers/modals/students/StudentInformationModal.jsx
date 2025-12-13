import { useState, useEffect } from "react";
import StudentScheduleModal from "../students/StudentAttendanceModal";
import StudentGradesModal from "./StudentGradesModal";
import StudentAttendanceModal from "./StudentAttendanceModal";
import studentService from "../../../../services/studentService";
import { useLocationData } from "../../../../hooks/useLocationData";
import AddressFields from "../../../../components/common/AddressFields";
import psgcService from "../../../../services/psgcService";
import manageGradeLevelsService from "../../../../services/manageGradeLevelsService";
import inputValidation from "../../../utils/inputValidation";
import {
  Check,
  X,
  Loader,
  MapPin,
  ChevronDown,
  AlertCircle,
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  Home,
  Calendar,
  Scale,
  Ruler,
  Heart,
  Users,
  Contact,
  Camera,
  BookOpen,
  ClipboardList,
  Shield,
  UserCheck,
} from "lucide-react";

const EditableInfoRow = ({
  label,
  value,
  field,
  isEditing = false,
  type = "text",
  onValueChange,
  className = "",
  options,
  loading,
  disabled,
  error,
  required = true,
  placeholder = "",
  icon: Icon,
  darkMode = false,
  validationType = "text",
}) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;

    // Apply input validation based on type
    if (validationType === "numeric") {
      newValue = inputValidation.allowOnlyNumbers(newValue);
    } else if (validationType === "name") {
      newValue = inputValidation.allowOnlyLetters(newValue);
    } else if (validationType === "phone") {
      newValue = inputValidation.handleEnhancedPhoneInput(e);
    }

    onValueChange(field, newValue);
  };

  const handleBlur = (e) => {
    if (type === "tel" && validationType === "phone" && value) {
      const formatted = inputValidation.formatPhoneNumber(value);
      onValueChange(field, formatted);
    }
  };

  return (
    <div className={`${className}`}>
      <span
        className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
          darkMode ? "text-gray-300" : "text-gray-500"
        }`}
      >
        {label}
        {!required && (
          <span
            className={`text-sm ml-1 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            (optional)
          </span>
        )}
      </span>
      {isEditing && type === "select" ? (
        <div className="relative">
          {Icon && (
            <Icon
              className={`absolute left-3 top-2.5 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          )}
          <select
            value={value || ""}
            onChange={(e) => onValueChange(field, e.target.value)}
            className={`w-full px-2 py-1 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
              Icon ? "pl-10" : ""
            } ${
              darkMode
                ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500"
                : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200"
            }`}
          >
            <option value="" disabled>
              Select {label}
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      ) : isEditing && type === "relationship-select" ? (
        <div className="relative">
          {Icon && (
            <Icon
              className={`absolute left-3 top-2.5 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          )}
          <select
            value={value || ""}
            onChange={(e) => onValueChange(field, e.target.value)}
            className={`w-full px-2 py-1 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
              Icon ? "pl-10" : ""
            } ${
              darkMode
                ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500"
                : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200"
            }`}
          >
            <option value="" disabled>
              Select Relationship
            </option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Sibling">Sibling</option>
            <option value="Other">Other</option>
          </select>
        </div>
      ) : isEditing && type === "location-select" ? (
        <SearchableSelect
          label=""
          name={field}
          icon={MapPin}
          placeholder={`Select ${label.toLowerCase()}`}
          value={value}
          onChange={onValueChange}
          options={options || []}
          loading={loading}
          disabled={disabled}
          required={required}
          error={error}
          darkMode={darkMode}
        />
      ) : isEditing ? (
        <div className="relative">
          {Icon && (
            <Icon
              className={`absolute left-3 top-2.5 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          )}
          <input
            type={type}
            value={value || ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-2 py-1 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
              Icon ? "pl-10" : ""
            } ${
              darkMode
                ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
            }`}
            required={required}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className={`w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          )}
          <span
            className={`text-sm font-medium block min-h-[28px] py-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value || "N/A"}
          </span>
        </div>
      )}
    </div>
  );
};

// Medical Conditions and Allergies Display Component
const MedicalInfoSection = ({
  medicalConditions = [],
  allergies = [],
  height = "",
  weight = "",
  isEditing = false,
  onMedicalDataChange,
  onHeightWeightChange,
  darkMode = false,
}) => {
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      const updatedConditions = [...medicalConditions, newCondition.trim()];
      onMedicalDataChange("medicalConditions", updatedConditions);
      setNewCondition("");
    }
  };

  const handleRemoveCondition = (index) => {
    const updatedConditions = medicalConditions.filter((_, i) => i !== index);
    onMedicalDataChange("medicalConditions", updatedConditions);
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...allergies, newAllergy.trim()];
      onMedicalDataChange("allergies", updatedAllergies);
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (index) => {
    const updatedAllergies = allergies.filter((_, i) => i !== index);
    onMedicalDataChange("allergies", updatedAllergies);
  };

  if (!isEditing && medicalConditions.length === 0 && allergies.length === 0) {
    return (
      <div className="space-y-3">
        <h4
          className={`text-base font-semibold border-b pb-1 ${
            darkMode
              ? "text-white border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          Medical Information
        </h4>

        {/* Height and Weight */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Height
            </span>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {height || "N/A"}
            </p>
          </div>
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Weight
            </span>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {weight || "N/A"}
            </p>
          </div>
        </div>

        <div
          className={`text-center py-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No medical conditions or allergies recorded.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4
        className={`text-base font-semibold border-b pb-1 ${
          darkMode
            ? "text-white border-gray-700"
            : "text-gray-800 border-gray-200"
        }`}
      >
        Medical Information
      </h4>

      {/* Height and Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Height
          </span>
          {isEditing ? (
            <div className="relative">
              <Ruler
                className={`absolute left-3 top-2.5 w-4 h-4 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                value={height || ""}
                onChange={(e) =>
                  onHeightWeightChange(
                    "height",
                    inputValidation.allowOnlyNumbers(e.target.value)
                  )
                }
                placeholder="Enter height in cm"
                className={`w-full pl-10 px-2 py-1 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
                  darkMode
                    ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                    : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
                }`}
              />
            </div>
          ) : (
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {height || "N/A"}
            </p>
          )}
        </div>
        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Weight
          </span>
          {isEditing ? (
            <div className="relative">
              <Scale
                className={`absolute left-3 top-2.5 w-4 h-4 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                value={weight || ""}
                onChange={(e) =>
                  onHeightWeightChange(
                    "weight",
                    inputValidation.allowOnlyNumbers(e.target.value)
                  )
                }
                placeholder="Enter weight in kg"
                className={`w-full pl-10 px-2 py-1 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
                  darkMode
                    ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                    : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
                }`}
              />
            </div>
          ) : (
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {weight || "N/A"}
            </p>
          )}
        </div>
      </div>

      {/* Medical Conditions */}
      <div>
        <h5
          className={`text-sm font-semibold mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Medical Conditions
        </h5>
        {medicalConditions.length === 0 && !isEditing ? (
          <p
            className={`text-sm italic ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No medical conditions
          </p>
        ) : (
          <div className="space-y-2">
            {medicalConditions.map((condition, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border flex justify-between items-center ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                <span className="font-medium">{condition}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveCondition(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add medical condition"
              className={`flex-1 px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "border-gray-300"
              }`}
              onKeyPress={(e) => e.key === "Enter" && handleAddCondition()}
            />
            <button
              onClick={handleAddCondition}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        )}
      </div>

      {/* Allergies */}
      <div>
        <h5
          className={`text-sm font-semibold mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Allergies
        </h5>
        {allergies.length === 0 && !isEditing ? (
          <p
            className={`text-sm italic ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No known allergies
          </p>
        ) : (
          <div className="space-y-2">
            {allergies.map((allergy, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border flex justify-between items-center ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                <span className="font-medium">{allergy}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveAllergy(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add allergy"
              className={`flex-1 px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "border-gray-300"
              }`}
              onKeyPress={(e) => e.key === "Enter" && handleAddAllergy()}
            />
            <button
              onClick={handleAddAllergy}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Authorized Escorts Display Component
const EscortInfoSection = ({ escorts = [], darkMode = false }) => {
  if (!escorts || escorts.length === 0) {
    return (
      <div className="space-y-3">
        <h4
          className={`text-base font-semibold border-b pb-1 ${
            darkMode
              ? "text-white border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          Authorized Escorts
        </h4>
        <div
          className={`text-center py-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No authorized escorts recorded.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4
        className={`text-base font-semibold border-b pb-1 ${
          darkMode
            ? "text-white border-gray-700"
            : "text-gray-800 border-gray-200"
        }`}
      >
        Authorized Escorts
      </h4>

      <div className="space-y-4">
        {escorts.map((escort, index) => (
          <div
            key={escort.EscortID || index}
            className={`rounded-lg p-4 border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-500" />
                <h5 className="font-semibold text-lg">{escort.FullName}</h5>
              </div>
              {escort.EscortStatus && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    escort.EscortStatus === "Approved"
                      ? "bg-green-100 text-green-800"
                      : escort.EscortStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {escort.EscortStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Relationship
                </span>
                <p className="font-medium">
                  {escort.RelationshipToStudent || "N/A"}
                </p>
              </div>

              <div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Contact Number
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{escort.ContactNumber || "N/A"}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Address
                </span>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="font-medium">{escort.Address || "N/A"}</p>
                </div>
              </div>

              {escort.AdditionalNotes && (
                <div className="md:col-span-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Additional Notes
                  </span>
                  <p className="font-medium italic">{escort.AdditionalNotes}</p>
                </div>
              )}

              {escort.DateAdded && (
                <div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Date Added
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">
                      {new Date(escort.DateAdded).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StudentInformationModal({
  isOpen,
  onClose,
  student,
  onStudentInfoUpdated,
  darkMode = false,
}) {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentSchoolYear, setCurrentSchoolYear] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [changingSectionError, setChangingSectionError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const locationHook = useLocationData();

  const formatStudentName = (student) => {
    if (student.firstName && student.lastName) {
      const middleInitial = student.middleName
        ? ` ${student.middleName.charAt(0)}.`
        : "";
      return `${student.firstName}${middleInitial} ${student.lastName}`;
    }
    return student.name || "Unknown Student";
  };

  // Get student initials for avatar fallback
  const getStudentInitials = (student) => {
    if (!student || !student.name) return "";

    const nameParts = student.name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (
        nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }
  };

  // Get student grade and section function
  const getStudentGradeAndSection = async (student) => {
    if (!currentSchoolYear || !student.id) return "Not Assigned";

    for (const gradeLevel of currentSchoolYear.gradeLevels || []) {
      for (const section of gradeLevel.sections || []) {
        try {
          let sectionStudents = [];

          if (section.Students || section.StudentsURL) {
            const studentsData =
              await manageGradeLevelsService.getStudentsByURL(
                section.Students || section.StudentsURL
              );
            sectionStudents = studentsData.data || studentsData || [];
          } else if (section.students && Array.isArray(section.students)) {
            sectionStudents = section.students;
          }

          const foundStudent = sectionStudents.find((s) => {
            const sId =
              s.StudentProfileID ||
              s.StudentID ||
              s.StudentNumber ||
              s.id ||
              s.studentId;
            const studentId = student.studentProfileId || student.id;
            return sId?.toString() === studentId?.toString();
          });

          if (foundStudent) {
            const gradeSectionStr = `${
              gradeLevel.levelName || gradeLevel.name || gradeLevel.gradeLevel
            } - ${
              section.SectionName ||
              section.name ||
              section.sectionName ||
              "Unnamed Section"
            }`;

            return gradeSectionStr;
          }
        } catch (error) {
          console.error(
            `Error checking section ${section.SectionName}:`,
            error
          );
        }
      }
    }
    return "Not Assigned";
  };

  useEffect(() => {
    if (studentDetails && isEditing) {
      locationHook.setLocation({
        streetAddress: studentDetails.streetAddress || "",
        regionCode: studentDetails.regionCode || "",
        region: studentDetails.region || "",
        provinceCode: studentDetails.provinceCode || "",
        province: studentDetails.province || "",
        cityCode: studentDetails.cityCode || "",
        city: studentDetails.city || "",
        barangayCode: studentDetails.barangayCode || "",
        barangay: studentDetails.barangay || "",
      });
    }
  }, [studentDetails, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setEditData((prev) => ({
        ...prev,
        ...locationHook.locationData,
      }));
    }
  }, [locationHook.locationData, isEditing]);

  // Fetch school years for the modal
  useEffect(() => {
    const fetchSchoolYearsForModal = async () => {
      try {
        const result = await manageGradeLevelsService.getSchoolYears();
        if (result.schoolYears && result.schoolYears.length > 0) {
          setSchoolYears(result.schoolYears);
          setCurrentSchoolYear(result.schoolYears[0]);
        }
      } catch (error) {
        console.error("Error fetching school years for modal:", error);
      }
    };

    if (isOpen) {
      fetchSchoolYearsForModal();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentDetails();
    }
  }, [isOpen, student, currentSchoolYear]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSaveError("");
      setSaveSuccess(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSectionsForGrade = async () => {
      if (!isEditing || !currentSchoolYear || !studentDetails) return;

      setLoadingSections(true);
      try {
        for (const gradeLevel of currentSchoolYear.gradeLevels || []) {
          for (const section of gradeLevel.sections || []) {
            const studentsData =
              await manageGradeLevelsService.getStudentsByURL(
                section.Students || section.StudentsURL
              );
            const sectionStudents = studentsData.data || studentsData || [];

            const foundStudent = sectionStudents.find((s) => {
              const sId =
                s.StudentProfileID || s.StudentID || s.StudentNumber || s.id;
              const studentId =
                studentDetails.studentProfileId || studentDetails.id;
              return sId?.toString() === studentId?.toString();
            });

            if (foundStudent) {
              setSections(gradeLevel.sections || []);
              setSelectedSectionId(section.SectionID || section.id);
              setLoadingSections(false);
              return;
            }
          }
        }
        setSections([]);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      } finally {
        setLoadingSections(false);
      }
    };

    if (isEditing) {
      fetchSectionsForGrade();
    }
  }, [isEditing, currentSchoolYear, studentDetails]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const studentId = student.studentProfileId || student.id;
      const studentData = await studentService.getStudentById(studentId);

      if (studentData) {
        const gradeSection = await getStudentGradeAndSection(studentData);
        const gradeParts = gradeSection.split(" - ");
        const grade = gradeParts[0] || "N/A";
        const section = gradeParts[1] || "N/A";

        const addressComponents = psgcService.parseAddress(
          studentData.address || ""
        );

        const guardians = studentData.rawData?.Guardians || [];
        let guardianData = [];

        if (guardians.length > 0) {
          guardianData = guardians.map((guardian) => ({
            guardianID: guardian.GuardianID || null,
            relationshipType: guardian.RelationshipType || "Guardian",
            fullName: guardian.FullName || "",
            phoneNumber: guardian.PhoneNumber || "",
            emailAddress: guardian.EmailAddress || "",
          }));
        } else {
          guardianData = [
            {
              guardianID: null,
              relationshipType: "Father",
              fullName: "",
              phoneNumber: "",
              emailAddress: "",
            },
          ];
        }

        // Get emergency contact from EmergencyContact
        const emergencyContact = studentData.rawData?.EmergencyContact || {};

        // Get authorized escorts
        const authorizedEscorts = studentData.rawData?.AuthorizedEscorts || [];

        const enhancedData = {
          ...studentData,
          gradeSection: gradeSection,
          grade: grade,
          section: section,
          formattedName: formatStudentName(studentData),

          streetAddress: addressComponents.streetAddress,
          barangay: addressComponents.barangay,
          city: addressComponents.city,
          province: addressComponents.province,
          region: addressComponents.region,

          fullAddress: studentData.address || "",

          regionCode: "",
          provinceCode: "",
          cityCode: "",
          barangayCode: "",

          // Guardian information
          guardians: guardianData,

          // Authorized escorts information
          authorizedEscorts: authorizedEscorts,

          emergencyContactPerson: studentData.emergencyContactPerson || "",
          emergencyContactNumber: studentData.emergencyContactNumber || "",

          // religion: studentData.rawData?.Religion || "",
          // birthplace: studentData.rawData?.Birthplace || "",
          // motherTongue: studentData.rawData?.MotherTongue || "",
        };

        setStudentDetails(enhancedData);
        setEditData(enhancedData);
      } else {
        throw new Error("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);

      const gradeSection = await getStudentGradeAndSection(student);
      const gradeParts = gradeSection.split(" - ");

      const addressComponents = psgcService.parseAddress(
        student.address || student.rawData?.Profile?.Address || ""
      );

      const fallbackData = {
        ...student,
        birthday: student.rawData?.DateOfBirth || student.birthday || "",
        age: student.age || "",
        sex: student.sex || student.rawData?.Gender || "",
        // religion: student.rawData?.Religion || "",
        height: student.height || student.rawData?.MedicalInfo?.Height || "",
        weight: student.weight || student.rawData?.MedicalInfo?.Weight || "",
        // birthplace: student.rawData?.Birthplace || "",
        // motherTongue: student.rawData?.MotherTongue || "",
        nationality: student.nationality || "",

        fullAddress: student.address || student.rawData?.Profile?.Address || "",
        streetAddress: addressComponents.streetAddress,
        region: addressComponents.region,
        province: addressComponents.province,
        city: addressComponents.city,
        barangay: addressComponents.barangay,

        // Initialize empty codes
        regionCode: "",
        provinceCode: "",
        cityCode: "",
        barangayCode: "",

        // Guardian info
        guardians:
          student.rawData?.Guardians?.length > 0
            ? student.rawData.Guardians.map((g) => ({
                guardianID: g.GuardianID || null,
                relationshipType: g.RelationshipType || "Guardian",
                fullName: g.FullName || "",
                phoneNumber: g.PhoneNumber || "",
                emailAddress: g.EmailAddress || "",
              }))
            : [
                {
                  guardianID: null,
                  relationshipType: "Father",
                  fullName: "",
                  phoneNumber: "",
                  emailAddress: "",
                },
              ],

        // Authorized escorts info
        authorizedEscorts: student.rawData?.AuthorizedEscorts || [],

        // Emergency contact
        emergencyContactPerson: student.emergencyContactPerson || "",
        emergencyContactNumber: student.emergencyContactNumber || "",

        medicalConditions: student.medicalConditions || [],
        allergies: student.allergies || [],
        gradeSection: gradeSection,
        grade: gradeParts[0] || "N/A",
        section: gradeParts[1] || "N/A",
        formattedName: formatStudentName(student),
      };

      setStudentDetails(fallbackData);
      setEditData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return "";

    try {
      const birthDate = new Date(birthday);
      if (isNaN(birthDate.getTime())) {
        console.warn("Invalid date format:", birthday);
        return "";
      }

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age.toString();
    } catch (error) {
      console.error("Error calculating age:", error);
      return "";
    }
  };

  const formatBirthdayForInput = (birthday) => {
    if (!birthday) return "";

    try {
      let birthDate;
      if (birthday.includes("/")) {
        const parts = birthday.split("/");
        if (parts.length === 3) {
          const month = parts[0].padStart(2, "0");
          const day = parts[1].padStart(2, "0");
          let year = parts[2];
          if (year.length === 2) {
            year = parseInt(year) < 50 ? `20${year}` : `19${year}`;
          }
          birthDate = new Date(`${year}-${month}-${day}`);
        }
      } else if (birthday.includes("-")) {
        return birthday;
      } else {
        birthDate = new Date(birthday);
      }

      if (!birthDate || isNaN(birthDate.getTime())) {
        return "";
      }

      return birthDate.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting birthday:", error);
      return "";
    }
  };

  // Function to format date for display
  const formatBirthdayForDisplay = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return dateString;
    }
  };

  useEffect(() => {
    if (isEditing && editData.birthday) {
      const calculatedAge = calculateAge(editData.birthday);
      if (calculatedAge && calculatedAge !== editData.age) {
        setEditData((prev) => ({
          ...prev,
          age: calculatedAge,
        }));
      }
    }
  }, [editData.birthday, isEditing]);

  const handleEditValueChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate age when birthday changes
    if (field === "birthday" && value) {
      const calculatedAge = calculateAge(value);
      if (calculatedAge) {
        setEditData((prev) => ({
          ...prev,
          age: calculatedAge,
        }));
      }
    }
  };

  const handleGuardianChange = (index, field, value) => {
    setEditData((prev) => {
      const updatedGuardians = [...prev.guardians];
      updatedGuardians[index] = {
        ...updatedGuardians[index],
        [field]: value,
      };
      return {
        ...prev,
        guardians: updatedGuardians,
      };
    });
  };

  const handleAddGuardian = () => {
    setEditData((prev) => ({
      ...prev,
      guardians: [
        ...prev.guardians,
        {
          guardianID: null,
          relationshipType: "Guardian",
          fullName: "",
          phoneNumber: "",
          emailAddress: "",
        },
      ],
    }));
  };

  const handleRemoveGuardian = (index) => {
    setEditData((prev) => ({
      ...prev,
      guardians: prev.guardians.filter((_, i) => i !== index),
    }));
  };

  const handleMedicalDataChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHeightWeightChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = async (newSectionId) => {
    if (!newSectionId || newSectionId === selectedSectionId) return;

    try {
      setChangingSectionError("");
      const studentId = student.studentProfileId || student.id;

      await studentService.changeSection(studentId, newSectionId);

      setSelectedSectionId(newSectionId);

      const selectedSection = sections.find(
        (s) => (s.SectionID || s.id)?.toString() === newSectionId.toString()
      );

      if (selectedSection) {
        const gradeLevel = currentSchoolYear.gradeLevels.find((gl) =>
          gl.sections.some((s) => (s.SectionID || s.id) === newSectionId)
        );

        const newGradeSection = `${
          gradeLevel?.levelName || gradeLevel?.name
        } - ${selectedSection.SectionName || selectedSection.name}`;

        setStudentDetails((prev) => ({
          ...prev,
          gradeSection: newGradeSection,
          grade: gradeLevel?.levelName || gradeLevel?.name,
          section: selectedSection.SectionName || selectedSection.name,
        }));

        setEditData((prev) => ({
          ...prev,
          gradeSection: newGradeSection,
        }));
      }
    } catch (error) {
      console.error("Error changing section:", error);
      setChangingSectionError(error.message || "Failed to change section");
    }
  };

  // Handle profile picture upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveError("Please select a valid image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setSaveError("Image size must be less than 2MB");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const studentId = student.studentProfileId || student.id;

      const formatAllPhoneNumbers = (phoneNumber) => {
        if (!phoneNumber) return "";
        return inputValidation.formatPhoneNumber(phoneNumber);
      };

      const formattedPhoneNumber = formatAllPhoneNumbers(
        editData.phoneNumber || studentDetails?.phoneNumber
      );

      const formattedEmergencyContactNumber = formatAllPhoneNumbers(
        editData.emergencyContactNumber ||
          studentDetails?.emergencyContactNumber
      );

      // Track which guardians need to be deleted
      const originalGuardianIDs = (studentDetails.guardians || [])
        .filter((g) => g.guardianID !== null && g.guardianID !== undefined)
        .map((g) => g.guardianID);

      const currentGuardianIDs = (editData.guardians || [])
        .filter((g) => g.guardianID !== null && g.guardianID !== undefined)
        .map((g) => g.guardianID);

      // Find guardians that were removed (existed before but not anymore)
      const guardiansToDelete = originalGuardianIDs.filter(
        (id) => !currentGuardianIDs.includes(id)
      );

      // Format guardians with proper validation
      const formattedGuardians = (editData.guardians || [])
        .filter((guardian) => {
          // Only include guardians with at least a full name
          return guardian.fullName && guardian.fullName.trim() !== "";
        })
        .map((guardian, index) => {
          const formattedGuardian = {
            GuardianID: guardian.guardianID || null,
            FullName: guardian.fullName?.trim() || "",
            PhoneNumber: formatAllPhoneNumbers(guardian.phoneNumber),
            EmailAddress: guardian.emailAddress?.trim() || "",
            RelationshipType: guardian.relationshipType || "Guardian",
            Occupation: guardian.occupation?.trim() || "",
            WorkAddress: guardian.workAddress?.trim() || "",
            IsPrimaryContact: Boolean(
              guardian.IsPrimaryContact === true ||
                guardian.isPrimaryContact === true
            ),
            IsEmergencyContact: Boolean(
              guardian.IsEmergencyContact === true ||
                guardian.isEmergencyContact === true
            ),
            IsAuthorizedPickup: Boolean(
              guardian.IsAuthorizedPickup !== false &&
                guardian.isAuthorizedPickup !== false
            ),
            SortOrder: Math.max(
              1,
              parseInt(guardian.SortOrder || guardian.sortOrder) || index + 1
            ),
          };

          console.log(`Guardian ${index}:`, formattedGuardian);
          return formattedGuardian;
        });

      const updateData = {
        FirstName: editData.firstName || studentDetails.firstName,
        LastName: editData.lastName || studentDetails.lastName,
        MiddleName: editData.middleName || studentDetails.middleName || "",
        PhoneNumber: formattedPhoneNumber,
        Address:
          locationHook.getFormattedAddress() ||
          psgcService.formatAddress(editData) ||
          studentDetails.address,
        EmailAddress: editData.email || studentDetails.email,
        DateOfBirth: editData.birthday || studentDetails.birthday,
        Gender: editData.sex || studentDetails.sex,
        Nationality: editData.nationality || studentDetails.nationality || "",
        ContactPerson:
          editData.emergencyContactPerson ||
          studentDetails.emergencyContactPerson ||
          "",
        ContactNumber: formattedEmergencyContactNumber,
        Height: editData.height?.toString() || studentDetails.height || "",
        Weight: editData.weight?.toString() || studentDetails.weight || "",
        Allergies: Array.isArray(editData.allergies)
          ? editData.allergies.join(", ")
          : editData.allergies || studentDetails.allergies?.join(", ") || "",
        MedicalConditions: Array.isArray(editData.medicalConditions)
          ? editData.medicalConditions.join(", ")
          : editData.medicalConditions ||
            studentDetails.medicalConditions?.join(", ") ||
            "",
        Medications: editData.medications || studentDetails.medications || "",

        // Guardians - send current list
        Guardians: formattedGuardians.length > 0 ? formattedGuardians : [],

        // GuardiansToDelete - IDs of guardians to remove from database
        GuardiansToDelete: guardiansToDelete,

        // Optional fields
        // Religion: editData.religion || studentDetails.religion || "",
        // Birthplace: editData.birthplace || studentDetails.birthplace || "",
        // MotherTongue:
        //   editData.motherTongue || studentDetails.motherTongue || "",
      };

      console.log("=== Update Data Being Sent ===");
      console.log(JSON.stringify(updateData, null, 2));
      console.log("=== Guardians to Delete ===");
      console.log(guardiansToDelete);

      // Add profile picture if selected
      if (selectedImage) {
        updateData.ProfilePicture = selectedImage;
      }

      const result = await studentService.updateStudent(studentId, updateData);

      if (result) {
        const freshStudentData = await studentService.getStudentById(studentId);

        const updatedStudent = {
          ...studentDetails,
          ...editData,
          ...freshStudentData,
          profilePicture:
            freshStudentData.profilePicture || studentDetails.profilePicture,
          profilePictureURL:
            freshStudentData.profilePictureURL ||
            studentDetails.profilePictureURL,
        };

        setStudentDetails(updatedStudent);
        setSaveSuccess(true);
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);

        if (onStudentInfoUpdated) {
          onStudentInfoUpdated(updatedStudent);
        }

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage =
        "Failed to update student information. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle validation errors specifically
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("; ");
        errorMessage = `Validation failed: ${errorMessages}`;
      }

      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(studentDetails);
    setSaveError("");
    setSaveSuccess(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  const displayProfilePicture =
    imagePreview ||
    studentDetails?.profilePictureURL ||
    studentDetails?.profilePicture;
  const studentInitials = getStudentInitials(studentDetails || student);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div
          className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden font-kumbh ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* Profile Picture with Edit Functionality */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-lg relative group">
                    {displayProfilePicture ? (
                      <img
                        src={displayProfilePicture}
                        alt="Student"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center text-white text-xl font-bold ${
                        darkMode ? "bg-yellow-600" : "bg-yellow-400"
                      } ${displayProfilePicture ? "hidden" : "flex"}`}
                    >
                      {studentInitials}
                    </div>
                    {isEditing && (
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full"
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-picture-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={saving}
                        />
                      </label>
                    )}
                  </div>
                  {isEditing && selectedImage && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {studentDetails?.formattedName || "Student Information"}
                  </h2>
                  {isEditing ? (
                    <div className="mt-1">
                      <select
                        value={selectedSectionId || ""}
                        onChange={(e) => handleSectionChange(e.target.value)}
                        disabled={loadingSections || sections.length === 0}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all ${
                          darkMode
                            ? "bg-gray-700 border-yellow-500 text-white hover:bg-gray-600"
                            : "bg-white border-yellow-500 text-gray-800 hover:bg-gray-50"
                        } ${
                          loadingSections
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {loadingSections ? (
                          <option>Loading sections...</option>
                        ) : sections.length === 0 ? (
                          <option>No sections available</option>
                        ) : (
                          <>
                            <option value="" disabled>
                              Select Section
                            </option>
                            {sections.map((section) => (
                              <option
                                key={section.SectionID || section.id}
                                value={section.SectionID || section.id}
                              >
                                {studentDetails?.grade} -{" "}
                                {section.SectionName || section.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {changingSectionError && (
                        <p className="text-red-500 text-xs mt-1">
                          {changingSectionError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {studentDetails?.gradeSection ||
                        "Grade and Section not assigned"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                        darkMode
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {saving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAttendanceModal(true)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        darkMode
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      View Attendance
                    </button>
                    <button
                      onClick={() => setShowGradesModal(true)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      View Grades
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        darkMode
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      Edit Information
                    </button>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Save Status Messages */}
          {saveError && (
            <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Student information updated successfully!</span>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-yellow-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Personal Information */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div
                    className={`rounded-xl p-6 ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 pb-2 border-b ${
                        darkMode
                          ? "text-white border-gray-700"
                          : "text-gray-800 border-gray-200"
                      }`}
                    >
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableInfoRow
                        label="First Name"
                        value={
                          isEditing
                            ? editData.firstName
                            : studentDetails?.firstName
                        }
                        field="firstName"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter first name"
                        icon={User}
                        darkMode={darkMode}
                        validationType="name"
                      />
                      <EditableInfoRow
                        label="Middle Name"
                        value={
                          isEditing
                            ? editData.middleName
                            : studentDetails?.middleName
                        }
                        field="middleName"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter middle name"
                        icon={User}
                        darkMode={darkMode}
                        validationType="name"
                      />
                      <EditableInfoRow
                        label="Last Name"
                        value={
                          isEditing
                            ? editData.lastName
                            : studentDetails?.lastName
                        }
                        field="lastName"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter last name"
                        icon={User}
                        darkMode={darkMode}
                        validationType="name"
                      />
                      <EditableInfoRow
                        label="Student Number"
                        value={studentDetails?.studentNumber}
                        field="studentNumber"
                        isEditing={false}
                        icon={User}
                        darkMode={darkMode}
                      />
                      <EditableInfoRow
                        label="Birthday"
                        value={
                          isEditing
                            ? formatBirthdayForInput(editData.birthday)
                            : formatBirthdayForDisplay(studentDetails?.birthday)
                        }
                        field="birthday"
                        isEditing={isEditing}
                        type="date"
                        onValueChange={handleEditValueChange}
                        placeholder="Select birth date"
                        icon={Calendar}
                        darkMode={darkMode}
                      />
                      <EditableInfoRow
                        label="Age"
                        value={isEditing ? editData.age : studentDetails?.age}
                        field="age"
                        isEditing={false}
                        icon={User}
                        darkMode={darkMode}
                      />
                      <EditableInfoRow
                        label="Sex"
                        value={isEditing ? editData.sex : studentDetails?.sex}
                        field="sex"
                        isEditing={isEditing}
                        type="select"
                        onValueChange={handleEditValueChange}
                        icon={User}
                        darkMode={darkMode}
                      />
                      <EditableInfoRow
                        label="Nationality"
                        value={
                          isEditing
                            ? editData.nationality
                            : studentDetails?.nationality
                        }
                        field="nationality"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter nationality"
                        icon={User}
                        darkMode={darkMode}
                        validationType="name"
                      />
                      {/* <EditableInfoRow
                        label="Religion"
                        value={
                          isEditing
                            ? editData.religion
                            : studentDetails?.religion
                        }
                        field="religion"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter religion"
                        icon={Heart}
                        darkMode={darkMode}
                        validationType="name"
                      /> */}
                      {/* <EditableInfoRow
                        label="Birthplace"
                        value={
                          isEditing
                            ? editData.birthplace
                            : studentDetails?.birthplace
                        }
                        field="birthplace"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter birthplace"
                        icon={MapPin}
                        darkMode={darkMode}
                      /> */}
                      {/* <EditableInfoRow
                        label="Mother Tongue"
                        value={
                          isEditing
                            ? editData.motherTongue
                            : studentDetails?.motherTongue
                        }
                        field="motherTongue"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter mother tongue"
                        icon={User}
                        darkMode={darkMode}
                        validationType="name"
                      /> */}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div
                    className={`rounded-xl p-6 ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 pb-2 border-b ${
                        darkMode
                          ? "text-white border-gray-700"
                          : "text-gray-800 border-gray-200"
                      }`}
                    >
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <EditableInfoRow
                        label="Email"
                        value={
                          isEditing ? editData.email : studentDetails?.email
                        }
                        field="email"
                        isEditing={isEditing}
                        onValueChange={handleEditValueChange}
                        placeholder="Enter email address"
                        icon={Mail}
                        darkMode={darkMode}
                      />
                      <EditableInfoRow
                        label="Phone Number"
                        value={
                          isEditing
                            ? editData.phoneNumber
                            : studentDetails?.phoneNumber
                        }
                        field="phoneNumber"
                        isEditing={isEditing}
                        type="tel"
                        onValueChange={handleEditValueChange}
                        placeholder="Enter phone number (11-13 digits)"
                        icon={Phone}
                        darkMode={darkMode}
                        validationType="phone"
                      />
                      <div>
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Address
                        </span>
                        {isEditing ? (
                          <AddressFields
                            locationData={locationHook.locationData}
                            regions={locationHook.regions}
                            provinces={locationHook.provinces}
                            cities={locationHook.cities}
                            barangays={locationHook.barangays}
                            loadingRegions={locationHook.loadingRegions}
                            loadingProvinces={locationHook.loadingProvinces}
                            loadingCities={locationHook.loadingCities}
                            loadingBarangays={locationHook.loadingBarangays}
                            handleLocationChange={
                              locationHook.handleLocationChange
                            }
                            handleStreetAddressChange={
                              locationHook.handleStreetAddressChange
                            }
                            hasNoProvinces={locationHook.hasNoProvinces}
                            disabled={saving}
                            darkMode={darkMode}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Home
                              className={`w-4 h-4 ${
                                darkMode ? "text-gray-400" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium block min-h-[28px] py-1 ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {psgcService.formatAddress(studentDetails) ||
                                "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Family & Medical Information */}
                <div className="space-y-6">
                  {/* Family Information */}
                  <div
                    className={`rounded-xl p-6 ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 pb-2 border-b ${
                        darkMode
                          ? "text-white border-gray-700"
                          : "text-gray-800 border-gray-200"
                      }`}
                    >
                      Family Information
                    </h3>
                    <div className="space-y-4">
                      {/* Guardian Fields */}
                      <div className="space-y-4">
                        {editData.guardians?.map((guardian, index) => (
                          <div
                            key={index}
                            className="space-y-3 p-4 border rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <span
                                className={`text-sm font-semibold ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Guardian {index + 1}
                              </span>
                              {isEditing && editData.guardians.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGuardian(index)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Relationship */}
                            <div>
                              <span
                                className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                              >
                                Relationship
                              </span>
                              {isEditing ? (
                                <select
                                  value={guardian.relationshipType || ""}
                                  onChange={(e) =>
                                    handleGuardianChange(
                                      index,
                                      "relationshipType",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
                                    darkMode
                                      ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500"
                                      : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200"
                                  }`}
                                >
                                  <option value="">Select Relationship</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Guardian">Guardian</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Other">Other</option>
                                </select>
                              ) : (
                                <span
                                  className={`text-sm font-medium block min-h-[40px] py-2 ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {guardian.relationshipType || "N/A"}
                                </span>
                              )}
                            </div>

                            {/* Full Name */}
                            <div>
                              <span
                                className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                              >
                                {guardian.relationshipType
                                  ? `${guardian.relationshipType}'s Full Name`
                                  : "Full Name"}
                              </span>
                              {isEditing ? (
                                <div className="relative">
                                  <User
                                    className={`absolute left-3 top-2.5 w-4 h-4 ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    value={guardian.fullName || ""}
                                    onChange={(e) =>
                                      handleGuardianChange(
                                        index,
                                        "fullName",
                                        inputValidation.allowOnlyLetters(
                                          e.target.value
                                        )
                                      )
                                    }
                                    placeholder="Enter full name"
                                    className={`w-full pl-10 px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
                                      darkMode
                                        ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                                        : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
                                    }`}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <User
                                    className={`w-4 h-4 ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm font-medium block min-h-[28px] py-1 ${
                                      darkMode ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {guardian.fullName || "N/A"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <span
                                  className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  Contact Number
                                </span>
                                {isEditing ? (
                                  <div className="relative">
                                    <Phone
                                      className={`absolute left-3 top-2.5 w-4 h-4 ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <input
                                      type="text"
                                      value={guardian.phoneNumber || ""}
                                      onChange={(e) =>
                                        handleGuardianChange(
                                          index,
                                          "phoneNumber",
                                          inputValidation.handleEnhancedPhoneInput(
                                            e
                                          )
                                        )
                                      }
                                      placeholder="Enter contact number (11-13 digits)"
                                      className={`w-full pl-10 px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
                                        darkMode
                                          ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                                          : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Phone
                                      className={`w-4 h-4 ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span
                                      className={`text-sm font-medium block min-h-[28px] py-1 ${
                                        darkMode
                                          ? "text-white"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {guardian.phoneNumber || "N/A"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <span
                                  className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                  }`}
                                >
                                  Email Address
                                </span>
                                {isEditing ? (
                                  <div className="relative">
                                    <Mail
                                      className={`absolute left-3 top-2.5 w-4 h-4 ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <input
                                      type="email"
                                      value={guardian.emailAddress || ""}
                                      onChange={(e) =>
                                        handleGuardianChange(
                                          index,
                                          "emailAddress",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter email address"
                                      className={`w-full pl-10 px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
                                        darkMode
                                          ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                                          : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
                                      }`}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Mail
                                      className={`w-4 h-4 ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span
                                      className={`text-sm font-medium block min-h-[28px] py-1 ${
                                        darkMode
                                          ? "text-white"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {guardian.emailAddress || "N/A"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleAddGuardian}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Guardian
                        </button>
                      )}

                      {/* Emergency Contact Information */}
                      <div className="pt-4 border-t border-gray-300 dark:border-gray-600 space-y-3">
                        <h4
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          } flex items-center gap-2`}
                        >
                          <Contact className="w-4 h-4" />
                          Emergency Contact
                        </h4>
                        <EditableInfoRow
                          label="Emergency Contact Person"
                          value={
                            isEditing
                              ? editData.emergencyContactPerson
                              : studentDetails?.emergencyContactPerson
                          }
                          field="emergencyContactPerson"
                          isEditing={isEditing}
                          onValueChange={handleEditValueChange}
                          placeholder="Enter emergency contact person's name"
                          icon={User}
                          darkMode={darkMode}
                          validationType="name"
                        />

                        <EditableInfoRow
                          label="Emergency Contact Number"
                          value={
                            isEditing
                              ? editData.emergencyContactNumber
                              : studentDetails?.emergencyContactNumber
                          }
                          field="emergencyContactNumber"
                          isEditing={isEditing}
                          onValueChange={handleEditValueChange}
                          placeholder="Enter emergency contact number (11-13 digits)"
                          icon={Phone}
                          darkMode={darkMode}
                          validationType="phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div
                    className={`rounded-xl p-6 ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <MedicalInfoSection
                      height={
                        isEditing ? editData.height : studentDetails?.height
                      }
                      weight={
                        isEditing ? editData.weight : studentDetails?.weight
                      }
                      medicalConditions={
                        isEditing
                          ? editData.medicalConditions
                          : studentDetails?.medicalConditions
                      }
                      allergies={
                        isEditing
                          ? editData.allergies
                          : studentDetails?.allergies
                      }
                      isEditing={isEditing}
                      onMedicalDataChange={handleMedicalDataChange}
                      onHeightWeightChange={handleHeightWeightChange}
                      darkMode={darkMode}
                    />
                  </div>

                  {/* Authorized Escorts Information */}
                  <div
                    className={`rounded-xl p-6 ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <EscortInfoSection
                      escorts={studentDetails?.authorizedEscorts || []}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Grades Modal */}
      <StudentGradesModal
        isOpen={showGradesModal}
        onClose={() => setShowGradesModal(false)}
        student={studentDetails || student}
        darkMode={darkMode}
      />

      {/* Student Attendance Modal */}
      <StudentAttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        student={studentDetails || student}
        darkMode={darkMode}
      />
    </>
  );
}
