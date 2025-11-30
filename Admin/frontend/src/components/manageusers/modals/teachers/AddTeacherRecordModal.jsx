import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Ruler,
  Calendar,
  Globe,
  Home,
  AlertCircle,
  CheckCircle,
  Loader2,
  Camera,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import teacherService from "../../../../services/teacherService";
import { useLocationData } from "../../../../hooks/useLocationData";
import AddressFields from "../../../../components/common/AddressFields";
import psgcService from "../../../../services/psgcService";
import inputValidation from "../../../utils/inputValidation";

const InputField = ({
  label,
  name,
  type = "text",
  icon: Icon,
  placeholder,
  readOnly = false,
  value,
  onChange,
  required = true,
  pattern,
  title,
  error,
  showPasswordToggle = false,
  onTogglePassword,
  darkMode = false,
  validationType = "default",
}) => {
  const [localValue, setLocalValue] = useState(value || "");

  const handleInputChange = (e) => {
    let newValue = e.target.value;

    // Apply validation based on type
    switch (validationType) {
      case "numeric":
        newValue = inputValidation.allowOnlyNumbers(newValue);
        break;
      case "name":
        newValue = inputValidation.allowOnlyLetters(newValue);
        break;
      case "phone":
        newValue = inputValidation.handleEnhancedPhoneInput(e);
        break;
      default:
        break;
    }

    setLocalValue(newValue);

    // Create synthetic event with validated value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue,
      },
    };

    onChange(syntheticEvent);
  };

  const handleBlur = (e) => {
    if (type === "tel" && validationType === "phone" && localValue) {
      const formatted = inputValidation.formatPhoneNumber(localValue);
      setLocalValue(formatted);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: formatted,
        },
      };

      onChange(syntheticEvent);
    }
  };

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  return (
    <div className="mb-1">
      <label
        className={`block mb-1 capitalize ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
        {!required && (
          <span
            className={`text-sm ml-1 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          >
            (optional)
          </span>
        )}
      </label>
      <div className="relative">
        <Icon
          className={`absolute left-3 top-2.5 w-5 h-5 ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}
        />
        <input
          type={type}
          name={name}
          readOnly={readOnly}
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
          title={title}
          className={`w-full border rounded-lg pl-10 ${
            showPasswordToggle ? "pr-10" : "pr-3"
          } py-2 focus:ring-2 outline-none ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-500 focus:border-yellow-500"
              : "bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
          } ${error ? "border-red-500 focus:ring-red-400" : ""}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={`absolute right-3 top-2.5 ${
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {type === "password" ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// SelectField component for User Type dropdown
const SelectField = ({
  label,
  name,
  icon: Icon,
  placeholder,
  value,
  onChange,
  options = [],
  required = true,
  error,
  darkMode = false,
}) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
  };

  return (
    <div className="mb-1">
      <label
        className={`block mb-1 capitalize ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
        {!required && (
          <span
            className={`text-sm ml-1 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          >
            (optional)
          </span>
        )}
      </label>
      <div className="relative">
        <Icon
          className={`absolute left-3 top-2.5 w-5 h-5 ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}
        />
        <select
          name={name}
          value={value || ""}
          onChange={handleSelectChange}
          required={required}
          className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 outline-none appearance-none ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-500 focus:border-yellow-500"
              : "bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
          } ${error ? "border-red-500 focus:ring-red-400" : ""}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          className={`absolute right-3 top-2.5 pointer-events-none ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}
        >
          ▼
        </div>
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ImageUploadField
const ImageUploadField = ({
  label,
  onImageChange,
  previewUrl,
  error,
  darkMode = false,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <div className="mb-2">
      <label
        className={`block mb-1 capitalize ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
        <span
          className={`text-sm ml-1 ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}
        >
          (optional)
        </span>
      </label>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center ${
              darkMode
                ? "border-gray-600 bg-gray-700"
                : "border-gray-300 bg-gray-100"
            } ${previewUrl ? "border-solid" : ""}`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Camera
                className={`w-8 h-8 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
            )}
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                darkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex-1">
          <label
            htmlFor="profile-picture"
            className={`cursor-pointer inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Camera className="w-4 h-4 mr-2" />
            {previewUrl ? "Change Photo" : "Upload Photo"}
          </label>
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Recommended: Square image, max 2MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const MultiSelectField = ({
  label,
  options,
  selectedValues = [],
  onChange,
  error,
  darkMode = false,
  required = true,
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
    <div className="mb-3">
      <label
        className={`block mb-1 capitalize ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
        {!required && (
          <span
            className={`text-sm ml-1 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          >
            (optional)
          </span>
        )}
      </label>

      <div
        className={`border rounded-lg p-3 ${
          darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
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

      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default function AddTeacherRecordModal({
  show,
  onClose,
  teacherEmail = "",
  onSuccess,
  darkMode = false,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({
    step1: {},
    step2: {},
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  // Use the centralized location hook
  const locationHook = useLocationData();

  const [formData, setFormData] = useState({
    step1: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: teacherEmail || "",
      phone: "",
    },
    step2: {
      nationality: "",
      userType: "Teacher",
      subjectSpecializations: [],
    },
  });

  const userTypeOptions = [
    { value: "Teacher", label: "Teacher" },
    { value: "Head Teacher", label: "Head Teacher" },
  ];

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

  // Handle profile picture changes
  const handleProfilePictureChange = (file) => {
    setProfilePicture(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    } else {
      setProfilePicturePreview("");
    }
  };

  useEffect(() => {
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  useEffect(() => {
    if (show) {
      locationHook.resetLocationData();
      setProfilePicture(null);
      setProfilePicturePreview("");
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e, stepKey) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [name]: value },
    }));
    if (errors[stepKey]?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [stepKey]: { ...prev[stepKey], [name]: "" },
      }));
    }
  };

  // Handle multiple subject selection
  const handleSubjectsChange = (selectedSubjects) => {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        subjectSpecializations: selectedSubjects,
      },
    }));

    if (errors.step2?.subjectSpecializations) {
      setErrors((prev) => ({
        ...prev,
        step2: { ...prev.step2, subjectSpecializations: "" },
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const data = formData.step1;

    if (!data.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!data.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!data.phone?.trim()) newErrors.phone = "Phone number is required";

    setErrors((prev) => ({ ...prev, step1: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const data = formData.step2;

    if (!data.nationality?.trim())
      newErrors.nationality = "Nationality is required";

    if (!data.userType?.trim()) newErrors.userType = "User type is required";

    // Validate at least one subject is selected
    if (!data.subjectSpecializations?.length)
      newErrors.subjectSpecializations =
        "At least one subject specialization is required";

    // Validate address fields
    if (!locationHook.locationData.streetAddress?.trim())
      newErrors.streetAddress = "Street address is required";
    if (!locationHook.locationData.regionCode)
      newErrors.regionCode = "Region is required";
    if (!locationHook.locationData.cityCode)
      newErrors.cityCode = "City/Municipality is required";
    if (!locationHook.locationData.barangayCode)
      newErrors.barangayCode = "Barangay is required";

    // Only validate province if the region has provinces
    if (
      !locationHook.hasNoProvinces &&
      !locationHook.locationData.provinceCode
    ) {
      newErrors.provinceCode = "Province is required";
    }

    setErrors((prev) => ({ ...prev, step2: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    }

    if (isValid) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitStatus("Creating Teacher Records...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus("Sending User Account...");

      // Use the formatted address from locationHook
      const fullAddress = locationHook.getFormattedAddress();

      // Get selected subject names
      const selectedSubjectNames = subjectSpecializations
        .filter((subject) =>
          formData.step2.subjectSpecializations.includes(subject.code)
        )
        .map((subject) => subject.name);

      // Transform User Type for backend (remove space from "Head Teacher" to "HeadTeacher")
      const userTypeForBackend =
        formData.step2.userType === "Head Teacher" ? "HeadTeacher" : "Teacher";

      const teacherData = {
        EmailAddress: formData.step1.email.trim(),
        LastName: formData.step1.lastName.trim(),
        FirstName: formData.step1.firstName.trim(),
        MiddleName: formData.step1.middleName?.trim() || "",
        PhoneNumber: formData.step1.phone.trim(),
        Address: fullAddress,
        Specialization: selectedSubjectNames.join(", "),
        HireDate: new Date().toISOString().split("T")[0],
        UserType: userTypeForBackend,
      };

      if (formData.step1.sex?.trim()) {
        teacherData.Sex = formData.step1.sex.trim();
      }

      if (formData.step2.nationality?.trim()) {
        teacherData.Nationality = formData.step2.nationality.trim();
      }

      teacherData.AccountEmail = formData.step1.email.trim();

      // Add profile picture if uploaded
      if (profilePicture) {
        teacherData.ProfilePicture = profilePicture;
      }

      // Use FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(teacherData).forEach((key) => {
        if (key === "ProfilePicture") {
          formDataToSend.append(key, teacherData[key]);
        } else {
          formDataToSend.append(key, teacherData[key]);
        }
      });

      const response = await teacherService.createTeacher(formDataToSend);
      console.log("Teacher created successfully:", response);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating teacher:", error);
      let errorMessage = "Failed to create teacher. Please try again.";
      if (error.response?.data) {
        if (error.response.data.errors) {
          const validationErrors = Object.values(
            error.response.data.errors
          ).flat();
          errorMessage = `Validation errors: ${validationErrors.join(", ")}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setSubmitStatus("");
    }
  };

  const handleCloseModal = () => {
    setCurrentStep(1);
    setErrors({ step1: {}, step2: {} });
    setShowSuccessModal(false);
    setSubmitError(null);
    setFormData({
      step1: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: teacherEmail || "",
        phone: "",
      },
      step2: {
        nationality: "",
        userType: "Teacher",
        subjectSpecializations: [],
      },
    });
    setProfilePicture(null);
    setProfilePicturePreview("");
    locationHook.resetLocationData();
    onClose();
  };

  const handleDone = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleCloseModal();
  };

  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
        <div
          className={`rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-scaleIn ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? "bg-green-900" : "bg-green-100"
              }`}
            >
              <CheckCircle
                className={`w-10 h-10 ${
                  darkMode ? "text-green-400" : "text-green-500"
                }`}
              />
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Success!
            </h2>
            <p
              className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Teacher record has been created successfully.
            </p>
            <button
              onClick={handleDone}
              className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div
        className={`rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Add Teacher
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Step {currentStep} of 2
          </p>
        </div>

        {/* Error Message */}
        {submitError && (
          <div
            className={`mx-6 mt-4 p-4 border rounded-lg flex items-start gap-3 ${
              darkMode
                ? "bg-red-900 border-red-700"
                : "bg-red-50 border-red-200"
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            />
            <div className="flex-1">
              <p
                className={`font-medium ${
                  darkMode ? "text-red-200" : "text-red-800"
                }`}
              >
                Error
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-red-300" : "text-red-600"
                }`}
              >
                {submitError}
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-6 pl-6 pr-6 pb-3">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-3">
              {/* Profile Picture - Centered at top */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <ImageUploadField
                    label="Profile Picture"
                    onImageChange={handleProfilePictureChange}
                    previewUrl={profilePicturePreview}
                    error={errors.step1?.profilePicture}
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    icon={User}
                    value={formData.step1?.firstName ?? ""}
                    onChange={(e) => handleChange(e, "step1")}
                    error={errors.step1?.firstName}
                    validationType="name"
                    darkMode={darkMode}
                  />
                  <InputField
                    label="Middle Name"
                    name="middleName"
                    placeholder="Enter middle name"
                    icon={User}
                    value={formData.step1?.middleName ?? ""}
                    onChange={(e) => handleChange(e, "step1")}
                    required={false}
                    validationType="name"
                    darkMode={darkMode}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    icon={User}
                    value={formData.step1?.lastName ?? ""}
                    onChange={(e) => handleChange(e, "step1")}
                    error={errors.step1?.lastName}
                    validationType="name"
                    darkMode={darkMode}
                  />
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number (11-13 digits)"
                    icon={Phone}
                    value={formData.step1?.phone ?? ""}
                    onChange={(e) => handleChange(e, "step1")}
                    error={errors.step1?.phone}
                    validationType="phone"
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    icon={Mail}
                    readOnly={!!teacherEmail}
                    value={formData.step1?.email ?? ""}
                    onChange={(e) => handleChange(e, "step1")}
                    error={errors.step1?.email}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Nationality"
                name="nationality"
                placeholder="Enter nationality"
                icon={Globe}
                value={formData.step2?.nationality ?? ""}
                onChange={(e) => handleChange(e, "step2")}
                error={errors.step2?.nationality}
                validationType="name"
                darkMode={darkMode}
              />

              <SelectField
                label="User Type"
                name="userType"
                placeholder="Select user type"
                icon={User}
                value={formData.step2?.userType ?? "Teacher"}
                onChange={(e) => handleChange(e, "step2")}
                options={userTypeOptions}
                error={errors.step2?.userType}
                darkMode={darkMode}
              />

              {/* Subject Specialization  */}
              <div className="col-span-2">
                <MultiSelectField
                  label="Subject Specializations"
                  options={subjectSpecializations}
                  selectedValues={formData.step2?.subjectSpecializations ?? []}
                  onChange={handleSubjectsChange}
                  error={errors.step2?.subjectSpecializations}
                  darkMode={darkMode}
                  required={true}
                />
              </div>

              {/* Address Fields */}
              <div className="col-span-2" style={{ overflow: "visible" }}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Address Information
                </h3>
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
                  disabled={isSubmitting}
                  darkMode={darkMode}
                />

                {/* Display address validation errors */}
                {errors.step2?.streetAddress && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.step2.streetAddress}</span>
                  </div>
                )}
                {errors.step2?.regionCode && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.step2.regionCode}</span>
                  </div>
                )}
                {errors.step2?.provinceCode && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.step2.provinceCode}</span>
                  </div>
                )}
                {errors.step2?.cityCode && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.step2.cityCode}</span>
                  </div>
                )}
                {errors.step2?.barangayCode && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.step2.barangayCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          {currentStep === 1 ? (
            <>
              <button
                type="button"
                onClick={handleCloseModal}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBack}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {submitStatus}
                  </>
                ) : (
                  "Create Teacher Account"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
