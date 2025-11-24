/**
 * PSGC (Philippine Standard Geographic Code) Service
 * Handles API calls to the PSGC API for Philippine location data
 */

const PSGC_BASE_URL = "https://psgc.cloud/api";

/**
 * Safe fetch wrapper with error handling
 * @param {string} url - The URL to fetch
 * @returns {Promise<Array>} - Array of location data
 */
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

export const psgcService = {
  /**
   * Fetch all regions
   * @returns {Promise<Array>} - Array of regions with code and name
   */
  async getRegions() {
    return safeFetch(`${PSGC_BASE_URL}/regions`);
  },

  /**
   * Fetch provinces by region code
   * @param {string} regionCode - The region code
   * @returns {Promise<Array>} - Array of provinces
   */
  async getProvinces(regionCode) {
    if (!regionCode) return [];
    return safeFetch(`${PSGC_BASE_URL}/regions/${regionCode}/provinces`);
  },

  /**
   * Fetch cities/municipalities by province code
   * @param {string} provinceCode - The province code
   * @returns {Promise<Array>} - Array of cities/municipalities
   */
  async getCitiesByProvince(provinceCode) {
    if (!provinceCode) return [];
    return safeFetch(
      `${PSGC_BASE_URL}/provinces/${provinceCode}/cities-municipalities`
    );
  },

  /**
   * Fetch cities/municipalities by region code (for regions without provinces like NCR)
   * @param {string} regionCode - The region code
   * @returns {Promise<Array>} - Array of cities/municipalities
   */
  async getCitiesByRegion(regionCode) {
    if (!regionCode) return [];
    return safeFetch(
      `${PSGC_BASE_URL}/regions/${regionCode}/cities-municipalities`
    );
  },

  /**
   * Fetch barangays by city/municipality code
   * @param {string} cityCode - The city/municipality code
   * @returns {Promise<Array>} - Array of barangays
   */
  async getBarangays(cityCode) {
    if (!cityCode) return [];
    return safeFetch(
      `${PSGC_BASE_URL}/cities-municipalities/${cityCode}/barangays`
    );
  },

  /**
   * Parse address string into components
   * Expects format: "Street, Barangay, City, Province, Region"
   * @param {string} fullAddress - The full address string
   * @returns {Object} - Object with address components
   */
  parseAddress(fullAddress) {
    if (!fullAddress) {
      return {
        streetAddress: "",
        barangay: "",
        city: "",
        province: "",
        region: "",
      };
    }

    const parts = fullAddress.split(",").map((part) => part.trim());

    return {
      streetAddress: parts[0] || "",
      barangay: parts[1] || "",
      city: parts[2] || "",
      province: parts[3] || "",
      region: parts[4] || "",
    };
  },

  /**
   * Format address components into full address string
   * @param {Object} addressData - Object with address components
   * @returns {string} - Formatted full address
   */
  formatAddress(addressData) {
    if (!addressData) return "";

    const parts = [
      addressData.streetAddress,
      addressData.barangay,
      addressData.city,
      addressData.province,
      addressData.region,
    ].filter((part) => part && part.trim());

    return parts.join(", ");
  },
};

export default psgcService;
