'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { useRouter } from 'next/navigation';
import CountUp from '../../components/CountUp';

const AgencyCard = ({ id, agency, words, sections, yearlyStats, complexity_score }) => {
  const router = useRouter();

  // Transform yearly stats for the chart
  const chartData = yearlyStats?.map(stat => ({
    year: stat.year,
    words: stat.total_word_count,
    rules: stat.rules_count
  })) || [];

  // Calculate domains for both axes with padding
  const wordsMax = Math.max(...chartData.map(d => d.words));
  const rulesMax = Math.max(...chartData.map(d => d.rules));
  
  // Calculate the minimum values to potentially start above zero
  const wordsMin = Math.min(...chartData.map(d => d.words));
  const rulesMin = Math.min(...chartData.map(d => d.rules));
  
  // Create padding for better visualization
  const wordsPadding = (wordsMax - wordsMin) * 0.1;
  const rulesPadding = (rulesMax - rulesMin) * 0.1;

  const handleClick = () => {
    router.push(`/agency/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 
        transition-all duration-200 hover:bg-gray-900/70 hover:border-gray-700 
        hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 cursor-pointer"
    >
      <h3 className="text-xl font-bold text-white mb-4 transition-colors duration-200 group-hover:text-blue-400">{agency}</h3>
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-400 transition-colors duration-200 hover:text-blue-300">
              <CountUp 
                value={words} 
                formatFn={(n) => `${(n/1000).toFixed(2)}K`}
              />
            </div>
            <div className="text-sm text-gray-400">Words</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white transition-colors duration-200 hover:text-gray-200">
              <CountUp 
                value={sections} 
                formatFn={(n) => n.toFixed(0)}
              />
            </div>
            <div className="text-sm text-gray-400">Rules</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 transition-colors duration-200 hover:text-green-300">
              <CountUp 
                value={complexity_score || 0} 
                formatFn={(n) => n.toFixed(2)}
              />
            </div>
            <div className="text-sm text-gray-400">Complexity</div>
          </div>
        </div>
        {/* Updated mini chart */}
        {chartData.length > 0 && (
          <div className="h-20 mt-4 opacity-50 hover:opacity-100 transition-opacity duration-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 15, left: 5 }}>
                <XAxis 
                  dataKey="year"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={(value, index) => index === 0 || index === chartData.length - 1 ? value : ''}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="words"
                  orientation="left"
                  domain={[
                    Math.max(0, wordsMin - wordsPadding),
                    wordsMax + wordsPadding
                  ]}
                  hide={true}
                />
                <YAxis 
                  yAxisId="rules"
                  orientation="right"
                  domain={[
                    Math.max(0, rulesMin - rulesPadding),
                    rulesMax + rulesPadding
                  ]}
                  hide={true}
                />
                <Line 
                  yAxisId="words"
                  type="monotone"
                  dataKey="words"
                  stroke="#60A5FA"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={true}
                />
                <Line 
                  yAxisId="rules"
                  type="monotone"
                  dataKey="rules"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const SortButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
      active 
        ? 'bg-gray-800 text-white shadow-lg shadow-black/20' 
        : 'bg-gray-900/50 text-gray-400 hover:bg-gray-900/70 hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

// Add a debounce utility function at the top
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Normalize text for searching
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
};

const AgencyBarChart = ({ data: initialData }) => {
  const [sortType, setSortType] = useState('rules');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/stats/agency`);
        if (!response.ok) throw new Error('Failed to fetch agency stats');
        const agencyStats = await response.json();
        
        const formattedData = agencyStats.map(stat => ({
          id: stat.agency_id,
          agency: stat.agency,
          words: stat.recent_total_word_count,
          sections: stat.recent_rules_count,
          yearlyStats: stat.yearly_stats,
          complexity_score: stat.complexity_score
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error('Error fetching agency stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize the search and sort functions
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Memoize the filtered and sorted data
  const sortedAndFilteredData = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);
    
    // First filter by search term
    const filteredData = data.filter(item => {
      const normalizedAgency = normalizeText(item.agency);
      return normalizedAgency.includes(normalizedSearch);
    });

    // Then sort the filtered data
    return [...filteredData].sort((a, b) => {
      switch (sortType) {
        case 'words':
          return b.words - a.words;
        case 'rules':
          return b.sections - a.sections;
        case 'complexity':
          if (!a.complexity_score) return 1;
          if (!b.complexity_score) return -1;
          return b.complexity_score - a.complexity_score;
        case 'agency':
          return a.agency.localeCompare(b.agency);
        default:
          return 0;
      }
    });
  }, [data, searchTerm, sortType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading agency data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search agencies..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 
              rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                handleSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                hover:text-gray-300 focus:outline-none"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="flex justify-center gap-2 flex-wrap">
          <SortButton 
            active={sortType === 'words'} 
            onClick={() => setSortType('words')}
          >
            Sort by Words ↕
          </SortButton>
          <SortButton 
            active={sortType === 'rules'} 
            onClick={() => setSortType('rules')}
          >
            Sort by Rules ↕
          </SortButton>
          <SortButton 
            active={sortType === 'complexity'} 
            onClick={() => setSortType('complexity')}
          >
            Sort by Complexity ↕
          </SortButton>
          <SortButton 
            active={sortType === 'agency'} 
            onClick={() => setSortType('agency')}
          >
            Sort by Agency ↕
          </SortButton>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedAndFilteredData.length > 0 ? (
          sortedAndFilteredData.map((item) => (
            <AgencyCard
              key={item.id}
              id={item.id}
              agency={item.agency}
              words={item.words}
              sections={item.sections}
              yearlyStats={item.yearlyStats}
              complexity_score={item.complexity_score}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-8">
            No agencies found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyBarChart; 