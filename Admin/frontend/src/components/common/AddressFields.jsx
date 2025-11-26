import { Home, MapPin } from "lucide-react";
import SearchableSelect from "./SearchableSelect";

/**
 * Reusable Address Fields Component using PSGC data
 * @param {Object} props - Component props
 * @param {Object} props.locationData - Location data from useLocationData hook
 * @param {Array} props.regions - Array of regions
 * @param {Array} props.provinces - Array of provinces
 * @param {Array} props.cities - Array of cities
 * @param {Array} props.barangays - Array of barangays
 * @param {boolean} props.loadingRegions - Loading state for regions
 * @param {boolean} props.loadingProvinces - Loading state for provinces
 * @param {boolean} props.loadingCities - Loading state for cities
 * @param {boolean} props.loadingBarangays - Loading state for barangays
 * @param {Function} props.handleLocationChange - Handler for location changes
 * @param {Function} props.handleStreetAddressChange - Handler for street address changes
 * @param {boolean} props.hasNoProvinces - Whether the region has no provinces
 * @param {boolean} props.disabled - Whether fields are disabled
 * @param {boolean} props.darkMode - Dark mode flag
 */
export default function AddressFields({
  locationData,
  regions,
  provinces,
  cities,
  barangays,
  loadingRegions,
  loadingProvinces,
  loadingCities,
  loadingBarangays,
  handleLocationChange,
  handleStreetAddressChange,
  hasNoProvinces,
  disabled = false,
  darkMode = false,
}) {
  return (
    <div className="space-y-3">
      {/* Street Address */}
      <div>
        <label
          className={`block mb-1 text-xs font-semibold uppercase tracking-wider ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Street Address
        </label>
        <div className="relative">
          <Home
            className={`absolute left-3 top-2.5 w-4 h-4 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            value={locationData.streetAddress || ""}
            onChange={(e) => handleStreetAddressChange(e.target.value)}
            placeholder="Enter street address"
            disabled={disabled}
            className={`w-full pl-10 px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all focus:ring-3 ${
              darkMode
                ? "bg-gray-700 border-yellow-500 text-white focus:border-yellow-400 focus:ring-yellow-500 placeholder-gray-400"
                : "bg-white border-yellow-500 focus:border-yellow-600 focus:ring-yellow-200 placeholder-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      {/* Region */}
      <SearchableSelect
        label="Region"
        name="regionCode"
        icon={MapPin}
        placeholder="Select region"
        value={locationData.regionCode}
        onChange={handleLocationChange}
        options={regions}
        loading={loadingRegions}
        disabled={disabled}
        darkMode={darkMode}
      />

      {/* Province */}
      <SearchableSelect
        label="Province"
        name="provinceCode"
        icon={MapPin}
        placeholder={
          hasNoProvinces ? "No provinces (skip to city)" : "Select province"
        }
        value={locationData.provinceCode}
        onChange={handleLocationChange}
        options={provinces}
        loading={loadingProvinces}
        disabled={disabled || !locationData.regionCode || hasNoProvinces}
        required={!hasNoProvinces}
        darkMode={darkMode}
      />

      {/* City/Municipality */}
      <SearchableSelect
        label="City/Municipality"
        name="cityCode"
        icon={MapPin}
        placeholder="Select city/municipality"
        value={locationData.cityCode}
        onChange={handleLocationChange}
        options={cities}
        loading={loadingCities}
        disabled={
          disabled ||
          (hasNoProvinces
            ? !locationData.regionCode
            : !locationData.provinceCode)
        }
        darkMode={darkMode}
      />

      {/* Barangay */}
      <SearchableSelect
        label="Barangay"
        name="barangayCode"
        icon={MapPin}
        placeholder="Select barangay"
        value={locationData.barangayCode}
        onChange={handleLocationChange}
        options={barangays}
        loading={loadingBarangays}
        disabled={disabled || !locationData.cityCode}
        darkMode={darkMode}
      />
    </div>
  );
}
