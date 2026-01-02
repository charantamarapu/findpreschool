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
  }, []);

  const value = {
    filters,
    updateFilter,
    clearFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
