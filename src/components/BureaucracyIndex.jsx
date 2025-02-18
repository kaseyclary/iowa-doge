export default function BureaucracyIndex({ data, loading }) {
  const currentYearData = data?.length > 0 
    ? data.find(d => d.year === 2024)
    : null;

  const unconstitutionalityIndex = currentYearData
    ? (currentYearData.new_rules_count / currentYearData.total_laws).toFixed(1)
    : '...';

  return (
    <div className="my-8 sm:mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
        Bureaucracy Index
      </h2>
      <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 text-center mb-2">
        {loading ? (
          <div className="animate-pulse">...</div>
        ) : (
          unconstitutionalityIndex
        )}
      </div>
      <p className="text-gray-400 font-medium text-center text-base sm:text-lg px-4 sm:px-0 w-full sm:w-5/12 mx-auto">
        This is the number of agency rules created by unelected bureaucrats for each law passed by Iowa's Elected Officials.
      </p>
    </div>
  );
} 