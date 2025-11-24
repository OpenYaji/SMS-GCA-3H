import { useState, useEffect, useCallback } from "react";
import psgcService from "../services/psgcService";

/**
 * Custom hook for managing Philippine location data using PSGC API
 * @param {Object} initialData - Initial address data with codes
 * @returns {Object} - Location data and handlers
 */
export const useLocationData = (initialData = {}) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  const [locationData, setLocationData] = useState({
    regionCode: initialData.regionCode || "",
    region: initialData.region || "",
    provinceCode: initialData.provinceCode || "",
    province: initialData.province || "",
    cityCode: initialData.cityCode || "",
    city: initialData.city || "",
    barangayCode: initialData.barangayCode || "",
    barangay: initialData.barangay || "",
    streetAddress: initialData.streetAddress || "",
  });

  // Fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true);
      try {
        const data = await psgcService.getRegions();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  // Fetch provinces when region changes
  useEffect(() => {
    const fetchProvinces = async () => {
      if (!locationData.regionCode) {
        setProvinces([]);
        setCities([]);
        setBarangays([]);
        return;
      }

      setLoadingProvinces(true);
      try {
        const data = await psgcService.getProvinces(locationData.regionCode);
        setProvinces(data);

        // If no provinces (like NCR), fetch cities directly
        if (!data || data.length === 0) {
          setLoadingCities(true);
          try {
            const citiesData = await psgcService.getCitiesByRegion(
              locationData.regionCode
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
          setBarangays([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, [locationData.regionCode]);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!locationData.provinceCode || provinces.length === 0) {
        if (provinces.length === 0 && cities.length === 0) {
          // Don't clear cities if we already have them (NCR case)
          return;
        }
        setCities([]);
        setBarangays([]);
        return;
      }

      setLoadingCities(true);
      try {
        const data = await psgcService.getCitiesByProvince(
          locationData.provinceCode
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
  }, [locationData.provinceCode, provinces.length]);

  // Fetch barangays when city changes
  useEffect(() => {
    const fetchBarangays = async () => {
      if (!locationData.cityCode) {
        setBarangays([]);
        return;
      }

      setLoadingBarangays(true);
      try {
        const data = await psgcService.getBarangays(locationData.cityCode);
        setBarangays(data);
      } catch (error) {
        console.error("Error fetching barangays:", error);
        setBarangays([]);
      } finally {
        setLoadingBarangays(false);
      }
    };

    fetchBarangays();
  }, [locationData.cityCode]);

  /**
   * Handle location field changes
   * @param {Event} e - Change event
   * @param {Object} option - Selected option with name
   */
  const handleLocationChange = useCallback(
    (e, option) => {
      const { name, value } = e.target;

      if (name === "regionCode") {
        setLocationData({
          regionCode: value,
          region: option.name,
          provinceCode: "",
          province: "",
          cityCode: "",
          city: "",
          barangayCode: "",
          barangay: "",
          streetAddress: locationData.streetAddress,
        });
      } else if (name === "provinceCode") {
        setLocationData((prev) => ({
          ...prev,
          provinceCode: value,
          province: option.name,
          cityCode: "",
          city: "",
          barangayCode: "",
          barangay: "",
        }));
      } else if (name === "cityCode") {
        setLocationData((prev) => ({
          ...prev,
          cityCode: value,
          city: option.name,
          barangayCode: "",
          barangay: "",
        }));
      } else if (name === "barangayCode") {
        setLocationData((prev) => ({
          ...prev,
          barangayCode: value,
          barangay: option.name,
        }));
      }
    },
    [locationData.streetAddress]
  ); // Only depend on streetAddress since we use it in regionCode case

  /**
   * Handle street address change
   * @param {string} value - Street address value
   */
  const handleStreetAddressChange = useCallback((value) => {
    setLocationData((prev) => ({
      ...prev,
      streetAddress: value,
    }));
  }, []);

  /**
   * Reset all location data
   */
  const resetLocationData = useCallback(() => {
    setLocationData({
      regionCode: "",
      region: "",
      provinceCode: "",
      province: "",
      cityCode: "",
      city: "",
      barangayCode: "",
      barangay: "",
      streetAddress: "",
    });
  }, []);

  /**
   * Set location data (useful for editing existing data)
   * @param {Object} data - New location data
   */
  const setLocation = useCallback((data) => {
    setLocationData({
      regionCode: data.regionCode || "",
      region: data.region || "",
      provinceCode: data.provinceCode || "",
      province: data.province || "",
      cityCode: data.cityCode || "",
      city: data.city || "",
      barangayCode: data.barangayCode || "",
      barangay: data.barangay || "",
      streetAddress: data.streetAddress || "",
    });
  }, []);

  /**
   * Get formatted full address
   * @returns {string} - Formatted address
   */
  const getFormattedAddress = useCallback(() => {
    return psgcService.formatAddress(locationData);
  }, [locationData]);

  const hasNoProvinces =
    locationData.regionCode && provinces.length === 0 && !loadingProvinces;

  return {
    // Location data
    locationData,
    regions,
    provinces,
    cities,
    barangays,

    // Loading states
    loadingRegions,
    loadingProvinces,
    loadingCities,
    loadingBarangays,

    // Handlers
    handleLocationChange,
    handleStreetAddressChange,
    resetLocationData,
    setLocation,
    getFormattedAddress,

    // Computed properties
    hasNoProvinces,
  };
};

export default useLocationData;
