'use client';
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SubruleItem = ({ subrule }) => (
  <div className="pl-8 border-l-2 border-gray-800 mt-4">
    <div className="text-gray-300 font-medium mb-2">
      {subrule.subrule_number && `${subrule.subrule_number})`}
    </div>
    <div className="text-gray-400 text-sm mb-3">
      {subrule.subrule_text}
    </div>
    {subrule.description && (
      <div className="text-gray-500 text-sm italic mb-2">
        {subrule.description}
      </div>
    )}
  </div>
);

const RuleAccordion = ({ rule }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-start justify-between hover:bg-gray-900/50 transition-all duration-200"
      >
        <div className="flex flex-col items-start flex-1 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-medium">{rule.citation}</span>
          </div>
          <h5 className="text-white font-medium mt-1 text-left">
            {rule.rule_title}
          </h5>
          {rule.description && (
            <p className="text-gray-400 text-sm mt-2 italic">
              {rule.description}
            </p>
          )}
        </div>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-800">
          <div className="text-gray-300 whitespace-pre-wrap">
            {rule.rule_text}
          </div>
          {rule.subrules && rule.subrules.length > 0 && (
            <div className="mt-4">
              {rule.subrules.map((subrule) => (
                <SubruleItem key={subrule.id} subrule={subrule} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChapterAccordion = ({ chapter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchRules = async () => {
    if (!isOpen) {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/api/v1/agencies/chapters/${chapter.id}/rules`);
        if (!response.ok) {
          throw new Error('Failed to fetch rules');
        }
        const data = await response.json();
        setRules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && rules.length === 0) {
      fetchRules();
    }
  };
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-start justify-between bg-gray-900/70 hover:bg-gray-900/90 transition-all duration-200"
      >
        <div className="flex flex-col items-start flex-1 pr-4">
          <span className="text-blue-400 font-medium">Chapter {chapter.chapter_number}</span>
          <h4 className="text-lg font-semibold text-white mt-1 text-left">
            {chapter.chapter_title}
          </h4>
          <p className="text-gray-400 text-sm mt-1">
            {chapter.total_word_count.toLocaleString()} Words
          </p>
        </div>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
          <div className="space-y-2 mb-4">
            <p className="text-gray-400 text-sm">
              Last Updated: {new Date(chapter.last_modified_date).toLocaleDateString()}
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
            </div>
          ) : rules.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No rules found for this chapter.</p>
          ) : (
            <div className="space-y-4 mt-6">
              {rules.map((rule) => (
                <RuleAccordion key={rule.id} rule={rule} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AgencyAccordion = ({ agency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChapters = async () => {
    if (!isOpen) {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/api/v1/agencies/year/${agency.id}/chapters`);
        if (!response.ok) {
          throw new Error('Failed to fetch chapters');
        }
        const data = await response.json();
        setChapters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && chapters.length === 0) {
      fetchChapters();
    }
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <div className="border border-gray-800 rounded-lg mb-4 overflow-hidden transition-all duration-200 hover:border-gray-700">
      <button
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-200"
      >
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-bold text-white">{agency.agency_name}</h3>
          <p className="text-gray-400 text-sm mt-1">
            Agency Number: {agency.agency_number} • Words: {formatNumber(agency.total_word_count)}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Last Updated: {new Date(agency.last_modified_date).toLocaleDateString()}
          </p>
        </div>
        <ChevronDownIcon 
          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-6 bg-gray-900/30 border-t border-gray-800">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
            </div>
          ) : chapters.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No chapters found for this agency.</p>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <ChapterAccordion key={chapter.id} chapter={chapter} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyAccordion; 