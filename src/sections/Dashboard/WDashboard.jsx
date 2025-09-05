import React from 'react';
import ConsumptionCard from '../../dcomponents/ConsumptionCard';
import VelocityChartCard from '../../dcomponents/VelocityChartCard';
import FlowChartCard from '../../dcomponents/FlowChartCard';

const WDashboard = () => {
  const data = [
    {
      title: 'Consumption :',
      value: '118.8 m³',
    },
    {
      title: 'Flow :',
      value: '3.1 m³/hr',
    },
    {
      title: 'Velocity :',
      value: '0.4 m/s',
    },
  ];

  return (
    <div className="p-5 bg-gray-100 space-y-6">
      {/* Top Row with Mini Cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        {data.map((item, index) => (
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

      {/* Second Row with Consumption Card */}
      <div className="flex">
        <ConsumptionCard />
      </div>
      <div className="flex">
        <FlowChartCard />
      </div>
      <div className="flex">
        <VelocityChartCard />
      </div>
    </div>
  );
};

export default WDashboard;
