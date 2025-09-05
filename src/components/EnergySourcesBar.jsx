import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';

Highcharts3D(Highcharts); // Initialize 3D support

const EnergySourcesBarChart = ({ data }) => {
  useEffect(() => {
    Highcharts.chart('energy-sources-chart', {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 15,
          depth: 100,
          viewDistance: 25,
          frame: {
            bottom: { size: 0 },
            back: { size: 0 },
            left: { size: 0 },
            right: { size: 0 },
            top: { size: 0 },
            front: { size: 0 },
          },
        },
        backgroundColor: 'transparent',
        margin: [30, 0, 0, 0],  //Increased bottom margin for the legend
      },
      title: {
        text: null, // Remove default title
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      tooltip: {
        headerFormat: '', // Remove the title
        pointFormat: '<b>{series.name}: {point.y} MW</b>', // Display source and value
      },
      series: [
        {
          name: 'Grid',
          data: [120],
          color: '#800000', // #F44336Red for Grid (strong and attention-grabbing)
        },
        {
          name: 'Diesel',
          data: [40],
          color: '#074799', // Yellow for Diesel (vibrant and noticeable)
        },
      ],
      plotOptions: {
        column: {
          stacking: 'normal',
          depth: 120,
          borderWidth: 0,
          borderColor: '#444444',
          shadow: true,
          dataLabels: {
            enabled: true,
            color: '#FFFFFF', // White color for percentage labels
            style: {
              fontWeight: 'bold',
            },
            formatter: function () {
              return `${Math.round(this.percentage)}%`; // Display percentages as integers
            },
            align: 'center', // Align horizontally
            verticalAlign: 'middle', // Align vertically
            x: -10, // Move slightly to the left
            y: 7, // Move slightly down
          },
        },
      },
      legend: {
        enabled: false, // Disable the legend
      },
      credits: {
        enabled: false,
      },
    });
  }, [data]);

  // Adjust container style to move the chart higher
  return (
    <div
      id="energy-sources-chart"
      style={{
        height: '320px',
        width: '210px',
        marginTop: '-80px', // Move chart upward
      }}
    />
  );
};

export default EnergySourcesBarChart;
