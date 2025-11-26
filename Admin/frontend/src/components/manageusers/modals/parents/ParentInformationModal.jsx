import { useState, useEffect } from "react";
import {
  Check,
  X,
  Loader,
  MapPin,
  ChevronDown,
  AlertCircle,
  CreditCard,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// mock data based on parent info
const generateMockParentDetails = (parent) => {
  if (!parent) {
    return {
      firstName: "Dexter",
      middleName: "M.",
      lastName: "Morgan",
      suffix: "",
      email: "dexter.morgan@gmail.com",
      phone: "+63 912 345 6789",
      height: "175cm",
      weight: "75kg",
      birthday: "1980-05-15",
      sex: "Male",
      birthplace: "Manila",
      motherTongue: "English",
      nationality: "Filipino",
      streetAddress: "123 Main Street",
      region: "National Capital Region (NCR)",
      province: "Metro Manila",
      city: "Manila",
      barangay: "Ermita",
      accountEmail: "dexter.morgan@gmail.com",
      outstandingBalance: 12500.75,
      paymentStatus: "pending",
      regionCode: "130000000",
      provinceCode: "133900000",
      cityCode: "133900000",
      barangayCode: "133900000",
    };
  }

  // Use parent's existing financial data or generate based on name hash for consistency
  const nameHash = parent.name.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const statusOptions = ["pending", "partially_paid", "fully_paid"];
  const status = parent.paymentStatus || statusOptions[Math.abs(nameHash) % 3];

  let balance = parent.outstandingBalance || 0;
  if (!parent.outstandingBalance) {
    switch (status) {
      case "pending":
        balance = (Math.abs(nameHash) % 20000) + 5000;
        break;
      case "partially_paid":
        balance = (Math.abs(nameHash) % 10000) + 1000;
        break;
      case "fully_paid":
        balance = 0;
        break;
    }
  }

  const nameParts = parent.name.split(" ");
  const email =
    parent.email ||
    `${nameParts[0].toLowerCase()}.${nameParts[
      nameParts.length - 1
    ].toLowerCase()}@gmail.com`;

  return {
    firstName: nameParts[0] || "Dexter",
    middleName: nameParts[1] || "M.",
    lastName: nameParts.slice(-1)[0] || "Morgan",
    suffix: "",
    email: email,
    phone: "+63 912 345 6789",
    height: "175cm",
    weight: "75kg",
    birthday: "1980-05-15",
    sex: "Male",
    birthplace: "Manila",
    motherTongue: "English",
    nationality: "Filipino",
    streetAddress: "123 Main Street",
    region: "National Capital Region (NCR)",
    province: "Metro Manila",
    city: "Manila",
    barangay: "Ermita",
    accountEmail: email,
    outstandingBalance: balance,
    paymentStatus: status,
    regionCode: "130000000",
    provinceCode: "133900000",
    cityCode: "133900000",
    barangayCode: "133900000",
  };
};

// Searchable Select Component with error handling
const SearchableSelect = ({
  label,
  name,
  icon: Icon,
  placeholder,
  value,
  onChange,
  options = [],
  loading,
  disabled,
  required = true,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = Array.isArray(options)
    ? options.filter((opt) =>
        opt?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const selectedOption = Array.isArray(options)
    ? options.find((opt) => opt.code === value)
    : null;

  const handleSelect = (option) => {
    if (option && option.code) {
      onChange({ target: { name, value: option.code } }, option);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-gray-700 dark:text-gray-300 mb-1 capitalize">
        {label}
        {!required && (
          <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">
            (optional)
          </span>
        )}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500 z-10" />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full border rounded-lg pl-10 pr-10 py-2 text-left focus:ring-2 outline-none ${
            disabled
              ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              : "bg-white dark:bg-gray-800"
          } ${
            error
              ? "border-red-500 focus:ring-red-400 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600 focus:ring-yellow-400 dark:focus:ring-yellow-500"
          } text-gray-900 dark:text-white`}
        >
          {loading ? (
            <span className="text-gray-400 dark:text-gray-500">Loading...</span>
          ) : selectedOption ? (
            <span>{selectedOption.name}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">
              {placeholder}
            </span>
          )}
        </button>
        <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b dark:border-gray-600">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  >
                    {option.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400 dark:text-gray-500">
                  {loading ? "Loading..." : "No results found"}
                </div>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for editable info rows
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
  readOnly = false,
  required = true,
  placeholder = "",
}) => (
  <div className={`${className}`}>
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
      {label}
      {!required && (
        <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">
          (optional)
        </span>
      )}
    </span>
    {isEditing && type === "select" && !readOnly ? (
      <select
        value={value || ""}
        onChange={(e) => onValueChange(field, e.target.value)}
        className="w-full px-2 py-1 border-2 border-yellow-500 dark:border-yellow-400 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium transition-all focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-3 focus:ring-yellow-200 dark:focus:ring-yellow-800 text-gray-900 dark:text-white"
      >
        <option value="" disabled>
          Select {label}
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    ) : isEditing && type === "location-select" && !readOnly ? (
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
      />
    ) : isEditing && !readOnly ? (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onValueChange(field, e.target.value)}
        className="w-full px-2 py-1 border-2 border-yellow-500 dark:border-yellow-400 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium transition-all focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-3 focus:ring-yellow-200 dark:focus:ring-yellow-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        required={required}
        placeholder={placeholder}
      />
    ) : (
      <span className="text-sm text-gray-900 dark:text-white font-medium block min-h-[28px] py-1">
        {value || "N/A"}
      </span>
    )}
  </div>
);

// Balance Display Component
const BalanceDisplay = ({ balance, status }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "fully_paid":
        return {
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-700 dark:text-green-400",
          icon: CheckCircle,
          label: "Fully Paid",
          amountColor: "text-green-600 dark:text-green-400",
        };
      case "partially_paid":
        return {
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-700 dark:text-blue-400",
          icon: CreditCard,
          label: "Partially Paid",
          amountColor: "text-blue-600 dark:text-blue-400",
        };
      case "pending":
      default:
        return {
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-200 dark:border-orange-800",
          textColor: "text-orange-700 dark:text-orange-400",
          icon: AlertTriangle,
          label: "Outstanding Balance",
          amountColor: "text-orange-600 dark:text-orange-400",
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${config.bgColor}`}>
          <IconComponent className={`w-5 h-5 ${config.textColor}`} />
        </div>
        <div className="flex-1">
          <div className={`text-sm font-semibold ${config.textColor}`}>
            {config.label}
          </div>
          <div className={`text-lg font-bold ${config.amountColor}`}>
            {status === "fully_paid" ? "₱0.00" : formatCurrency(balance)}
          </div>
          {status === "fully_paid" && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              All payments completed
            </div>
          )}
          {status === "partially_paid" && (
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Partial payment received
            </div>
          )}
          {status === "pending" && balance > 0 && (
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Payment due
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Safe fetch function with error handling
const safeFetch = async (url) => {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("Server returned HTML instead of JSON");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    return [];
  }
};

export default function ParentInformationModal({
  isOpen,
  onClose,
  parent,
  onParentUpdate,
}) {
  const [parentDetails, setParentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Location data states
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Fetch regions on mount with error handling
  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true);
      try {
        const data = await safeFetch("https://psgc.cloud/api/regions");
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };

    if (isOpen) {
      fetchRegions();
    }
  }, [isOpen]);

  // Fetch provinces when region changes
  useEffect(() => {
    const regionCode = editData.regionCode;
    if (regionCode) {
      const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
          const data = await safeFetch(
            `https://psgc.cloud/api/regions/${regionCode}/provinces`
          );
          setProvinces(data);

          // If no provinces, fetch cities directly from region
          if (!data || data.length === 0) {
            setLoadingCities(true);
            try {
              const citiesData = await safeFetch(
                `https://psgc.cloud/api/regions/${regionCode}/cities-municipalities`
              );
              setCities(citiesData);
            } catch (error) {
              console.error("Error fetching cities from region:", error);
              setCities([]);
            } finally {
              setLoadingCities(false);
            }
          } else {
            setCities([]);
          }
        } catch (error) {
          console.error("Error fetching provinces:", error);
          setProvinces([]);
        } finally {
          setLoadingProvinces(false);
        }
      };
      fetchProvinces();
    } else {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }
  }, [editData.regionCode]);

  // Fetch cities when province changes
  useEffect(() => {
    const provinceCode = editData.provinceCode;
    if (provinceCode) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const data = await safeFetch(
            `https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`
          );
          setCities(data);
        } catch (error) {
          console.error("Error fetching cities:", error);
          setCities([]);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    } else if (provinces.length > 0) {
      setCities([]);
      setBarangays([]);
    }
  }, [editData.provinceCode, provinces.length]);

  // Fetch barangays when city changes
  useEffect(() => {
    const cityCode = editData.cityCode;
    if (cityCode) {
      const fetchBarangays = async () => {
        setLoadingBarangays(true);
        try {
          const data = await safeFetch(
            `https://psgc.cloud/api/cities-municipalities/${cityCode}/barangays`
          );
          setBarangays(data);
        } catch (error) {
          console.error("Error fetching barangays:", error);
          setBarangays([]);
        } finally {
          setLoadingBarangays(false);
        }
      };
      fetchBarangays();
    } else {
      setBarangays([]);
    }
  }, [editData.cityCode]);

  // Backend-ready parent details fetching with fallback
  const fetchParentDetails = async () => {
    if (!parent) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/parents/${parent.id}/details`);

      if (response.ok) {
        const data = await response.json();
        setParentDetails(data);
        setEditData(data);
      } else {
        throw new Error("API not available");
      }
    } catch (error) {
      console.error("Error fetching parent details:", error);
      const mockData = generateMockParentDetails(parent);
      setParentDetails(mockData);
      setEditData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch parent details when modal opens
  useEffect(() => {
    if (isOpen && parent) {
      fetchParentDetails();
    }
  }, [isOpen, parent]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSaveError("");
      setSaveSuccess(false);
      setSaving(false);
    }
  }, [isOpen]);

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

  const formatFullAddress = (data) => {
    if (!data) return "N/A";

    const addressParts = [
      data.streetAddress,
      data.barangay,
      data.city,
      data.province,
      data.region,
    ].filter((part) => part && part.trim());

    return addressParts.join(", ") || "N/A";
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

  const handleLocationChange = (e, option) => {
    const { name, value } = e.target;

    if (name === "regionCode") {
      setEditData((prev) => ({
        ...prev,
        regionCode: value,
        region: option.name,
        provinceCode: "",
        province: "",
        cityCode: "",
        city: "",
        barangayCode: "",
        barangay: "",
      }));
    } else if (name === "provinceCode") {
      setEditData((prev) => ({
        ...prev,
        provinceCode: value,
        province: option.name,
        cityCode: "",
        city: "",
        barangayCode: "",
        barangay: "",
      }));
    } else if (name === "cityCode") {
      setEditData((prev) => ({
        ...prev,
        cityCode: value,
        city: option.name,
        barangayCode: "",
        barangay: "",
      }));
    } else if (name === "barangayCode") {
      setEditData((prev) => ({
        ...prev,
        barangayCode: value,
        barangay: option.name,
      }));
    }

    if (saveError) {
      setSaveError("");
    }
  };

  const handleValueChange = (field, value) => {
    if (field === "outstandingBalance" || field === "paymentStatus") {
      return;
    }

    const updatedData = {
      ...editData,
      [field]: value,
    };

    // If birthday is being updated, calculate age automatically
    if (field === "birthday" && value) {
      const calculatedAge = calculateAge(value);
      if (calculatedAge) {
        updatedData.age = calculatedAge;
      }
    }

    setEditData(updatedData);
    if (saveError) {
      setSaveError("");
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "birthday",
      "sex",
      "height",
      "weight",
      "birthplace",
      "motherTongue",
      "nationality",
      "streetAddress",
      "regionCode",
      "cityCode",
      "barangayCode",
      "accountEmail",
    ];

    const missingFields = requiredFields.filter(
      (field) => !editData[field]?.trim()
    );

    if (missingFields.length > 0) {
      setSaveError(`Please fill in all required fields`);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editData.email && !emailRegex.test(editData.email)) {
      setSaveError("Please enter a valid email address");
      return false;
    }

    if (editData.accountEmail && !emailRegex.test(editData.accountEmail)) {
      setSaveError("Please enter a valid account email address");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const updateData = {
        ...editData,
        outstandingBalance: parentDetails?.outstandingBalance || 0,
        paymentStatus: parentDetails?.paymentStatus || "pending",
        id: parentDetails?.id || parent?.id,
        updatedAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Backend-ready API call with fallback
      try {
        const response = await fetch(`/api/parents/${parent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          const updatedData = await response.json();
          setParentDetails(updatedData);

          if (onParentUpdate) {
            onParentUpdate(updatedData);
          }
        } else {
          // If API fails, update locally but preserve financial data
          setParentDetails(updateData);
          if (onParentUpdate) {
            onParentUpdate(updateData);
          }
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        // Fallback: update locally
        setParentDetails(updateData);
        if (onParentUpdate) {
          onParentUpdate(updateData);
        }
      }

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating parent information:", error);
      setSaveError("Failed to save changes");
      setTimeout(() => setSaveError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(parentDetails);
    setIsEditing(false);
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleEdit = () => {
    setEditData(parentDetails);
    setIsEditing(true);
    setSaveError("");
    setSaveSuccess(false);
  };

  if (!isOpen) return null;

  // Use editData when editing, otherwise use parentDetails
  const displayData = isEditing ? editData : parentDetails;

  const hasNoProvinces =
    editData.regionCode && provinces.length === 0 && !loadingProvinces;

  // Calculate full name
  const fullName = displayData
    ? `${displayData.firstName || ""} ${displayData.middleName || ""} ${
        displayData.lastName || ""
      } ${displayData.suffix || ""}`
        .trim()
        .replace(/\s+/g, " ")
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Wider modal container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[85vh] overflow-y-auto font-kumbh">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center rounded-t-xl z-10">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Parent Information
          </h2>

          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
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
        </div>

        {/* Save Status Messages */}
        {(saveError || saveSuccess || saving) && (
          <div
            className={`px-6 py-3 ${
              saveError
                ? "bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800"
                : saveSuccess
                ? "bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800"
                : "bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm ${
                saveError
                  ? "text-red-700 dark:text-red-400"
                  : saveSuccess
                  ? "text-green-700 dark:text-green-400"
                  : "text-blue-700 dark:text-blue-400"
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
                  <span>Parent information updated successfully!</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal content */}
        <div className="p-5">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : displayData ? (
            <>
              {/* Parent photo and basic info with balance */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="w-24 h-24 mx-auto md:mx-0 rounded-full bg-yellow-400 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-md">
                    {parent?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "PM"}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {fullName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Parent ID: {parent?.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Email: {displayData?.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Child: {parent?.child || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Outstanding Balance Display - NON-EDITABLE */}
                <div className="w-full md:w-64">
                  <BalanceDisplay
                    balance={displayData?.outstandingBalance || 0}
                    status={displayData?.paymentStatus || "pending"}
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Balance information cannot be edited
                    </p>
                  )}
                </div>
              </div>

              {/* Main content grid - 3 columns for better space utilization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white border-b pb-1 dark:border-gray-700">
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
                    placeholder="Enter first name"
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
                  />

                  <EditableInfoRow
                    label="Last Name"
                    value={displayData?.lastName}
                    field="lastName"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    placeholder="Enter last name"
                  />

                  <EditableInfoRow
                    label="Suffix"
                    value={displayData?.suffix}
                    field="suffix"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={false}
                    placeholder="Suffix (optional)"
                  />

                  <EditableInfoRow
                    label="Birthday"
                    value={
                      isEditing
                        ? displayData?.birthday
                        : formatBirthdayForDisplay(displayData?.birthday)
                    }
                    field="birthday"
                    isEditing={isEditing}
                    type={isEditing ? "date" : "text"}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                  />

                  <EditableInfoRow
                    label="Age"
                    value={
                      displayData?.age ||
                      (displayData?.birthday
                        ? calculateAge(displayData.birthday)
                        : "")
                    }
                    field="age"
                    isEditing={isEditing}
                    type="text"
                    onValueChange={handleValueChange}
                    readOnly={true}
                    disabled={saving}
                    required={true}
                    placeholder="Age"
                  />
                </div>

                {/* Contact & Physical Information */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white border-b pb-1 dark:border-gray-700">
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
                    placeholder="Enter email address"
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
                    placeholder="Enter phone number"
                  />

                  <EditableInfoRow
                    label="Sex"
                    value={displayData?.sex}
                    field="sex"
                    isEditing={isEditing}
                    type="select"
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                  />

                  <EditableInfoRow
                    label="Height"
                    value={displayData?.height}
                    field="height"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    placeholder="Enter height"
                  />

                  <EditableInfoRow
                    label="Weight"
                    value={displayData?.weight}
                    field="weight"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    placeholder="Enter weight"
                  />
                </div>

                {/* Background & Account Information */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white border-b pb-1 dark:border-gray-700">
                    Background & Account
                  </h4>

                  <EditableInfoRow
                    label="Birthplace"
                    value={displayData?.birthplace}
                    field="birthplace"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    placeholder="Enter birthplace"
                  />

                  <EditableInfoRow
                    label="Mother Tongue"
                    value={displayData?.motherTongue}
                    field="motherTongue"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    placeholder="Enter mother tongue"
                  />

                  <EditableInfoRow
                    label="Nationality"
                    value={displayData?.nationality}
                    field="nationality"
                    isEditing={isEditing}
                    onValueChange={handleValueChange}
                    disabled={saving}
                    required={true}
                    placeholder="Enter nationality"
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
                    placeholder="Enter account email"
                  />

                  {/* Full Address Display (when not editing) */}
                  {!isEditing && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Address
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">
                        {formatFullAddress(displayData)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information - Only show when editing */}
              {isEditing && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white border-b pb-1 dark:border-gray-700">
                    Address Information
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <EditableInfoRow
                      label="Street Address"
                      value={displayData?.streetAddress}
                      field="streetAddress"
                      isEditing={isEditing}
                      className="col-span-2"
                      onValueChange={handleValueChange}
                      disabled={saving}
                      required={true}
                      placeholder="Enter street address"
                    />

                    <SearchableSelect
                      label="Region"
                      name="regionCode"
                      icon={MapPin}
                      placeholder="Select region"
                      value={displayData?.regionCode}
                      onChange={handleLocationChange}
                      options={regions}
                      loading={loadingRegions}
                      disabled={!isEditing || saving}
                      error={""}
                      required={true}
                    />

                    <SearchableSelect
                      label="Province"
                      name="provinceCode"
                      icon={MapPin}
                      placeholder={
                        hasNoProvinces
                          ? "No provinces (skip to city)"
                          : "Select province"
                      }
                      value={displayData?.provinceCode}
                      onChange={handleLocationChange}
                      options={provinces}
                      loading={loadingProvinces}
                      disabled={
                        !isEditing ||
                        saving ||
                        !displayData?.regionCode ||
                        hasNoProvinces
                      }
                      required={!hasNoProvinces}
                      error={""}
                    />

                    <SearchableSelect
                      label="City / Municipality"
                      name="cityCode"
                      icon={MapPin}
                      placeholder="Select city / municipality"
                      value={displayData?.cityCode}
                      onChange={handleLocationChange}
                      options={cities}
                      loading={loadingCities}
                      disabled={
                        !isEditing ||
                        saving ||
                        (hasNoProvinces
                          ? !displayData?.regionCode
                          : !displayData?.provinceCode)
                      }
                      error={""}
                      required={true}
                    />

                    <SearchableSelect
                      label="Barangay"
                      name="barangayCode"
                      icon={MapPin}
                      placeholder="Select barangay"
                      value={displayData?.barangayCode}
                      onChange={handleLocationChange}
                      options={barangays}
                      loading={loadingBarangays}
                      disabled={!isEditing || saving || !displayData?.cityCode}
                      error={""}
                      required={true}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Failed to load parent details.
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-end gap-2 rounded-b-xl">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-kumbh flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-kumbh disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
              <button
                onClick={handleEdit}
                disabled={saving}
                className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-400 transition-colors font-kumbh disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Parent Info
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
