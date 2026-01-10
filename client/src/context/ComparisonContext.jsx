import React, { createContext, useState, useCallback } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [selectedPreSchools, setSelectedPreSchools] = useState([]);
  const [comparisonType, setComparisonType] = useState('admission');

  const addToComparison = useCallback((preschool) => {
    setSelectedPreSchools((prev) => {
      // Limit to 4 preschools
      if (prev.length >= 4) {
        return prev;
      }
      // Avoid duplicates
      if (prev.some((p) => p.id === preschool.id)) {
        return prev;
      }
      return [...prev, preschool];
    });
  }, []);

  const removeFromComparison = useCallback((preschoolId) => {
    setSelectedPreSchools((prev) =>
      prev.filter((p) => p.id !== preschoolId)
    );
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedPreSchools([]);
  }, []);

  const value = {
    selectedPreSchools,
    comparisonType,
    setComparisonType,
    addToComparison,
    removeFromComparison,
    clearComparison,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
