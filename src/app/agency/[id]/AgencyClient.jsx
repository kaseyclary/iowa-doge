'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AgencyAccordion from '../../../components/AgencyAccordion';
import Navbar from '../../../components/Navbar';
import CountUp from '../../../components/CountUp';

export default function AgencyClient() {
  const { id } = useParams();
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/agency/${id}/${currentYear}/details`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch agency data');
        }
        
        const data = await response.json();
        setAgencyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, [id, currentYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          Error loading agency data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar actionText="Home" />

      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold leading-tight sm:leading-normal text-center sm:text-left mb-2">
            {agencyData?.agencyName || 'Agency Details'}
          </h1>
          
          {agencyData?.complexity_score && (
            <div className="mb-8">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 text-center sm:text-left mb-2">
                Complexity Score: {' '}
                <CountUp 
                  value={agencyData.complexity_score} 
                  formatFn={(n) => n.toFixed(2)}
                />
              </div>
              <p className="text-gray-400 font-medium text-base sm:text-lg">
                The Upvote Complexity Score measures how detailed an agency's rules are. Higher scores mean longer, more complex rules on average. <br></br>
                <span className="text-gray-400 font-medium text-base">
                  We use a balanced scale that prevents a few extremely long rules from skewing the results.
                </span>
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {agencyData && (
          <AgencyAccordion agency={agencyData} />
        )}
      </main>
    </div>
  );
} 