import React, { createContext, useState, useCallback } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [selectedPreschools, setSelectedPreschools] = useState([]);
  const [comparisonType, setComparisonType] = useState('admission');

  const addToComparison = useCallback((preschool) => {
    setSelectedPreschools((prev) => {
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
    setSelectedPreschools((prev) =>
      prev.filter((p) => p.id !== preschoolId)
    );
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedPreschools([]);
  }, []);

  const value = {
    selectedPreschools,
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
