import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const InstantaneousChillerCop = () => {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Chiller COP / Loading',
    },
    xAxis: {
      categories: ['Chiller 1', 'Chiller 2', 'Chiller 3', 'Chiller 4', 'Chiller 5'],
    },
    yAxis: {
      title: {
        text: 'COP / Loading',
      },
    },
    series: [
      {
        name: 'COP',
        data: [3.2, 3.5, 3.0, 3.8, 4.1],
        color: '#90ed7d',
      },
      {
        name: 'Loading (%)',
        data: [70, 75, 80, 65, 85],
        color: '#f45b5b',
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Instantaneous Chiller COP / Loading</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default InstantaneousChillerCop;
