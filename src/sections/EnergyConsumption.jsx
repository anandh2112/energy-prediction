import React from 'react';

const EnergyConsumption = ({ energyUsed }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold">Energy Consumption</h3>
      <p className="text-xl font-bold">{energyUsed} kWh</p>
    </div>
  );
};

export default EnergyConsumption;
