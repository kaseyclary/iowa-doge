import React from 'react';

const DataToggleButton = ({ showAllData, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-md text-sm transition-all duration-200 
      bg-gray-900/50 text-gray-400 border border-gray-800
      hover:bg-gray-900/70 hover:text-gray-300 hover:border-gray-700
      hover:shadow-lg hover:shadow-black/20"
  >
    {showAllData ? 'Show Recent Data' : 'Show All Data'}
  </button>
);

export default DataToggleButton; 