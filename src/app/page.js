'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import RulesOverTimeChart from '../components/charts/RulesOverTimeChart';
import AgencyBarChart from '../components/charts/AgencyCards';
import TotalWordsChart from '../components/charts/TotalWordsChart';
import Timeline from '../components/charts/Timeline';
import regulationsData from '../data/regulations.json';
import Image from 'next/image';

export default function Home() {
  const [rulesData, setRulesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/rules/new?start_year=2012&end_year=2025`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setRulesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentYearData = rulesData.length > 0 
    ? rulesData.find(d => d.year === 2024)
    : null;

  const unconstitutionalityIndex = currentYearData
    ? (currentYearData.new_rules_count / currentYearData.total_laws).toFixed(1)
    : '...';

  const scrollToAgencies = () => {
    document.getElementById('agencies-section').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-[#020617] border-b border-gray-800/50">
        <nav className="max-w-7xl mx-auto px-4 py-3">
          {/* Mobile Layout (default) */}
          <div className="md:hidden flex flex-col items-center space-y-3">
            <div className="flex items-center justify-between w-full">
              <div className="relative w-20">
                <Image
                  src="/logo.webp"
                  alt="Department Logo"
                  width={80}
                  height={80}
                  className="w-full h-full"
                />
              </div>
              <button
                onClick={scrollToAgencies}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Explore
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-base font-semibold leading-none">
            GOVERNMENT ANALYTICS
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                The people are curious.
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 md:items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-40">
                <Image
                  src="/logo.webp"
                  alt="Department Logo"
                  width={144}
                  height={144}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-lg font-semibold leading-none">
                DEPARTMENT OF GOVERNMENT ANALYTICS
              </h1>
              <p className="text-sm text-gray-400">
                The people are curious.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={scrollToAgencies}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Explore
              </button>
            </div>
          </div>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
            Bureaucracy Index
          </h2>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 text-center mb-2">
            5.2
          </div>
          <p className="text-gray-400 font-medium text-center text-base sm:text-lg px-4 sm:px-0 w-full sm:w-5/12 mx-auto">
            This is the number of agency rules created by unelected bureaucrats for each law passed by Iowa's Elected Officials.
          </p>
        </div>
        
        <section className="mb-16 sm:mb-32">
          <RulesOverTimeChart initialData={rulesData} />
        </section>
        
        <section className="mb-16 sm:mb-32">
          <Timeline />
        </section>
        
        <section className="mb-16 sm:mb-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">
            Rules and Word Count Over Time
          </h2>
          <p className="text-gray-400 font-medium text-center text-base sm:text-lg px-4 sm:px-0 w-full sm:w-5/12 mx-auto mb-6 sm:mb-8">
            Get a feel for the change in volume and complexity of Iowa's regulations over time.
          </p>
          <TotalWordsChart />
        </section>
        
        <section id="agencies-section" className="mb-16 sm:mb-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">
            Regulations by State Agency
          </h2>
          <p className="text-gray-400 font-medium text-center text-base sm:text-lg px-4 sm:px-0 w-full sm:w-5/12 mx-auto mb-6 sm:mb-8">
            Search and sort through Iowa's regulatory agencies to see their impact on the state's regulatory landscape.
          </p>
          <AgencyBarChart data={regulationsData.rulesByAgency} />
        </section>
      </main>
    </div>
  );
} 