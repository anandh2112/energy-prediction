import React from "react";
import img from "../sections/pictures/Metalwaredaylightfactorcompressed.jpg";
const DaylightFactorAnalysis = () => {
  return (
    <div className="border-gray-300 shadow-md rounded-lg p-4 bg-white">
      <h1 className="text-2xl font-bold text-center">Daylight Factor Analysis</h1>
      <img src={img} className="w-full h-full object-contain"/>
     
    </div>
  );
};

export default DaylightFactorAnalysis;
