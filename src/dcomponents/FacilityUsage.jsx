import React from 'react';
import DateSelector from '../components/DateSelector';
import FacilityUsageChart from '../components/FacilityUsageChart';

const FacilityUsage = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-lg font-bold text-gray-800">Facility Usage</h3>
      </div>

      {/* Chart Section */}
      <div className="flex justify-center">
        <FacilityUsageChart />
      </div>
    </div>
  );
};

export default FacilityUsage;
