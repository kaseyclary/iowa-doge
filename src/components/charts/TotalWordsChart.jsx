'use client';
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatNumber, getAxisFontSize } from './utils/formatters';
import TooltipContainer from './common/TooltipContainer';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const rules = payload.find((p) => p.dataKey === 'total_rules')?.value || 0;
  const words = payload.find((p) => p.dataKey === 'total_word_count')?.value || 0;

  return (
    <TooltipContainer>
      <p>In {label}:</p>
      <p>Total Rules: {formatNumber(rules)}</p>
      <p>Total Words: {formatNumber(words)}</p>
    </TooltipContainer>
  );
};

const TotalWordsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllData, setShowAllData] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/total_rule_volume?start_year=2003&end_year=2023`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch total rule volume data');
        return response.json();
      })
      .then(dataset => {
        setData(dataset);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getDisplayedData = () => {
    if (showAllData || data.length <= 10) return data;
    return data.slice(-10);
  };

  const formatRulesYAxis = (value) => {
    return value;
  };

  const formatWordsYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value;
  };

  const formatXAxis = (value) => {
    return value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[300px] text-red-500">
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
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getDisplayedData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
              yAxisId="left"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={formatNumber}
              fontSize={getAxisFontSize()}
              width={45}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatNumber}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              fontSize={getAxisFontSize()}
              width={45}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{
                fill: '#FFFFFF',
                opacity: 0.1
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="total_rules"
              fill="#3B82F6"
              name="Total Rules"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="total_word_count"
              fill="#10B981"
              name="Total Word Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalWordsChart; 