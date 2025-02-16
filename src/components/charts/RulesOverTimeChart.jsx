'use client';
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rules = payload.find((p) => p.dataKey === 'Rules')?.value || 0;
    const laws = payload.find((p) => p.dataKey === 'Laws')?.value || 0;
    const ratio = laws !== 0 ? (rules / laws).toFixed(1) : '0.0';

    return (
      <div
        style={{
          backgroundColor: '#1F2937',
          border: 'none',
          borderRadius: '0.5rem',
          color: '#F3F4F6',
          padding: '0.5rem'
        }}
      >
        <p>In {label}, there were {ratio} rules per law.</p>
        <p>Rules: {rules}</p>
        <p>Laws: {laws}</p>
      </div>
    );
  }
  return null;
};

export default function RulesOverTimeChart({ rulesData, lawsData }) {
  const [showAllData, setShowAllData] = useState(false);

  const filterData = (data) => {
    if (!showAllData) {
      return data.filter(item => item.year >= 2012 && item.year <= 2025);
    }
    return data;
  };

  const combinedData = filterData(rulesData).map((rule) => ({
    year: rule.year,
    Rules: rule.count,
    Laws: lawsData.find((law) => law.year === rule.year)?.count || 0
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setShowAllData(!showAllData)}
          className="px-4 py-2 rounded-md text-sm transition-all duration-200 
            bg-gray-900/50 text-gray-400 border border-gray-800
            hover:bg-gray-900/70 hover:text-gray-300 hover:border-gray-700
            hover:shadow-lg hover:shadow-black/20"
        >
          {showAllData ? 'Show Recent Data' : 'Show All Data'}
        </button>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={combinedData}>
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="Rules"
              fill="#3B82F6"
              name="Rules"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Laws"
              fill="#10B981"
              name="Laws"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}