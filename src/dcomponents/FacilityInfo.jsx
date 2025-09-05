import React from "react";

const FacilityInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row">
      {/* Left Partition: Facility Information */}
      <div className="w-full md:w-1/2 pr-4 md:pr-2 border-r border-gray-300">
        <h4 className="text-md font-bold text-gray-700 mb-2"> Facility Information
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-semibold">Block 15 Pritech Park Annex</p>
          <p>
            BUA: <span className="font-semibold">1 lakh sq.ft.</span>
          </p>
          <p>
            Location: <span className="font-semibold">Bangalore, India</span>
          </p>
          <p>
            Climate: <span className="font-semibold">Tropical Savanna</span>
          </p>
        </div>
      </div>

      {/* Right Partition: Renewable Share */}
      <div className="w-full md:w-1/2 pl-4 md:pl-2 flex flex-col justify-center items-center space-y-2">
        {/* Renewable Share Data */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-green-500">70%</h3>
          <p className="text-sm text-gray-600 font-medium">Renewable Share</p>
        </div>

        {/* Today's Change */}
        <div className="flex items-center space-x-2 text-gray-700 text-sm font-medium">
          <span className="text-red-500 text-xl">↓</span>
          <p>
            <span className="font-bold">2%</span> Today's Change
          </p>
        </div>

       
      </div>
    </div>
  );
};

export default FacilityInfo;
