import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DailyEnergyCycleChart = () => {
  const options = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
    },
    title: null,
    xAxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    },
    yAxis: {
      title: {
        text: 'State of Charge (%)',
      },
    },
    series: [
      {
        name: 'Energy Cycle',
        data: [80, 75, 85, 90, 65, 70, 85], // Example data
        color: '#00c853',
      },
      {
        name: 'SoC',
        data: [50, 60, 55, 70, 50, 65, 75], // Example data
        color: '#ff6f00',
      },
    ],
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DailyEnergyCycleChart;
