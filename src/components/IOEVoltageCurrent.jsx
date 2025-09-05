import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const IOEVoltageCurrentChart = () => {
  const options = {
    chart: {
      type: 'scatter',
      backgroundColor: 'transparent',
    },
    title: null,
    xAxis: {
      title: { text: 'Voltage (V)' }
    },
    yAxis: {
      title: { text: 'Current (A)' }
    },
    series: [
      {
        name: 'IOE Battery',
        data: [[220, 50], [230, 55], [240, 60], [250, 65], [260, 70]], // Sample data
        color: '#90ed7d',
      }
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default IOEVoltageCurrentChart;
