// components/FacilityUsageChart.js

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const FacilityUsageChart = () => {
  const data = {
    labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'],
    datasets: [
      {
        data: [25, 20, 15, 10, 10, 10, 10], // Example values for each zone
        backgroundColor: [
          '#FF5733', // Bright Red (Zone 1)
          '#33B5FF', // Bright Blue (Zone 2)
          '#FFD700', // Bright Yellow (Zone 3)
          '#28A745', // Bright Green (Zone 4)
          '#8A2BE2', // Bright Purple (Zone 5)
          '#FF69B4', // Bright Pink (Zone 6)
          '#FF8C00', // Bright Orange (Zone 7)
        ],
        hoverBackgroundColor: [
          '#FF8566', // Lighter Red
          '#66C2FF', // Lighter Blue
          '#FFEC8B', // Lighter Yellow
          '#5CD85C', // Lighter Green
          '#B39CD6', // Lighter Purple
          '#FFA4C1', // Lighter Pink
          '#FFAD5C', // Lighter Orange
        ],
        borderWidth: 0, // Remove border for a clean look
      },
    ],
  };

  const totalValue = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides the default legend
      },
      tooltip: {
        callbacks: {
          title: () => null, // Removes title in tooltip
          label: (tooltipItem) => {
            const label = data.labels[tooltipItem.dataIndex]; // Get the label
            const value = tooltipItem.raw; // Get the raw value
            return `${label}: ${value} MW`; // Format the tooltip
          },
        },
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          weight: 'bold',
        },
        formatter: (value) => `${Math.round((value / totalValue) * 100)}%`, // Displays integer percentages
      },
    },
    cutout: '30%', // Create a donut shape with a smaller hole
  };

  return (
    <div className="flex justify-center items-center">
      <Doughnut data={data} options={options} style={{ width: '240px', height: '240px' }} />
    </div>
  );
};

export default FacilityUsageChart;
