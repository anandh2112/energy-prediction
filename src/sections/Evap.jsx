import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const EvaporatorTemperature = () => {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Evaporator In/Out Temperature',
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
        data: [7, 8],
        color: '#7cb5ec',
      },
      {
        name: 'Outlet Temperature',
        data: [4, 5],
        color: '#434348',
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Evaporator In/Out Temperature</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default EvaporatorTemperature;
