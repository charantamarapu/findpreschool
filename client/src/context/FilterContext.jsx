import React, { createContext, useState, useCallback } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    city: '',
    minFee: null,
    maxFee: null,
    minRating: null,
    minEstablishedYear: null,
    facilities: [],
    ageGroup: [],
  });

  // Location-based search state
  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(3); // Default 3km
  const [locationError, setLocationError] = useState(null);

  const updateFilter = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      city: '',
      minFee: null,
      maxFee: null,
      minRating: null,
      minEstablishedYear: null,
      facilities: [],
      ageGroup: [],
    });
    setNearbyMode(false);
    setUserLocation(null);
    setLocationError(null);
  }, []);

  // Request user's location
  const requestLocation = useCallback(() => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setNearbyMode(true);
        setLocationError(null);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable it in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
        setNearbyMode(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const disableNearbyMode = useCallback(() => {
    setNearbyMode(false);
    setUserLocation(null);
    setLocationError(null);
  }, []);

  const value = {
    filters,
    updateFilter,
    clearFilters,
    // Location-based search
    nearbyMode,
    userLocation,
    searchRadius,
    setSearchRadius,
    locationError,
    requestLocation,
    disableNearbyMode,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

