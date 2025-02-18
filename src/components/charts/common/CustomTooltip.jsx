import React from 'react';

const TooltipContainer = ({ children }) => (
  <div
    style={{
      backgroundColor: '#1F2937',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#F3F4F6',
      padding: '0.5rem'
    }}
  >
    {children}
  </div>
);

export default TooltipContainer; 