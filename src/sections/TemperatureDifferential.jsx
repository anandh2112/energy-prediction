import React from 'react';

const TemperatureDifferential = ({ inletTemp, outletTemp }) => {
  const temperatureDifference = inletTemp - outletTemp;

  return (
    <div className="bg-white p-4 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold">Temperature Differential</h3>
      <p className="text-xl font-bold">{inletTemp}°C (Inlet) - {outletTemp}°C (Outlet)</p>
      <p className="text-lg">Difference: {temperatureDifference}°C</p>
    </div>
  );
};

export default TemperatureDifferential;
