import React, { useState } from 'react';
import HWS from './HotWater.png';
import CWS from './ColdWater.png';

const WaterStorage = () => {
  const [coldWaterStatus, setColdWaterStatus] = useState('Not Operational');
  const [hotWaterStatus, setHotWaterStatus] = useState('Not Operational');

  return (
    <div className="relative opacity-50">
      {/* Grayed-Out Overlay */}
      <div className="grid grid-cols-1 gap-6 mb-4 relative group">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Thermal Storage</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cold Water Storage */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-6">
              <div className="relative flex justify-center items-center w-1/3">
                {/* Water Tank Image */}
                <div className="w-32 h-40 relative overflow-hidden">
                  <img
                    src={CWS}
                    alt="Cold Water Tank"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="w-2/3 flex flex-col gap-4">
                <h4 className="text-lg font-semibold text-gray-800">Cold Water Storage</h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      coldWaterStatus === 'Not Operational' ? 'bg-gray-400' : 'bg-green-600'
                    }`}
                  />
                  <p className="text-sm font-medium">{coldWaterStatus}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Charging Energy</p>
                    <p className="text-gray-900 font-semibold">0 kWh</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Discharging Energy</p>
                    <p className="text-gray-900 font-semibold">0 kWh</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Stored Temp</p>
                    <p className="text-gray-900 font-semibold">7°C</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hot Water Storage */}
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-6">
              <div className="relative flex justify-center items-center w-1/3">
                {/* Water Tank Image */}
                <div className="w-32 h-40 relative overflow-hidden">
                  <img
                    src={HWS}
                    alt="Hot Water Tank"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="w-2/3 flex flex-col gap-4">
                <h4 className="text-lg font-semibold text-gray-800">Hot Water Storage</h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      hotWaterStatus === 'Not Operational' ? 'bg-gray-400' : 'bg-green-600'
                    }`}
                  />
                  <p className="text-sm font-medium">{hotWaterStatus}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Charging Energy</p>
                    <p className="text-gray-900 font-semibold">0 kWh</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Discharging Energy</p>
                    <p className="text-gray-900 font-semibold">0 kWh</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Stored Temp</p>
                    <p className="text-gray-900 font-semibold">0°C</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute inset-0 flex justify-center items-center group-hover:opacity-100 opacity-0 transition-opacity z-10">
        <p className="text-sm bg-gray-900 text-white py-2 px-4 rounded-lg shadow-lg">
          Section Not Available
        </p>
        </div>
      </div>
    </div>
  );
};

export default WaterStorage;