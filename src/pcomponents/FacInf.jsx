import React from 'react'
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";


const FacInf = () => {
    const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center w-full space-y-6">
    {/* Heading */}
    <h1 className="text-2xl font-bold text-center text-black">Facility Information</h1>
  
    {/* Address */}
    <p className="text-gray-600 text-center mb-6 text-lg">
      C 49 & 50, Noida, Sector 63, Noida, Uttar Pradesh 201307
    </p>
  
    {/* Flex container for Visual and Buttons */}
    <div className="flex items-center justify-center md:w-[100%] md:h-[40%] lg:w-[auto] lg:h-[80%] space-x-8">
      {/* Score Representation */}
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Circular Progress Bar */}
        <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#4ade80"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="282.6"  // Max value of circle circumference
            strokeDashoffset={(1 - 760 / 1000) * 282.6} // Proportional to the score
            fill="none"
          />
        </svg>
  
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg sm:text-base md:text-lg lg:text-4xl xl:text-4xl font-bold text-gray-800">760</p>
          <p className="flex flex-col text-sm sm:text-xs md:text-xs lg:text-lg text-gray-500 text-center">
            <span>Building</span>
            <span>Score</span>
          </p>
        </div>
      </div>
  
      {/* Right Section (Button and Info Icon side by side) */}
      <div className="flex items-center space-x-1">
        <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 text-sm w-32">
          CONNECT
        </button>
  
        {/* Info Icon with Tooltip */}
        <div className="relative">
          <button
            onClick={handleInfoClick}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaInfoCircle size={24} />
          </button>
  
          {/* Tooltip */}
          {showInfo && (
            <div className="absolute bottom-12 left-1/12 transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded-md p-1 w-64 text-center">
              <p>
                You can reach out to us for any help or improvements regarding the building's performance and efficiency.
              </p>
            </div>
          )}
        </div>
      </div>
  </div>
  
  
        </div>
    )
}

export default FacInf