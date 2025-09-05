import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const LoadingVsCop = () => {
  const options = {
    chart: {
      type: 'scatter',
    },
    title: {
      text: 'Loading (%) vs COP',
    },
    xAxis: {
      title: {
        text: 'Loading (%)',
      },
    },
    yAxis: {
      title: {
        text: 'COP',
      },
    },
    series: [
      {
        name: 'Chillers',
        data: [
          [70, 3.2],
          [75, 3.5],
          [80, 3.0],
          [65, 3.8],
          [85, 4.1],
        ],
        color: '#2b908f',
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Loading (%) vs COP</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LoadingVsCop;
