'use client';
import React, { useState, useEffect } from 'react';
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
import { formatNumber, getAxisFontSize } from './utils/formatters';
import TooltipContainer from './common/TooltipContainer';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <TooltipContainer>
      <p>In {label}:</p>
      {payload.map((entry) => (
        <p key={entry.name}>
          {entry.name}: {formatNumber(entry.value)}
        </p>
      ))}
    </TooltipContainer>
  );
};

export default function RulesOverTimeChart() {
  const [showAllData, setShowAllData] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startYear = showAllData ? 2003 : 2012;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/rules/new?start_year=${startYear}&end_year=2024`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const jsonData = await response.json();
        const formattedData = jsonData.map(item => ({
          year: item.year,
          Rules: item.new_rules_count,
          Laws: item.total_laws
        }));
        
        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showAllData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px] text-red-500">
        Error: {error}
      </div>
    );
  }

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
          <BarChart data={data}>
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              fontSize={getAxisFontSize()}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={formatNumber}
              fontSize={getAxisFontSize()}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="Rules"
              fill="#3B82F6"
              name="New Rules"
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