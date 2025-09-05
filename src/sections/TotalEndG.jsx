import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const TotalEnergyAndCooling = () => {
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Chiller Status',
    },
    xAxis: {
      categories: ['Chiller 1', 'Chiller 2', 'Chiller 3', 'Chiller 4', 'Chiller 5', 'Chiller 6'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Status (%)',
      },
    },
    series: [
      {
        name: 'Operational Efficiency',
        data: [85, 90, 75, 80, 95, 65],
        color: '#7cb5ec',
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return (
<div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Today's Energy Overview</h2>
      
      {/* Mini Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-100 shadow-md rounded-md p-4">
          <p className="text-lg font-medium">Total Electrical Energy</p>
          <p className="text-2xl font-bold text-blue-700">7526 kWh</p>
        </div>
        <div className="bg-green-100 shadow-md rounded-md p-4">
          <p className="text-lg font-medium">Total Cooling Energy</p>
          <p className="text-2xl font-bold text-green-700">5100 TRh</p>
        </div>
      </div>


      {/* Chillers Status Chart */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Chillers Status</h3>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default TotalEnergyAndCooling;
