import React from 'react';
import StatCard from '../components/StatCard';
import RulesOverTimeChart from '../components/charts/RulesOverTimeChart';
import AgencyBarChart from '../components/charts/AgencyBarChart';
import TotalWordsChart from '../components/charts/TotalWordsChart';
import regulationsData from '../data/regulations.json';

export default function Home() {
  const currentYear = 2024;
  const currentYearStats = {
    year: currentYear,
    rulesCount: regulationsData.rulesCountByYear.find(d => d.year === currentYear).count,
    lawsCount: regulationsData.lawsCountByYear.find(d => d.year === currentYear).count,
  };

  const unconstitutionalityIndex = (
    currentYearStats.rulesCount / currentYearStats.lawsCount
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Iowa State Regulations Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-2">
            Bureaucracy Index
          </h2>
          <div className="text-4xl font-extrabold text-blue-400 text-center mb-2">
            {unconstitutionalityIndex}
          </div>
          <p className="text-gray-400 font-medium text-center text-lg w-5/12 mx-auto">
          This is the number of agency rules created by unelected bureaucrats for each law passed by Iowa's Elected Officials.
          </p>
        </div>
        <section className="mb-32">
          <RulesOverTimeChart 
            rulesData={regulationsData.rulesCountByYear}
            lawsData={regulationsData.lawsCountByYear}
          />
        </section>
        <section className="mb-32">
          <TotalWordsChart data={regulationsData} />
        </section>
          <div className="space-y-16">
          <section className="mb-32">
            <h2 className="text-4xl font-bold text-center mb-8">
              Regulations by State Agency
            </h2>
            <AgencyBarChart data={regulationsData.rulesByAgency} />
          </section>
        </div>
      </main>
    </div>
  );
} 