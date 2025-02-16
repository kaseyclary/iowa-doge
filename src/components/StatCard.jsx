'use client';
import React from 'react';

const StatCard = ({ title, value, subtitle, className = '' }) => {
  return (
    <div className={`p-6 rounded-lg bg-gray-900 ${className}`}>
      <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
      <div className="text-4xl font-bold text-blue-400 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {subtitle && (
        <p className="text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard; 