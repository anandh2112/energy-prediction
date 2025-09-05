import React from 'react';
import MonthlyConsumption from './MonthlyConsumption';
import MeterReading from '../../components/MeterReading';

const BuildingOverview = () => {
  return (
    <div className="bg-gray-100 p-5 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <MeterReading/>
      </div>
    </div>
  );
};

export default BuildingOverview;