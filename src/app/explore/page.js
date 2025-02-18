'use client';
import React, { useState, useEffect } from 'react';
import AgencyAccordion from '../../components/AgencyAccordion';

export default function ExplorePage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/by-year/2024`);
        if (!response.ok) {
          throw new Error('Failed to fetch agencies');
        }
        const data = await response.json();
        // Sort agencies by word count in descending order
        const sortedAgencies = data.sort((a, b) => (b.total_word_count || 0) - (a.total_word_count || 0));
        setAgencies(sortedAgencies);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Explore Iowa Regulations</h1>
          <p className="text-gray-400 text-center max-w-2xl">
            Explore regulations across all of the different agencies Iowa has to offer.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {agencies.map((agency) => (
              <AgencyAccordion key={agency.id} agency={agency} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 