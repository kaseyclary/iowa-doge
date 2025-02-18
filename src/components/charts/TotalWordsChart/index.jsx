import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TooltipContainer from '../common/CustomTooltip';
import DataToggleButton from '../common/DataToggleButton';
import { LoadingSpinner, ErrorDisplay } from '../common/ChartStatus';
import { formatWordsYAxis } from './utils';
import CustomTooltip from './CustomTooltip';

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
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  const getDisplayedData = () => 
    showAllData || data.length <= 10 ? data : data.slice(-10);

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <DataToggleButton 
          showAllData={showAllData} 
          onClick={() => setShowAllData(!showAllData)} 
        />
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
            />
            <YAxis
              yAxisId="left"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatWordsYAxis}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
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