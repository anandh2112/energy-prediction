import React from 'react';

const PressureGauges = ({ inletPressure, outletPressure }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg text-center">
      <h3 className="text-lg font-semibold">Pressure</h3>
      <p className="text-xl font-bold">{inletPressure} Bar (Inlet)</p>
      <p className="text-xl font-bold">{outletPressure} Bar (Outlet)</p>
    </div>
  );
};

export default PressureGauges;
