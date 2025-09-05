import React from 'react';

const FacilityUsageProfile = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 w-1/2">
      {/* Common Title Section for Facility Information and Elements Score */}
      <div className="w-full">
        <h1 className="text-2xl font-bold">Facility Information</h1>
        {/* Facility Information Section */}
        <div className="mb-4">
          <p className="text-sm">
            <strong>Sector 49 & 50, Noida, Uttar Pradesh 201307</strong>
          </p>
        </div>

       
        <div className="bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-xl font-semibold mb-4">Facility Information</h2>
  <p className="text-gray-600 mb-4">
    C 49 & 50, Noida, Sector 63, Noida, Uttar Pradesh 201307
  </p>

  {/* Building Score */}
  <p className="text-sm mb-2">
    Your Building Score: <strong>760</strong>
  </p>
  <p className="text-sm mb-4">Suggestions for improvement</p>

  {/* Score Indicator */}
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-1">
      <span className="text-xs text-red-500">POOR</span>
      <div className="relative w-32 h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-green-500 rounded-full"
          style={{ width: '75%' }}
        ></div>
        <span
          className="absolute left-3/4 transform -translate-x-1/2 text-xs text-gray-700 bg-white px-1 rounded-full border border-gray-300"
        >
          760
        </span>
      </div>
      <span className="text-xs text-green-500">GOOD</span>
    </div>
  </div>

  {/* Connect Button */}
  <div className="mt-6">
    <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
      CONNECT
    </button>
  </div>
  </div>
  </div>
  </div>
  );
};

export default FacilityUsageProfile;
