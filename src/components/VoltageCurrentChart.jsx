import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const VoltageCurrentChart = () => {
  const options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      backgroundColor: 'transparent',
    },
    title: null,
    xAxis: {
      title: {
        enabled: true,
        text: 'Voltage (V)',
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
    },
    yAxis: {
      title: {
        text: 'Current (A)',
      },
    },
    series: [
      {
        name: 'Voltage vs Current',
        data: [
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 8],
          [8, 9],
          [9, 10],
        ], // Example data
        marker: {
          radius: 5,
        },
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default VoltageCurrentChart;
