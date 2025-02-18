import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center h-[400px] text-red-500">
    Error: {message}
  </div>
); 