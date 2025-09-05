import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LTOVoltageCurrentChart = () => {
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
          [2, 3],
          [3, 5],
          [4, 7],
          [5, 8],
          [6, 9],
          [7, 10],
          [8, 12],
          [9, 13],
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

export default LTOVoltageCurrentChart;
