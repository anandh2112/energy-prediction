import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const IOEEnergyCycleChart = () => {
  const options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
    },
    title: null,
    xAxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      title: { text: 'Day' }
    },
    yAxis: {
      title: { text: 'State of Charge (%)' }
    },
    series: [
      {
        name: 'Energy Cycle',
        data: [90, 85, 80, 75, 78, 88, 92], // Sample data
        color: '#7cb5ec',
      },
      {
        name: 'SoC',
        data: [95, 90, 85, 80, 85, 90, 95], // Sample data
        color: '#f7a35c',
      }
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default IOEEnergyCycleChart;
