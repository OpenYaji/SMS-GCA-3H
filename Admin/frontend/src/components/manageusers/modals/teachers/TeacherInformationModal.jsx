import { useState, useEffect } from "react";
import {
  Check,
  X,
  Loader,
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
  Contact,
  Camera,
} from "lucide-react";
import ScheduleOfClassesModal from "./ScheduleOfClassesModal";
import { useLocationData } from "../../../../hooks/useLocationData";
import AddressFields from "../../../../components/common/AddressFields";
import psgcService from "../../../../services/psgcService";
import teacherService from "../../../../services/teacherService";
import inputValidation from "../../../utils/inputValidation";

// Subject Specializations
const subjectSpecializations = [
  { code: "english", name: "English" },
  { code: "filipino", name: "Filipino" },
  { code: "reading", name: "Reading" },
  { code: "science", name: "Science" },
  { code: "mathematics", name: "Mathematics" },
  { code: "ap", name: "Araling Panlipunan" },
  { code: "mapeh", name: "MAPEH" },
  { code: "epp", name: "Edukasyon sa Pagpapakatao" },
  { code: "hele", name: "Hele" },
];

// Helper component for editable info rows
const EditableInfoRow = ({
  label,
  value,
  field,
  isEditing = false,
  type = "text",
  onValueChange,
  className = "",
  readOnly = false,
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
        className={`text-xs font-semibold font-kumbh uppercase tracking-wider mb-1 ${
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
      {isEditing && type === "select" && !readOnly ? (
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
      ) : isEditing && !readOnly ? (
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

// MultiSelectField for multiple subjects
const MultiSelectField = ({
  label,
  options,
  selectedValues = [],
  onChange,
  error,
  darkMode = false,
  required = true,
  isEditing = false,
}) => {
  const handleOptionChange = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelectedValues);
  };

  const selectedSubjects = options
    .filter((option) => selectedValues.includes(option.code))
    .map((option) => option.name);

  return (
    <div>
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

      {isEditing ? (
        <div
          className={`border-2 rounded-lg p-3 ${
            darkMode
              ? "bg-gray-700 border-yellow-500"
              : "bg-white border-yellow-500"
          } ${error ? "border-red-500" : ""}`}
        >
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <label
                key={option.code}
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                  selectedValues.includes(option.code)
                    ? darkMode
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-100 text-yellow-800"
                    : darkMode
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.code)}
                  onChange={() => handleOptionChange(option.code)}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm">{option.name}</span>
              </label>
            ))}
          </div>

          {selectedSubjects.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Selected: {selectedSubjects.join(", ")}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <User
            className={`w-4 h-4 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium block min-h-[28px] py-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {selectedSubjects.length > 0 ? selectedSubjects.join(", ") : "N/A"}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default function TeacherInformationModal({
  isOpen,
  onClose,
  teacher,
  onTeacherUpdate,
  darkMode = false,
}) {
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const locationHook = useLocationData();

  const formatName = (data) => {
    if (!data) return "";

    const firstName = data.firstName || "";
    const middleName = data.middleName || "";
    const lastName = data.lastName || "";
    let formattedName = firstName;
    if (middleName && middleName.trim() !== "") {
      formattedName += ` ${middleName.charAt(0)}.`;
    }
    formattedName += ` ${lastName}`;
    return formattedName.trim();
  };

  const parseSubjects = (subjectString) => {
    if (!subjectString) return [];

    // Handle comma-separated subjects
    if (typeof subjectString === "string") {
      return subjectString
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }
    if (Array.isArray(subjectString)) {
      return subjectString;
    }

    return [];
  };

  // Get subject codes from subject names
  const getSubjectCodes = (subjectNames) => {
    if (!Array.isArray(subjectNames)) return [];

    return subjectNames
      .map((name) => {
        const subject = subjectSpecializations.find((s) => s.name === name);
        return subject ? subject.code : null;
      })
      .filter((code) => code !== null);
  };

  // Fetch single teacher details when modal opens
  const fetchTeacherDetails = async () => {
    if (!teacher) return;

    setLoading(true);
    setApiError("");
    try {
      console.log(`Fetching teacher details for ID: ${teacher.id}`);
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/teacher-profiles/${teacher.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw teacher details response:", data);

      if (!data) {
        throw new Error("No teacher data received from API");
      }
      const teacherData = data.data || data;
      if (!teacherData) {
        throw new Error("No teacher data found in API response");
      }

      const addressComponents = psgcService.parseAddress(
        teacherData.Profile?.Address || ""
      );

      const subjectArray = parseSubjects(teacherData.Specialization);
      const subjectCodes = getSubjectCodes(subjectArray);

      const transformedData = {
        id: teacherData.TeacherProfileID?.toString() || teacher.id,
        teacherId:
          teacherData.EmployeeNumber || `T-${teacherData.TeacherProfileID}`,
        name: `${teacherData.Profile?.FirstName || ""} ${
          teacherData.Profile?.LastName || ""
        }`.trim(),
        email: teacherData.User?.EmailAddress || "",
        subject: teacherData.Specialization || "General Subject",
        subjects: subjectArray,
        subjectCodes: subjectCodes,

        // Personal Info
        firstName: teacherData.Profile?.FirstName || "",
        lastName: teacherData.Profile?.LastName || "",
        middleName: teacherData.Profile?.MiddleName || "",
        phone: teacherData.Profile?.PhoneNumber || "",

        // Address components from parsed address
        streetAddress: addressComponents.streetAddress,
        region: addressComponents.region,
        province: addressComponents.province,
        city: addressComponents.city,
        barangay: addressComponents.barangay,

        nationality: teacherData.Profile?.Nationality || "Filipino",

        accountEmail: teacherData.User?.EmailAddress || "",

        // Store the full address for display
        fullAddress: teacherData.Profile?.Address || "",

        regionCode: "",
        provinceCode: "",
        cityCode: "",
        barangayCode: "",

        profilePicture: teacherData.Profile?.ProfilePictureURL || null,
        rawData: teacherData,
      };

      console.log("Transformed teacher data for modal:", transformedData);

      setTeacherDetails(transformedData);
      setEditData(transformedData);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      setApiError(error.message);
      // Fallback to mock data if API fails
      const mockData = generateMockTeacherDetails(teacher);
      setTeacherDetails(mockData);
      setEditData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Set location data when editing starts
  useEffect(() => {
    if (teacherDetails && isEditing) {
      locationHook.setLocation({
        streetAddress: teacherDetails.streetAddress || "",
        regionCode: teacherDetails.regionCode || "",
        region: teacherDetails.region || "",
        provinceCode: teacherDetails.provinceCode || "",
        province: teacherDetails.province || "",
        cityCode: teacherDetails.cityCode || "",
        city: teacherDetails.city || "",
        barangayCode: teacherDetails.barangayCode || "",
        barangay: teacherDetails.barangay || "",
      });
    }
  }, [teacherDetails, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setEditData((prev) => ({
        ...prev,
        ...locationHook.locationData,
      }));
    }
  }, [locationHook.locationData, isEditing]);

  useEffect(() => {
    if (isOpen && teacher) {
      fetchTeacherDetails();
    }
  }, [isOpen, teacher]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSaveError("");
      setSaveSuccess(false);
      setSaving(false);
      setShowScheduleModal(false);
      setApiError("");
    }
  }, [isOpen]);

  const handleValueChange = (field, value) => {
    if (field === "middleName" && value === "") {
      setEditData((prev) => ({ ...prev, [field]: "" }));
    } else {
      setEditData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle subject selection changes
  const handleSubjectsChange = (selectedSubjectCodes) => {
    const selectedSubjectNames = subjectSpecializations
      .filter((subject) => selectedSubjectCodes.includes(subject.code))
      .map((subject) => subject.name);

    setEditData((prev) => ({
      ...prev,
      subjectCodes: selectedSubjectCodes,
      subjects: selectedSubjectNames,
      subject: selectedSubjectNames.join(", "),
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "accountEmail",
      "phone",
      "streetAddress",
    ];

    const missingFields = requiredFields.filter((field) => {
      const val = editData[field];
      return !val || (typeof val === "string" && !val.trim());
    });

    if (missingFields.length > 0) {
      setSaveError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    // Validate at least one subject is selected
    if (!editData.subjectCodes || editData.subjectCodes.length === 0) {
      setSaveError("Please select at least one subject specialization");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editData.accountEmail && !emailRegex.test(editData.accountEmail)) {
      setSaveError("Please enter a valid account email address");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const safe = (val, fallback = "") =>
        val !== undefined && val !== null && String(val).trim() !== ""
          ? val
          : fallback;

      const fullAddress =
        locationHook.getFormattedAddress() ||
        psgcService.formatAddress(editData);

      // Get selected subject names
      const selectedSubjectNames = subjectSpecializations
        .filter((subject) => editData.subjectCodes.includes(subject.code))
        .map((subject) => subject.name);

      const updateData = {
        FirstName: safe(editData.firstName, teacherDetails?.firstName),
        MiddleName:
          editData.middleName !== undefined
            ? editData.middleName
            : safe(teacherDetails?.middleName, ""),
        LastName: safe(editData.lastName, teacherDetails?.lastName),
        PhoneNumber: safe(editData.phone, teacherDetails?.phone),
        Address: fullAddress,
        EmailAddress: safe(
          editData.accountEmail || editData.email,
          teacherDetails?.accountEmail || teacherDetails?.email
        ),
        Specialization: selectedSubjectNames.join(", "),
      };

      if (selectedImage) {
        updateData.ProfilePicture = selectedImage;
      }

      const result = await teacherService.updateTeacher(teacher.id, updateData);

      const updatedTeacher = {
        ...teacherDetails,
        ...editData,
        name: formatName(editData),
        profilePicture:
          result.data?.Profile?.ProfilePictureURL ||
          teacherDetails.profilePicture,
      };
      setTeacherDetails(updatedTeacher);

      if (onTeacherUpdate) {
        onTeacherUpdate(updatedTeacher);
      }

      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating teacher:", error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(teacherDetails || {});
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
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

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    if (teacherDetails) {
      setEditData({
        ...teacherDetails,
      });
    }
    setIsEditing(true);
    setSaveError("");
    setSaveSuccess(false);
  };

  if (!isOpen) return null;

  const displayData = isEditing ? editData : teacherDetails;
  const fullName = displayData ? formatName(displayData) : teacher?.name || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Scrollable modal container */}
      <div
        className={`relative rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div
          className={`sticky top-0 border-b px-6 py-3 flex justify-between items-center rounded-t-xl z-10 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-lg font-semibold font-kumbh ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Teacher Information
          </h2>

          <button
            onClick={onClose}
            disabled={saving}
            className={`transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div
            className={`px-6 py-3 border-b ${
              darkMode
                ? "bg-yellow-900 border-yellow-800"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm ${
                darkMode ? "text-yellow-300" : "text-yellow-700"
              }`}
            >
              <AlertCircle size={16} />
              <span>Using fallback data: {apiError}</span>
            </div>
          </div>
        )}

        {(saveError || saveSuccess || saving) && (
          <div
            className={`px-6 py-3 ${
              saveError
                ? darkMode
                  ? "bg-red-900 border-b border-red-800"
                  : "bg-red-50 border-b border-red-200"
                : saveSuccess
                ? darkMode
                  ? "bg-green-900 border-b border-green-800"
                  : "bg-green-50 border-b border-green-200"
                : darkMode
                ? "bg-blue-900 border-b border-blue-800"
                : "bg-blue-50 border-b border-blue-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm ${
                saveError
                  ? darkMode
                    ? "text-red-300"
                    : "text-red-700"
                  : saveSuccess
                  ? darkMode
                    ? "text-green-300"
                    : "text-green-700"
                  : darkMode
                  ? "text-blue-300"
                  : "text-blue-700"
              }`}
            >
              {saving ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : saveError ? (
                <>
                  <X size={16} />
                  <span>{saveError}</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Teacher information updated successfully!</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-5 font-kumbh">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                  darkMode ? "border-blue-400" : "border-blue-600"
                }`}
              ></div>
              <span
                className={`ml-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Loading teacher details...
              </span>
            </div>
          ) : displayData ? (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="w-24 h-24 mx-auto md:mx-0 rounded-full flex-shrink-0 shadow-md overflow-hidden relative group">
                    {isEditing && (
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Camera className="w-6 h-6 text-white" />
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

                    {imagePreview || teacherDetails?.profilePicture ? (
                      <img
                        src={imagePreview || teacherDetails.profilePicture}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${
                        darkMode ? "bg-yellow-600" : "bg-yellow-400"
                      } ${
                        imagePreview || teacherDetails?.profilePicture
                          ? "hidden"
                          : ""
                      }`}
                    >
                      {fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2) || "TM"}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3
                      className={`text-xl font-bold mb-1 ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {fullName}
                    </h3>
                    <p
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Teacher ID: {teacherDetails?.teacherId || teacher?.id}
                    </p>
                    <p
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Email: {displayData?.email}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Subjects:{" "}
                      {displayData?.subjects?.join(", ") ||
                        displayData?.subject ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4
                    className={`text-base font-semibold border-b pb-1 ${
                      darkMode
                        ? "text-white border-gray-700"
                        : "text-gray-800 border-gray-200"
                    }`}
                  >
                    Personal Information
                  </h4>

                  <EditableInfoRow
                    label="First Name"
                    value={displayData?.firstName}
                    field="firstName"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    icon={User}
                    darkMode={darkMode}
                    validationType="name"
                  />

                  <EditableInfoRow
                    label="Middle Name"
                    value={displayData?.middleName}
                    field="middleName"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={false}
                    placeholder="Middle name (optional)"
                    icon={User}
                    darkMode={darkMode}
                    validationType="name"
                  />

                  <EditableInfoRow
                    label="Last Name"
                    value={displayData?.lastName}
                    field="lastName"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    icon={User}
                    darkMode={darkMode}
                    validationType="name"
                  />
                </div>

                <div className="space-y-3">
                  <h4
                    className={`text-base font-semibold border-b pb-1 ${
                      darkMode
                        ? "text-white border-gray-700"
                        : "text-gray-800 border-gray-200"
                    }`}
                  >
                    Contact & Other Info
                  </h4>

                  <EditableInfoRow
                    label="Email"
                    value={displayData?.email}
                    field="email"
                    isEditing={isEditing}
                    type="email"
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    icon={Mail}
                    darkMode={darkMode}
                  />

                  <EditableInfoRow
                    label="Phone Number"
                    value={displayData?.phone}
                    field="phone"
                    isEditing={isEditing}
                    type="tel"
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    icon={Phone}
                    darkMode={darkMode}
                    validationType="phone"
                  />

                  {/* Multi-select for Subjects */}
                  <MultiSelectField
                    label="Subjects"
                    options={subjectSpecializations}
                    selectedValues={displayData?.subjectCodes || []}
                    onChange={handleSubjectsChange}
                    error={
                      saveError && !displayData?.subjectCodes?.length
                        ? "At least one subject is required"
                        : ""
                    }
                    darkMode={darkMode}
                    required={true}
                    isEditing={isEditing}
                  />
                </div>

                <div className="space-y-3">
                  <h4
                    className={`text-base font-semibold border-b pb-1 ${
                      darkMode
                        ? "text-white border-gray-700"
                        : "text-gray-800 border-gray-200"
                    }`}
                  >
                    Background Information
                  </h4>

                  <EditableInfoRow
                    label="Nationality"
                    value={displayData?.nationality}
                    field="nationality"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    icon={User}
                    darkMode={darkMode}
                    validationType="name"
                  />

                  <EditableInfoRow
                    label="Account Email"
                    value={displayData?.accountEmail}
                    field="accountEmail"
                    isEditing={isEditing}
                    type="email"
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    icon={Mail}
                    darkMode={darkMode}
                  />

                  {!isEditing && (
                    <div>
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Address
                      </span>
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
                          {psgcService.formatAddress(displayData) || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 space-y-3">
                  <h4
                    className={`text-base font-semibold border-b pb-1 ${
                      darkMode
                        ? "text-white border-gray-700"
                        : "text-gray-800 border-gray-200"
                    }`}
                  >
                    Address Information
                  </h4>

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
                    handleLocationChange={locationHook.handleLocationChange}
                    handleStreetAddressChange={
                      locationHook.handleStreetAddressChange
                    }
                    hasNoProvinces={locationHook.hasNoProvinces}
                    disabled={saving}
                    darkMode={darkMode}
                  />
                </div>
              )}
            </>
          ) : (
            <div
              className={`text-center py-8 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Failed to load teacher details.
            </div>
          )}
        </div>

        <div
          className={`sticky bottom-0 border-t px-6 py-3 flex justify-end gap-2 rounded-b-xl ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className={`px-4 py-2 rounded-md transition-colors font-kumbh flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors font-kumbh flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-kumbh"
              >
                View Schedule of Classes
              </button>
              <button
                onClick={handleEdit}
                disabled={saving || !teacherDetails}
                className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-400 transition-colors font-kumbh disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Teacher Info
              </button>
            </>
          )}
        </div>

        {showScheduleModal && (
          <ScheduleOfClassesModal
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            teacher={teacher}
            teacherDetails={teacherDetails}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

// Mock data function
function generateMockTeacherDetails(teacher) {
  if (!teacher) {
    return {
      firstName: "Dean",
      middleName: "W.",
      lastName: "Winchester",
      email: "dean.winchester@spn.edu",
      phone: "+63 912 345 6789",
      nationality: "American",
      streetAddress: "Hunter's Road",
      region: "National Capital Region (NCR)",
      province: "Metro Manila",
      city: "Manila",
      barangay: "Ermita",
      accountEmail: "dean.winchester@spn.edu",
      subject: "English, Mathematics",
      subjects: ["English", "Mathematics"],
      subjectCodes: ["english", "mathematics"],
      regionCode: "130000000",
      provinceCode: "133900000",
      cityCode: "133900000",
      barangayCode: "133900001",
    };
  }

  const nameParts = teacher.name.split(" ").filter((part) => part.trim());
  let firstName = "";
  let middleName = "";
  let lastName = "";

  if (nameParts.length === 1) {
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length === 3) {
    firstName = nameParts[0];
    middleName = nameParts[1];
    lastName = nameParts[2];
  } else if (nameParts.length >= 4) {
    firstName = nameParts[0];
    middleName = nameParts[1];
    lastName = nameParts[2];
  }

  return {
    id: teacher.id,
    teacherId: teacher.id,
    firstName,
    middleName,
    lastName,
    email:
      teacher.email ||
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`,
    phone: "+63 912 345 6789",
    nationality: "Filipino",
    streetAddress: "123 Main Street",
    region: "National Capital Region (NCR)",
    province: "Metro Manila",
    city: "Quezon City",
    barangay: "Diliman",
    accountEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`,
    subject: teacher.subject || "General Subject",
    subjects: teacher.subject
      ? teacher.subject.split(",").map((s) => s.trim())
      : ["General Subject"],
    subjectCodes: ["english"],
    profilePicture: teacher.profilePicture || null,
    regionCode: "130000000",
    provinceCode: "133900000",
    cityCode: "137401000",
    barangayCode: "137401001",
  };
}
