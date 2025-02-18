import AgencyClient from './AgencyClient';

// This is a Server Component
export async function generateMetadata({ params }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/agencies/agency/${params.id}/${new Date().getFullYear()}/details`
    );
    const agencyData = await response.json();
    
    return {
      title: `${agencyData.agencyName} Regulations | Iowa Government Analytics`,
      description: `Explore ${agencyData.agencyName}'s regulatory framework, including rules, complexity scores, and historical trends.`,
      openGraph: {
        title: `${agencyData.agencyName} Regulations`,
        description: `Analysis of ${agencyData.agencyName}'s regulatory framework and complexity.`,
      },
    };
  } catch (error) {
    return {
      title: 'Agency Regulations | Iowa Government Analytics',
      description: 'Explore Iowa agency regulations and their complexity scores.',
    };
  }
}

// Server Component
export default function AgencyPage() {
  return <AgencyClient />;
} 