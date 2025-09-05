import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const UPSBatteryHourlyChart = () => {
  const options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
    },
    title: null,
    xAxis: {
      categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    },
    yAxis: {
      title: {
        text: 'kWh',
      },
    },
    series: [
      {
        name: 'UPS Battery',
        data: [10, 20, 15, 18, 25, 30, 45, 35, 40, 50, 55, 60], // Example data
      },
    ],
    credits: {
        enabled: false, // Hide Highcharts credits
      },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default UPSBatteryHourlyChart;
