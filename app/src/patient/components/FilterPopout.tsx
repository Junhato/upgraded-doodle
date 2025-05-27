import React from 'react';

interface FilterPopoutProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const FilterPopout: React.FC<FilterPopoutProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
}; 