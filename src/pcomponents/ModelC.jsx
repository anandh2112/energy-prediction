import React, { useState } from "react";
import modelImage from '../sections/pictures/compressed.jpg';

const CombinedComponent = () => {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 ">
      <h1 className="text-2xl font-bold text-center text-black md:pb-0 lg:pb-0 xl:pb-7">Facility Information</h1>
      <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4 items-center w-full ">
        <div className="p-6 bg-white rounded-lg flex flex-col gap-[10px] items-center h-[100%]"> 
          <div className='flex aling-center justify-center '>
            <img src={modelImage} alt="Metalware Model" className="md:w-[auto] md:h-[30vmin] lg:w-[auto] lg:h-[35vmin] xl:h-[50vmin] aspect-auto"/>
          </div>
        </div>
        <div className="text-start grid grid-cols-2 gap-4">
          <div className="lg:text-sm xl:text-md font-bold text-gray-500 border-r-2 border-gray space-y-3 ">
            <p>Company Name:</p>
            <p>Building Type:</p>
            <p>Nature of Operations:</p>
            <p>Address:</p>
            <p>Carpet Area:</p>
            <p>Number of Blocks:</p>
            <p>Number of floors per block:</p>
            <p>‎</p>
            <p>Operating Hours:</p>
            <p>‎</p>
            <p>Non-operating Hours:</p>
            <p>Number of Occupants:</p>
            <p>‎</p>
            <p>Number of Zones:</p>
          </div>
          <div className="lg:text-sm xl:text-md text-gray-600 space-y-3 pl-2 ">
            <p>METALWARE CORPORATION</p>
            <p>Industrial</p>
            <p>Metal Processing Industry</p>
            <p>C-49-50, Sector-63, Noida-201307</p>
            <p>45,000 sq.ft</p>
            <p>2 nos. (C49 & C50)</p>
            <p>C49 - B+6</p>
            <p>C50 - B+4</p>
            <p>Weekdays (Mon - Sat) - 20 hours</p>
            <p>Weekend (Sun) - 7 hours</p>
            <p>3.5 hours (for maintenance)</p>
            <p>Day Shift - 275</p>
            <p>Night Shift - 175</p>
            <p>10 Zones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedComponent;