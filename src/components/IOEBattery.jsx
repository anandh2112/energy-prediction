import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const IOEBatteryHourlyChart = () => {
  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
    },
    title: null,
    xAxis: {
      categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00'],
      title: { text: 'Hour' }
    },
    yAxis: {
      title: { text: 'Energy (kWh)' }
    },
    series: [
      {
        name: 'IOE Battery',
        data: [5, 8, 6, 7, 9, 10, 15, 18, 12, 9], // Sample data
        color: '#f45b5b',
      }
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default IOEBatteryHourlyChart;
