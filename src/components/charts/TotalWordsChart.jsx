'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

const TotalWordsChart = ({ data }) => {
  const formatYAxis = (value) => {
    if (value === 0) return '0';
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    }
    return value;
  };

  const formatXAxis = (value) => {
    // Only show years 2012, 2016, 2020, 2024
    if ([2012, 2016, 2020, 2024].includes(value)) {
      return value;
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold">Iowa Rules & Regulations</h2>
        <div className="flex justify-center items-center gap-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400">{data.totalStats.totalWords}</div>
            <div className="text-sm text-gray-400">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{data.totalStats.totalSections}</div>
            <div className="text-sm text-gray-400">Total Sections of regulation</div>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.totalWordsByYear}
            margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
          >
            <XAxis
              dataKey="year"
              tickFormatter={formatXAxis}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              domain={[0, 100000000]}
              ticks={[0, 25000000, 50000000, 75000000, 100000000]}
            />
            <Bar
              dataKey="words"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalWordsChart; 