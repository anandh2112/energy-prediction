import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';

// Initialize Highcharts 3D
Highcharts3D(Highcharts);

const ConsumptionPieChart = () => {
  const pieChartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      },
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: [
      {
        name: 'Share',
        data: [
          { name: 'Clients Total', y: 100, color: '#1e40af' }, // blue
          { name: 'Chillers Total', y: 80, color: '#10b981' }, // green
          { name: 'Common Area', y: 60, color: '#f59e0b' }, // yellow
        ],
      },
    ],
    credits: {
      enabled: false, // Hide Highcharts credits
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />;
};

export default ConsumptionPieChart;