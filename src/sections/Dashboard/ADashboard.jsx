import React from "react";
import AirQualityCard from "../../dcomponents/AirQualityCard";
import CO2Card from "../../dcomponents/Co2Card";

const ADashboard = () => {
  const miniCardData = [
    {
      title: "PM2.5 :",
      value: "75 µg/m³",
    },
    {
      title: "PM10 :",
      value: "150 µg/m³",
    },
    {
      title: "CO2 :",
      value: "400 ppm",
    },
  ];

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
       {/* Top Row with Mini Cards */}
       <div className="flex flex-col sm:flex-row gap-4">
        {miniCardData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-white shadow-md border border-gray-200 rounded-lg p-4 flex-1 text-center"
          >
            <div className="flex flex-col items-center mr-4">
              <h5 className="text-sm font-medium text-gray-500">{item.title}</h5>
            </div>
            <div className="flex items-center justify-center">
              <h6 className="text-3xl font-bold text-black mr-2">{item.value}</h6> {/* Value */}
            </div>
          </div>
        ))}
      </div>

      {/* Larger Cards */}
      <div className="flex flex-col mt-6 gap-4">
        <AirQualityCard />
        <CO2Card />
      </div>
    </div>
  );
};

export default ADashboard;
