import React from 'react';
import TooltipContainer from '../common/CustomTooltip';
import { formatWordsYAxis } from './utils';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const rules = payload.find((p) => p.dataKey === 'total_rules')?.value || 0;
  const words = payload.find((p) => p.dataKey === 'total_word_count')?.value || 0;

  return (
    <TooltipContainer>
      <p>In {label}:</p>
      <p>Total Rules: {rules}</p>
      <p>Total Words: {formatWordsYAxis(words)}</p>
    </TooltipContainer>
  );
};

export default CustomTooltip; 