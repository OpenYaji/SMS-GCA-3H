import { useState, useEffect } from "react";
import {
  Check,
  X,
  Loader,
  House,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Scale,
  Home,
  Camera,
} from "lucide-react";
import { useLocationData } from "../../../../hooks/useLocationData";
import AddressFields from "../../../../components/common/AddressFields";
import psgcService from "../../../../services/psgcService";
import guardService from "../../../../services/guardService";
import inputValidation from "../../../utils/inputValidation";

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
    // Format phone number on blur
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

const formatNameWithMiddleInitial = (data) => {
  if (!data) return "";

  const firstName = data.firstName || "";
  const middleName = data.middleName || "";
  const lastName = data.lastName || "";

  let fullName = firstName;

  if (middleName && middleName.trim() !== "") {
    const middleInitial = middleName.charAt(0).toUpperCase() + ".";
    fullName += ` ${middleInitial}`;
  }

  fullName += ` ${lastName}`;

  return fullName.trim();
};

export default function GuardInformationModal({
  isOpen,
  onClose,
  guard,
  onGuardUpdate,
  darkMode = false,
}) {
  const [guardDetails, setGuardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const locationHook = useLocationData();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch single guard details when modal opens
  const fetchGuardDetails = async () => {
    if (!guard) return;

    setLoading(true);
    setApiError("");
    try {
      console.log(`Fetching guard details for ID: ${guard.id}`);
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/guard-profiles/${guard.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error("No guard data received from API");
      }

      const guardData = data.data || data;
      console.log("Extracted guard data:", guardData);

      if (!guardData) {
        throw new Error("No guard data found in API response");
      }

      // Parse address using psgcService
      const addressComponents = psgcService.parseAddress(
        guardData.Profile?.Address || ""
      );

      const transformedData = {
        id: guardData.GuardProfileID?.toString() || guard.id,
        guardId: guardData.EmployeeNumber || `G-${guardData.GuardProfileID}`,
        name: formatNameWithMiddleInitial({
          firstName: guardData.Profile?.FirstName,
          middleName: guardData.Profile?.MiddleName,
          lastName: guardData.Profile?.LastName,
        }),
        email: guardData.User?.EmailAddress || "",

        // Personal Info
        firstName: guardData.Profile?.FirstName || "",
        lastName: guardData.Profile?.LastName || "",
        middleName: guardData.Profile?.MiddleName || "",
        phone: guardData.Profile?.PhoneNumber || "",

        // Address components from parsed address
        streetAddress: addressComponents.streetAddress,
        region: addressComponents.region,
        province: addressComponents.province,
        city: addressComponents.city,
        barangay: addressComponents.barangay,

        // Other info
        nationality: guardData.Profile?.Nationality || "Filipino",

        accountEmail: guardData.User?.EmailAddress || "",

        // Store the full address for display
        fullAddress: guardData.Profile?.Address || "",

        // Initialize empty codes (will be populated when editing)
        regionCode: "",
        provinceCode: "",
        cityCode: "",
        barangayCode: "",

        profilePicture: guardData.Profile?.ProfilePictureURL || null,
        rawData: guardData,
      };

      console.log("Transformed guard data for modal:", transformedData);

      setGuardDetails(transformedData);
      setEditData(transformedData);
    } catch (error) {
      console.error("Error fetching guard details:", error);
      setApiError(error.message);
      const basicData = {
        id: guard.id,
        guardId: guard.id,
        name: guard.name,
        email: guard.email,
        firstName: guard.name.split(" ")[0] || "",
        lastName: guard.name.split(" ").slice(-1)[0] || "",
        middleName: "",
        phone: "",
        streetAddress: "",
        region: "",
        province: "",
        city: "",
        barangay: "",
        nationality: "Filipino",
        accountEmail: guard.email || "",
      };
      setGuardDetails(basicData);
      setEditData(basicData);
    } finally {
      setLoading(false);
    }
  };

  // Set location data when editing starts
  useEffect(() => {
    if (guardDetails && isEditing) {
      locationHook.setLocation({
        streetAddress: guardDetails.streetAddress || "",
        regionCode: guardDetails.regionCode || "",
        region: guardDetails.region || "",
        provinceCode: guardDetails.provinceCode || "",
        province: guardDetails.province || "",
        cityCode: guardDetails.cityCode || "",
        city: guardDetails.city || "",
        barangayCode: guardDetails.barangayCode || "",
        barangay: guardDetails.barangay || "",
      });
    }
  }, [guardDetails, isEditing]);

  // Sync location data with editData when editing
  useEffect(() => {
    if (isEditing) {
      setEditData((prev) => ({
        ...prev,
        ...locationHook.locationData,
      }));
    }
  }, [locationHook.locationData, isEditing]);

  useEffect(() => {
    if (isOpen && guard) {
      fetchGuardDetails();
    }
  }, [isOpen, guard]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSaveError("");
      setSaveSuccess(false);
      setSaving(false);
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

      // Use the formatted address from locationHook
      const fullAddress =
        locationHook.getFormattedAddress() ||
        psgcService.formatAddress(editData);

      const updateData = {
        FirstName: safe(editData.firstName, guardDetails?.firstName),
        MiddleName:
          editData.middleName !== undefined
            ? editData.middleName
            : safe(guardDetails?.middleName, ""),
        LastName: safe(editData.lastName, guardDetails?.lastName),
        PhoneNumber: safe(editData.phone, guardDetails?.phone),
        Address: fullAddress,
        EmailAddress: safe(
          editData.accountEmail || editData.email,
          guardDetails?.accountEmail || guardDetails?.email
        ),
      };

      // Add profile picture if selected
      if (selectedImage) {
        updateData.ProfilePicture = selectedImage;
      }

      console.log("Sending update data:", updateData);

      const result = await guardService.updateGuard(guard.id, updateData);

      await fetchGuardDetails();

      const updatedGuard = {
        ...guardDetails,
        ...editData,
        name: formatNameWithMiddleInitial(editData),
        profilePicture:
          result.data?.Profile?.ProfilePictureURL ||
          guardDetails?.profilePicture,
      };
      setGuardDetails(updatedGuard);

      if (onGuardUpdate) {
        console.log("Calling onGuardUpdate with:", updatedGuard);
        onGuardUpdate(updatedGuard);
      }

      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating guard:", error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(guardDetails || {});
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setSaveError("");
    setSaveSuccess(false);
  };

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

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    if (guardDetails) {
      setEditData({
        ...guardDetails,
      });
    }
    setIsEditing(true);
    setSaveError("");
    setSaveSuccess(false);
  };

  if (!isOpen) return null;

  const displayData = isEditing ? editData : guardDetails;
  const fullName = displayData
    ? formatNameWithMiddleInitial(displayData)
    : guard?.name || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={onClose}
      ></div>

      <div
        className={`relative rounded-xl shadow-lg w-full max-w-4xl max-h-[85vh] overflow-y-auto font-kumbh ${
          darkMode ? "bg-gray-800" : "bg-white"
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
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Guard Information
          </h2>

          <button
            onClick={onClose}
            disabled={saving}
            className={`transition-colors p-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                ? "bg-yellow-900/20 border-yellow-800"
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
            className={`px-6 py-3 border-b ${
              saveError
                ? darkMode
                  ? "bg-red-900/20 border-red-800"
                  : "bg-red-50 border-red-200"
                : saveSuccess
                ? darkMode
                  ? "bg-green-900/20 border-green-800"
                  : "bg-green-50 border-green-200"
                : darkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm ${
                saveError
                  ? darkMode
                    ? "text-red-400"
                    : "text-red-700"
                  : saveSuccess
                  ? darkMode
                    ? "text-green-400"
                    : "text-green-700"
                  : darkMode
                  ? "text-blue-400"
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
                  <span>Guard information updated successfully!</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                  darkMode ? "border-blue-400" : "border-blue-600"
                }`}
              ></div>
              <span
                className={`ml-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loading guard details...
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

                    {imagePreview || guardDetails?.profilePicture ? (
                      <img
                        src={imagePreview || guardDetails.profilePicture}
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
                        imagePreview || guardDetails?.profilePicture
                          ? "hidden"
                          : ""
                      }`}
                    >
                      {guard?.firstName && guard?.lastName
                        ? `${guard.firstName.charAt(0)}${guard.lastName.charAt(
                            0
                          )}`.toUpperCase()
                        : guard?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2) || "GM"}
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
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Guard ID: {guard.guardId || guard.id}
                    </p>
                    <p
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Email: {displayData?.email}
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
                    Contact & Physical Info
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
              Failed to load guard details.
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
                    ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
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
            <button
              onClick={handleEdit}
              disabled={saving || !guardDetails}
              className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-400 transition-colors font-kumbh disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Guard Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
