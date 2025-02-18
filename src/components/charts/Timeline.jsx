import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatNumber, getAxisFontSize } from './utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  const isRemoval = data.value < 0;
  
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-xl">
      <p className="text-sm text-gray-400 mb-2">{data.year}</p>
      <div className="space-y-3">
        {isRemoval ? (
          <>
            <p className="text-red-400 font-semibold">Removed Agencies:</p>
            {data.removed.map(agency => (
              <p key={agency.agency_id} className="text-sm text-gray-300">
                • {agency.agency_name}
              </p>
            ))}
          </>
        ) : (
          <>
            <p className="text-green-400 font-semibold">New Agencies:</p>
            {data.created.map(agency => (
              <p key={agency.agency_id} className="text-sm text-gray-300">
                • {agency.agency_name}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default function Timeline() {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/timeline?start_year=1998&end_year=2024`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch timeline data');
        return response.json();
      })
      .then(data => {
        // For each year, create one node for new agencies (positive count)
        // and one node for removed agencies (negative count)
        const transformedData = data.flatMap(yearData => {
          const nodes = [];
          if (yearData.created && yearData.created.length > 0) {
            nodes.push({
              year: yearData.year,
              value: yearData.created.length,
              created: yearData.created,
              removed: []
            });
          }
          if (yearData.removed && yearData.removed.length > 0) {
            nodes.push({
              year: yearData.year,
              value: -yearData.removed.length,
              created: [],
              removed: yearData.removed
            });
          }
          return nodes;
        });
        setTimelineData(transformedData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
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
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Agency Timeline</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
          See the evolution of Iowa's regulatory landscape: new agencies above the line and removed agencies below.
        </p>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ 
            top: 20, 
            right: 20, 
            bottom: 20, 
            left: 20,
          }}>
            <XAxis
              dataKey="year"
              type="number"
              domain={[1998, 2025]}
              tickCount={8}
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={value => value}
              angle={-45}
              textAnchor="end"
              height={50}
              fontSize={getAxisFontSize()}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['-4', '4']}
              dataKey="value"
              tickFormatter={value => Math.abs(value)}
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF' }}
              fontSize={getAxisFontSize()}
              width={25}
            />
            <ZAxis range={[100, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <ReferenceLine y={0} stroke="#4B5563" strokeWidth={1} strokeDasharray="3 3" />
            <Scatter
              data={timelineData}
              shape={props => {
                const { cx, cy, payload } = props;
                const fillColor = payload.value >= 0 ? '#34D399' : '#F87171';
                const strokeColor = payload.value >= 0 ? '#065F46' : '#991B1B';
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={10}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={1.5}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#34D399] border border-[#065F46]"></div>
          <span className="text-gray-400 text-sm">New Agencies</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F87171] border border-[#991B1B]"></div>
          <span className="text-gray-400 text-sm">Removed Agencies</span>
        </div>
      </div>
    </div>
  );
} 