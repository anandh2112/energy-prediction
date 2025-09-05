import React from "react";

const DaylightFactorAnalysis = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl border border-gray-200">
        {/* Header Section */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-black">Daylight Factor Floor Plan Analysis</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">PLOT C-50</h2>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-8 px-6 pb-6">
          {/* Inference Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Inference</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>The daylight factor (DF) is carefully carried out for each floor.</li>
              <li>
                The analysis shows that all the indoor surface is getting 2.3%
                approx., which is below the average of 5% for precision work
                factories.
              </li>
            </ul>
          </div>

          {/* Images Section */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Image Placeholders */}
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center border border-gray-300 rounded-lg">
              <span className="text-gray-500">Ground Level</span>
            </div>
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center border border-gray-300 rounded-lg">
              <span className="text-gray-500">Level 1</span>
            </div>
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center border border-gray-300 rounded-lg">
              <span className="text-gray-500">Level 2</span>
            </div>
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center border border-gray-300 rounded-lg">
              <span className="text-gray-500">Terrace</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
          <span className="font-semibold">Elements Energy</span>
          <span className="float-right">04</span>
        </div>
      </div>
    </div>
  );
};

export default DaylightFactorAnalysis;
