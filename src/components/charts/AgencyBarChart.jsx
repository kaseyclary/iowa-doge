'use client';
import React, { useState } from 'react';

const AgencyCard = ({ agency, words, sections }) => {
  return (
    <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 transition-all duration-200 hover:bg-gray-900/70 hover:border-gray-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20">
      <h3 className="text-xl font-bold text-white mb-4 transition-colors duration-200 group-hover:text-blue-400">{agency}</h3>
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold text-blue-400 transition-colors duration-200 hover:text-blue-300">
          {typeof words === 'number' ? `${(words/1000).toFixed(2)}K` : words}
        </div>
        <div className="text-sm text-gray-400">Words</div>
        <div className="text-2xl font-bold text-white mt-2 transition-colors duration-200 hover:text-gray-200">
          {sections.toFixed(2)}
        </div>
        <div className="text-sm text-gray-400">Sections of regulation</div>
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

const AgencyBarChart = ({ data }) => {
  const [sortType, setSortType] = useState('words');

  const getSortedData = () => {
    switch (sortType) {
      case 'words':
        return [...data].sort((a, b) => (b.words || b.count) - (a.words || a.count));
      case 'regulations':
        return [...data].sort((a, b) => (b.sections || b.count) - (a.sections || a.count));
      case 'agency':
        return [...data].sort((a, b) => a.agency.localeCompare(b.agency));
      default:
        return data;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2">
        <SortButton 
          active={sortType === 'words'} 
          onClick={() => setSortType('words')}
        >
          Sort by Words ↕
        </SortButton>
        <SortButton 
          active={sortType === 'regulations'} 
          onClick={() => setSortType('regulations')}
        >
          Sort by Regulations ↕
        </SortButton>
        <SortButton 
          active={sortType === 'agency'} 
          onClick={() => setSortType('agency')}
        >
          Sort by Agency ↕
        </SortButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {getSortedData().map((item) => (
          <AgencyCard
            key={item.agency}
            agency={item.agency}
            words={item.words || item.count}
            sections={item.sections || Math.round(item.count * 0.3)}
          />
        ))}
      </div>
    </div>
  );
};

export default AgencyBarChart; 