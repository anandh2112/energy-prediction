import React from "react";

const ElementsScore = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row">
      {/* Left Partition: Elements Score */}
      <div className="w-full md:w-1/2 pr-4 md:pr-2 border-r border-gray-300">
        <h4 className="text-md font-bold text-gray-700 mb-2">Elements Score</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <h5 className="font-semibold">
            Your Building Score: <span className="font-bold">760</span>
          </h5>
          <p className="text-xs text-gray-500">
            Suggestions for improvement<span className="ml-1 text-gray-400">ⓘ</span>
          </p>

          {/* Flex container to align progress bar and button side by side */}
          <div className="flex items-center justify-between space-y-3">
            {/* Progress Bar */}
            <div className="relative flex-grow mr-3">
              <div className="w-full h-2 bg-gradient-to-r from-green-200 to-green-500 rounded-full">
                <div className="absolute left-[76%] -top-3 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-semibold text-gray-800">
                  760
                </div>
              </div>
              <div className="flex justify-between w-full mt-1 text-xs text-gray-600">
                <span className="font-medium text-red-500">POOR</span>
                <span className="font-medium text-green-500">GOOD</span>
              </div>
            </div>

            {/* Connect Button */}
            <button className="bg-[#003F3F] text-white rounded-md px-4 py-1 text-sm font-semibold -translate-y-3">
              CONNECT
            </button>
          </div>
        </div>
      </div>

{/* Right Partition: Savings */}
<div className="w-full md:w-1/2 pl-6 md:pl-4 flex flex-col justify-start space-y-2 pr-4">
  <h4 className="text-md font-bold text-gray-700 mb-2">Savings</h4>
  <div className="w-full flex flex-wrap justify-between space-y-2 items-start">
    {/* Energy Savings */}
    <div className="w-1/2 pr-2">
      <p className="text-xs text-gray-500">Energy</p>
      <h5 className="text-lg font-semibold text-gray-900">
        1.4K <span className="text-xs font-normal">kWh (Avg)</span>
      </h5>
      <p className="text-xs text-gray-500 flex items-center whitespace-nowrap">
        During Peak Saving <span className="ml-1 text-gray-400">ⓘ</span>
      </p>
    </div>

    {/* Cost Savings */}
    <div className="w-1/2 pl-3" style={{ transform: 'translateY(-8px)' }}>
      <p className="text-xs text-gray-500">Cost</p>
      <h5 className="text-lg font-semibold text-gray-900">₹ 2K</h5>
      <p className="text-xs text-gray-500 flex items-center whitespace-nowrap">
        During peak hours <span className="ml-1 text-gray-400">ⓘ</span>
      </p>
    </div>
  </div>
</div>






    </div>
  );
};

export default ElementsScore;
