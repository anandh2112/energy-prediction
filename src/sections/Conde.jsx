import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const CondenserTemperature = () => {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Condenser In/Out Temperature',
    },
    xAxis: {
      categories: ['Phase 1', 'Phase 2'],
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)',
      },
    },
    series: [
      {
        name: 'Inlet Temperature',
        data: [30, 32],
        color: '#f45b5b',
      },
      {
        name: 'Outlet Temperature',
        data: [27, 28],
        color: '#91e8e1',
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Condenser In/Out Temperature</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default CondenserTemperature;
